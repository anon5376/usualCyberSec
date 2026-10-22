export function emptyDraft() {
  return {url:'',expected:'',fingerprint:'',title:'',type:'deepfake',summary:'',sourceUrl:'',initialized:false};
}

export function startIncidentDraft(draft, initialType) {
  if (draft.initialized) return draft;
  return {...draft, type:['deepfake','impersonation','phishing','breach'].includes(initialType)?initialType:draft.type, initialized:true};
}

export function hasPendingDrafts(draft, file) {
  return Boolean(file || ['url','expected','fingerprint','title','summary','sourceUrl'].some(key=>draft[key]?.trim()) || draft.type!=='deepfake');
}
