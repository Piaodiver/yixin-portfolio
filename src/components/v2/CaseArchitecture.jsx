import { Para } from './Place';
import DecisionQuiz from './DecisionQuiz';
import ArchGraph from './ArchGraph';

/**
 * The architecture half of a case: a small eyebrow, a monospace diagram,
 * prose, then the decisions as a choose-then-reveal quiz (DecisionQuiz).
 * With `graph` (step 40) the diagram is clickable boxes instead of the
 * monospace block.
 */
export default function CaseArchitecture({ arch, graph }) {
  if (!arch) return null;
  return (
    <div className="mt-10">
      {graph ? (
        <ArchGraph graph={graph} eyebrow={arch.eyebrow} />
      ) : (
        <>
          <p className="v2-eyebrow pt-2">{arch.eyebrow}</p>
          <pre className="v2-diagram" aria-label="Architecture diagram">{arch.diagram.join('\n')}</pre>
        </>
      )}
      <div className="v2-prose mt-6">
        {arch.paragraphs.map((p, i) => <Para key={i} text={p} />)}
      </div>
      <DecisionQuiz arch={arch} />
    </div>
  );
}
