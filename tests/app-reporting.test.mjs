import test from 'node:test';
import assert from 'node:assert/strict';
import { webcrypto } from 'node:crypto';
import { pathToFileURL } from 'node:url';

test('production app resets report state on every changed report URL and accepts disclosure changes while busy', async () => {
  const globalNames = ['document', 'window', 'location', 'localStorage', 'FormData', 'crypto', 'setTimeout', 'clearTimeout'];
  const previousDescriptors = new Map(globalNames.map(name => [name, Object.getOwnPropertyDescriptor(globalThis, name)]));
  const nodes = new Map();
  const documentListeners = new Map();
  const windowListeners = new Map();
  let hash = '#overview';
  const node = selector => {
    if (!nodes.has(selector)) nodes.set(selector, {
      innerHTML: '', textContent: '', hidden: false,
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
    localStorage: { getItem() { return null; } },
    crypto: webcrypto,
    setTimeout: () => 1,
    clearTimeout: () => {},
    FormData: class {
    constructor(form) { this.form = form; }
    get(key) { return this.form.values?.[key] ?? null; }
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
    const submit = documentListeners.get('submit');
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

    // A same-route render is not a new report entry and must preserve the user's choices.
    renderOnHashChange();
    assert.match(main.innerHTML, /data-report-field="summary" checked/);

    // Entering the generic guide while selected must clear that case and its disclosure.
    await enterReport('#report');
    assert.match(main.innerHTML, /href="#new"/);
    assert.match(main.innerHTML, /href="#vault"/);
    assert.doesNotMatch(main.innerHTML, new RegExp(`value="${caseId}" selected`));
    assert.doesNotMatch(main.innerHTML, /summary-secret-during-save/);

    // Re-select the sensitive field, then enter a changed but unresolved case URL.
    await enterReport(`#report/${encodeURIComponent(caseId)}`);
    fireChange(reportControl('report-route', 'youtube-privacy'));
    fireChange(summaryToggle);
    await enterReport('#report/missing-case');
    assert.doesNotMatch(main.innerHTML, new RegExp(`value="${caseId}" selected`));
    assert.doesNotMatch(main.innerHTML, /summary-secret-during-save/);

    // Reselect the case, then begin a real hash operation whose file read remains pending.
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
  } finally {
    for (const [name, descriptor] of previousDescriptors) {
      if (descriptor) Object.defineProperty(globalThis, name, descriptor);
      else delete globalThis[name];
    }
  }
});
