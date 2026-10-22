import {StrictMode, useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';
import fixtures from '../fixtures/c2pa/fixtures.json';
import {inspectContentCredentials} from '../../src/lib/c2pa-client';
import {createController} from '../../src/lib/controller.mjs';
import {ContentCredentials} from '../../src/components/ProvenanceInspector';

type Fixture = {file:string;url:string;bytes:number;sha256:string;mediaType:string;base64:string};
type ProbeRow = {file:string;bytes:number;sha256:string;outcome:string;state:string;codes:string[];error:string;result:string};

const controller = createController({inspectCredentials:inspectContentCredentials});
const sampleFixtures = fixtures as Fixture[];

function App() {
  const [state, setState] = useState(controller.getSnapshot());
  const [rows, setRows] = useState<ProbeRow[]>([]);
  const [running, setRunning] = useState(false);
  const [cspViolations, setCspViolations] = useState<string[]>([]);

  useEffect(() => controller.subscribe(() => setState(controller.getSnapshot())), []);
  useEffect(() => {
    const onViolation = (event: SecurityPolicyViolationEvent) => {
      setCspViolations(current => [...current, JSON.stringify({
        effectiveDirective:event.effectiveDirective,
        violatedDirective:event.violatedDirective,
        blockedURI:event.blockedURI,
        sourceFile:event.sourceFile,
        lineNumber:event.lineNumber,
        disposition:event.disposition,
      })]);
    };
    window.addEventListener('securitypolicyviolation', onViolation);
    return () => window.removeEventListener('securitypolicyviolation', onViolation);
  }, []);

  async function inspectFixture(fixture: Fixture) {
    const binary = atob(fixture.base64);
    const bytes = Uint8Array.from(binary, character => character.charCodeAt(0));
    controller.selectFile(new File([bytes], fixture.file, {type:fixture.mediaType}));
    return controller.run(controller.inspectCredentials);
  }

  async function runFixtures() {
    setRunning(true);
    setRows([]);
    const completed: ProbeRow[] = [];
    try {
      for (const fixture of sampleFixtures) {
        let error = '';
        try {
          await inspectFixture(fixture);
        } catch (caught) {
          const failure = caught instanceof Error ? caught : new Error(String(caught));
          error = failure.stack || failure.message;
        }
        const snapshot = controller.getSnapshot();
        const credentials = snapshot.credentials;
        const codes = credentials?.statuses.map(status => status.code) || [];
        const row: ProbeRow = {
          file:fixture.file,
          bytes:fixture.bytes,
          sha256:fixture.sha256,
          outcome:error ? 'error' : credentials ? 'returned' : 'no-result',
          state:credentials?.validationState || 'unavailable',
          codes,
          error,
          result:JSON.stringify(credentials, null, 2),
        };
        completed.push(row);
        setRows([...completed]);
      }
    } finally {
      setRunning(false);
    }
  }

  return <main>
    <h1>usualCyberSec C2PA browser probe</h1>
    <p><strong>Isolated QA using public C2PA test samples.</strong> These fixtures are test data; this probe makes no authenticity claim about real-world content.</p>
    <p>The harness imports the production inspector, controller, and Content Credentials component. Fixture bytes are bundled locally; the browser makes no fixture fetch.</p>
    <button type="button" disabled={running || state.busy} onClick={() => void runFixtures()}>
      {running ? 'Running public C2PA fixtures…' : 'Run public C2PA fixtures'}
    </button>
    <p role="status">{running ? 'Inspection running sequentially.' : rows.length ? `Completed ${rows.length} of ${sampleFixtures.length} fixtures.` : 'Not run.'}</p>
    <section aria-labelledby="results-heading">
      <h2 id="results-heading">Actual SDK and controller results</h2>
      <table>
        <thead><tr><th>Fixture</th><th>Bytes</th><th>Outcome</th><th>SDK validation state</th><th>Raw status codes</th></tr></thead>
        <tbody>{rows.map(row => <tr key={row.file}>
          <td>{row.file}<button disabled={running||state.busy} onClick={()=>void inspectFixture(sampleFixtures.find(fixture=>fixture.file===row.file)!).catch(()=>{})}>Inspect {row.file}</button></td><td>{row.bytes}</td><td>{row.outcome}</td><td>{row.state}</td><td><code>{JSON.stringify(row.codes)}</code></td>
        </tr>)}</tbody>
      </table>
      {rows.map(row => <details key={row.file} open={Boolean(row.error)}>
        <summary>{row.file}: full result and error</summary>
        <p>SHA-256: <code>{row.sha256}</code></p>
        <h3>Normalized controller result</h3>
        <pre>{row.result || '(none returned)'}</pre>
        <h3>Full error</h3>
        <pre>{row.error || '(none)'}</pre>
      </details>)}
    </section>
    <section aria-labelledby="csp-heading">
      <h2 id="csp-heading">CSP violations observed by this page</h2>
      <p>{cspViolations.length ? `${cspViolations.length} violation(s)` : 'None observed so far.'}</p>
      <pre>{cspViolations.join('\n') || '(none)'}</pre>
    </section>
    <section aria-labelledby="production-render-heading">
      <h2 id="production-render-heading">Production component rendering</h2>
      <p>Uses the selected last fixture and the production ContentCredentials component below.</p>
      {state.error&&<p role="alert">{state.error}</p>}
      <ContentCredentials state={state} controller={controller}/>
    </section>
  </main>;
}

createRoot(document.getElementById('root')!).render(<StrictMode><App/></StrictMode>);
