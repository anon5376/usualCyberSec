import { TYPES, validateWorkspace } from './core.mjs';

export const REPORT_FIELDS = [
  { key: 'title', label: 'Case title' },
  { key: 'summary', label: 'Case summary' },
  { key: 'sourceUrls', label: 'Source and acquisition URLs' },
  { key: 'fingerprints', label: 'SHA-256 fingerprints' },
  { key: 'filenames', label: 'Evidence filenames' },
  { key: 'notes', label: 'Evidence notes' },
];

export const REPORTING_ROUTES = [
  {
    id: 'youtube-privacy',
    label: 'YouTube · Privacy complaint',
    service: 'YouTube',
    title: 'YouTube privacy complaint for synthetic face or voice',
    issues: ['deepfake', 'impersonation'],
    action: 'report',
    url: 'https://support.google.com/youtube/answer/2801895?hl=en',
    summary: 'YouTube privacy guidance covers synthetic or altered content depicting an identifiable person. It evaluates context and does not promise automatic removal.',
    requirements: [
      'The depicted person or an authorized legal representative should make the complaint.',
      'The person must be uniquely identifiable in the content.',
      'YouTube considers context such as parody, public interest, and whether synthetic or altered content is disclosed.',
    ],
    steps: [
      'Keep the content URL, channel name, date observed, and relevant surrounding context.',
      'Review YouTube’s privacy complaint process and linked privacy complaint form before submitting.',
      'Describe why the person is identifiable and what privacy harm is involved; review the request before sending it.',
    ],
    region: 'Global service; process availability may vary by location.',
    checkedAt: '2026-10-22',
    accessNote: 'The privacy complaint flow is a review process. A report does not cause automatic removal, and this tool cannot determine whether the content violates YouTube policy.',
  },
  {
    id: 'instagram-impersonation',
    label: 'Instagram · Impersonation',
    service: 'Instagram',
    title: 'Report an Instagram account impersonating you',
    issues: ['impersonation'],
    action: 'report',
    url: 'https://help.instagram.com/370054663112398/',
    summary: 'Instagram provides a route to report an account that impersonates someone.',
    requirements: [
      'Use Instagram’s official reporting path and follow the instructions shown there.',
      'Current form fields and identity-document requirements were not verified for this reference.',
    ],
    steps: [
      'Record the impersonating profile URL, account name, and relevant messages or posts.',
      'Open the official help page and use its current report flow.',
      'Review any requested information before sending it directly to Instagram.',
    ],
    region: 'Global service; current form availability may vary.',
    checkedAt: '2026-10-22',
    accessNote: 'The linked route was robot-limited during source checking and corroborated by a public eSafety guide. Exact current form and identity requirements remain unverified.',
  },
  {
    id: 'facebook-impersonation',
    label: 'Facebook · Impersonation',
    service: 'Facebook',
    title: 'Report an impersonating Facebook profile or Page',
    issues: ['impersonation'],
    action: 'report',
    url: 'https://www.facebook.com/help/174210519303259',
    summary: 'Facebook provides a help route for reporting profiles or Pages that impersonate a person or organization.',
    requirements: [
      'Follow the current Facebook instructions for the profile or Page being reported.',
      'Current form fields and identity-document requirements were not verified for this reference.',
    ],
    steps: [
      'Record the profile or Page URL, name, and relevant messages or posts.',
      'Open Facebook’s official help route and follow the current reporting process.',
      'Review any requested information before sending it directly to Facebook.',
    ],
    region: 'Global service; current form availability may vary.',
    checkedAt: '2026-10-22',
    accessNote: 'The page redirected to login while checked. Current form fields and evidence requirements remain unverified.',
  },
  {
    id: 'tiktok-synthetic',
    label: 'TikTok · Synthetic media',
    service: 'TikTok',
    title: 'Report AI-generated or manipulated content on TikTok',
    issues: ['deepfake'],
    action: 'report',
    url: 'https://support.tiktok.com/en/using-tiktok/creating-videos/ai-generated-content/',
    summary: 'TikTok’s guidance describes synthetic-media categories and its policy. AI generation alone does not establish a policy violation.',
    requirements: [
      'Select the reporting category that best matches the content and TikTok’s current options.',
      'The platform policy distinguishes deepfakes, synthetic media, and manipulated media; context matters.',
    ],
    steps: [
      'Record the post URL, account name, date observed, and surrounding context.',
      'Use the post’s report control and choose the applicable misinformation or synthetic-media category shown by TikTok.',
      'Describe the specific harm and review the report before submission.',
    ],
    region: 'Global policy guidance; reporting options may vary by location.',
    checkedAt: '2026-10-22',
    accessNote: 'This is policy guidance, not a finding that a post violates policy. Current in-app category labels may change.',
  },
  {
    id: 'tiktok-impersonation',
    label: 'TikTok · Impersonation',
    service: 'TikTok',
    title: 'Report an impersonating TikTok account',
    issues: ['impersonation'],
    action: 'report',
    url: 'https://www.tiktok.com/en/safety-hc/report-a-problem/report-an-impersonation-account',
    summary: 'TikTok provides an account-impersonation reporting route with different processes for U.S. and non-U.S. reports.',
    requirements: [
      'Choose the reporting process for the relevant region.',
      'The U.S. process asks for identity proof; do not provide identity documents to usualCyberSec.',
    ],
    steps: [
      'Record the impersonating account URL, account name, and relevant posts or messages.',
      'Open the official TikTok route and choose the applicable regional process.',
      'Review all requested information and submit it only through TikTok’s official route.',
    ],
    region: 'United States and non-U.S. processes differ.',
    checkedAt: '2026-10-22',
    accessNote: 'The U.S. form asks for identity proof. This application does not collect or transmit that proof.',
  },
  {
    id: 'x-impersonation',
    label: 'X · Impersonation',
    service: 'X',
    title: 'Report an account impersonating you on X',
    issues: ['impersonation'],
    action: 'report',
    url: 'https://help.x.com/en/safety-and-security/report-x-impersonation',
    summary: 'X provides impersonation reporting paths for the affected person, an authorized representative, and bystanders.',
    requirements: [
      'Use the affected-person or authorized-representative path where applicable; bystanders can report a profile through its report control.',
      'An identity-specific process may require signing in; current requirements can vary by path.',
    ],
    steps: [
      'Record the profile URL, account name, and relevant posts or messages.',
      'Choose the reporting path that matches your relationship to the person being impersonated.',
      'Review the information requested by X before submitting it through X.',
    ],
    region: 'Global service; route requirements may vary.',
    checkedAt: '2026-10-22',
    accessNote: 'Some reporting paths may require an X account or identity information. This application does not collect or transmit either.',
  },
  {
    id: 'google-recovery',
    label: 'Google Account · Recovery',
    service: 'Google Account',
    title: 'Recover a compromised Google Account',
    issues: ['breach', 'phishing'],
    action: 'recover',
    url: 'https://support.google.com/accounts/answer/6294825?hl=en',
    summary: 'Google’s account recovery guidance covers regaining access and reviewing account security after suspected compromise.',
    requirements: [
      'Use a familiar device, browser, and location where possible during ownership recovery.',
      'After recovery, review recent security events, signed-in devices, and account recovery information.',
      'For a work or school account, contact the organization’s administrator.',
    ],
    steps: [
      'Start recovery from Google’s official account recovery page using a familiar device and location.',
      'After access is restored, change the password, review recent security activity and devices, and remove unfamiliar recovery methods.',
      'Review connected apps and forwarding settings; contact a work or school administrator for managed accounts.',
    ],
    region: 'Global account recovery; organization-managed accounts use administrator support.',
    checkedAt: '2026-10-22',
    accessNote: 'Recovery depends on Google’s ownership checks. This application cannot restore or verify account access.',
  },
  {
    id: 'microsoft-recovery',
    label: 'Microsoft Account · Recovery',
    service: 'Microsoft Account',
    title: 'Recover a personal Microsoft Account',
    issues: ['breach', 'phishing'],
    action: 'recover',
    url: 'https://support.microsoft.com/en-us/accounts-billing/manage/help-with-the-microsoft-account-recovery-form',
    summary: 'Microsoft’s account recovery guidance describes the recovery form for personal Microsoft accounts.',
    requirements: [
      'Provide a reachable contact email and ownership history requested by Microsoft; a familiar device may help.',
      'The form cannot recover an account with two-step verification enabled when no alternate verification method is available.',
      'This route is for personal accounts; work or school accounts require administrator support.',
    ],
    steps: [
      'Use Microsoft’s official account recovery form and a reachable contact email.',
      'Complete the ownership questions using information you can verify, preferably from a familiar device.',
      'If access is restored, change the password, review security information and active sessions, and remove unfamiliar recovery methods.',
    ],
    region: 'Personal Microsoft accounts; work and school accounts use administrator support.',
    checkedAt: '2026-10-22',
    accessNote: 'Microsoft’s recovery limits apply, including the two-step verification limitation. This application cannot restore or verify account access.',
  },
];

