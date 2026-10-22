import {analyzeUrl, hashFile, createCase, validateWorkspace, encryptWorkspace, decryptWorkspace, exportReport} from './core.mjs';
import {emptyDraft, startIncidentDraft, hasPendingDrafts} from './drafts.mjs';
import {isWorkspaceDirty, readArchiveInput, saveCiphertext, eraseCiphertext} from './vault.mjs';
import {REPORT_FIELDS, findReportingRoutes, getReportingRoute, getReportingJurisdiction, buildReportingPacket} from './reporting.mjs';

export const STORAGE_KEY = 'usualcybersec-vault-v1';
const blankAttachment = () => ({caseId:'',sourceUrl:'',notes:''});
const blankReport = () => ({caseId:'',issue:'all',jurisdiction:'global',routeId:'',disclosure:{}});
export function parseRoute(hash = '') {
  const [path, query=''] = hash.replace(/^#/, '').split('?');
  const [name='link', encoded=''] = path.split('/');
  let id='';
  try { id=decodeURIComponent(encoded); } catch {}
  return {name:name || 'link',id,query};
}
export function checkedSource(value) {
  const source=value.trim();
  if(source && !['http:','https:'].includes(new URL(source).protocol)) throw Error('Source links must start with http:// or https://.');
  return source;
}
export function createController(env = {}) {
  let state={workspace:{version:1,cases:[]},savedSnapshot:null,vaultRaw:null,vaultChanged:false,storageAvailable:true,draft:emptyDraft(),file:null,evidence:null,credentials:null,urlResult:null,edits:{},attachment:blankAttachment(),report:blankReport(),route:parseRoute(),sessionRevision:0,busy:false,error:'',message:''};
  let ticket=0;
  let credentialTicket=0;
  let credentialAbort=null;
  const cancelCredentials=()=>{credentialTicket++;credentialAbort?.abort();credentialAbort=null;};
  const listeners=new Set();
  const emit=patch => {state={...state,...patch};listeners.forEach(fn=>fn());};
  const item=id => state.workspace.cases.find(record=>record.id===id);
  const confirm=message => env.confirm ? env.confirm(message) : false;
  const commit=workspace => {validateWorkspace(workspace);emit({workspace});};
  const update=(id,change) => {const workspace=structuredClone(state.workspace);const record=workspace.cases.find(c=>c.id===id);if(!record)throw Error('This incident is no longer in the workspace.');change(record);record.updatedAt=new Date().toISOString();commit(workspace);};
  const dirty=()=>isWorkspaceDirty(state.workspace,state.savedSnapshot)||(state.vaultChanged&&state.workspace.cases.length>0);
  const hasDraftWork=()=>hasPendingDrafts(state.draft,state.file,state.edits,state.attachment);
  const pending=()=>dirty()||hasDraftWork()||Boolean(state.evidence||state.credentials||state.urlResult);
  const reset=()=>{ticket++;cancelCredentials();emit({sessionRevision:state.sessionRevision+1,draft:emptyDraft(),file:null,evidence:null,credentials:null,urlResult:null,edits:{},attachment:blankAttachment(),report:blankReport()});};
  const go=route=>{api.navigate('#'+route);env.navigate?.(route);};
  const download=(body,name,type='application/json')=>{if(!env.download)throw Error('Downloads are unavailable in this environment.');env.download(body,name,type);};
  const api={
    getSnapshot:()=>state,
    subscribe:fn=>{listeners.add(fn);return()=>listeners.delete(fn);},
    dirty,hasDraftWork,hasPendingWork:pending,
    initialize(hash='') {try{emit({vaultRaw:env.storage?.getItem(STORAGE_KEY)||null});}catch{emit({storageAvailable:false,error:'Browser storage is unavailable. Use encrypted backup downloads.'});}api.navigate(hash);},
    navigate(hash) {
      const route=parseRoute(hash);const patch={route,hash};
      if(route.name==='new')patch.draft=startIncidentDraft(state.draft,route.id);
      if(route.name==='report'&&hash!==state.hash){
        const params=new URLSearchParams(route.query);const caseId=params.get('case')||route.id||'';
        const record=item(caseId);patch.report={...blankReport(),caseId:record?caseId:'',issue:record?.type||'all'};
      }
      emit(patch);
    },
    setDraft(key,value){const draft={...state.draft,[key]:value};if(key==='type')draft.initialized=true;const patch={draft};if(['url','expected'].includes(key))patch.urlResult=null;if(key==='fingerprint'){ticket++;patch.evidence=null;}emit(patch);},
    setEdit(id,key,value){const original=item(id);if(!original)throw Error('This incident no longer exists.');const fields={...state.edits[id]};if(value===original[key])delete fields[key];else fields[key]=value;const edits={...state.edits};if(Object.keys(fields).length)edits[id]=fields;else delete edits[id];emit({edits});},
    cancelEdit(id){const edits={...state.edits};delete edits[id];emit({edits});go('case/'+encodeURIComponent(id));},
    setAttachment(key,value){emit({attachment:{...state.attachment,[key]:value}});},
    selectFile(file){ticket++;cancelCredentials();emit({file:file||null,evidence:null,credentials:null,attachment:blankAttachment()});},
    async inspectCredentials(){
      const file=state.file;
      if(!file)throw Error('Choose a file first.');
      if(!env.inspectCredentials)throw Error('Content Credentials inspection is unavailable in this environment.');
      cancelCredentials();
      const current=credentialTicket;
      const abort=new AbortController();credentialAbort=abort;
      emit({credentials:null});
      try {
        const credentials=await env.inspectCredentials(file,abort.signal);
        if(current!==credentialTicket||state.file!==file)return false;
        emit({credentials,message:'Content Credentials inspection finished on this device.'});
        return credentials;
      }catch(error){if(current!==credentialTicket||state.file!==file)return false;throw error;}
      finally{if(current===credentialTicket)credentialAbort=null;}
    },
    checkLink(){const {url,expected}=state.draft;emit({urlResult:{input:url,result:analyzeUrl(url,expected)},message:'Address checked on this device.'});},
    async fingerprint(){const file=state.file;const expected=state.draft.fingerprint.trim();if(!file)throw Error('Choose a file first.');if(expected&&!/^[a-f\d]{64}$/i.test(expected))throw Error('A reference fingerprint must contain exactly 64 hexadecimal characters.');const current=++ticket;const record=await (env.hashFile||hashFile)(file);if(current!==ticket)throw Error('The file or reference changed. Make a new fingerprint.');emit({evidence:{record,expected},message:'Fingerprint created. Keep the original file separately.'});},
    saveCase(id=''){const original=id?item(id):null;if(id&&!original)throw Error('This incident no longer exists.');const fields=original?{...original,...state.edits[id]}:state.draft;const sourceUrl=checkedSource(fields.sourceUrl);if(original){update(id,record=>{record.title=fields.title.trim();record.summary=fields.summary;record.sourceUrl=sourceUrl;});const edits={...state.edits};delete edits[id];emit({edits});}else{const record=createCase({...fields,sourceUrl});commit({...state.workspace,cases:[record,...state.workspace.cases]});id=record.id;emit({draft:{...state.draft,title:'',summary:'',sourceUrl:'',type:'deepfake',initialized:false}});}emit({message:'Incident saved in this session.'});go('case/'+encodeURIComponent(id));return id;},
    caseFromLink(){if(!state.urlResult)throw Error('Check a link first.');const {input,result}=state.urlResult;const record=createCase({title:'Review: '+(result.hostname||'suspicious link'),type:'phishing',summary:'Submitted URL (unvisited): '+input+'\n\n'+result.findings.map(f=>f.title+': '+f.detail).join('\n')+'\n\n'+result.limitations});commit({...state.workspace,cases:[record,...state.workspace.cases]});go('case/'+record.id);},
    attach(){if(!state.evidence)throw Error('Make a fingerprint first.');const {caseId,sourceUrl,notes}=state.attachment;const source=checkedSource(sourceUrl);update(caseId,record=>record.evidence.push({...state.evidence.record,id:crypto.randomUUID(),sourceUrl:source,notes}));emit({attachment:blankAttachment(),message:'Fingerprint attached. The original file is not stored.'});go('case/'+caseId);},
    setStatus(id,status){update(id,record=>{record.status=status;});},
    setStep(id,step,checked){update(id,record=>{record.completedSteps=checked?[...new Set([...record.completedSteps,step])]:record.completedSteps.filter(value=>value!==step);});},
    deleteCase(id){if(!item(id))throw Error('This incident no longer exists.');if(!confirm('Delete this incident and its fingerprint records from this session? Saved backups are unchanged.'))return;commit({...state.workspace,cases:state.workspace.cases.filter(record=>record.id!==id)});const edits={...state.edits};delete edits[id];emit({edits,attachment:state.attachment.caseId===id?{...state.attachment,caseId:''}:state.attachment,message:'Incident deleted. Save again to update your browser vault.'});go('cases');},
    setReport(key,value){
      let report={...state.report};
      if(key==='caseId'){
        const record=item(value);
        report={...blankReport(),jurisdiction:report.jurisdiction,caseId:record?value:'',issue:record?.type||'all'};
      }else if(key==='issue'){
        report={...blankReport(),jurisdiction:report.jurisdiction,caseId:report.caseId,issue:value};
      }else if(key==='jurisdiction'){
        if(!getReportingJurisdiction(value))throw Error('Unknown reporting jurisdiction. Choose a listed location.');
        report={...report,jurisdiction:value,routeId:'',disclosure:{}};
      }else if(key==='routeId'){
        report={...report,routeId:findReportingRoutes(report.issue,report.jurisdiction).some(r=>r.id===value)?value:'',disclosure:{}};
      }
      emit({report});
    },
    setDisclosure(key,value){if(!REPORT_FIELDS.some(field=>field.key===key)||typeof value!=='boolean')throw Error('Invalid disclosure choice.');emit({report:{...state.report,disclosure:{...state.report.disclosure,[key]:value}}});},
    packet(){const record=item(state.report.caseId);if(!record)throw Error('Choose an incident before preparing a report.');if(!getReportingRoute(state.report.routeId))throw Error('Choose an official route first.');return buildReportingPacket(record,state.report.routeId,state.report.disclosure,state.report.jurisdiction);},
    downloadPacket(){const body=api.packet();download(body,'usualcybersec-packet-'+state.report.routeId+'.txt','text/plain;charset=utf-8');emit({message:'Report download started. Review the file before sharing it.'});},
    downloadIncidentReport(id){const record=item(id);if(!record)throw Error('This incident no longer exists.');download(exportReport(record),'usualcybersec-incident-'+id+'.md','text/markdown;charset=utf-8');emit({message:'Full incident notes downloaded as plaintext. Review personal information before sharing.'});},
    downloadFingerprint(){if(!state.evidence)throw Error('Make a fingerprint first.');download(JSON.stringify({tool:'usualCyberSec',...state.evidence.record,limitations:'Identifies matching bytes only. Does not prove authenticity.'},null,2),'usualcybersec-fingerprint.json');},
    async save(password,confirmation,mode='local') {
      if(password!==confirmation)throw Error('The passphrases do not match.');
      const snapshot=JSON.stringify(state.workspace);const baseline=mode==='local'?env.storage.getItem(STORAGE_KEY):null;
      if(mode==='local'&&baseline&&(state.vaultChanged||!state.savedSnapshot||baseline!==state.vaultRaw)&&!confirm('Replace the encrypted vault saved in this browser with this session? Download a backup first if needed.')){emit({message:'Save canceled. The encrypted browser copy is unchanged.'});return false;}
      const raw=JSON.stringify(await encryptWorkspace(JSON.parse(snapshot),password));
      if(mode==='local'){await saveCiphertext(env.storage,env.locks,STORAGE_KEY,baseline,raw);emit({vaultRaw:raw,savedSnapshot:snapshot,vaultChanged:false,message:'Encrypted copy saved in this browser.'});}
      else {download(raw,'usualcybersec-backup.json');emit({message:'Encrypted backup download started. Verify it was saved before closing.'});}
      return true;
    },
    async unlock(password,file=null){const {raw,fromFile}=await readArchiveInput(file,file?null:env.storage.getItem(STORAGE_KEY));let workspace;try{workspace=await decryptWorkspace(JSON.parse(raw),password);}catch{throw Error('Cannot unlock this archive. Check the passphrase and choose an intact usualCyberSec backup. Your current session is unchanged.');}if(pending()&&!confirm('Replace the current session with this archive? Unsaved incidents, drafts and results will be lost.')){emit({message:'Restore canceled. Your current session is unchanged.'});return false;}reset();emit({workspace,savedSnapshot:fromFile?null:JSON.stringify(workspace),...(fromFile?{}:{vaultRaw:raw,vaultChanged:false}),message:'Workspace unlocked on this device.'});go('cases');return true;},
    lock(){if(pending()&&!confirm('Clear this session? Unsaved incidents, drafts and results will be lost. Saved encrypted copies remain.'))return;reset();emit({workspace:{version:1,cases:[]},savedSnapshot:null,message:'Session cleared. Saved encrypted copies remain.'});},
    async erase(){if(!confirm('Permanently delete the encrypted vault saved in this browser? Download a backup first if needed.'))return;await eraseCiphertext(env.storage,env.locks,STORAGE_KEY);emit({vaultRaw:null,savedSnapshot:null,vaultChanged:false,message:'Encrypted browser copy deleted.'});},
    storageChanged(raw){emit({vaultRaw:raw,vaultChanged:true,message:raw?'The encrypted copy changed in another tab. Back up this session before unlocking the latest copy.':'The encrypted browser copy was deleted in another tab. This session is still in memory.'});},
    showError(error){emit({error:error?.message||String(error)});},
    dismiss(){emit({error:'',message:''});},
    async run(action){if(state.busy)throw Error('Wait for the current operation to finish.');emit({busy:true,error:'',message:''});try{return await action();}catch(error){api.showError(error);throw error;}finally{emit({busy:false});}}
  };
  return api;
}
