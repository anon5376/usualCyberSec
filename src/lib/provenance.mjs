export const MAX_CREDENTIAL_BYTES = 25 * 1024 * 1024;
const text = value => typeof value === 'string' ? value.slice(0, 1000) : '';
export function checkCredentialFile(file) {
  if (!file || typeof file.size !== 'number') throw Error('Choose a file first.');
  if (!file.size) throw Error('This file is empty.');
  if (file.size > MAX_CREDENTIAL_BYTES) throw Error('Content Credentials inspection is limited to 25 MiB.');
}
export function normalizeCredentials(store) {
  if (store === null) return {kind:'absent',validationState:'Unknown',statuses:[],manifest:null,truncated:false};
  if (!store || typeof store !== 'object' || Array.isArray(store)) throw Error('The SDK returned an unreadable manifest store.');
  const label=text(store.active_manifest);
  const manifest=label && store.manifests && Object.hasOwn(store.manifests,label) ? store.manifests[label] : null;
  const statuses=[];
  let truncated=false;
  const visit=(value,path,depth=0)=>{
    if(depth>8){truncated=true;return;}
    if(!value||typeof value!=='object')return;
    if(typeof value.code==='string'){
      if(statuses.length>=100){truncated=true;return;}
      statuses.push({code:text(value.code),explanation:text(value.explanation),scope:path});
      return;
    }
    for(const [key,child] of Object.entries(value).slice(0,100))visit(child,text(path+'.'+key),depth+1);
    if(Object.keys(value).length>100)truncated=true;
  };
  visit(store.validation_status,'validation_status');
  visit(store.validation_results,'validation_results');
  return {kind:'present',validationState:['Invalid','Valid','Trusted'].includes(store.validation_state)?store.validation_state:'Unknown',statuses,manifest:manifest?{label,title:text(manifest.title),format:text(manifest.format),issuer:text(manifest.signature_info?.issuer),generator:text(manifest.claim_generator),assertionLabels:Array.isArray(manifest.assertions)?manifest.assertions.slice(0,50).map(item=>text(item?.label)):[]}:null,truncated};
}
