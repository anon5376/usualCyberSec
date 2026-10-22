export const MAX_FILE_BYTES = 100 * 1024 * 1024;

export const TYPES = [
  { id: 'deepfake', label: 'Suspected deepfake' },
  { id: 'impersonation', label: 'Impersonation' },
  { id: 'phishing', label: 'Phishing or suspicious link' },
  { id: 'breach', label: 'Account or system breach' },
];

const official = {
  report: 'https://consumer.ftc.gov/articles/scammers-use-fake-emergencies-steal-your-money',
  ai: 'https://www.ftc.gov/policy/advocacy-research/tech-at-ftc/2024/04/approaches-address-ai-enabled-voice-cloning',
  ic3: 'https://www.ic3.gov/',
  cisa: 'https://www.cisa.gov/stopransomware/ransomware-guide',
  cisaPlaybook: 'https://www.cisa.gov/sites/default/files/publications/Cybersecurity_Incident_Vulnerability_Response_Playbooks_508C.pdf',
  nist: 'https://www.nist.gov/itl/smallbusinesscyber/guidance-topic/incident-response',
  deepfake: 'https://www.nist.gov/document/deepfake-trifold-version',
  c2pa: 'https://spec.c2pa.org/specifications/specifications/2.4/security/Harms_Modelling.html',
};

export const PLAYBOOKS = {
  deepfake: [
    { id: 'preserve', title: 'Preserve the original and source context', detail: 'Record the source and any transformations; quality alone does not establish whether media is fake, and provenance credentials do not prove that its claims are true.', url: official.deepfake },
    { id: 'verify', title: 'Pause and verify independently', detail: 'Call a number you already know or verify with family or colleagues through a separate channel. Treat urgency, secrecy, and unusual payment requests as warning signs.', url: official.report },
    { id: 'report', title: 'Report the content and resulting harm', detail: 'Use the platform reporting route. In the United States, report online crime to IC3 and consumer fraud to the FTC; routes differ elsewhere.', url: official.ic3 },
    { id: 'recover', title: 'Recover accounts or funds if affected', detail: 'Contact the financial institution using its official number, secure affected accounts from a trusted device, and preserve transaction and message records.', url: official.report },
  ],
  impersonation: [
    { id: 'preserve', title: 'Preserve messages and account details', detail: 'Keep original messages, URLs, timestamps, and relevant account notices.', url: official.report },
    { id: 'verify', title: 'Verify identity separately', detail: 'Contact the real person or organization using a number, address, or website you already trust.', url: official.report },
    { id: 'secure', title: 'Secure the affected account', detail: 'From a trusted device, change the password, revoke unfamiliar sessions, enable multifactor authentication, and check recovery email addresses and phone numbers.', url: official.cisaPlaybook },
    { id: 'report', title: 'Report impersonation', detail: 'Report the account or content to the platform. In the United States, use FTC consumer fraud reporting and IC3 for online crime; elsewhere use the local authority.', url: official.ic3 },
  ],
  phishing: [
    { id: 'avoid', title: 'Do not open or submit information on the link', detail: 'This local review does not visit the link and cannot establish whether it is safe.', url: official.cisa },
    { id: 'preserve', title: 'Preserve the message and link', detail: 'Keep the original message, sender details, full URL, and time received. Do not forward it as an attachment unless the security team asks.', url: official.cisaPlaybook },
    { id: 'secure', title: 'If you entered credentials, recover the account', detail: 'Open the official app or type the known website address yourself. Change the password, revoke unfamiliar sessions, enable multifactor authentication, and check recovery methods.', url: official.cisaPlaybook },
    { id: 'report', title: 'Report the message', detail: 'Use the service provider’s phishing report control. In the United States, report financial fraud to the FTC and cybercrime to IC3.', url: official.ic3 },
  ],
  breach: [
    { id: 'contain', title: 'Contain ongoing access and preserve evidence', detail: 'Isolate affected systems where feasible; preserve logs and volatile evidence when trained responders can do so safely. Follow your organization’s incident plan.', url: official.cisa },
    { id: 'secure', title: 'Recover accounts from a trusted device', detail: 'Change affected passwords, revoke active sessions and tokens, enable multifactor authentication, and remove unknown recovery methods. Check mail forwarding rules and connected apps.', url: official.cisaPlaybook },
    { id: 'notify', title: 'Notify the responsible security team', detail: 'Share the time, affected accounts or systems, observed activity, and preserved records through your organization’s approved channel.', url: official.nist },
    { id: 'report', title: 'Check official reporting routes and deadlines', detail: 'Requirements depend on location, data, and organization. In the United States, use CISA incident reporting and IC3 for cybercrime; consult counsel or your regulator where required.', url: official.cisaPlaybook },
  ],
};

