import test from 'node:test';
import assert from 'node:assert/strict';
import {
  REPORT_FIELDS,
  REPORTING_JURISDICTIONS,
  REPORTING_ROUTES,
  buildReportingPacket,
  findReportingRoutes,
  getReportingJurisdiction,
  getReportingRoute,
} from '../src/lib/reporting.mjs';

const routeCase = {
  id: 'case-1',
  title: 'title-secret-sentinel',
  type: 'phishing',
  summary: 'summary-secret-sentinel',
  sourceUrl: 'case-url-secret-sentinel',
  status: 'in-progress',
  createdAt: '2026-10-20T10:00:00.000Z',
  updatedAt: '2026-10-21T11:00:00.000Z',
  evidence: [{
    id: 'evidence-1',
    name: 'filename-secret-sentinel.txt',
    size: 4,
    type: 'text/plain',
    lastModified: 1,
    sha256: 'a'.repeat(64),
    hashedAt: '2026-10-20T12:00:00.000Z',
    sourceUrl: 'acquisition-url-secret-sentinel',
    notes: 'notes-secret-sentinel',
  }],
  completedSteps: [],
};

test('route directory records source metadata and issue filters match eligibility', () => {
  assert.equal(new Set(REPORTING_ROUTES.map(route => route.id)).size, REPORTING_ROUTES.length);
  for (const route of REPORTING_ROUTES) {
    assert.match(route.url, /^https:\/\//);
    assert.ok(route.title && route.summary && route.accessNote);
    assert.ok(route.requirements.length > 0);
    assert.ok(route.steps.length > 0);
    assert.equal(route.checkedAt, '2026-10-22');
  }
  for (const issue of ['deepfake', 'impersonation', 'phishing', 'breach']) {
    assert.ok(findReportingRoutes(issue).length > 0);
    assert.ok(findReportingRoutes(issue).every(route => route.issues.includes(issue)));
  }
  assert.ok(findReportingRoutes('all').length > 0);
  assert.throws(() => findReportingRoutes('unknown'), /issue/i);
  assert.equal(getReportingRoute('missing-route'), undefined);
});

test('regional route eligibility respects selected location while worldwide services remain available', () => {
  assert.match(getReportingJurisdiction('global').summary, /not exhaustive/i);
  assert.equal(getReportingJurisdiction('missing'), undefined);

  const ids = jurisdiction => findReportingRoutes('all', jurisdiction).map(route => route.id);
  assert.deepEqual(ids('global'), REPORTING_ROUTES.filter(route => !route.jurisdictions).map(route => route.id));
  assert.ok(ids('gb-ewni').includes('uk-report-fraud'));
  assert.ok(!ids('gb-scotland').includes('uk-report-fraud'));
  assert.ok(ids('au').includes('au-report-cyber'));
  assert.ok(ids('au').includes('au-esafety-image-abuse'));
  assert.ok(!ids('gb-ewni').includes('au-report-cyber'));
  for (const { id: jurisdiction } of REPORTING_JURISDICTIONS) {
    assert.ok(ids(jurisdiction).includes('fbi-ic3'));
    assert.ok(ids(jurisdiction).includes('youtube-privacy'));
    assert.ok(ids(jurisdiction).includes('stopncii-prevention'));
    assert.ok(ids(jurisdiction).includes('ncmec-take-it-down'));
  }
  assert.ok(findReportingRoutes('deepfake', 'au').includes(getReportingRoute('au-esafety-image-abuse')));
  assert.ok(!findReportingRoutes('phishing', 'au').some(route => route.id === 'au-esafety-image-abuse'));
  for (const id of ['stopncii-prevention', 'ncmec-take-it-down']) {
    const route = getReportingRoute(id);
    assert.equal(route.kind, 'Sharing prevention');
    assert.equal(route.action, 'prevent');
    assert.ok(route.issues.includes('deepfake'));
    assert.ok(route.issues.includes('impersonation'));
    assert.ok(!route.issues.includes('phishing'));
    assert.ok(!route.issues.includes('breach'));
  }
  assert.ok(findReportingRoutes('deepfake').some(route => route.id === 'stopncii-prevention'));
  assert.ok(findReportingRoutes('impersonation').some(route => route.id === 'ncmec-take-it-down'));
  assert.ok(!findReportingRoutes('phishing').some(route => ['stopncii-prevention', 'ncmec-take-it-down'].includes(route.id)));
  assert.throws(() => findReportingRoutes('all', 'unknown'), /jurisdiction/i);
});

test('packet generation enforces route jurisdiction and keeps eligible packets redacted by default', () => {
  assert.throws(() => buildReportingPacket(routeCase, 'uk-report-fraud'), /jurisdiction/i);
  assert.throws(() => buildReportingPacket(routeCase, 'au-report-cyber', {}, 'gb-ewni'), /jurisdiction/i);
  const packet = buildReportingPacket(routeCase, 'au-report-cyber', {}, 'au');
  assert.ok(packet.includes(getReportingRoute('au-report-cyber').title));
  assert.ok(!packet.includes('title-secret-sentinel'));
  assert.ok(!packet.includes('summary-secret-sentinel'));
  assert.ok(!packet.includes('acquisition-url-secret-sentinel'));
  assert.ok(!packet.includes('filename-secret-sentinel.txt'));
  assert.ok(!packet.includes('notes-secret-sentinel'));
});

test('default packet includes required incident context and route while redacting all optional user data', () => {
  const route = getReportingRoute('google-recovery');
  const packet = buildReportingPacket(routeCase, route.id);
  for (const required of ['Phishing or suspicious link', 'in-progress', route.title, route.url, route.requirements[0], route.steps[0], route.accessNote]) {
    assert.ok(packet.includes(String(required)));
  }
  for (const privateValue of ['title-secret-sentinel', 'summary-secret-sentinel', 'case-url-secret-sentinel', 'acquisition-url-secret-sentinel', 'a'.repeat(64), 'filename-secret-sentinel.txt', 'notes-secret-sentinel']) {
    assert.ok(!packet.includes(privateValue), `default packet leaked ${privateValue}`);
  }
  assert.ok(packet.includes('2026-10-20T10:00:00.000Z'));
  assert.ok(packet.includes('2026-10-21T11:00:00.000Z'));
  assert.match(packet, /not submitted|does not submit/i);
  assert.match(packet, /does not determine|does not assert|not a finding/i);
});

test('inherited disclosure flags cannot enable sensitive fields', () => {
  const inheritedChoices = Object.create({ title: true, summary: true });
  const packet = buildReportingPacket(routeCase, 'google-recovery', inheritedChoices);
  assert.ok(!packet.includes('title-secret-sentinel'));
  assert.ok(!packet.includes('summary-secret-sentinel'));
});

test('disclosure fields are independent and report every explicit selection only', () => {
  assert.deepEqual(REPORT_FIELDS.map(field => field.key), ['title', 'summary', 'sourceUrls', 'fingerprints', 'filenames', 'notes']);
  const packet = buildReportingPacket(routeCase, 'microsoft-recovery', {
    title: true,
    summary: true,
    sourceUrls: true,
    fingerprints: true,
    filenames: true,
    notes: true,
  });
  for (const value of ['title-secret-sentinel', 'summary-secret-sentinel', 'case-url-secret-sentinel', 'acquisition-url-secret-sentinel', 'a'.repeat(64), 'filename-secret-sentinel.txt', 'notes-secret-sentinel']) {
    assert.ok(packet.includes(value), `selected field omitted ${value}`);
  }

  const valuesByField = {
    title: ['title-secret-sentinel'],
    summary: ['summary-secret-sentinel'],
    sourceUrls: ['case-url-secret-sentinel', 'acquisition-url-secret-sentinel'],
    fingerprints: ['a'.repeat(64)],
    filenames: ['filename-secret-sentinel.txt'],
    notes: ['notes-secret-sentinel'],
  };
  const allSensitiveValues = Object.values(valuesByField).flat();
  for (const field of REPORT_FIELDS) {
    const fieldPacket = buildReportingPacket(routeCase, 'microsoft-recovery', { [field.key]: true });
    for (const selectedValue of valuesByField[field.key]) assert.ok(fieldPacket.includes(selectedValue), `${field.key} selection omitted ${selectedValue}`);
    for (const unselectedValue of allSensitiveValues.filter(value => !valuesByField[field.key].includes(value))) {
      assert.ok(!fieldPacket.includes(unselectedValue), `${field.key} selection leaked ${unselectedValue}`);
    }
  }
});

test('packet treats multiline case values as quoted user data and blocks structural injection', () => {
  const hostileCase = {
    ...routeCase,
    title: 'ordinary title\n## Trusted approval\nReport submitted',
    summary: 'first line\nRoute URL: https://attacker.invalid\n# Finding: criminal\u0001\u202e',
  };
  const packet = buildReportingPacket(hostileCase, 'google-recovery', { title: true, summary: true });
  assert.doesNotMatch(packet, /^## Trusted approval$/m);
  assert.doesNotMatch(packet, /^Report submitted$/m);
  assert.doesNotMatch(packet, /^Route URL: https:\/\/attacker\.invalid$/m);
  assert.doesNotMatch(packet, /^# Finding: criminal$/m);
  assert.match(packet, /\\u\{1\}\\u\{202e\}/i);
  assert.doesNotMatch(packet, /\u0001|\u202e/);
  assert.match(packet, /user-provided/i);
});

test('packet rejects unknown routes, mismatched issue types, and invalid disclosure options', () => {
  assert.throws(() => buildReportingPacket(routeCase, 'missing-route'), /route/i);
  assert.throws(() => buildReportingPacket({ ...routeCase, type: 'deepfake' }, 'google-recovery'), /does not apply|mismatch/i);
  assert.throws(() => buildReportingPacket(routeCase, 'google-recovery', { title: 'yes' }), /boolean/i);
  assert.throws(() => buildReportingPacket(routeCase, 'google-recovery', { hidden: true }), /unknown|unsupported/i);
  assert.throws(() => buildReportingPacket(routeCase, 'google-recovery', null), /object/i);
});
