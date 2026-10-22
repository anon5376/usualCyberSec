import test from 'node:test';
import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
import {createController, STORAGE_KEY} from '../src/lib/controller.mjs';
import {createCase, encryptWorkspace} from '../src/lib/core.mjs';
if(!globalThis.crypto)globalThis.crypto=webcrypto;
const password='a long test passphrase';
function fixture(options={}) {
  const entries=new Map();const downloads=[];const prompts=[];const {confirm:confirmation,...overrides}=options;
  const storage={getItem:key=>entries.get(key)||null,setItem:(key,value)=>entries.set(key,value),removeItem:key=>entries.delete(key)};
  const locks={request:async(key,action)=>action()};
  const app=createController({storage,locks,confirm:message=>{prompts.push(message);return confirmation!==false;},download:(body,name,type)=>downloads.push({body,name,type}),...overrides});
  app.initialize('#link');
  return {app,entries,downloads,prompts};
}
function incident(app,title='Private title') {app.navigate('#new');app.setDraft('title',title);app.setDraft('summary','Private summary');return app.saveCase();}

test('report disclosure stays controllable during async work and resets across changed URLs and re-entry',async()=>{
  const {app,downloads}=fixture();const id=incident(app);
  app.navigate('#report/'+id);assert.equal(app.getSnapshot().report.caseId,id);
  app.setReport('routeId','youtube-privacy');
  let release;const busy=app.run(()=>new Promise(resolve=>{release=resolve;}));
  app.setDisclosure('summary',true);assert.match(app.packet(),/Private summary/);
  app.setDisclosure('summary',false);assert.doesNotMatch(app.packet(),/Private summary/);
  release();await busy;
  app.setDisclosure('summary',true);app.navigate('#cases');app.navigate('#report/'+id);
  assert.deepEqual(app.getSnapshot().report.disclosure,{});assert.equal(app.getSnapshot().report.routeId,'');
  app.setReport('routeId','youtube-privacy');app.downloadPacket();assert.doesNotMatch(downloads[0].body,/Private title|Private summary/);
  app.setDisclosure('summary',true);app.navigate('#report?case='+id);assert.deepEqual(app.getSnapshot().report.disclosure,{});
  app.navigate('#report/missing');assert.equal(app.getSnapshot().report.caseId,'');assert.throws(()=>app.packet(),/Choose an incident/);
});

test('incident and attachment drafts survive routes without mutating committed records',()=>{
  const {app}=fixture();const first=incident(app,'First');const second=incident(app,'Second');
  app.setDraft('url','https://expected.example@other.example/');app.setDraft('expected','expected.example');app.setDraft('fingerprint','a'.repeat(64));
  app.setEdit(first,'title','First draft');app.setEdit(second,'summary','Second draft');
  app.setAttachment('caseId',first);app.setAttachment('sourceUrl','https://source.example/');app.setAttachment('notes','Original context');
  app.navigate('#link');app.navigate('#edit/'+first);
  assert.equal(app.getSnapshot().edits[first].title,'First draft');assert.equal(app.getSnapshot().workspace.cases.find(c=>c.id===first).title,'First');
  app.cancelEdit(first);assert.equal(app.getSnapshot().edits[first],undefined);assert.equal(app.getSnapshot().edits[second].summary,'Second draft');
  app.saveCase(second);assert.equal(app.getSnapshot().edits[second],undefined);assert.equal(app.getSnapshot().workspace.cases.find(c=>c.id===second).summary,'Second draft');
  app.deleteCase(first);assert.equal(app.getSnapshot().attachment.caseId,'');assert.equal(app.getSnapshot().attachment.notes,'Original context');assert.equal(app.getSnapshot().attachment.sourceUrl,'https://source.example/');
  assert.equal(app.getSnapshot().draft.url,'https://expected.example@other.example/');assert.equal(app.hasDraftWork(),true);
});

test('new incident draft survives navigation and saves only after explicit commit',()=>{
  const {app}=fixture();app.navigate('#new/impersonation');app.setDraft('title','Draft record');app.setDraft('summary','Notes');app.navigate('#link');app.navigate('#new/breach');
  assert.equal(app.getSnapshot().draft.type,'impersonation');assert.equal(app.getSnapshot().workspace.cases.length,0);
  const id=app.saveCase();assert.equal(app.getSnapshot().workspace.cases[0].id,id);assert.equal(app.getSnapshot().draft.title,'');assert.equal(app.getSnapshot().draft.type,'deepfake');
});

