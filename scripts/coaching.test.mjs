import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createAiRouter } from '../server/routes/ai.routes.js';
import sessionsRouter from '../server/routes/sessions.routes.js';
import routinesRouter from '../server/routes/routines.routes.js';
import { Exercise, Session, Routine, User, WeekPlan } from '../server/models.js';
import { AiDraft, AiPreferences } from '../server/ai/models.js';
import { todayFor } from '../server/validation.js';
import { weekKey } from '../shared/engine.js';

let db, server, base, user, other, lift, routine, count = 0, context, invalidResponse = false;
const today = todayFor('America/Toronto');
const provider = async body => {
  count++;
  context = JSON.parse(body.input[1].content);
  const adjustment = body.text.format.name === 'adjustment_response';
  const row = context.rows?.find(r => r.proposed);
  const result = adjustment
    ? { summary: 'Review the logged sets.', changes: row ? [{ exerciseId: row.exerciseId, reason: 'Two completed targets.', evidenceIds: [invalidResponse ? other.id : row.evidence[0].id] }] : [] }
    : { summary: 'Based on the selected record.', observations: [], nextSteps: [], limitations: [] };
  return { status: 'completed', usage: { input_tokens: 100, output_tokens: 50 }, output: [{ content: [{ type: 'output_text', text: JSON.stringify(result) }] }] };
};
async function call(path, method = 'GET', body, member = user) {
  const r = await fetch(base + path, { method, headers: { 'content-type': 'application/json', 'x-time-zone': 'America/Toronto',
    Cookie: 'gt_token=' + jwt.sign({ sub: member.id, version: 0 }, process.env.JWT_SECRET) }, body: body && JSON.stringify(body) });
  return { status: r.status, data: await r.json() };
}
before(async () => {
  process.env.JWT_SECRET = 'isolated-coaching-tests';
  db = await MongoMemoryServer.create(); await mongoose.connect(db.getUri());
  await Promise.all(Object.values(mongoose.models).map(m => m.init()));
  [user, other] = await User.create(['one', 'two'].map(name => ({ name, email: name + '@test.invalid', passwordHash: 'test', weighIns: [{ date: today, kg: 80 }] })));
  lift = await Exercise.create({ name: 'Bench', slug: 'bench', category: 'chest', type: 'strength' });
  routine = await Routine.create({ name: 'Push', user: user._id, exercises: [{ exercise: lift._id, targetSets: 2, targetReps: 8, repCeiling: 10, targetWeightKg: 50, incrementKg: 2.5 }] });
  await Session.insertMany([1,2].map(i => ({ user: user._id, routine: routine._id, date: today, name: 'Push '+i, status: 'completed', bodyWeightKg: 80,
    startedAt: new Date(Date.now() - i*3600000), entries: [{ exercise: lift._id, sets: [1,2].map(() => ({ done: true, reps: 10, weightKg: 50, rpe: 7 })) }] })));
  const app = express(); app.use(express.json(), cookieParser()); app.use('/ai',createAiRouter({ request: provider })); app.use('/sessions',sessionsRouter); app.use('/routines',routinesRouter);
  app.use((e,_req,res,_next) => res.status(e.status ?? (e.name === 'VersionError' ? 409 : 500)).json({ error: e.message }));
  server = app.listen(0,'127.0.0.1'); await new Promise(r => server.once('listening',r)); base = 'http://127.0.0.1:'+server.address().port;
});
after(async () => { if(server) await new Promise(r => server.close(r)); await mongoose.disconnect(); if(db) await db.stop(); });
const routinePath = () => '/ai/coaching/routines/' + routine.id;
test('progression, reviewed application and undo use current records and atomic routine revisions', async () => {
  const path = routinePath();
  assert.equal((await call(path,'GET',null,other)).status,404);
  const preview = (await call(path)).data;
  assert.equal(preview.rows[0].proposed.targetWeightKg,52.5); assert.equal(count,0);
  assert.equal((await call(path+'/review','POST',{stamp:preview.stamp})).status,400);
  invalidResponse = true;
  assert.equal((await call(path+'/review','POST',{consent:true,stamp:preview.stamp})).status,502);
  invalidResponse = false;
  const reviewed = await call(path+'/review','POST',{consent:true,stamp:preview.stamp});
  assert.equal(reviewed.status,200); const calls = count;
  await call(path+'/review','POST',{consent:true,stamp:preview.stamp}); assert.equal(count,calls);
  assert.equal((await call(path)).data.review.summary,reviewed.data.draft.result.summary);
  const body = { stamp: preview.stamp, exerciseIds: [lift.id] };
  const responses = await Promise.all([call(path+'/apply','POST',body),call(path+'/apply','POST',body)]);
  assert.deepEqual(responses.map(r=>r.status).sort(),[200,409]);
  assert.equal((await Routine.findById(routine._id)).exercises[0].targetWeightKg,52.5);
  const next = (await call(path)).data; assert.equal(next.canUndo,true);
  assert.equal((await call(path+'/undo','POST',{revision:next.revision})).status,200);
  assert.equal((await Routine.findById(routine._id)).exercises[0].targetWeightKg,50);
  const afterUndo = (await call(path)).data;
  await Session.updateMany({user:user._id},{ $set:{feedback:{difficulty:'manageable',stoppedFor:'pain',note:''}} });
  assert.equal((await call(path+'/apply','POST',{...body,stamp:afterUndo.stamp})).status,409);
  assert.equal((await call(path)).data.rows[0].proposed,null);
});
test('planner preserves previews, moves dates, rejects stale writes and isolates account data without GPT',async()=>{
  const startCount=count;
  const week=weekKey(today); const path='/ai/coaching/weeks/'+week;
  const plan=await call(path); assert.equal(plan.data.revision,-1);
  const slots=[{ date:week, routineId:routine.id }];
  assert.equal((await call(path,'PUT',{revision:-1,slots},other)).status,400);
  assert.equal((await call(path,'PUT',{revision:-1,slots})).status,200);
  assert.equal((await call(path,'PUT',{revision:-1,slots})).status,409);
  const later=new Date(week+'T12:00:00Z'); later.setUTCDate(later.getUTCDate()+2);
  slots[0].date=later.toISOString().slice(0,10);
  assert.equal((await call(path,'PUT',{revision:0,slots})).status,200);
  assert.deepEqual((await call(path)).data.slots,slots);
  assert.equal((await call(path)).data.completed.length,2);
  assert.equal((await call(path,'GET',null,other)).data.slots.length,0);
  assert.equal(await WeekPlan.countDocuments(),1);assert.equal(count,startCount);
});
test('feedback is optional and saved with finished work, and time and pain produce different suggestions', async () => {
  await Session.updateMany({user:user._id},{ $unset:{feedback:1} });
  const active=(await call('/sessions','POST',{routineId:routine.id})).data.session;
  const saved=(await call('/sessions/'+active.id,'PATCH',{revision:active.revision,entries:[{exerciseId:lift.id,sets:[{done:true,reps:8,weightKg:50}]}]})).data.session;
  assert.equal((await call('/sessions/'+active.id+'/finish','POST',{revision:saved.revision,feedback:{difficulty:'bad'}})).status,400);
  const feedback={difficulty:'manageable',stoppedFor:'time',note:'Had to catch the bus.'};
  const ended=await call('/sessions/'+active.id+'/finish','POST',{revision:saved.revision,feedback});
  assert.deepEqual(ended.data.session.feedback,feedback);
  const row=(await call(routinePath())).data.rows[0];assert.equal(row.proposed.targetSets,1);
});
test('focused questions share only the selected scope, cache answers and reject foreign subjects',async()=>{
  const path='/ai/coaching/question';const question={question:'How has my bench progressed?',subjectType:'exercise',subjectId:lift.id,consent:true};
  const privateLift=await Exercise.create({owner:other._id,name:'Other exercise',slug:'other-exercise',category:'chest',type:'strength'});
  await Session.create({user:other._id,name:'Other workout',date:today,status:'completed',startedAt:new Date(),bodyWeightKg:70,entries:[{exercise:lift._id}]});
  assert.equal((await call(path,'POST',{...question,subjectId:privateLift.id})).status,404);
  assert.equal((await call(path,'POST',{...question,consent:false})).status,400);
  const response=await call(path,'POST',question);assert.equal(response.status,200);assert.equal(response.data.draft.question,question.question);
  assert.ok(context.history.length>0);assert.ok(!JSON.stringify(context).includes('Other workout'));
  const calls=count;await call(path,'POST',question);assert.equal(count,calls);
  assert.equal(await AiDraft.countDocuments({user:user._id,task:'question'}),1);
});
