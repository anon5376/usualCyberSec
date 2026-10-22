import {createC2pa,Reader} from '@contentauth/c2pa-web/inline';
import {Context} from '@contentauth/c2pa-web';
import workerPath from '@contentauth/c2pa-web/c2pa_worker?worker&url';
import {checkCredentialFile,normalizeCredentials} from './provenance.mjs';

let started=false;
self.onmessage=async(event:MessageEvent<{file:File}>)=>{
  if(started)return;
  started=true;
  let runtime:Awaited<ReturnType<typeof createC2pa>>|undefined;
  try {
    const file=event.data.file;
    checkCredentialFile(file);
    runtime=await createC2pa({workerSrc:new URL(workerPath,self.location.href)});
    const context=new Context({verify:{verifyAfterReading:true,verifyTrust:true,verifyTimestampTrust:true,ocspFetch:false,remoteManifestFetch:false}});
    const reader=await Reader.fromBlob(runtime,undefined,file,context);
    let result;
    try {result=normalizeCredentials(reader?await reader.manifestStore():null);}
    finally {if(reader)await reader.free();}
    self.postMessage({ok:true,result});
  }catch(error){self.postMessage({ok:false,error:(error instanceof Error?error.message:'The C2PA reader could not inspect this file.').slice(0,1000)});}
  finally {runtime?.dispose();}
};
