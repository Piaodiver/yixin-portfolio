import { Inline } from './Place';

/**
 * The architecture half of a case: a small eyebrow, a monospace diagram,
 * prose, then the decisions as a list of five blocks. A list rather than a
 * table so it reads the same at phone width; each block carries its four
 * labels so a reader can scan one column at a time.
 */
export default function CaseArchitecture({ arch }) {
  if (!arch) return null;
  return (
    <div className="mt-10">
      <p className="v2-eyebrow pt-2">{arch.eyebrow}</p>
      <pre className="v2-diagram" aria-label="Architecture diagram">{arch.diagram.join('\n')}</pre>
      <div className="v2-prose mt-6">
        {arch.paragraphs.map((p, i) => <p key={i}><Inline text={p} /></p>)}
      </div>
      <p className="v2-eyebrow mt-10">{arch.decisionsTitle}</p>
      <ol className="v2-decisions">
        {arch.decisions.map((d, i) => (
          <li key={i}>
            <dl>
              <dt>Constraint</dt><dd>{d.constraint}</dd>
              <dt>Options</dt>
              <dd>
                <ul>{d.options.map((o) => <li key={o}>{o}</li>)}</ul>
              </dd>
              <dt>Chose</dt><dd>{d.chose}</dd>
              <dt>Would change if</dt><dd>{d.change}</dd>
            </dl>
          </li>
        ))}
      </ol>
    </div>
  );
}
