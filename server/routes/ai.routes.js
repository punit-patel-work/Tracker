import { coachingRoutes } from './coaching.routes.js';
import { Router } from 'express';
import { requireAuth, requireAdmin } from '../auth.js';
import { Exercise, Session, Routine, AdminAudit } from '../models.js';
import { id, text, number, array, invalid, routineInput, accessibleExercises } from '../validation.js';
import { AiPreferences, AiDraft, AiAlternative, AiUsage, AiSettings } from '../ai/models.js';
import { preferencesInput, validateSchema, exerciseSchema } from '../ai/schemas.js';
import { available, movement, alternativeCandidates, catalogFingerprint, EQUIPMENT } from '../ai/catalog.js';
import { buildContext } from '../ai/context.js';
import { generate, settings, budget, serialize, openaiRequest } from '../ai/service.js';

export function createAiRouter({request=openaiRequest}={}) {
const router=Router();
router.use(requireAuth,(_req,res,next)=>{res.set('Cache-Control','no-store');next();});
router.use('/coaching', coachingRoutes(request));
router.get('/bootstrap',async(req,res)=>{
  const [prefs,config,drafts]=await Promise.all([AiPreferences.findOne({user:req.user._id}).lean(),settings(),AiDraft.find({user:req.user._id,task:{$ne:'adjustment'}}).sort({createdAt:-1}).limit(8).lean()]);
  res.json({preferences:prefs?.preferences??null,enabled:config.enabled,configured:!!process.env.OPENAI_API_KEY,equipment:EQUIPMENT,drafts:drafts.map(serialize)});
});
router.put('/preferences',async(req,res)=>{
  const preferences=preferencesInput(req.body);
  await AiPreferences.findOneAndUpdate({user:req.user._id},{$set:{preferences}},{upsert:true});
  res.json({preferences});
});
router.get('/alternatives/:id',async(req,res)=>{
  id(req.params.id);
  const all=await Exercise.find({$or:[{owner:null},{owner:req.user._id}]}).sort({name:1}).lean();
  const source=all.find(e=>String(e._id)===req.params.id);
  if(!source) return res.status(404).json({error:'Exercise not found'});
  // Cache each source against its owner's visible catalog; shared sources use only shared candidates.
  const universe=source.owner?all:all.filter(e=>!e.owner);
  const fingerprint=catalogFingerprint(universe);
  let saved=await AiAlternative.findOne({source:source._id}).lean();
  if(!saved?.curated && saved?.fingerprint!==fingerprint) {
    saved=await AiAlternative.findOneAndUpdate({source:source._id},{$set:{fingerprint,group:movement(source),candidates:alternativeCandidates(source,universe).map(e=>e._id)}},{upsert:true,returnDocument:'after'}).lean();
  }
  const prefs=await AiPreferences.findOne({user:req.user._id}).lean();
  const equipment=typeof req.query.equipment==='string'?req.query.equipment.split(','):(prefs?.preferences?.equipment??['full_gym']);
  if(equipment.some(e=>!EQUIPMENT.includes(e))) invalid('Invalid equipment filter');
  const exclude=typeof req.query.exclude==='string'?req.query.exclude.split(','):[];
  if(exclude.length>100) invalid('Too many exclusions');
  const denied=new Set([...exclude,...(prefs?.preferences?.excludedExerciseIds??[])]);
  const allowed=new Set((saved?.candidates??[]).map(String));
  res.json({group:saved?.group??null,curated:!!saved?.curated,alternatives:all.filter(e=>allowed.has(String(e._id))&&!e.archived&&e.type===source.type&&!!e.isTimed===!!source.isTimed&&!denied.has(String(e._id))&&available(e,equipment))
    .map(e=>({exerciseId:String(e._id),name:e.name,equipment:e.equipment,reason:'Related '+(saved?.group??'movement')+'. Technique, difficulty and loads can differ; choose a fresh starting load.'}))});
});
router.post('/routine-draft',async(req,res)=>{
  if(req.body?.consent!==true) invalid('Confirm sharing relevant training data with OpenAI to generate a suggestion');
  const preferences=preferencesInput(req.body.preferences??{});
  const context=await buildContext(req.user,req.timeZone,preferences,'routine');
  if(!context.candidates.length) invalid('No exercises match your equipment and exclusions');
  await AiPreferences.findOneAndUpdate({user:req.user._id},{$set:{preferences}},{upsert:true});
  res.json(await generate({user:req.user,task:'routine',context,request}));
});
router.post('/weekly-review',async(req,res)=>{
  if(req.body?.consent!==true) invalid('Confirm sharing relevant training data with OpenAI');
  const prefs=await AiPreferences.findOne({user:req.user._id}).lean();
  const context=await buildContext(req.user,req.timeZone,prefs?.preferences??null,'review');
  if(!context.history.length) invalid('Log a completed workout in the last 14 days to get a weekly review');
  res.json(await generate({user:req.user,task:'review',context,request}));
});
router.post('/workout-explanation',async(req,res)=>{
  if(req.body?.consent!==true) invalid('Confirm sharing relevant training data with OpenAI');
  const sessionId=id(req.body.sessionId),topic=text(req.body.topic??'Explain this workout','Topic',500);
  const context=await buildContext(req.user,req.timeZone,null,'explanation',sessionId);context.topic=topic;
  res.json(await generate({user:req.user,task:'explanation',context,request}));
});
router.post('/drafts/:id/save',async(req,res)=>{
  id(req.params.id);
  const draft=await AiDraft.findOne({_id:req.params.id,user:req.user._id,task:'routine'}).lean();
  if(!draft) return res.status(404).json({error:'Routine draft not found'});
  const index=number(req.body.dayIndex,'Day',0,draft.result.days.length-1,true);
  const name=text(req.body.name,'Routine name');
  const list=array(req.body.exercises,'Exercises',10);
  if(!list.length) invalid('Add at least one exercise');
  list.forEach(e=>validateSchema(e,exerciseSchema));
  const entries=routineInput(list);
  const byId=await accessibleExercises(entries.map(e=>String(e.exercise)),req.user._id);
  if([...byId.values()].some(e=>e.archived)) invalid('An exercise was archived. Choose another before saving');
  for(const e of list){
    const ex=byId.get(e.exerciseId);
    if(ex.type==='cardio' ? !(e.targetCardioMin>0) : ex.isTimed ? !(e.targetDurationSec>0) : !(e.targetReps>0)) invalid('Complete the exercise targets before saving');
  }
  const source=req.params.id+':'+index;
  const routine=await Routine.findOneAndUpdate({user:req.user._id,aiSource:source},{$setOnInsert:{
    name,note:text(req.body.note??'','Routine note',2000,false),exercises:entries,aiSource:source,
  }},{upsert:true,returnDocument:'after'}).lean();
  await AiDraft.updateOne({_id:draft._id,user:req.user._id},{$addToSet:{savedDays:index}});
  res.json({routineId:String(routine._id),name:routine.name});
});
router.get('/admin',requireAdmin,async(req,res)=>{
  const [config,ledger,items,groups]=await Promise.all([settings(),budget(),AiUsage.find().sort({createdAt:-1}).limit(30).lean(),
    AiUsage.aggregate([{$match:{createdAt:{$gte:new Date(new Date().toISOString().slice(0,7)+'-01')}}},{$group:{_id:'$task',requests:{$sum:1},costUsd:{$sum:'$costUsd'},inputTokens:{$sum:'$usage.input_tokens'},outputTokens:{$sum:'$usage.output_tokens'}}}])]);
  res.json({config,ledger,items,groups,configured:!!process.env.OPENAI_API_KEY,models:{routine:process.env.OPENAI_ROUTINE_MODEL||'gpt-6.1-sol',insights:process.env.OPENAI_INSIGHT_MODEL||'gpt-6-luna'}});
});
router.patch('/admin',requireAdmin,async(req,res)=>{
  if(typeof req.body.enabled!=='boolean') invalid('Invalid enabled setting');
  const monthlyBudgetUsd=number(req.body.monthlyBudgetUsd,'Monthly USD budget',0,100);
  const config=await AiSettings.findByIdAndUpdate('global',{$set:{enabled:req.body.enabled,monthlyBudgetUsd}},{upsert:true,returnDocument:'after'});
  await AdminAudit.create({actor:req.user._id,actorName:req.user.name,action:'ai.settings',target:'ai',summary:'Updated AI availability and monthly allowance'});
  res.json({config});
});
router.get('/admin/alternatives/:id',requireAdmin,async(req,res)=>{
  id(req.params.id);
  const source=await Exercise.findOne({_id:req.params.id,owner:null}).lean();
  if(!source) return res.status(404).json({error:'Shared exercise not found'});
  const saved=await AiAlternative.findOne({source:source._id}).lean();
  const all=await Exercise.find({owner:null,archived:false}).lean();
  res.json({source:source.name,group:saved?.group??movement(source)??'',candidates:(saved?.curated?saved.candidates:alternativeCandidates(source,all).map(e=>e._id)).map(String)});
});
router.put('/admin/alternatives/:id',requireAdmin,async(req,res)=>{
  id(req.params.id);
  const source=await Exercise.findOne({_id:req.params.id,owner:null}).lean();
  if(!source) return res.status(404).json({error:'Shared exercise not found'});
  const candidates=[...new Set(array(req.body.candidates,'Alternatives',30).map(id))];
  const docs=await Exercise.find({_id:{$in:candidates},owner:null,archived:false,type:source.type,isTimed:!!source.isTimed}).lean();
  if(docs.length!==candidates.length||candidates.includes(req.params.id)) invalid('Choose available shared exercises of the same type');
  await AiAlternative.findOneAndUpdate({source:source._id},{$set:{candidates,group:text(req.body.group,'Movement group',80),curated:true}},{upsert:true});
  await AdminAudit.create({actor:req.user._id,actorName:req.user.name,action:'ai.alternatives',target:req.params.id,summary:'Reviewed alternatives for '+source.name});
  res.json({ok:true});
});
return router;
}
export default createAiRouter();
