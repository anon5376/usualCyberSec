export function isWorkspaceDirty(workspace, savedSnapshot) {
  return savedSnapshot !== null ? JSON.stringify(workspace) !== savedSnapshot : workspace.cases.length > 0;
}

export async function readArchiveInput(file, savedRaw) {
  const fromFile = Boolean(file?.name);
  if (fromFile) {
    if (file.size === 0) throw new Error('The selected backup is empty. Choose an intact encrypted backup.');
    if (file.size > 10 * 1024 * 1024) throw new Error('This archive exceeds the 10 MiB import limit.');
    return {raw:await file.text(),fromFile:true};
  }
  if (!savedRaw) throw new Error('No saved vault found. Select an encrypted backup file.');
  return {raw:savedRaw,fromFile:false};
}

export async function saveCiphertext(storage, lockManager, key, baseline, ciphertext) {
  if (!lockManager?.request) throw new Error('This browser cannot coordinate vault saves safely. Download an encrypted backup instead.');
  await lockManager.request(key, async () => {
    if (storage.getItem(key) !== baseline) throw new Error('The saved vault changed in another tab. Your session is intact. Download a backup, then unlock the latest vault before saving again.');
    storage.setItem(key, ciphertext);
  });
}

export async function eraseCiphertext(storage, lockManager, key) {
  if (!lockManager?.request) throw new Error('Use a browser with Web Locks support to delete saved vault data.');
  await lockManager.request(key, async () => { storage.removeItem(key); });
}
