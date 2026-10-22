export function requestInspection(worker, file, signal, timeoutMs = 60000) {
  return new Promise((resolve,reject)=>{
    let settled=false;
    let timer;
    const finish=(error,result)=>{
      if(settled)return;
      settled=true;
      clearTimeout(timer);
      signal?.removeEventListener('abort',abort);
      worker.removeEventListener('message',message);
      worker.removeEventListener('error',failure);
      worker.removeEventListener('messageerror',decodeFailure);
      worker.terminate();
      if(error)reject(error);else resolve(result);
    };
    const abort=()=>finish(Error('Content Credentials inspection canceled.'));
    const failure=()=>finish(Error('Content Credentials inspection could not start or the reader failed.'));
    const decodeFailure=()=>finish(Error('Content Credentials inspection returned an unreadable response.'));
    const message=event=>{
      const response=event.data;
      if(response?.ok===true&&response.result&&typeof response.result==='object')finish(null,response.result);
      else if(response?.ok===false&&typeof response.error==='string')finish(Error(response.error.slice(0,1000)));
      else decodeFailure();
    };
    worker.addEventListener('message',message);
    worker.addEventListener('error',failure);
    worker.addEventListener('messageerror',decodeFailure);
    signal?.addEventListener('abort',abort,{once:true});
    timer=setTimeout(()=>finish(Error('Content Credentials inspection timed out. Try a smaller file.')),timeoutMs);
    if(signal?.aborted){abort();return;}
    try {worker.postMessage({file});}catch{failure();}
  });
}
