import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeCredentials,checkCredentialFile,MAX_CREDENTIAL_BYTES} from '../src/lib/provenance.mjs';
import {createController} from '../src/lib/controller.mjs';

test('absence, unknown validation and cryptographic validity remain distinct from trust',()=>{
  assert.equal(normalizeCredentials(null).kind,'absent');
  assert.equal(normalizeCredentials({validation_status:[]}).validationState,'Unknown');
  assert.equal(normalizeCredentials({validation_state:'Valid'}).validationState,'Valid');
  const result=normalizeCredentials({validation_state:'Invalid',validation_results:{activeManifest:{failure:[{code:'assertion.dataHash.mismatch',explanation:'Changed bytes'}]}}});
  assert.equal(result.validationState,'Invalid');
  assert.equal(result.statuses[0].code,'assertion.dataHash.mismatch');
  assert.throws(()=>normalizeCredentials('invalid'));
});

test('untrusted metadata and diagnostic arrays are bounded without interpreting links or markup',()=>{
  const result=normalizeCredentials({active_manifest:'a',manifests:{a:{title:'<script>'.repeat(1000),assertions:Array.from({length:60},()=>({label:'https://untrusted.example'}))}},validation_status:Array.from({length:200},()=>({code:'x'.repeat(2000)}))});
  assert.equal(result.manifest.title.length,1000);
  assert.equal(result.manifest.assertionLabels.length,50);
  assert.equal(result.statuses.length,100);
  assert.equal(result.statuses[0].code.length,1000);
  assert.equal(result.truncated,true);
  assert.throws(()=>checkCredentialFile({size:0}));
  assert.throws(()=>checkCredentialFile({size:MAX_CREDENTIAL_BYTES+1}));
});

test('file replacement cancels inspection and suppresses late results and errors; route changes retain results',async()=>{
  let resolve,reject,signal;
  const controller=createController({inspectCredentials:(_file,s)=>{signal=s;return new Promise((yes,no)=>{resolve=yes;reject=no;});},confirm:()=>true});
  const first={name:'first',size:10},second={name:'second',size:10};
  controller.selectFile(first);
  const pending=controller.run(controller.inspectCredentials);
  controller.selectFile(second);
  assert.equal(signal.aborted,true);
  reject(Error('stale failure'));
  assert.equal(await pending,false);
  assert.equal(controller.getSnapshot().error,'');
  assert.equal(controller.getSnapshot().credentials,null);
  const next=controller.run(controller.inspectCredentials);
  resolve({kind:'absent'});
  await next;
  controller.navigate('#cases');
  assert.equal(controller.getSnapshot().credentials.kind,'absent');
  const locked=controller.run(controller.inspectCredentials);
  controller.lock();
  resolve({kind:'present'});
  assert.equal(await locked,false);
  assert.equal(controller.getSnapshot().credentials,null);
  assert.equal(controller.getSnapshot().file,null);
});
