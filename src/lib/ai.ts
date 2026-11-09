import { ApiError } from './api';
import type { RoutineExercise } from './types';
export interface TrainingPreferences {
  goal:string; experience:string; trainingMonths:number; breakWeeks:number; days:number; minutes:number;
  equipment:string[]; preferredDays:string[]; priorities:string[]; gender:string;
  age:number|null; weightKg:number|null; heightCm:number|null;
  excludedExerciseIds:string[]; preferences:string; limitations:string;
}
export interface AiExercise extends RoutineExercise { reason:string; loadReason:string; targetDurationSec:number|null; targetCardioMin:number|null }
export interface AiDay { name:string; focus:string; exercises:AiExercise[]; estimatedMinutes?:number }
export interface RoutineResult { title:string; explanation:string; limitations:string[]; days:AiDay[] }
export interface InsightResult { summary:string; observations:{title:string;detail:string;evidenceIds:string[]}[]; nextSteps:string[]; limitations:string[] }
export interface AiDraft { id:string;savedDays?:number[];task:'routine'|'review'|'explanation';result:RoutineResult|InsightResult;createdAt:string;model:string;costUsd:number;
  weekly?:{from:string;to:string;current:{sessions:number;workingSets:number;minutes:number;estimatedKcal:number};previous:unknown};
  evidence?:{id:string;name:string;date:string}[] }
export interface Bootstrap {preferences:TrainingPreferences|null;enabled:boolean;configured:boolean;equipment:string[];drafts:AiDraft[]}
export async function aiApi<T>(path:string,method='GET',body?:unknown,signal?:AbortSignal):Promise<T> {
  let res:Response;
  try { res=await fetch('/api/ai'+path,{method,credentials:'same-origin',cache:'no-store',
    headers:{'Content-Type':'application/json','X-Time-Zone':Intl.DateTimeFormat().resolvedOptions().timeZone},
    body:body===undefined?undefined:JSON.stringify(body),signal:signal??AbortSignal.timeout(125000)}); }
  catch(e){
    if(signal?.aborted)throw e;
    const timedOut=typeof e==='object' && e!==null && 'name' in e && e.name==='TimeoutError';
    throw new ApiError(timedOut
      ? 'The AI request took too long. Check Saved suggestions before generating again; the server may still finish it.'
      : 'Cannot connect to the app server. Check your connection and that the API is running, then check Saved suggestions before generating again.',0);
  }
  const data=await res.json().catch(()=>null);
  if(!res.ok||!data)throw new ApiError(data?.error??'AI request failed',res.status);
  return data as T;
}
export const equipmentLabels:Record<string,string>={full_gym:'Full gym',bodyweight:'Bodyweight / mat',dumbbell:'Dumbbells',barbell:'Barbell / EZ bar',bench:'Bench',cable:'Cable station',machine:'Machines',smith:'Smith machine',band:'Resistance bands',kettlebell:'Kettlebells',pullup_bar:'Pull-up bar',suspension:'Suspension straps',ball:'Stability ball',other:'Other equipment'};
