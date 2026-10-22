import test from 'node:test';
import assert from 'node:assert/strict';
import { locks } from 'node:worker_threads';
import { isWorkspaceDirty, readArchiveInput, saveCiphertext } from '../src/lib/vault.mjs';

test('deleting the last saved case remains an unsaved change', () => {
  const empty = {version:1,cases:[]};
  assert.equal(isWorkspaceDirty(empty, JSON.stringify({version:1,cases:[{id:'case-a'}]})), true);
  assert.equal(isWorkspaceDirty(empty, null), false);
  assert.equal(isWorkspaceDirty(empty, JSON.stringify(empty)), false);
});

test('an explicitly selected empty backup never falls back to another saved vault', async () => {
  await assert.rejects(readArchiveInput(new File([], 'truncated.json'), 'unrelated-vault'), /empty/i);
  assert.deepEqual(await readArchiveInput(new File([], ''), 'saved-vault'), {raw:'saved-vault',fromFile:false});
  assert.deepEqual(await readArchiveInput(new File(['backup-data'], 'valid.json'), 'saved-vault'), {raw:'backup-data',fromFile:true});
});

test('concurrent saves and stale deletions cannot silently overwrite another tab', async () => {
  const data = new Map();
  const storage = {getItem:key=>data.get(key)??null,setItem:(key,value)=>data.set(key,value)};
  const results = await Promise.allSettled([
    saveCiphertext(storage,locks,'test-vault',null,'first-encrypted-snapshot'),
    saveCiphertext(storage,locks,'test-vault',null,'second-encrypted-snapshot'),
  ]);
  assert.equal(results.filter(r=>r.status==='fulfilled').length,1);
  assert.equal(results.filter(r=>r.status==='rejected').length,1);
  assert.equal(data.get('test-vault'),'first-encrypted-snapshot');
  data.delete('test-vault');
  await assert.rejects(saveCiphertext(storage,locks,'test-vault','first-encrypted-snapshot','stale-save'),/another tab/i);
  assert.equal(data.has('test-vault'),false);
  await assert.rejects(saveCiphertext(storage,null,'test-vault',null,'snapshot'),/backup/i);
});
