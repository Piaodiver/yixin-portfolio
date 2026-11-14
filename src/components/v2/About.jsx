import Reveal from './Reveal';
import { about } from '../../content/v2';
import { Inline } from './Place';

/**
 * About — the one paragraph the reader has not read yet (outside work).
 * Step 28, 2026-11-11: the route paragraph and the 280px photo are archived
 * under the git tag about-v1-route-280px. 2026-11-13: the 160px portrait that
 * hung in the left margin is gone too; the same photo now opens the hero.
 */
export default function About() {
  return (
    <Reveal as="section" id="about" className="v2-about border-t border-rule">
      <div className="v2-wrap"><p className="v2-eyebrow v2-about__eyebrow">Outside work</p></div>
      <div className="v2-wrap v2-prose">
        {about.map((t) => <p key={t}><Inline text={t} /></p>)}
      </div>
    </Reveal>
  );
}
