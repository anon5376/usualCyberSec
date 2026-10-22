import test from 'node:test';
import assert from 'node:assert/strict';
import {emptyDraft, startIncidentDraft, hasPendingDrafts} from '../dist/drafts.mjs';

test('recovery route initializes the incident category without overwriting an existing draft',()=>{
  const draft=startIncidentDraft(emptyDraft(),'phishing');
  draft.title='Suspicious sign-in';
  assert.equal(startIncidentDraft(draft,'').type,'phishing');
  draft.type='breach';
  assert.equal(startIncidentDraft(draft,'phishing').type,'breach');
  assert.equal(startIncidentDraft(emptyDraft(),'unknown').type,'deepfake');
});

test('discard guards recognize draft text, selected category and pending files',()=>{
  assert.equal(hasPendingDrafts(emptyDraft(),null),false);
  for(const key of ['url','expected','fingerprint','title','summary','sourceUrl']) {
    assert.equal(hasPendingDrafts({...emptyDraft(),[key]:'unsaved user input'},null),true,key);
  }
  assert.equal(hasPendingDrafts(startIncidentDraft(emptyDraft(),'phishing'),null),true);
  assert.equal(hasPendingDrafts(emptyDraft(),new File(['abc'],'evidence.txt')),true);
  assert.equal(hasPendingDrafts({...emptyDraft(),title:'   '},null),false);
});
