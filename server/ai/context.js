import { Exercise, Session, Routine } from '../models.js';
import { sessionTotals, CALC_VERSION } from '../../shared/engine.js';
import { available, movement, equipmentTags } from './catalog.js';
import { todayFor } from '../validation.js';
export const shiftDay = (day,n) => new Date(Date.parse(day+'T12:00:00Z')+n*86400000).toISOString().slice(0,10);
export async function buildContext(user, zone, preferences, task, sessionId) {
  const today = todayFor(zone);
  const exercises = await Exercise.find({ $or:[{owner:null},{owner:user._id}] }).sort({name:1}).lean();
  const byId = new Map(exercises.map(e=>[String(e._id),e]));
  const sessions = await Session.find({user:user._id,status:'completed',date:{$gte:shiftDay(today,-84),$lte:today}})
    .sort({date:-1,_id:-1}).limit(120).lean();
  if (sessionId && !sessions.some(s=>String(s._id)===sessionId)) {
    const old = await Session.findOne({_id:sessionId,user:user._id,status:'completed'}).lean();
    if (!old) throw Object.assign(new Error('Completed workout not found'),{status:404});
    sessions.push(old);
  }
  const history = sessions.map(s=>({
    id:String(s._id),date:s.date,name:s.name,revision:s.__v??0,bodyWeightKg:s.bodyWeightKg,
    totals:sessionTotals({ ...s, entries:s.entries.map(e=>({...e,exerciseId:String(e.exercise)})) },byId),
    entries:s.entries.map(e=>({
      exerciseId:String(e.exercise),name:byId.get(String(e.exercise))?.name??'Archived exercise',
      equipment:byId.get(String(e.exercise))?.equipment??'Unknown',
      sets:e.sets.filter(s=>s.done!==false).map(({reps,weightKg,durationSec,restSec,rpe,isWarmup})=>({reps,weightKg,durationSec,restSec,rpe,isWarmup})),
      cardio:e.cardio?.done?e.cardio:null,notes:e.notes??'',
    })), notes:s.notes??'',
  }));
  const recentIds = new Set(history.flatMap(s=>s.entries.map(e=>e.exerciseId)));
  // Provide all compatible choices; context is intentionally generous for this small private app.
  const candidates = exercises.filter(e=>!e.archived && (!preferences || (available(e,preferences.equipment) && !preferences.excludedExerciseIds.includes(String(e._id)))));
  const aggregate = rows=>rows.reduce((a,s)=>({sessions:a.sessions+1,workingSets:a.workingSets+(s.totals.workingSets??0),
    minutes:a.minutes+(s.totals.durationMin??0),estimatedKcal:a.estimatedKcal+(s.totals.totalKcal??0)}),
    {sessions:0,workingSets:0,minutes:0,estimatedKcal:0});
  const current = history.filter(s=>s.date>=shiftDay(today,-6));
  const previous = history.filter(s=>s.date>=shiftDay(today,-13)&&s.date<shiftDay(today,-6));
  const selected = task==='explanation' ? history.filter(s=>s.id===sessionId) : task==='review' ? [...current,...previous] : history;
  const routines = task==='routine' ? await Routine.find({user:user._id,archived:false}).select('name exercises note').limit(30).lean():[];
  return {
    today,timeZone:zone,preferences,
    historyWindow:{from:shiftDay(today,-84),to:today,maxSessions:120},
    history:selected, weekly:{from:shiftDay(today,-6),to:today,current:aggregate(current),previous:aggregate(previous),target:user.weeklyTarget},
    routines:routines.map(r=>({name:r.name,note:r.note,exercises:r.exercises.map(e=>({...e,exercise:String(e.exercise)}))})),
    candidates:(task==='routine'?candidates:exercises.filter(e=>selected.some(s=>s.entries.some(x=>x.exerciseId===String(e._id))))).map(e=>({
      exerciseId:String(e._id),name:e.name,type:e.type,category:e.category,equipment:e.equipment,equipmentTags:equipmentTags(e),
      primaryMuscles:e.primaryMuscles,secondaryMuscles:e.secondaryMuscles,movement:movement(e),
      isTimed:!!e.isTimed,isBodyweight:!!e.isBodyweight,isBarbell:!!e.isBarbell,barWeightKg:e.barWeightKg,
      met:e.met,defaultRestSec:e.defaultRestSec,energyModel:e.energyModel,previouslyLogged:recentIds.has(String(e._id)),
    })),
    calorieMethod:{version:CALC_VERSION,formula:'MET * 3.5 * recorded bodyWeightKg / 200 * minutes',secondsPerRep:3,restMET:1.5,
      notes:'Gross estimates, not measured burn. Working sets only. Saved/default rest included. Cardio depends on recorded time, intensity and supported speed model. Timer and lifted load do not directly drive calories.'},
  };
}
export function checkRoutine(result,context) {
  if (result.days.length!==context.preferences.days) throw new Error('The routine did not match your requested number of days.');
  const map=new Map(context.candidates.map(e=>[e.exerciseId,e]));
  for (const day of result.days) {
    const seen=new Set();
    let seconds=300; // warm-up allowance + transition allowance per exercise
    for (const item of day.exercises) {
      const ex=map.get(item.exerciseId);
      if (!ex || seen.has(item.exerciseId)) throw new Error('The routine included an unavailable or repeated exercise.');
      seen.add(item.exerciseId);
      if (ex.type==='cardio') {
        if (!(item.targetCardioMin>0) || item.targetDurationSec!==null || item.targetReps!==0 || item.targetWeightKg!==null) throw new Error('Invalid cardio target.');
        seconds+=item.targetCardioMin*60;
      } else {
        if (item.targetCardioMin!==null || (ex.isTimed ? !(item.targetDurationSec>0) || item.targetReps!==0 : item.targetDurationSec!==null || item.targetReps<1)) throw new Error('Invalid strength target.');
        seconds+=item.targetSets*((item.targetDurationSec??item.targetReps*3)+item.restSec);
      }
      seconds+=60;
      // A new movement has no trustworthy load history. Never transfer another exercise's weight.
      const records=context.history.filter(s=>s.date>=shiftDay(context.today,-42)).flatMap(s=>s.entries)
        .filter(e=>e.exerciseId===item.exerciseId).flatMap(e=>e.sets).filter(s=>!s.isWarmup&&s.weightKg!=null);
      if (!records.length || context.preferences.breakWeeks>6) {
        item.targetWeightKg=null;
        item.loadReason='Choose a comfortable starting load during warm-up; no sufficiently recent, matching performance is available.';
      } else if(item.targetWeightKg!==null) {
        const max=Math.max(...records.map(s=>s.weightKg));
        if(item.targetWeightKg>max*1.1+2.5) {
          item.targetWeightKg=null;
          item.loadReason='Suggested load needs your review. Start from your recent performance and adjust during warm-up.';
        }
      }
    }
    day.estimatedMinutes=Math.ceil(seconds/60);
    if(day.estimatedMinutes>context.preferences.minutes+10) throw new Error('The proposed session exceeds your available time. Try again or adjust your preferences.');
  }
  return result;
}
