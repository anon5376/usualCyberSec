import test from 'node:test';
import assert from 'node:assert/strict';
import { webcrypto } from 'node:crypto';
import { analyzeUrl, createCase, decryptWorkspace, encryptWorkspace, exportReport, hashFile, validateWorkspace } from '../src/lib/core.mjs';

if (!globalThis.crypto) globalThis.crypto = webcrypto;

test('hashFile returns the standard SHA-256 digest and file metadata', async () => {
  const file = new Blob(['abc'], { type: 'text/plain' });
  Object.defineProperties(file, { name: { value: 'note.txt' }, lastModified: { value: 123 } });
  const result = await hashFile(file);
  assert.equal(result.sha256, 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
  assert.deepEqual([result.name, result.size, result.type, result.lastModified], ['note.txt', 3, 'text/plain', 123]);
  assert.ok(Number.isFinite(Date.parse(result.hashedAt)));
});

test('hashFile rejects inconsistent size metadata and returned data over the file limit', async () => {
  const misreported = { size: 2, name: 'x', type: '', lastModified: 1, arrayBuffer: async () => new Uint8Array(3).buffer };
  await assert.rejects(hashFile(misreported), /size metadata/i);
  const oversized = { size: 1, name: 'x', type: '', lastModified: 1, arrayBuffer: async () => new Uint8Array(100 * 1024 * 1024 + 1).buffer };
  await assert.rejects(hashFile(oversized), /100 MiB/);
});

test('URL review detects deceptive structure without visiting the URL', () => {
  const reviewed = analyzeUrl('http://trusted.example@xn--pple-43d.com:8080/login', 'trusted.example');
  assert.equal(reviewed.hostname, 'xn--pple-43d.com');
  assert.equal(reviewed.normalized, 'http://trusted.example@xn--pple-43d.com:8080/login');
  assert.ok(reviewed.findings.some(item => /credential/i.test(item.title)));
  assert.ok(reviewed.findings.some(item => /punycode/i.test(item.title)));
  assert.ok(reviewed.findings.some(item => /HTTP/i.test(item.title)));
  assert.ok(reviewed.findings.some(item => /port/i.test(item.title)));
  assert.ok(reviewed.findings.some(item => /expected domain/i.test(item.title)));
  for (const input of ['javascript:alert(1)', 'https://127.0.0.1/path', 'https://[2001:db8::1]/']) {
    const result = analyzeUrl(input);
    assert.ok(result.findings.length > 0);
  }
  assert.ok(analyzeUrl('https://example.com.evil.test', 'example.com').findings.some(x => /expected domain/i.test(x.title)));
  assert.throws(() => analyzeUrl('https://example.com', 'https://example.com/path'), /expected domain/i);
  assert.throws(() => analyzeUrl('https://example.com', 'user@example.com'), /expected domain/i);
  assert.throws(() => analyzeUrl('x'.repeat(10001)), /URL input/i);
  assert.throws(() => analyzeUrl('https://example.com', 'x'.repeat(1001)), /expected domain/i);
});

test('workspace validation accepts complete records and rejects malformed or oversized records', () => {
  const value = { version: 1, cases: [{ id: 'c1', title: 'Incident', type: 'phishing', summary: '', sourceUrl: '', status: 'open', createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z', evidence: [{ id: 'e1', name: 'x', size: 2, type: 'text/plain', lastModified: 1, sha256: 'a'.repeat(64), hashedAt: '2026-01-01T00:00:00.000Z', sourceUrl: '', notes: '' }], completedSteps: [] }] };
  assert.deepEqual(validateWorkspace(value), value);
  assert.throws(() => validateWorkspace({ ...value, cases: [{ ...value.cases[0], type: 'unknown' }] }));
  assert.throws(() => validateWorkspace({ ...value, importedFlag: true }));
  assert.throws(() => validateWorkspace({ ...value, cases: [{ ...value.cases[0], evidence: [{ ...value.cases[0].evidence[0], sha256: 'bad' }] }] }));
  assert.throws(() => validateWorkspace({ ...value, cases: [{ ...value.cases[0], completedSteps: ['x'.repeat(200)] }] }));
  assert.throws(() => validateWorkspace({ version: 1, cases: Array(101).fill(value.cases[0]) }));
  assert.throws(() => validateWorkspace({ ...value, cases: [{ ...value.cases[0], updatedAt: 'yesterday' }] }));
  assert.throws(() => createCase({ title: '   ' }));
  assert.throws(() => validateWorkspace({ ...value, cases: [{ ...value.cases[0], id: '\ud800' }] }));
  assert.throws(() => validateWorkspace({ ...value, cases: [{ ...value.cases[0], evidence: [{ ...value.cases[0].evidence[0], id: '\ud800' }] }] }));
});

test('case creation and report export preserve context as readable text', () => {
  const item = createCase({ title: 'Urgent [review]', type: 'deepfake', summary: 'Verify independently.', sourceUrl: 'https://example.test/path' });
  assert.equal(item.status, 'open');
  assert.deepEqual(item.evidence, []);
  const report = exportReport(item);
  assert.match(report, /Evidence/);
  assert.match(report, /Verify independently\\\./);
  assert.match(report, /A file hash helps identify matching bytes/);
  item.title = 'Case\n## injected heading';
  assert.doesNotMatch(exportReport(item), /^## injected heading$/m);
});

test('encrypted workspace roundtrips; wrong password and modified ciphertext fail', async () => {
  const workspace = { version: 1, cases: [] };
  const envelope = await encryptWorkspace(workspace, 'correct horse battery staple');
  assert.deepEqual(await decryptWorkspace(envelope, 'correct horse battery staple'), workspace);
  await assert.rejects(decryptWorkspace(envelope, 'incorrect password'));
  const changed = { ...envelope, ciphertext: `${envelope.ciphertext.slice(0, -2)}AA` };
  await assert.rejects(decryptWorkspace(changed, 'correct horse battery staple'));
  await assert.rejects(decryptWorkspace({ ...envelope, extra: true }, 'correct horse battery staple'), /unsupported or missing fields/i);
  await assert.rejects(decryptWorkspace({ ...envelope, ciphertext: 'A'.repeat(14 * 1024 * 1024 + 4) }, 'correct horse battery staple'), /length|size|limit/i);
});

test('encrypted archive handles ordinary multi-case workspaces larger than a byte spread call', async () => {
  const workspace = {
    version: 1,
    cases: Array.from({ length: 12 }, (_, index) => createCase({ title: `Case ${index}`, summary: 'x'.repeat(9_000), type: 'breach' })),
  };
  const envelope = await encryptWorkspace(workspace, 'correct horse battery staple');
  assert.deepEqual(await decryptWorkspace(envelope, 'correct horse battery staple'), workspace);
});