const ISSUE_IDS = new Set(['deepfake', 'impersonation', 'phishing', 'breach']);
const DISCLOSURE_KEYS = new Set(REPORT_FIELDS.map(field => field.key));
const TYPE_LABELS = new Map(TYPES.map(type => [type.id, type.label]));
const CONTROL_CHARS = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f\u2028\u2029\u200b-\u200f\u202a-\u202e\u2060-\u206f\ufeff]/g;

export function findReportingRoutes(issue = 'all') {
  if (issue === 'all') return [...REPORTING_ROUTES];
  if (!ISSUE_IDS.has(issue)) throw new TypeError(`Unknown reporting issue: ${String(issue)}`);
  return REPORTING_ROUTES.filter(route => route.issues.includes(issue));
}

export function getReportingRoute(id) {
  return REPORTING_ROUTES.find(route => route.id === id);
}

function validateDisclosure(disclosure) {
  if (disclosure === undefined) return Object.create(null);
  if (!disclosure || typeof disclosure !== 'object' || Array.isArray(disclosure)) {
    throw new TypeError('Disclosure options must be an object of boolean choices.');
  }
  const selected = Object.create(null);
  for (const [key, value] of Object.entries(disclosure)) {
    if (!DISCLOSURE_KEYS.has(key)) throw new TypeError(`Unknown disclosure option: ${key}`);
    if (typeof value !== 'boolean') throw new TypeError(`Disclosure option ${key} must be boolean.`);
    selected[key] = value;
  }
  return selected;
}

