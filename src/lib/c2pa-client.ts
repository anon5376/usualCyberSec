import {checkCredentialFile} from './provenance.mjs';
import {requestInspection} from './worker-request.mjs';
import inspectorPath from './c2pa-inspector.worker.ts?worker&url';

export async function inspectContentCredentials(file: File, signal?: AbortSignal) {
  checkCredentialFile(file);
  if (location.protocol !== 'https:') throw Error('Content Credentials inspection requires this app to be served over HTTPS.');
  const worker=new Worker(new URL(inspectorPath,location.href),{type:'module'});
  return requestInspection(worker,file,signal);
}
