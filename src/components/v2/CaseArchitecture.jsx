import { Para } from './Place';
import DecisionQuiz from './DecisionQuiz';

/**
 * The architecture half of a case: a small eyebrow, a monospace diagram,
 * prose, then the decisions as a choose-then-reveal quiz (DecisionQuiz).
 */
export default function CaseArchitecture({ arch }) {
  if (!arch) return null;
  return (
    <div className="mt-10">
      <p className="v2-eyebrow pt-2">{arch.eyebrow}</p>
      <pre className="v2-diagram" aria-label="Architecture diagram">{arch.diagram.join('\n')}</pre>
      <div className="v2-prose mt-6">
        {arch.paragraphs.map((p, i) => <Para key={i} text={p} />)}
      </div>
      <DecisionQuiz arch={arch} />
    </div>
  );
}