function addUserValue(lines, label, value) {
  lines.push(`${label} (user-provided):`);
  const escaped = String(value).replace(CONTROL_CHARS, char => `\\u{${char.codePointAt(0).toString(16)}}`);
  const logicalLines = escaped.replace(/\r\n?/g, '\n').split('\n');
  for (const line of logicalLines) lines.push(`  | ${line}`);
}

export function buildReportingPacket(incidentCase, routeId, disclosure = {}) {
  validateWorkspace({ version: 1, cases: [incidentCase] });
  const route = getReportingRoute(routeId);
  if (!route) throw new TypeError(`Unknown reporting route: ${String(routeId)}`);
  if (!route.issues.includes(incidentCase.type)) {
    throw new TypeError(`Reporting route ${route.id} does not apply to case type ${incidentCase.type}.`);
  }
  const selected = validateDisclosure(disclosure);
  const lines = [
    'usualCyberSec incident reporting packet',
    'Preparation only. Nothing is submitted or uploaded by this tool.',
    'This packet does not determine that a crime, policy violation, or synthetic-media claim is true.',
    '',
    `Incident category: ${TYPE_LABELS.get(incidentCase.type)}`,
    `Case status: ${incidentCase.status}`,
    `Locally recorded created time: ${incidentCase.createdAt}`,
    `Locally recorded updated time: ${incidentCase.updatedAt}`,
    '',
    `Selected service: ${route.service}`,
    `Selected route: ${route.title}`,
    `Official route URL: ${route.url}`,
    `Applicable issue categories: ${route.issues.join(', ')}`,
    `Route action: ${route.action}`,
    `Region: ${route.region}`,
    `Source checked: ${route.checkedAt}`,
    `Route summary: ${route.summary}`,
    '',
    'Requirements to review:',
    ...route.requirements.map(requirement => `- ${requirement}`),
    '',
    'Suggested steps:',
    ...route.steps.map(step => `- ${step}`),
    '',
    `Access and limitation note: ${route.accessNote}`,
  ];

  if (selected.title) {
    lines.push('');
    addUserValue(lines, 'Case title', incidentCase.title);
  }
  if (selected.summary) {
    lines.push('');
    addUserValue(lines, 'Case summary', incidentCase.summary);
  }
  if (selected.sourceUrls) {
    lines.push('', 'Source and acquisition URLs (user-provided):');
    const urls = [incidentCase.sourceUrl, ...incidentCase.evidence.map(record => record.sourceUrl)].filter(Boolean);
    if (urls.length) urls.forEach((url, index) => addUserValue(lines, `URL ${index + 1}`, url));
    else lines.push('  | None recorded.');
  }
  if (selected.fingerprints) {
    lines.push('', 'Evidence SHA-256 fingerprints (recorded values; not authenticity proofs):');
    if (incidentCase.evidence.length) incidentCase.evidence.forEach((record, index) => addUserValue(lines, `Fingerprint ${index + 1}`, record.sha256));
    else lines.push('  | None recorded.');
  }
  if (selected.filenames) {
    lines.push('', 'Evidence filenames (user-provided):');
    if (incidentCase.evidence.length) incidentCase.evidence.forEach((record, index) => addUserValue(lines, `Filename ${index + 1}`, record.name));
    else lines.push('  | None recorded.');
  }
  if (selected.notes) {
    lines.push('', 'Evidence acquisition notes (user-provided):');
    if (incidentCase.evidence.length) incidentCase.evidence.forEach((record, index) => addUserValue(lines, `Evidence notes ${index + 1}`, record.notes));
    else lines.push('  | None recorded.');
  }

  lines.push('', 'Review this packet and submit information yourself through the selected service’s official process. usualCyberSec does not submit this packet.', '');
  return lines.join('\n');
}
