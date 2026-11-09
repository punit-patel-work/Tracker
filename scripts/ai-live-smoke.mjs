// Explicit opt-in live test: synthetic profile only, disposable DB, no emails or real workout changes.
import fs from 'node:fs';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import {MongoMemoryServer} from 'mongodb-memory-server';
import {User,Exercise,Session} from '../server/models.js';
import * as aiModels from '../server/ai/models.js';
import {buildContext} from '../server/ai/context.js';
import {generate} from '../server/ai/service.js';
import {CATALOG} from '../shared/catalog.js';
import {todayFor} from '../server/validation.js';
if(!process.argv.includes('--live'))throw new Error('Use --live to authorize paid OpenAI calls with synthetic data.');
const env=dotenv.parse(fs.readFileSync('.env'));process.env.OPENAI_API_KEY=env.OPENAI_API_KEY;
if(!process.env.OPENAI_API_KEY)throw new Error('OPENAI_API_KEY is missing.');
let db;
try{
 db=await MongoMemoryServer.create();await mongoose.connect(db.getUri());
 await Promise.all([User,Exercise,Session,...Object.values(aiModels)].map(m=>m.init()));
 const user=await User.create({name:'Synthetic test user',email:'synthetic@example.invalid',passwordHash:'unused',weeklyTarget:3});
 await Exercise.insertMany(CATALOG.map(e=>({...e,_id:undefined})));
 const lift=await Exercise.findOne({slug:'dumbbell-flat-bench-press'});
 const session=await Session.create({user:user._id,name:'Synthetic training session',date:todayFor('UTC'),status:'completed',bodyWeightKg:75,
   startedAt:new Date(Date.now()-1800000),endedAt:new Date(),entries:[{exercise:lift._id,sets:[{reps:10,weightKg:12,done:true,rpe:7,restSec:90}]}]});
 const preferences={goal:'general',experience:'beginner',trainingMonths:3,breakWeeks:0,days:3,minutes:45,equipment:['dumbbell','bench','bodyweight'],
   preferredDays:['Mon','Wed','Fri'],priorities:[],gender:'unspecified',age:30,weightKg:75,heightCm:175,excludedExerciseIds:[],preferences:'Prefer straightforward movements.',limitations:''};
 for(const task of ['routine','review','explanation']){
  const context=await buildContext(user,'UTC',preferences,task,task==='explanation'?session.id:undefined);
  if(task==='explanation')context.topic='Explain the calorie estimate.';
  const {draft}=await generate({user,task,context});
  console.log(JSON.stringify({task,model:draft.model,status:'validated',usage:draft.usage,estimatedUsd:draft.costUsd,days:draft.result.days?.length}));
 }
}catch(e){console.error('Live AI check:',e.message);process.exitCode=1;}
finally{await mongoose.disconnect();if(db)await db.stop();}