const LIMITATIONS = 'Structural checks only. This tool does not visit the URL, assess reputation, or determine whether a link is safe.';
const MAX_CASES = 100;
const MAX_EVIDENCE = 100;
const MAX_STEPS = 100;
const MAX_TEXT = 10000;
const MAX_WORKSPACE_BYTES = 7 * 1024 * 1024;
const HEX_256 = /^[a-f\d]{64}$/i;
const SAFE_ID = /^[A-Za-z0-9_-]{1,128}$/;

function finding(level, title, detail) { return { level, title, detail }; }

function canonicalHost(host) { return host.toLowerCase().replace(/\.$/, ''); }

function isIpLiteral(host) {
  if (host.startsWith('[') && host.endsWith(']')) return true;
  const parts = host.split('.');
  return parts.length === 4 && parts.every(part => /^\d{1,3}$/.test(part) && Number(part) <= 255);
}

export function analyzeUrl(input, expectedDomain = '') {
  assert(typeof input === 'string' || input == null, 'URL input must be a string.');
  const raw = String(input ?? '').trim();
  assert(raw.length <= 10000, 'URL input must be at most 10000 characters.');
  assert(typeof expectedDomain === 'string', 'Expected domain must be a hostname string.');
  assert(expectedDomain.length <= 253, 'Expected domain must be a hostname of at most 253 characters.');
  const expectedInput = expectedDomain.trim();
  if (expectedInput && (!/^(?:[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?)(?:\.(?:[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?))*\.?$/i.test(expectedInput) || expectedInput.length > 253)) {
    throw new TypeError('Expected domain must be a hostname only, without a scheme, credentials, port, path, query, or fragment.');
  }
  const findings = [];
  let parsed;
  try { parsed = new URL(raw); } catch {
    return { hostname: '', normalized: raw, findings: [finding('high', 'Invalid URL', 'Enter a complete HTTP or HTTPS URL to review its structure.')], limitations: LIMITATIONS };
  }
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    findings.push(finding('high', 'Unsupported scheme', 'Only HTTP and HTTPS URLs can be structurally reviewed.'));
  }
  const hostname = canonicalHost(parsed.hostname);
  if (parsed.username || parsed.password) findings.push(finding('high', 'Credentials in URL', 'This address contains user information before the hostname.'));
  if (parsed.protocol === 'http:') findings.push(finding('high', 'Unencrypted HTTP', 'HTTP does not protect the connection in transit.'));
  if (hostname.includes('xn--')) findings.push(finding('medium', 'Punycode hostname', 'The hostname contains an encoded internationalized label that may resemble another domain.'));
  if (isIpLiteral(hostname)) findings.push(finding('medium', 'IP address hostname', 'The address uses an IP literal instead of a conventional domain name.'));
  if (parsed.port && !['80', '443'].includes(parsed.port)) findings.push(finding('medium', 'Unusual port', `The URL specifies port ${parsed.port}.`));
  if (expectedInput) {
    const expected = canonicalHost(expectedInput.toLowerCase().replace(/^\.+|\.+$/g, ''));
    if (!expected || !(hostname === expected || hostname.endsWith(`.${expected}`))) {
      findings.push(finding('medium', 'Expected domain does not match', `Hostname is not ${expectedInput} or one of its subdomains.`));
    }
  }
  if (findings.length === 0) findings.push(finding('info', 'No listed structural warning', 'This limited check found no listed warning; it does not establish safety.'));
  return { hostname, normalized: parsed.href, findings, limitations: LIMITATIONS };
}

export async function hashFile(file) {
  if (!file || typeof file.arrayBuffer !== 'function') throw new TypeError('A file-like object is required.');
  if (!Number.isSafeInteger(file.size) || file.size < 0) throw new TypeError('File size metadata must be a non-negative safe integer.');
  if (file.size > MAX_FILE_BYTES) throw new RangeError('File exceeds the 100 MiB limit.');
  if (typeof file.name !== 'string' || file.name.length > 1000 || typeof file.type !== 'string' || file.type.length > 255) throw new TypeError('File name or type metadata is invalid.');
  if (!Number.isSafeInteger(file.lastModified) || file.lastModified < 0) throw new TypeError('File lastModified metadata is invalid.');
  const bytes = await file.arrayBuffer();
  if (bytes.byteLength > MAX_FILE_BYTES) throw new RangeError('File data exceeds the 100 MiB limit.');
  if (bytes.byteLength !== file.size) throw new TypeError('File size metadata does not match the bytes read.');
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  const digestBytes = new Uint8Array(digest);
  let sha256 = '';
  for (let offset = 0; offset < digestBytes.length; offset += 1) sha256 += digestBytes[offset].toString(16).padStart(2, '0');
  return { name: String(file.name ?? ''), size: file.size, type: String(file.type ?? ''), lastModified: Number(file.lastModified ?? 0), sha256, hashedAt: new Date().toISOString() };
}

function assert(condition, message) { if (!condition) throw new TypeError(message); }
function boundedString(value, label, max = MAX_TEXT) { assert(typeof value === 'string' && value.length <= max, `${label} must be a string of at most ${max} characters.`); }
function exactKeys(value, keys, label) {
  const actual = Object.keys(value).sort();
  const expected = [...keys].sort();
  assert(actual.length === expected.length && actual.every((key, index) => key === expected[index]), `${label} has unsupported or missing fields.`);
}
function validTime(value, label) {
  boundedString(value, label, 40);
  assert(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/.test(value) && Number.isFinite(Date.parse(value)), `${label} must be an ISO UTC timestamp.`);
}

export function validateWorkspace(value) {
  assert(value && typeof value === 'object' && !Array.isArray(value), 'Workspace must be an object.');
  exactKeys(value, ['version', 'cases'], 'Workspace');
  assert(value.version === 1 && Array.isArray(value.cases), 'Workspace version or cases are invalid.');
  assert(value.cases.length <= MAX_CASES, 'Workspace has too many cases.');
  const ids = new Set();
  const typeIds = new Set(TYPES.map(type => type.id));
  for (const item of value.cases) {
    assert(item && typeof item === 'object' && !Array.isArray(item), 'Case must be an object.');
    exactKeys(item, ['id', 'title', 'type', 'summary', 'sourceUrl', 'status', 'createdAt', 'updatedAt', 'evidence', 'completedSteps'], 'Case');
    for (const key of ['id', 'title', 'summary', 'sourceUrl']) boundedString(item[key], `Case ${key}`, key === 'id' ? 128 : MAX_TEXT);
    assert(SAFE_ID.test(item.id) && !ids.has(item.id), 'Case IDs must use 1–128 ASCII letters, digits, underscores, or hyphens and be unique.'); ids.add(item.id);
    assert(item.title.trim().length > 0, 'Case title is required.');
    assert(typeIds.has(item.type), 'Case type is invalid.');
    assert(['open', 'in-progress', 'resolved'].includes(item.status), 'Case status is invalid.');
    validTime(item.createdAt, 'Case createdAt'); validTime(item.updatedAt, 'Case updatedAt');
    assert(Array.isArray(item.evidence) && item.evidence.length <= MAX_EVIDENCE, 'Case evidence is invalid or too large.');
    const evidenceIds = new Set();
    for (const record of item.evidence) {
      assert(record && typeof record === 'object' && !Array.isArray(record), 'Evidence must be an object.');
      exactKeys(record, ['id', 'name', 'size', 'type', 'lastModified', 'sha256', 'hashedAt', 'sourceUrl', 'notes'], 'Evidence');
      for (const key of ['id', 'name', 'type', 'sourceUrl', 'notes']) boundedString(record[key], `Evidence ${key}`, key === 'id' ? 128 : MAX_TEXT);
      assert(SAFE_ID.test(record.id) && !evidenceIds.has(record.id), 'Evidence IDs must use 1–128 ASCII letters, digits, underscores, or hyphens and be unique within a case.'); evidenceIds.add(record.id);
      assert(Number.isSafeInteger(record.size) && record.size >= 0 && record.size <= MAX_FILE_BYTES, 'Evidence size is invalid.');
      assert(Number.isSafeInteger(record.lastModified) && record.lastModified >= 0, 'Evidence lastModified is invalid.');
      assert(HEX_256.test(record.sha256), 'Evidence SHA-256 digest is invalid.');
      validTime(record.hashedAt, 'Evidence hashedAt');
    }
    assert(Array.isArray(item.completedSteps) && item.completedSteps.length <= MAX_STEPS, 'Case completedSteps is invalid or too large.');
    const allowedSteps = new Set(PLAYBOOKS[item.type].map(step => step.id));
    const completed = new Set();
    for (const step of item.completedSteps) {
      boundedString(step, 'Completed step', 128);
      assert(allowedSteps.has(step) && !completed.has(step), 'Completed step is unknown or repeated for this case type.');
      completed.add(step);
    }
  }
  assert(encoder.encode(JSON.stringify(value)).byteLength <= MAX_WORKSPACE_BYTES, 'Workspace exceeds the 7 MiB archive limit.');
  return value;
}

export function createCase({ title = '', type = 'deepfake', summary = '', sourceUrl = '' } = {}) {
  const now = new Date().toISOString();
  const normalizedTitle = String(title).trim();
  assert(normalizedTitle.length > 0, 'Case title is required.');
  const item = { id: crypto.randomUUID(), title: normalizedTitle, type, summary: String(summary), sourceUrl: String(sourceUrl), status: 'open', createdAt: now, updatedAt: now, evidence: [], completedSteps: [] };
  validateWorkspace({ version: 1, cases: [item] });
  return item;
}

export function exportReport(item) {
  validateWorkspace({ version: 1, cases: [item] });
  const text = value => String(value).replace(/[\r\n]+/g, ' ').replace(/([\\`*_{}\[\]()#+.!|><&:?/=])/g, '\\$1');
  const lines = [
    `# Incident report: ${text(item.title || 'Untitled incident')}`, '',
    `- Type: ${TYPES.find(type => type.id === item.type).label}`,
    `- Status: ${item.status}`,
    `- Created: ${item.createdAt}`,
    `- Updated: ${item.updatedAt}`,
    `- Source URL: ${text(item.sourceUrl || 'Not recorded')}`, '',
    '## Summary', '', text(item.summary || 'No summary recorded.'), '',
    '## Evidence', '',
  ];
  if (item.evidence.length === 0) lines.push('No evidence records.');
  for (const entry of item.evidence) lines.push(`- ${text(entry.name || 'Unnamed file')} — SHA-256: ${entry.sha256}; size: ${entry.size} bytes; type: ${text(entry.type || 'unknown')}; last modified: ${entry.lastModified}; hashed: ${entry.hashedAt}; acquisition URL: ${text(entry.sourceUrl || 'Not recorded')}; notes: ${text(entry.notes || 'None')}`);
  lines.push('', '## Response steps', '');
  const steps = PLAYBOOKS[item.type];
  for (const step of steps) lines.push(`- [${item.completedSteps.includes(step.id) ? 'x' : ' '}] ${step.title}`);
  lines.push('', '## Limits', '', 'A file hash helps identify matching bytes; it does not authenticate a file or identify generated media. URL checks are structural only and do not establish whether a link is safe. Timestamps come from the local device and are not external attestations.', '');
  return lines.join('\n');
}

const encoder = new TextEncoder();
const decoder = new TextDecoder('utf-8', { fatal: true });
const toBase64 = bytes => {
  const view = new Uint8Array(bytes);
  let binary = '';
  const chunkSize = 0x8000;
  for (let offset = 0; offset < view.length; offset += chunkSize) {
    binary += String.fromCharCode(...view.subarray(offset, offset + chunkSize));
  }
  return btoa(binary);
};
const fromBase64 = value => Uint8Array.from(atob(value), char => char.charCodeAt(0));

async function deriveKey(password, salt, usages) {
  const material = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: 600000 }, material, { name: 'AES-GCM', length: 256 }, false, usages);
}

export async function encryptWorkspace(workspace, password) {
  validateWorkspace(workspace);
  assert(typeof password === 'string' && password.length >= 12, 'Password must contain at least 12 characters.');
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt, ['encrypt']);
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoder.encode(JSON.stringify(workspace)));
  return { version: 1, algorithm: 'AES-GCM', kdf: 'PBKDF2-SHA256', iterations: 600000, salt: toBase64(salt), iv: toBase64(iv), ciphertext: toBase64(ciphertext) };
}

