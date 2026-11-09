import { Exercise } from '../models.js';
import { AiAlternative } from './models.js';
import { alternativeCandidates,catalogFingerprint,movement } from './catalog.js';
// Version-gated caller; empty lists are intentional for movements without maintained relationships.
export async function seedAlternatives() {
  const list=await Exercise.find({owner:null,archived:false}).sort({name:1}).lean();
  const fingerprint=catalogFingerprint(list);
  const existing=new Set((await AiAlternative.find({curated:true}).select('source').lean()).map(x=>String(x.source)));
  const updates=list.filter(e=>!existing.has(String(e._id))).map(e=>({updateOne:{filter:{source:e._id},
    update:{$set:{fingerprint,group:movement(e),candidates:alternativeCandidates(e,list).map(c=>c._id)}},upsert:true}}));
  if(updates.length)await AiAlternative.bulkWrite(updates,{ordered:false});
  return {exercises:list.length,withAlternatives:list.filter(e=>alternativeCandidates(e,list).length).length};
}
