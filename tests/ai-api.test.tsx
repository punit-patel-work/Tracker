import {afterEach,expect,it,vi} from 'vitest';
import {aiApi} from '../src/lib/ai';
afterEach(()=>vi.unstubAllGlobals());
it('preserves server validation errors instead of reporting connection failure',async()=>{
 const fetchMock=vi.fn().mockResolvedValue(new Response(JSON.stringify({error:'Your training context exceeds the supported request size.'}),{status:400}));
 vi.stubGlobal('fetch',fetchMock);
 await expect(aiApi('/routine-draft','POST',{})).rejects.toThrow('Your training context exceeds');
 expect(fetchMock).toHaveBeenCalledTimes(1);
});
it('distinguishes browser timeout from an unreachable app server without retrying',async()=>{
 const fetchMock=vi.fn().mockRejectedValue(new DOMException('Timed out','TimeoutError'));
 vi.stubGlobal('fetch',fetchMock);
 await expect(aiApi('/routine-draft','POST',{})).rejects.toThrow('The AI request took too long');
 expect(fetchMock).toHaveBeenCalledTimes(1);
 fetchMock.mockRejectedValue(new TypeError('Failed to fetch'));
 await expect(aiApi('/routine-draft','POST',{})).rejects.toThrow('Cannot connect to the app server');
 expect(fetchMock).toHaveBeenCalledTimes(2);
});
it('preserves intentional caller cancellation',async()=>{
 const controller=new AbortController();controller.abort();
 const error=new DOMException('Aborted','AbortError');
 vi.stubGlobal('fetch',vi.fn().mockRejectedValue(error));
 await expect(aiApi('/bootstrap','GET',undefined,controller.signal)).rejects.toBe(error);
});
