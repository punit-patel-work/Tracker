import { invalid, text, number, array, id } from '../validation.js';
import { EQUIPMENT } from './catalog.js';
const str = (max = 600) => ({ type: 'string', maxLength: max });
const nullableNum = (min, max) => ({ type: ['number','null'], minimum: min, maximum: max });
const num = (min,max) => ({ type:'integer',minimum:min,maximum:max });
const list = (items, max = 12) => ({ type: 'array', items, maxItems: max });
const obj = properties => ({ type: 'object', properties, required: Object.keys(properties), additionalProperties: false });
export const exerciseSchema = obj({
  exerciseId: str(24), targetSets: num(1,8), targetReps: num(0,50),
  targetWeightKg: nullableNum(0,1000), restSec: num(0,600),
  targetDurationSec: nullableNum(5,600), targetCardioMin: nullableNum(1,90),
  reason: str(500), loadReason: str(500),
});
export const routineSchema = obj({
  title: str(100), explanation: str(1800), limitations: list(str(400),8),
  days: { ...list(obj({ name: str(100), focus: str(300), exercises: { ...list(exerciseSchema,10), minItems:1 } }),6), minItems:1 },
});
export const insightSchema = obj({
  summary: str(2000), observations: list(obj({ title: str(100), detail: str(700), evidenceIds: list(str(24),12) }),6),
  nextSteps: list(str(500),5), limitations: list(str(500),6),
});
export function validateSchema(value, schema, path = 'response') {
  const types = Array.isArray(schema.type) ? schema.type : [schema.type];
  const type = value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value;
  if (!types.includes(type) && !(types.includes('integer') && Number.isInteger(value))) invalid('Invalid AI ' + path);
  if (value === null) return;
  if (typeof value === 'number' && (!Number.isFinite(value) || value < schema.minimum || value > schema.maximum)) invalid('AI value out of range: ' + path);
  if (typeof value === 'string' && value.length > schema.maxLength) invalid('AI text too long: ' + path);
  if (Array.isArray(value)) {
    if (value.length > schema.maxItems || value.length < (schema.minItems ?? 0)) invalid('Invalid AI list: ' + path);
    value.forEach((v,i) => validateSchema(v,schema.items,path+'.'+i));
  } else if (type === 'object') {
    if (Object.keys(value).some(k => !Object.hasOwn(schema.properties,k)) || schema.required.some(k => !Object.hasOwn(value,k))) invalid('Invalid AI fields: ' + path);
    for (const [k,s] of Object.entries(schema.properties)) validateSchema(value[k],s,path+'.'+k);
  }
}
export function preferencesInput(body) {
  if(!body || typeof body !== 'object' || Array.isArray(body)) invalid('Complete the training preferences form');
  const choice = (key, values) => { if (!values.includes(body[key])) invalid('Choose a valid ' + key); return body[key]; };
  const strings = (key,max = 10) => array(body[key] ?? [],key,max).map(v => text(v,key,100));
  const nullable = (key,min,max) => body[key] == null || body[key] === '' ? null : number(body[key],key,min,max);
  const p = {
    goal: choice('goal',['strength','hypertrophy','fat-loss','general']),
    experience: choice('experience',['new','beginner','intermediate','experienced','returning']),
    trainingMonths: number(body.trainingMonths ?? 0,'Training months',0,900,true),
    breakWeeks: number(body.breakWeeks ?? 0,'Break weeks',0,520,true),
    days: number(body.days,'Days per week',1,6,true), minutes: number(body.minutes,'Session minutes',15,120,true),
    equipment: strings('equipment',20), preferredDays: strings('preferredDays',6), priorities: strings('priorities',8),
    gender: choice('gender',['unspecified','male','female','nonbinary','self-described']),
    age: nullable('age',18,100), weightKg: nullable('weightKg',25,400), heightCm: nullable('heightCm',100,250),
    excludedExerciseIds: strings('excludedExerciseIds',100).map(id),
    preferences: text(body.preferences ?? '', 'Preferences',1500,false),
    limitations: text(body.limitations ?? '', 'Movement limitations',1500,false),
  };
  if (!p.equipment.length || p.equipment.some(v => !EQUIPMENT.includes(v))) invalid('Select available equipment');
  if (new Set(p.preferredDays).size !== p.preferredDays.length || p.preferredDays.some(v => !['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].includes(v))) invalid('Choose valid training days');
  if (p.preferredDays.length && p.preferredDays.length !== p.days) invalid('Select one preferred weekday per training day, or leave weekdays open');
  return p;
}
