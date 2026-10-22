import test from 'node:test';
import assert from 'node:assert/strict';
import { webcrypto } from 'node:crypto';
import { pathToFileURL } from 'node:url';

test('production app resets report state on every changed report URL and accepts disclosure changes while busy', async () => {
  const globalNames = ['document', 'window', 'location', 'localStorage', 'navigator', 'FormData', 'DataTransfer', 'crypto', 'setTimeout', 'clearTimeout'];
  const previousDescriptors = new Map(globalNames.map(name => [name, Object.getOwnPropertyDescriptor(globalThis, name)]));
  const nodes = new Map();
  const documentListeners = new Map();
  const windowListeners = new Map();
  let hash = '#overview';
  const node = selector => {
    if (!nodes.has(selector)) nodes.set(selector, {
      innerHTML: '', textContent: '', hidden: false,
      isConnected: true,
      classList: { toggle() {} },
      focus() {}, setAttribute() {}, removeAttribute() {}, reset() {},
      querySelectorAll() { return [{ disabled: false }]; },
      querySelector() { return null; },
    });
    return nodes.get(selector);
  };
  const replacements = {
    document: {
    title: '',
    querySelector: node,
    getElementById: node,
    addEventListener(type, handler) { documentListeners.set(type, handler); },
    },
    window: {
    addEventListener(type, handler) { windowListeners.set(type, handler); },
    scrollTo() {},
    },
    location: { get hash() { return hash; }, set hash(value) { hash = value.startsWith('#') ? value : `#${value}`; } },
    localStorage: {
      data: new Map(),
      getItem(key) { return this.data.get(key) ?? null; },
      setItem(key, value) { this.data.set(key, value); },
      removeItem(key) { this.data.delete(key); },
    },
    navigator: { locks: { async request(_key, callback) { return callback(); } } },
    crypto: webcrypto,
    setTimeout: () => 1,
    clearTimeout: () => {},
    FormData: class {
    constructor(form) { this.form = form; }
    get(key) { return this.form.values?.[key] ?? null; }
    },
    DataTransfer: class {
      constructor() { this.entries = []; this.items = { add: file => this.entries.push(file) }; }
      get files() { return this.entries; }
    },
  };
  for (const [name, value] of Object.entries(replacements)) {
    Object.defineProperty(globalThis, name, { value, configurable: true, writable: true });
  }

  try {
    const appUrl = pathToFileURL(new URL('../dist/app.mjs', import.meta.url).pathname);
    await import(`${appUrl.href}?test=${Date.now()}`);
    const renderOnHashChange = windowListeners.get('hashchange');
    const change = documentListeners.get('change');
    const input = documentListeners.get('input');
    const submit = documentListeners.get('submit');
    const click = documentListeners.get('click');
    const main = node('#main');

    const form = node('case-form-instance');
    form.id = 'case-form';
    form.dataset = { id: '' };
    form.values = { title: 'Case title', type: 'deepfake', summary: 'summary-secret-during-save', sourceUrl: '' };
    let buttonDisabled = false;
    const button = {};
    Object.defineProperty(button, 'disabled', { get: () => buttonDisabled, set: value => { buttonDisabled = value; } });
    form.querySelectorAll = () => [button];
    const submitted = submit({ target: form, preventDefault() {} });
    await submitted;
    const caseHash = globalThis.location.hash;
    assert.match(caseHash, /^#case\//);
    renderOnHashChange();
    const caseId = decodeURIComponent(caseHash.slice('#case/'.length));

    const saveWorkspace = async () => {
      const saveForm = node('save-form-instance');
      saveForm.id = 'save-form';
      saveForm.values = { password: 'test passphrase long enough', confirm: 'test passphrase long enough' };
      saveForm.querySelectorAll = () => [button];
      saveForm.reset = () => {};
      await submit({ target: saveForm, submitter: { value: 'local' }, preventDefault() {} });
    };
    globalThis.location.hash = '#new';
    renderOnHashChange();
    const secondCaseForm = node('second-case-form');
    secondCaseForm.id = 'case-form';
    secondCaseForm.dataset = { id: '' };
    secondCaseForm.values = { title: 'Second case', type: 'breach', summary: '', sourceUrl: '' };
    secondCaseForm.querySelectorAll = () => [button];
    await submit({ target: secondCaseForm, preventDefault() {} });
    const secondCaseHash = globalThis.location.hash;
    const secondCaseId = decodeURIComponent(secondCaseHash.slice('#case/'.length));
    renderOnHashChange();
    await saveWorkspace();

    const enterReport = async hash => {
      globalThis.location.hash = hash;
      renderOnHashChange();
    };
    const fireChange = target => change({ target });
    const reportControl = (id, value) => ({
      id,
      value,
      checked: true,
      dataset: {},
      closest() { return {}; },
      matches() { return false; },
    });

    await enterReport(`#report/${encodeURIComponent(caseId)}`);
    assert.match(main.innerHTML, /Choose an official route to prepare a packet/);
    assert.doesNotMatch(main.innerHTML, /href="#new"|href="#vault"/);
    assert.match(main.innerHTML, /YouTube · Privacy complaint/);
    fireChange(reportControl('report-route', 'youtube-privacy'));
    const summaryToggle = { id: 'disclose-summary', value: '', checked: true, dataset: { reportField: 'summary' }, closest() { return {}; }, matches() { return false; } };
    fireChange(summaryToggle);
    assert.match(main.innerHTML, /summary-secret-during-save/);
    assert.match(main.innerHTML, /data-report-field="summary" checked/);

    renderOnHashChange();
    assert.match(main.innerHTML, /data-report-field="summary" checked/);

    await enterReport('#report');
    assert.match(main.innerHTML, /href="#new"/);
    assert.match(main.innerHTML, /href="#vault"/);
    assert.doesNotMatch(main.innerHTML, new RegExp(`value="${caseId}" selected`));
    assert.doesNotMatch(main.innerHTML, /summary-secret-during-save/);

    await enterReport(`#report/${encodeURIComponent(caseId)}`);
    fireChange(reportControl('report-route', 'youtube-privacy'));
    fireChange(summaryToggle);
    await enterReport('#report/missing-case');
    assert.doesNotMatch(main.innerHTML, new RegExp(`value="${caseId}" selected`));
    assert.doesNotMatch(main.innerHTML, /summary-secret-during-save/);

    await enterReport(`#report/${encodeURIComponent(caseId)}`);
    fireChange(reportControl('report-route', 'youtube-privacy'));
    fireChange(summaryToggle);
    let releaseRead;
    const readGate = new Promise(resolve => { releaseRead = resolve; });
    const file = {
      name: 'pending.bin', type: 'application/octet-stream', size: 1, lastModified: 1,
      async arrayBuffer() { await readGate; return new Uint8Array([1]).buffer; },
    };
    const hashForm = node('hash-form-instance');
    hashForm.id = 'hash-form';
    hashForm.values = { file, expected: '' };
    hashForm.querySelectorAll = () => [button];
    const hashing = submit({ target: hashForm, preventDefault() {} });
    const uncheckedSummary = { ...summaryToggle, checked: false };
    fireChange(uncheckedSummary);
    releaseRead();
    await hashing;
    renderOnHashChange();
    assert.doesNotMatch(main.innerHTML, /data-report-field="summary" checked/);
    assert.doesNotMatch(main.innerHTML, /summary-secret-during-save/);

    globalThis.location.hash = '#evidence';
    renderOnHashChange();
    const attachForm = { id: 'attach-form' };
    const selectAttachmentCase = { id: 'attach-case', value: caseId, closest() { return null; }, matches() { return false; } };
    change({ target: selectAttachmentCase });
    input({ target: { id: 'evidence-source', name: 'sourceUrl', value: 'https://source.example/post', closest(selector) { return selector === 'form' ? attachForm : null; } } });
    input({ target: { id: 'evidence-notes', name: 'notes', value: 'received from a colleague', closest(selector) { return selector === 'form' ? attachForm : null; } } });
    globalThis.location.hash = '#library';
    renderOnHashChange();
    globalThis.location.hash = '#evidence';
    renderOnHashChange();
    assert.match(main.innerHTML, new RegExp(`value="${caseId}" selected`));
    assert.match(main.innerHTML, /value="https:\/\/source\.example\/post"/);
    assert.match(main.innerHTML, /received from a colleague/);

    const replacementFile = { name: 'replacement.bin', size: 1, type: 'application/octet-stream', lastModified: 2, async arrayBuffer() { return new Uint8Array([2]).buffer; } };
    change({ target: { id: 'media-file', files: [replacementFile], closest() { return null; }, matches() { return false; } } });
    const replacementHashForm = node('replacement-hash-form');
    replacementHashForm.id = 'hash-form';
    replacementHashForm.values = { file: replacementFile, expected: '' };
    replacementHashForm.querySelectorAll = () => [button];
    await submit({ target: replacementHashForm, preventDefault() {} });
    renderOnHashChange();
    assert.doesNotMatch(main.innerHTML, /source\.example\/post|received from a colleague/);
    assert.doesNotMatch(main.innerHTML, new RegExp(`value="${caseId}" selected`));

    input({ target: { id: 'evidence-source', name: 'sourceUrl', value: 'https://new.example/item', closest(selector) { return selector === 'form' ? attachForm : null; } } });
    input({ target: { id: 'evidence-notes', name: 'notes', value: 'new acquisition details', closest(selector) { return selector === 'form' ? attachForm : null; } } });
    const attachSubmit = node('attach-submit-form');
    attachSubmit.id = 'attach-form';
    attachSubmit.values = { caseId: secondCaseId, sourceUrl: 'https://new.example/item', notes: 'new acquisition details' };
    attachSubmit.querySelectorAll = () => [button];
    await submit({ target: attachSubmit, preventDefault() {} });
    globalThis.location.hash = `#case/${encodeURIComponent(secondCaseId)}`;
    renderOnHashChange();
    assert.match(main.innerHTML, /new\.example\/item/);
    assert.match(main.innerHTML, /new acquisition details/);
    globalThis.location.hash = '#evidence';
    renderOnHashChange();
    assert.doesNotMatch(main.innerHTML, /new\.example\/item|new acquisition details/);

    let rejectRead;
    const failingRead = new Promise((_resolve, reject) => { rejectRead = reject; });
    const failingFile = { name: 'failure.bin', size: 1, type: 'application/octet-stream', lastModified: 3, async arrayBuffer() { await failingRead; } };
    const lateErrorForm = node('late-error-form');
    lateErrorForm.id = 'hash-form';
    lateErrorForm.values = { file: failingFile, expected: '' };
    lateErrorForm.querySelectorAll = () => [button];
    const detachedError = { textContent: '', hidden: true, isConnected: false };
    lateErrorForm.querySelector = () => detachedError;
    const lateFailure = submit({ target: lateErrorForm, preventDefault() {} });
    globalThis.location.hash = '#library';
    renderOnHashChange();
    rejectRead(new Error('late hash read failed'));
    await lateFailure;
    assert.match(node('#notice').textContent, /late hash read failed/);
    assert.equal(detachedError.textContent, '');
    await saveWorkspace();
    change({ target: { id: 'media-file', files: [], closest() { return null; }, matches() { return false; } } });
    globalThis.location.hash = `#edit/${encodeURIComponent(caseId)}`;
    renderOnHashChange();
    const editForm = { id: 'case-form', dataset: { id: caseId } };
    input({ target: { id: 'case-summary', name: 'summary', value: 'final-edit-draft', closest(selector) { return selector === 'form' ? editForm : null; } } });
    assert.equal(node('#storage-state').textContent, 'Unsaved draft');
    let unloadPrevented = false;
    windowListeners.get('beforeunload')({ preventDefault() { unloadPrevented = true; } });
    assert.equal(unloadPrevented, true);
    globalThis.location.hash = `#case/${encodeURIComponent(caseId)}`;
    renderOnHashChange();
    assert.match(main.innerHTML, /summary-secret-during-save/);
    assert.doesNotMatch(main.innerHTML, /final-edit-draft/);
    globalThis.location.hash = `#edit/${encodeURIComponent(caseId)}`;
    renderOnHashChange();
    assert.match(main.innerHTML, /final-edit-draft/);

    const saveEditForm = node('edit-submit-form');
    saveEditForm.id = 'case-form';
    saveEditForm.dataset = { id: caseId };
    saveEditForm.values = { title: 'Case title', type: 'deepfake', summary: 'final-edit-draft', sourceUrl: '' };
    saveEditForm.querySelectorAll = () => [button];
    await submit({ target: saveEditForm, preventDefault() {} });
    globalThis.location.hash = `#case/${encodeURIComponent(caseId)}`;
    renderOnHashChange();
    assert.match(main.innerHTML, /final-edit-draft/);
    await saveWorkspace();

    globalThis.location.hash = `#edit/${encodeURIComponent(caseId)}`;
    renderOnHashChange();
    input({ target: { id: 'case-summary', name: 'summary', value: 'cancelled-summary-draft', closest(selector) { return selector === 'form' ? editForm : null; } } });
    click({ target: { closest(selector) { return selector === '[data-action]' ? { dataset: { action: 'cancel-edit', id: caseId } } : null; } } });
    globalThis.location.hash = `#case/${encodeURIComponent(caseId)}`;
    renderOnHashChange();
    globalThis.location.hash = `#edit/${encodeURIComponent(caseId)}`;
    renderOnHashChange();
    assert.match(main.innerHTML, /final-edit-draft/);
    assert.doesNotMatch(main.innerHTML, /cancelled-summary-draft/);


  } finally {
    for (const [name, descriptor] of previousDescriptors) {
      if (descriptor) Object.defineProperty(globalThis, name, descriptor);
      else delete globalThis[name];
    }
  }
});
