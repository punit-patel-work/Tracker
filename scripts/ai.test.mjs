import test,{before,after} from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import {MongoMemoryServer} from 'mongodb-memory-server';
import express from 'express';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import {User,Exercise,Routine,Session} from '../server/models.js';
import * as models from '../server/ai/models.js';
import {createAiRouter} from '../server/routes/ai.routes.js';
import sessionRouter from '../server/routes/sessions.routes.js';
import {validateSchema,routineSchema} from '../server/ai/schemas.js';
import {equipmentTags,alternativeCandidates,FAMILIES} from '../server/ai/catalog.js';
import {CATALOG} from '../shared/catalog.js';
import {todayFor} from '../server/validation.js';
import {buildContext} from '../server/ai/context.js';
import {generate,estimatedCost,MAX_INPUT_BYTES} from '../server/ai/service.js';
let db,server,base,user,other,owner,bench,dumbbell,cable,hold,cardio,privateEx,workout,calls=0,lastBody,mode='ok',waiter;
const prefs={goal:'general',experience:'beginner',trainingMonths:6,breakWeeks:0,days:1,minutes:45,equipment:['full_gym'],preferredDays:[],priorities:[],gender:'unspecified',age:30,weightKg:80,heightCm:175,excludedExerciseIds:[],preferences:'',limitations:''};
const token=u=>'gt_token='+jwt.sign({sub:String(u._id),version:0},process.env.JWT_SECRET);
async function call(path,method='GET',body,who=user){
 const r=await fetch(base+path,{method,headers:{'Content-Type':'application/json',Cookie:who?token(who):'','X-Time-Zone':'America/Toronto'},body:body?JSON.stringify(body):undefined});
 return {status:r.status,data:await r.json()};
}
function output(body){
 const context=JSON.parse(body.input[1].content);
 const entry=id=>({exerciseId:id,targetSets:3,targetReps:10,targetWeightKg:50,restSec:90,targetDurationSec:null,targetCardioMin:null,reason:'Matches your goal.',loadReason:'Based on matching recent sets.'});
 if(body.text.format.name==='routine_response'){
  const ids=context.candidates.map(e=>e.exerciseId);
  const normal=ids.includes(bench.id)?bench.id:ids[0];
  const entries=mode==='mixed'?[
    entry(bench.id),{...entry(hold.id),targetReps:0,targetWeightKg:null,targetDurationSec:30},
    {...entry(cardio.id),targetSets:1,targetReps:0,targetWeightKg:null,targetCardioMin:5},
  ]:[entry(mode==='foreign'?privateEx.id:normal)];
  if(mode==='too-heavy')entries[0].targetWeightKg=500;
  return {title:'One-day plan',explanation:'A practical training session.',limitations:[],days:[{name:'Session A',focus:'General training',exercises:entries}]};
 }
 return {summary:'Review of logged training.',observations:[{title:'Completed work',detail:'Use your records as a starting point.',evidenceIds:mode==='bad-evidence'?[privateEx.id]:context.history.slice(0,1).map(s=>s.id)}],nextSteps:['Keep logging your effort.'],limitations:['Recovery was not measured.']};
}
const provider=async body=>{
 calls++;lastBody=body;
 if(mode==='wait')await new Promise(r=>{waiter=r;});
 if(mode==='network')throw Object.assign(new Error('Offline'),{status:503});
 if(mode==='incomplete')return {status:'incomplete',usage:{input_tokens:100,output_tokens:50},output:[]};
 return {status:'completed',usage:{input_tokens:100,output_tokens:200},output:[{type:'message',content:mode==='refusal'?[{type:'refusal',refusal:'Cannot assist'}]:[{type:'output_text',text:JSON.stringify(output(body))}]}]};
};
before(async()=>{
 process.env.JWT_SECRET='ai-tests-only'; db=await MongoMemoryServer.create();await mongoose.connect(db.getUri());
 await Promise.all([User,Exercise,Routine,Session,...Object.values(models)].map(m=>m.init()));
 user=await User.create({name:'Member',email:'member@example.test',passwordHash:'not-real',weighIns:[{date:'2026-01-01',kg:80}]});
 other=await User.create({name:'Other',email:'other@example.test',passwordHash:'not-real'});
 owner=await User.create({name:'Owner',email:'owner@example.test',passwordHash:'not-real',role:'admin'});
 const create=slug=>Exercise.create({...CATALOG.find(e=>e.slug===slug),_id:undefined});
 bench=await create('barbell-flat-bench-press');dumbbell=await create('dumbbell-flat-bench-press');cable=await create('standing-cable-chest-press');
 hold=await create('forearm-plank');
 cardio=await Exercise.create({slug:'test-bike',name:'Upright Bike',type:'cardio',category:'cardio',equipment:'Machine'});
 privateEx=await Exercise.create({slug:'private',name:'Private lift',type:'strength',category:'chest',owner:other._id});
 workout=await Session.create({user:user._id,name:'Completed workout',date:todayFor('America/Toronto'),status:'completed',bodyWeightKg:80,startedAt:new Date(Date.now()-1800000),endedAt:new Date(),
 entries:[{exercise:bench._id,sets:[{reps:10,weightKg:50,done:true,rpe:7,restSec:90}]}]});
 const app=express();app.use(express.json(),cookieParser());app.use('/ai',createAiRouter({request:provider}));app.use('/sessions',sessionRouter);
 app.use((err,req,res,next)=>res.status(err.status??500).json({error:err.message}));
 server=app.listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));base='http://127.0.0.1:'+server.address().port;
});
after(async()=>{if(server)await new Promise(r=>server.close(r));await mongoose.disconnect();if(db)await db.stop();});
test('AI routes enforce authentication, admin roles, and consent before calling a provider',async()=>{
 assert.equal((await call('/ai/bootstrap','GET',undefined,null)).status,401);
 assert.equal((await call('/ai/admin')).status,403);
 assert.equal((await call('/ai/routine-draft','POST',{preferences:prefs})).status,400);
 assert.equal(calls,0);
 assert.equal((await call('/ai/weekly-review','POST',{consent:true},other)).status,400);
});
test('catalog alternatives make zero provider calls and respect equipment, exclusions and ownership',async()=>{
 const before=calls;
 let r=await call('/ai/alternatives/'+bench.id+'?equipment=dumbbell,bench');
 assert.deepEqual(r.data.alternatives.map(e=>e.exerciseId),[dumbbell.id]);
 r=await call('/ai/alternatives/'+bench.id+'?exclude='+dumbbell.id);
 assert.ok(!r.data.alternatives.some(e=>e.exerciseId===dumbbell.id));
 assert.equal((await call('/ai/alternatives/'+privateEx.id)).status,404);
 assert.equal(calls,before);assert.ok(await models.AiAlternative.findOne({source:bench._id}));
});
test('routine context contains exact set-level history and omits account secrets and foreign exercises',async()=>{
 const r=await call('/ai/routine-draft','POST',{preferences:prefs,consent:true});
 assert.equal(r.status,200,JSON.stringify(r.data));assert.equal(r.data.cached,false);
 const context=JSON.parse(lastBody.input[1].content);
 assert.equal(context.history[0].entries[0].sets[0].rpe,7);
 assert.equal(context.candidates.some(e=>e.exerciseId===privateEx.id),false);
 assert.doesNotMatch(JSON.stringify(context),/passwordHash|member@example|JWT_SECRET/);
 assert.equal(lastBody.store,false);assert.equal(lastBody.text.format.strict,true);
 const count=calls;
 const again=await call('/ai/routine-draft','POST',{preferences:prefs,consent:true});
 assert.equal(again.data.cached,true);assert.equal(calls,count);
 const otherDrafts=await call('/ai/bootstrap','GET',undefined,other);
 assert.equal(otherDrafts.data.drafts.length,0);
});
test('invalid exercise IDs and schema fields never become usable drafts',async()=>{
 mode='foreign';
 const r=await call('/ai/routine-draft','POST',{preferences:{...prefs,preferences:'foreign-test'},consent:true});
 assert.equal(r.status,502);assert.match(r.data.error,/validation/);
 assert.throws(()=>validateSchema({title:'bad'},routineSchema));
 mode='ok';
});
test('loads without matching history stay blank; implausible progression is removed',async()=>{
 let r=await call('/ai/routine-draft','POST',{preferences:{...prefs,excludedExerciseIds:[bench.id],preferences:'no-history'},consent:true});
 assert.equal(r.status,200);assert.equal(r.data.draft.result.days[0].exercises[0].targetWeightKg,null);
 mode='too-heavy';
 r=await call('/ai/routine-draft','POST',{preferences:{...prefs,preferences:'heavy'},consent:true});
 assert.equal(r.data.draft.result.days[0].exercises[0].targetWeightKg,null);mode='ok';
});
test('timed, cardio and rest targets survive editable draft saving and workout start; saving is idempotent',async()=>{
 mode='mixed';
 const r=await call('/ai/routine-draft','POST',{preferences:{...prefs,preferences:'mixed'},consent:true});
 assert.equal(r.status,200,JSON.stringify(r.data));const draft=r.data.draft;
 const body={dayIndex:0,name:'Edited session',note:'Reviewed',exercises:draft.result.days[0].exercises};
 assert.equal((await call('/ai/drafts/'+draft.id+'/save','POST',body,other)).status,404);
 const saved=await call('/ai/drafts/'+draft.id+'/save','POST',body);
 assert.equal(saved.status,200,JSON.stringify(saved.data));
 const again=await call('/ai/drafts/'+draft.id+'/save','POST',body);
 assert.equal(saved.data.routineId,again.data.routineId);
 const started=await call('/sessions','POST',{routineId:saved.data.routineId});
 assert.equal(started.status,201,JSON.stringify(started.data));
 const entries=started.data.session.entries;
 assert.equal(entries.find(e=>e.exerciseId===hold.id).sets[0].durationSec,30);
 assert.equal(entries.find(e=>e.exerciseId===bench.id).sets[0].restSec,90);
 assert.equal(entries.find(e=>e.exerciseId===cardio.id).cardio.durationMin,5);
 assert.equal(entries[0].sets[0].done,false);
 await Session.deleteOne({_id:started.data.session.id});mode='ok';
});
test('workout explanations reject another account’s workout and fabricated evidence',async()=>{
 assert.equal((await call('/ai/workout-explanation','POST',{sessionId:workout.id,consent:true},other)).status,404);
 const r=await call('/ai/workout-explanation','POST',{sessionId:workout.id,consent:true,topic:'Calories'});
 assert.equal(r.status,200);assert.equal(r.data.draft.evidence[0].id,workout.id);
 mode='bad-evidence';
 assert.equal((await call('/ai/workout-explanation','POST',{sessionId:workout.id,consent:true,topic:'Bad evidence'})).status,502);mode='ok';
});
test('weekly reviews use computed totals and invalidate cache after a workout edit',async()=>{
 let r=await call('/ai/weekly-review','POST',{consent:true});
 assert.equal(r.status,200);assert.equal(r.data.draft.weekly.current.sessions,1);
 const count=calls;await call('/ai/weekly-review','POST',{consent:true});assert.equal(calls,count);
 await Session.updateOne({_id:workout._id},{$set:{'entries.0.sets.0.reps':12},$inc:{__v:1}});
 r=await call('/ai/weekly-review','POST',{consent:true});
 assert.equal(r.status,200);assert.equal(r.data.cached,false);
});
test('refusal, truncation and transport failure do not save drafts and keep costs accounted',async()=>{
 const count=await models.AiDraft.countDocuments();
 for(const m of ['refusal','incomplete','network']){
  mode=m;const r=await call('/ai/routine-draft','POST',{preferences:{...prefs,preferences:m},consent:true});
  assert.ok([422,502,503].includes(r.status));
 }
 assert.equal(await models.AiDraft.countDocuments(),count);mode='ok';
 const ledger=await models.AiBudget.findOne();assert.ok(ledger.usedUsd>0);assert.ok(Math.abs(ledger.reservedUsd)<1e-8);
});
test('duplicate in-flight requests are rejected without a second provider call',async()=>{
 mode='wait';waiter=null;
 const body={preferences:{...prefs,preferences:'concurrent'},consent:true};
 const first=call('/ai/routine-draft','POST',body);
 for(let i=0;i<100&&!waiter;i++)await new Promise(r=>setTimeout(r,10));
 assert.ok(waiter);const count=calls;
 const second=await call('/ai/routine-draft','POST',body);
 assert.equal(second.status,409);assert.equal(calls,count);
 mode='ok';waiter();assert.equal((await first).status,200);
});
test('admin budgets and disable controls stop generation while saved drafts and alternatives remain readable',async()=>{
 await call('/ai/admin','PATCH',{enabled:true,monthlyBudgetUsd:0},owner);
 const count=calls;
 const r=await call('/ai/routine-draft','POST',{preferences:{...prefs,preferences:'budget'},consent:true});
 assert.equal(r.status,429);assert.equal(calls,count);
 await call('/ai/admin','PATCH',{enabled:false,monthlyBudgetUsd:5},owner);
 assert.equal((await call('/ai/weekly-review','POST',{consent:true})).status,503);
 assert.equal((await call('/ai/bootstrap')).status,200);
 assert.equal((await call('/ai/alternatives/'+bench.id)).status,200);
 await call('/ai/admin','PATCH',{enabled:true,monthlyBudgetUsd:5},owner);
});
test('maintained alternatives reject private references and survive catalog metadata refreshes',async()=>{
 assert.equal((await call('/ai/admin/alternatives/'+bench.id,'PUT',{group:'Press',candidates:[privateEx.id]},owner)).status,400);
 assert.equal((await call('/ai/admin/alternatives/'+bench.id,'PUT',{group:'Press',candidates:[dumbbell.id]},owner)).status,200);
 await Exercise.updateOne({_id:cable._id},{$set:{name:'Updated cable press'}});
 const r=await call('/ai/alternatives/'+bench.id);assert.equal(r.data.curated,true);assert.deepEqual(r.data.alternatives.map(e=>e.exerciseId),[dumbbell.id]);
});
test('catalog families have no cross-family overlap or unknown exercise slugs',()=>{
 const slugs=Object.values(FAMILIES).flat();
 assert.equal(new Set(slugs).size,slugs.length);
 const catalog=new Set(CATALOG.map(e=>e.slug));
 assert.deepEqual(slugs.filter(s=>!catalog.has(s)),[]);
 assert.ok(equipmentTags({name:'Dumbbell Flat Bench Press',equipment:'Dumbbell',isBodyweight:false}).includes('bench'));
 assert.equal(alternativeCandidates({slug:'unknown',_id:'x'},[]).length,0);
});


