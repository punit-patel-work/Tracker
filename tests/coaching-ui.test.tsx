import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import RoutineReview from '../src/components/RoutineReview';
import WeeklyPlanner from '../src/components/WeeklyPlanner';
import CoachQuestion from '../src/components/CoachQuestion';
import { aiApi } from '../src/lib/ai';
import { todayISO, shiftDays } from '../src/lib/format';
import { weekKey } from '../shared/engine.js';

const state = vi.hoisted(() => ({
  routine: { id: 'push', name: 'Push', note: '', lastPerformedAt: null, exercises: [{ exerciseId: 'lift', targetReps: 8, targetSets: 2, targetWeightKg: 50, restSec: 60 }] },
  reload: vi.fn(),
}));
vi.mock('../src/state/app', () => ({ useApp: () => ({ user: { units: 'metric' }, exercises: [{ id: 'lift', name: 'Bench' }], routines: [state.routine], byId: new Map(), reloadRoutines: state.reload }) }));
vi.mock('../src/lib/ai',() => ({ aiApi: vi.fn() }));
beforeEach(() => { vi.mocked(aiApi).mockReset(); });
afterEach(cleanup);
it('shows targets and evidence before the user selects an individual change',async()=>{
  const current = { targetReps: 8, targetSets: 2, targetWeightKg: 50 };
  const row = { exerciseId: 'lift', name: 'Bench', current, proposed: { ...current, targetWeightKg: 52.5 }, reason:'Both logs met your target.', evidence:[{id:'s',date:'2026-11-04',name:'Push'}] };
  vi.mocked(aiApi).mockResolvedValue({stamp:'current',rows:[row],canUndo:false,revision:0,review:null});
  render(<RoutineReview routine={state.routine} onClose={vi.fn()}/>);
  await screen.findByText(/Based on Push/);
  const apply = screen.getByRole('button',{name:'Apply selected (0)'}) as HTMLButtonElement;
  expect(apply.disabled).toBe(true);
  expect((screen.getByRole('button',{name:'Request AI review'}) as HTMLButtonElement).disabled).toBe(true);
  fireEvent.click(screen.getByLabelText('Apply this change')); fireEvent.click(apply);
  await waitFor(()=>expect(aiApi).toHaveBeenCalledWith('/coaching/routines/push/apply','POST',{stamp:'current',revision:0,exerciseIds:['lift']}));
  expect(aiApi).not.toHaveBeenCalledWith(expect.stringContaining('/review'),'POST',expect.anything());
});
it('stages a missed workout move until Save week is clicked',async()=>{
  const week=weekKey(todayISO());
  vi.mocked(aiApi).mockResolvedValueOnce({revision:1,slots:[{date:week,routineId:'push'}],preferredDays:['Mon'],completed:[]}).mockResolvedValueOnce({revision:2});
  render(<WeeklyPlanner/>);
  const move=await screen.findByLabelText('Move session');
  fireEvent.change(move,{target:{value:shiftDays(week,2)}});
  expect(aiApi).toHaveBeenCalledTimes(1);
  fireEvent.click(screen.getByRole('button',{name:'Save week'}));
  await screen.findByText('Week saved.');
  expect(aiApi).toHaveBeenCalledWith('/coaching/weeks/'+week,'PUT',{revision:1,slots:[{date:shiftDays(week,2),routineId:'push'}]});
});
it('sends a focused question only after subject selection and consent',async()=>{
  vi.mocked(aiApi).mockResolvedValue({draft:{id:'answer'}});
  const onAnswer=vi.fn(); render(<CoachQuestion enabled onAnswer={onAnswer}/>);
  fireEvent.change(screen.getByLabelText('Training record'),{target:{value:'push'}});
  fireEvent.change(screen.getByLabelText('Your question'),{target:{value:'Why these rep targets?'}});
  expect((screen.getByRole('button',{name:'Ask coach'}) as HTMLButtonElement).disabled).toBe(true);
  fireEvent.click(screen.getByLabelText(/Share this question/));fireEvent.click(screen.getByRole('button',{name:'Ask coach'}));
  await waitFor(()=>expect(onAnswer).toHaveBeenCalledWith({id:'answer'}));
  expect(aiApi).toHaveBeenCalledWith('/coaching/question','POST',{consent:true,subjectType:'routine',subjectId:'push',question:'Why these rep targets?'});
});
