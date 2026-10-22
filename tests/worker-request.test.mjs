import test from 'node:test';
import assert from 'node:assert/strict';
import {requestInspection} from '../src/lib/worker-request.mjs';

class WorkerSurface extends EventTarget {
  terminated=0;
  sent=[];
  terminate(){this.terminated++;}
  postMessage(value){this.sent.push(value);}
}

test('inspection success, worker failure, decode failure and reported failure each terminate the owned worker',async()=>{
  for(const outcome of ['success','error','messageerror','reported','malformed']){
    const worker=new WorkerSurface();
    const file=new Blob(['file']);
    const request=requestInspection(worker,file);
    assert.equal(worker.sent[0].file,file);
    if(outcome==='success')worker.dispatchEvent(new MessageEvent('message',{data:{ok:true,result:{kind:'absent'}}}));
    else if(outcome==='reported')worker.dispatchEvent(new MessageEvent('message',{data:{ok:false,error:'Reader failed'}}));
    else if(outcome==='malformed')worker.dispatchEvent(new MessageEvent('message',{data:{ok:true}}));
    else worker.dispatchEvent(new Event(outcome));
    if(outcome==='success')assert.deepEqual(await request,{kind:'absent'});
    else await assert.rejects(request);
    worker.dispatchEvent(new Event('error'));
    assert.equal(worker.terminated,1);
  }
});

test('a worker that never initializes is terminated at timeout and cancellation',async()=>{
  const hung=new WorkerSurface();
  await assert.rejects(requestInspection(hung,new Blob(['x']),undefined,5),/timed out/);
  assert.equal(hung.terminated,1);
  for(const alreadyAborted of [false,true]){
    const worker=new WorkerSurface();
    const abort=new AbortController();
    if(alreadyAborted)abort.abort();
    const request=requestInspection(worker,new Blob(['x']),abort.signal);
    if(!alreadyAborted)abort.abort();
    await assert.rejects(request,/canceled/);
    assert.equal(worker.terminated,1);
    assert.equal(worker.sent.length,alreadyAborted?0:1);
  }
});