test('concurrent users cannot spend the same remaining monthly allowance',async()=>{
 mode='wait';waiter=null;
 const first=call('/ai/routine-draft','POST',{preferences:{...prefs,preferences:'cross-user-budget'},consent:true});
 for(let i=0;i<100&&!waiter;i++)await new Promise(r=>setTimeout(r,10));
 assert.ok(waiter);
 const ledger=await models.AiBudget.findOne();
 await models.AiSettings.updateOne({_id:'global'},{$set:{monthlyBudgetUsd:ledger.usedUsd+ledger.reservedUsd+0.000001}});
 const count=calls;
 const second=await call('/ai/routine-draft','POST',{preferences:{...prefs,preferences:'other-budget'},consent:true},other);
 assert.equal(second.status,429);assert.equal(calls,count);
 mode='ok';waiter();assert.equal((await first).status,200);
 await models.AiSettings.updateOne({_id:'global'},{$set:{monthlyBudgetUsd:5}});
});


test('Full Gym with the complete catalog and 31 detailed workouts preserves all context',async()=>{
 const existing=new Set((await Exercise.find({owner:null}).select('slug').lean()).map(e=>e.slug));
 await Exercise.insertMany(CATALOG.filter(e=>!existing.has(e.slug)));
 const history=Array.from({length:30},(_,i)=>({user:user._id,name:'Training '+i,date:todayFor('America/Toronto'),status:'completed',bodyWeightKg:80,startedAt:new Date(Date.now()-3600000),endedAt:new Date(),
  entries:Array.from({length:8},()=>({exercise:bench._id,notes:'Controlled repetitions and comfortable range of motion.',
   sets:Array.from({length:4},()=>({reps:10,weightKg:50,done:true,rpe:7,restSec:90}))}))}));
 await Session.insertMany(history);
 const before=calls;
 const r=await call('/ai/routine-draft','POST',{preferences:{...prefs,preferences:'full-gym-large-history'},consent:true});
 assert.equal(r.status,200,JSON.stringify(r.data));assert.equal(calls,before+1);
 const context=JSON.parse(lastBody.input[1].content);
 assert.ok(Buffer.byteLength(JSON.stringify(lastBody),'utf8')>250000,'Fixture must exceed the former limit');
 assert.equal(context.history.length,31);
 assert.ok(context.candidates.length>=CATALOG.length);
 assert.equal(context.history.filter(s=>s.entries.length===8).length,30);
 assert.equal(context.history.find(s=>s.entries.length===8).entries[0].sets.length,4);
 assert.ok(context.candidates.every(e=>e.exerciseId&&e.name));
 const ledger=await models.AiBudget.findOne();assert.ok(Math.abs(ledger.reservedUsd)<1e-8);
});

test('oversized context is rejected before provider calls or budget reservation and releases its lock',async()=>{
 const context=await buildContext(user,'America/Toronto',prefs,'routine');
 context.preferences={...prefs,preferences:'x'.repeat(MAX_INPUT_BYTES)};
 const before=await models.AiBudget.findOne().lean(),count=calls;
 await assert.rejects(generate({user,task:'routine',context,request:provider}),e=>e.status===400&&e.code==='context_size');
 assert.equal(calls,count);assert.equal(await models.AiLock.countDocuments(),0);
 const after=await models.AiBudget.findOne().lean();
 assert.equal(after.requests,before.requests);assert.equal(after.usedUsd,before.usedUsd);assert.equal(after.reservedUsd,before.reservedUsd);
});

test('large-request reservations and usage reconciliation include Sol long-context rates',()=>{
 assert.equal(estimatedCost('gpt-6.1-sol',272000,8000),0.76);
 assert.equal(estimatedCost('gpt-6.1-sol',300000,8000),1.62);
 assert.equal(estimatedCost('gpt-6-luna',300000,8000),0.0415);
});
