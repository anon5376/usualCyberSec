import {ActionButton} from './arc/action-button/action-button';

export function ContentCredentials({state,controller}:{state:any;controller:any}) {
  const result=state.credentials;
  const httpsAvailable=typeof location!=='undefined'&&location.protocol==='https:';
  return <section className="section" aria-labelledby="credentials-title">
    <h2 id="credentials-title">Content Credentials</h2>
    <p>Inspect embedded C2PA provenance on this device. Up to 25 MiB; supported media formats depend on the C2PA reader. The first inspection loads about 4.6 MB of inspection software.</p>
    <p className="hint">Credentials describe signed provenance, not whether content is true or AI generated. Missing credentials do not mean a file is fake. No file is uploaded; remote manifests and certificate status lookups are disabled.</p>
    {!httpsAvailable&&<p className="notice">Content Credentials inspection requires HTTPS. Open this app from an HTTPS address to enable inspection.</p>}
    <ActionButton label="Inspect credentials" pendingLabel="Inspecting file" successLabel="Inspection finished" disabled={state.busy||!state.file||!httpsAvailable} onAction={()=>controller.run(controller.inspectCredentials)} onActionError={()=>{}}/>
    {result&&<div className="result" aria-live="polite">
      <h3>{result.kind==='absent'?'No embedded credentials found':'Embedded credentials found'}</h3>
      {result.kind==='present'&&<>
        <p>SDK validation state: <strong>{result.validationState}</strong>. {result.validationState==='Invalid'?'The SDK reports validation failures. This does not establish that the depicted event is false.':result.validationState==='Unknown'?'A conclusive validation state was not returned.':'This describes the SDK’s structural and cryptographic checks, not the truth of the content.'}</p>
        <p>Signer trust: not established against an independently configured trust list. Current certificate revocation status: not checked.</p>
        {result.manifest&&<><h4>Manifest metadata</h4><p className="hint">Metadata is supplied by the credential author and remains untrusted.</p><dl>{[['Title',result.manifest.title],['Format',result.manifest.format],['Certificate issuer',result.manifest.issuer],['Generator',result.manifest.generator]].filter(([,value])=>value).map(([label,value])=><div key={label}><dt>{label}</dt><dd className="machine">{value}</dd></div>)}</dl>{result.manifest.assertionLabels.length>0&&<p className="machine">Assertion labels: {result.manifest.assertionLabels.join(', ')}</p>}</>}
        <details><summary>SDK validation details ({result.statuses.length})</summary>{result.statuses.length?<ul>{result.statuses.map((status:any,index:number)=><li key={index}><code className="machine">{status.code}</code>{status.explanation&&<p>{status.explanation}</p>}<p className="hint machine">{status.scope}</p></li>)}</ul>:<p>No detailed status codes returned. An empty list alone does not establish successful validation.</p>}{result.truncated&&<p>Details were limited for display.</p>}</details>
      </>}
      <p className="hint">Inspection results stay in this tab and are cleared when you choose another file or clear the session.</p>
    </div>}
  </section>;
}