test('late fingerprint cannot replace changed file/reference and async failure remains visible after navigation',async()=>{
  let release;const {app}=fixture({hashFile:()=>new Promise(resolve=>{release=resolve;})});
  app.selectFile({name:'a.txt'});const pending=app.run(app.fingerprint);app.navigate('#cases');app.setDraft('fingerprint','a'.repeat(64));release({sha256:'b'.repeat(64)});
  await assert.rejects(pending,/changed/);assert.equal(app.getSnapshot().evidence,null);assert.match(app.getSnapshot().error,/changed/);assert.equal(app.getSnapshot().busy,false);
});

test('real local fingerprint is attached with context and original file is not included in archive',async()=>{
  const {app,downloads}=fixture();const id=incident(app);const file=new Blob(['abc'],{type:'text/plain'});Object.defineProperties(file,{name:{value:'original.txt'},lastModified:{value:1}});
  app.selectFile(file);await app.run(app.fingerprint);app.setAttachment('caseId',id);app.setAttachment('notes','Received directly');app.attach();
  assert.equal(app.getSnapshot().workspace.cases[0].evidence[0].sha256,'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
  assert.equal(app.getSnapshot().attachment.notes,'');await app.save(password,password,'backup');assert.equal(downloads.length,1);assert.doesNotMatch(downloads[0].body,/original.txt|Received directly/);
});

test('other-tab event delivered before save requires confirmation and cannot overwrite on refusal',async()=>{
  const {app,entries,prompts}=fixture({confirm:false});incident(app);await app.save(password,password);
  const foreign=JSON.stringify(await encryptWorkspace({version:1,cases:[createCase({title:'Other tab'})]},password));entries.set(STORAGE_KEY,foreign);app.storageChanged(foreign);
  assert.equal(await app.save(password,password),false);assert.equal(entries.get(STORAGE_KEY),foreign);assert.equal(prompts.length,1);assert.equal(app.getSnapshot().vaultChanged,true);
  entries.delete(STORAGE_KEY);app.storageChanged(null);assert.equal(app.getSnapshot().vaultRaw,null);assert.match(app.getSnapshot().message,/deleted/);
});

test('deleting last saved incident remains dirty and requires saving an empty workspace',async()=>{
  const {app}=fixture();const id=incident(app);await app.save(password,password);assert.equal(app.dirty(),false);app.deleteCase(id);assert.equal(app.getSnapshot().workspace.cases.length,0);assert.equal(app.dirty(),true);await app.save(password,password);assert.equal(app.dirty(),false);
});

test('explicit empty archive does not fall back to browser vault; restore and lock clear drafts after confirmation',async()=>{
  const {app}=fixture();const id=incident(app);await app.save(password,password);app.setEdit(id,'summary','Uncommitted');app.setDraft('url','https://draft.example');app.setAttachment('notes','Pending');
  await assert.rejects(app.unlock(password,{name:'empty.json',size:0,text:async()=>''}),/empty/);assert.equal(app.getSnapshot().draft.url,'https://draft.example');
  await app.unlock(password);assert.equal(app.getSnapshot().draft.url,'');assert.deepEqual(app.getSnapshot().edits,{});assert.equal(app.getSnapshot().attachment.notes,'');
  app.setEdit(id,'title','Another draft');app.lock();assert.equal(app.getSnapshot().workspace.cases.length,0);assert.equal(app.hasDraftWork(),false);assert.equal(app.getSnapshot().vaultRaw!==null,true);
});

test('full incident export downloads explicit plaintext notes and context',()=>{
  const {app,downloads}=fixture();const id=incident(app);app.downloadIncidentReport(id);assert.equal(downloads[0].type,'text/markdown;charset=utf-8');assert.match(downloads[0].body,/Private summary/);assert.match(downloads[0].name,/\.md$/);
});

test('draft-only lock refusal preserves unsaved work and passphrases never enter controller state',async()=>{
  const {app,prompts}=fixture({confirm:false});app.setDraft('title','Draft');app.lock();assert.equal(app.getSnapshot().draft.title,'Draft');assert.equal(prompts.length,1);await app.save(password,password,'backup');assert.doesNotMatch(JSON.stringify(app.getSnapshot()),new RegExp(password));
});
