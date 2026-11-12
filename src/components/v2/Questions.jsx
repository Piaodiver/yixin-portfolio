import Reveal from './Reveal';
import { questions } from '../../content/v2';

/**
 * Open questions (C1, 2026-11-11): a band between About and End. Five
 * questions, no answers on purpose, one optional line of provenance each.
 * The month in the eyebrow says the list is meant to change.
 */
export default function Questions() {
  return (
    <Reveal as="section" id="questions" className="v2-questions-band border-t border-rule">
      <div className="v2-wrap">
        <p className="v2-eyebrow">{questions.eyebrow}</p>
        <ul className="v2-questions">
          {questions.items.map((it) => (
            <li key={it.q}>
              <p className="v2-questions__q">{it.q}</p>
              {it.from ? <p className="v2-questions__from">{it.from}</p> : null}
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}
