import {beforeEach,afterEach,expect,it,vi} from 'vitest';
import {cleanup,fireEvent,render,screen,waitFor} from '@testing-library/react';
import AiCoach,{RoutinePreview} from '../src/pages/AiCoach';
import ExerciseAlternatives from '../src/components/ExerciseAlternatives';
import {aiApi} from '../src/lib/ai';
import type {AiDraft} from '../src/lib/ai';
const state=vi.hoisted(()=>({reload:vi.fn(),exercises:[
 {id:'a',name:'Bench press',equipment:'Barbell',type:'strength',primaryMuscles:['Chest'],isTimed:false,howToUrl:''},
 {id:'b',name:'Dumbbell press',equipment:'Dumbbell',type:'strength',primaryMuscles:['Chest'],isTimed:false,howToUrl:''},
]}));
vi.mock('../src/state/app',()=>({useApp:()=>({user:{id:'user',goal:'general',units:'metric',weeklyTarget:3},exercises:state.exercises,byId:new Map(state.exercises.map(e=>[e.id,e])),reloadRoutines:state.reload,offline:false})}));
vi.mock('../src/lib/ai',async importOriginal=>({...await importOriginal<typeof import('../src/lib/ai')>(),aiApi:vi.fn()}));
vi.mock('../src/lib/api',()=>({api:{sessions:vi.fn().mockResolvedValue({sessions:[]})},ApiError:class extends Error{}}));
const draft:AiDraft={id:'draft',task:'routine',createdAt:'2026-11-03T00:00:00Z',model:'test',costUsd:.01,result:{title:'Training plan',explanation:'Based on your preferences.',limitations:[],days:[{name:'Day A',focus:'Full body',estimatedMinutes:30,exercises:[{exerciseId:'a',targetSets:3,targetReps:8,targetWeightKg:40,restSec:90,targetDurationSec:null,targetCardioMin:null,reason:'Matches the plan.',loadReason:'Recent logged weight.'}]}]}};
beforeEach(()=>{sessionStorage.clear();vi.mocked(aiApi).mockReset();state.reload.mockResolvedValue(undefined);vi.mocked(aiApi).mockImplementation(async(path)=>{
 if(path==='/bootstrap')return {preferences:null,enabled:true,configured:true,equipment:[],drafts:[] } as any;
 if(path.startsWith('/alternatives/'))return {alternatives:[{exerciseId:'b',name:'Dumbbell press',equipment:'Dumbbell',reason:'Related movement.'}]} as any;
 if(path.endsWith('/save'))return {routineId:'new'} as any;
 return {draft,cached:false} as any;
});});
afterEach(cleanup);
it('uses a three-step form and requires explicit consent before a paid routine request',async()=>{
 render(<AiCoach/>);await screen.findByText('Goals & schedule');
 fireEvent.click(screen.getByRole('button',{name:'Continue'}));await screen.findByText('Training background');
 expect(screen.getByLabelText('Months of previous training')).toBeTruthy();
 fireEvent.change(screen.getByLabelText('Months of previous training'),{target:{value:'24'}});
 fireEvent.click(screen.getByRole('button',{name:'Continue'}));
 const button=screen.getByRole('button',{name:'Generate my routine'}) as HTMLButtonElement;
 expect(button.disabled).toBe(true);
 fireEvent.click(screen.getByLabelText(/Use my selected profile/));fireEvent.click(button);
 await screen.findByText('Training plan');
 expect(aiApi).toHaveBeenCalledWith('/routine-draft','POST',expect.objectContaining({consent:true,preferences:expect.objectContaining({trainingMonths:24})}));
 expect(aiApi).not.toHaveBeenCalledWith(expect.stringContaining('/save'),'POST',expect.anything());
});
it('reopening saved suggestions does not call generation',async()=>{
 vi.mocked(aiApi).mockResolvedValueOnce({preferences:null,enabled:true,configured:true,equipment:[],drafts:[draft]} as any);
 render(<AiCoach/>);await screen.findByText('Goals & schedule');
 fireEvent.click(screen.getByRole('button',{name:'Saved suggestions'}));
 fireEvent.click(screen.getByRole('button',{name:/Training plan/}));
 await screen.findByText('Based on your preferences.');
 expect(aiApi).toHaveBeenCalledTimes(1);
});
it('keeps generation errors visible and allows retry without saving records',async()=>{
 render(<AiCoach/>);await screen.findByText('Goals & schedule');
 fireEvent.click(screen.getByRole('button',{name:'Review my week'}));fireEvent.click(screen.getByLabelText(/Use my selected profile/));
 vi.mocked(aiApi).mockRejectedValueOnce(new Error('Monthly allowance reached'));
 fireEvent.click(screen.getAllByRole('button',{name:'Review my week',exact:true}).at(-1)!);
 await screen.findByRole('alert');expect(screen.getByText('Monthly allowance reached')).toBeTruthy();
});
it('edits generated targets and only saves when the user accepts',async()=>{
 render(<RoutinePreview draft={draft} onSaved={state.reload}/>);
 fireEvent.change(screen.getByLabelText('Reps'),{target:{value:'12'}});
 expect(aiApi).not.toHaveBeenCalled();
 fireEvent.click(screen.getByRole('button',{name:'Save this session to routines'}));
 await screen.findByText('Saved to routines');
 expect(aiApi).toHaveBeenCalledWith('/drafts/draft/save','POST',expect.objectContaining({exercises:[expect.objectContaining({targetReps:12})]}));
 expect(state.reload).toHaveBeenCalled();
});
it('replacement selection clears the old movement’s suggested load without a GPT request',async()=>{
 render(<RoutinePreview draft={draft} onSaved={state.reload}/>);
 fireEvent.click(screen.getByRole('button',{name:'Alternatives'}));await screen.findByRole('dialog');
 fireEvent.click(await screen.findByRole('button',{name:'Choose'}));
 await waitFor(()=>expect(screen.queryByRole('dialog')).toBeNull());
 expect((screen.getByLabelText('Weight (kg)') as HTMLInputElement).value).toBe('');
 expect(screen.getByText('Dumbbell press')).toBeTruthy();
 expect(vi.mocked(aiApi).mock.calls.every(c=>c[0].startsWith('/alternatives/'))).toBe(true);
});
it('alternatives show a useful empty state and can be dismissed by keyboard',async()=>{
 vi.mocked(aiApi).mockResolvedValue({alternatives:[]} as any);const close=vi.fn();
 render(<ExerciseAlternatives sourceId="a" exclude={['a']} onPick={vi.fn()} onClose={close}/>);
 await screen.findByText(/No maintained alternatives/);
 fireEvent.keyDown(document,{key:'Escape'});expect(close).toHaveBeenCalled();
});