export async function decryptWorkspace(envelope, password) {
  assert(envelope && typeof envelope === 'object' && !Array.isArray(envelope), 'Encrypted archive is invalid.');
  exactKeys(envelope, ['version', 'algorithm', 'kdf', 'iterations', 'salt', 'iv', 'ciphertext'], 'Encrypted archive');
  assert(envelope.version === 1 && envelope.algorithm === 'AES-GCM' && envelope.kdf === 'PBKDF2-SHA256' && envelope.iterations === 600000, 'Encrypted archive parameters are unsupported.');
  assert(typeof password === 'string' && password.length >= 12, 'Password must contain at least 12 characters.');
  assert(typeof envelope.salt === 'string' && typeof envelope.iv === 'string' && typeof envelope.ciphertext === 'string', 'Encrypted archive fields are invalid.');
  assert(envelope.salt.length === 24 && envelope.iv.length === 16 && envelope.ciphertext.length <= 14 * 1024 * 1024, 'Encrypted archive fields exceed length limits.');
  const validBase64 = /^(?:[A-Za-z\d+/]{4})*(?:[A-Za-z\d+/]{2}==|[A-Za-z\d+/]{3}=)?$/;
  assert(validBase64.test(envelope.salt) && validBase64.test(envelope.iv) && validBase64.test(envelope.ciphertext), 'Encrypted archive fields are not valid base64.');
  const salt = fromBase64(envelope.salt); const iv = fromBase64(envelope.iv); const ciphertext = fromBase64(envelope.ciphertext);
  assert(salt.length === 16 && iv.length === 12 && ciphertext.length >= 16 && ciphertext.length <= 10 * 1024 * 1024, 'Encrypted archive exceeds limits or has invalid parameters.');
  const key = await deriveKey(password, salt, ['decrypt']);
  const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);
  return validateWorkspace(JSON.parse(decoder.decode(plaintext)));
}
