import Reveal from './Reveal';
import { reading } from '../../content/v2';

/**
 * Reading (step 33, 2026-11-11): a band between Open questions and End. The
 * sources behind the hero quiz's "what the research says" lines, each with the
 * owner's own take. Each item has an id so the quiz can link to it.
 */
export default function Reading() {
  return (
    <Reveal as="section" id="reading" className="v2-reading-band border-t border-rule">
      <div className="v2-wrap">
        <p className="v2-eyebrow">{reading.eyebrow}</p>
        <ul className="v2-reading">
          {reading.items.map((it) => (
            <li key={it.id} id={it.id}>
              <p className="v2-reading__title">
                <a className="v2-reading__link" href={it.href}>{it.title}</a>
                <span className="v2-reading__who"> {it.who}</span>
              </p>
              <p className="v2-reading__what">{it.what}</p>
              <p className="v2-reading__take"><span className="v2-reading__k">My take</span> {it.take}</p>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}
