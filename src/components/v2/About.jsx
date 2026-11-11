import Reveal from './Reveal';
import { about } from '../../content/v2';
import { Inline } from './Place';

/**
 * About — a small portrait beside the one paragraph the reader has not
 * read yet (outside work). Step 28, 2026-11-11: the route paragraph and the
 * 280px photo are archived under the git tag about-v1-route-280px.
 *
 * Desktop: two columns, the photo in a fixed 160px column at its own 4:5
 * ratio (the file is 720x900, nothing is cropped), about the height of one
 * paragraph at 64ch. Phone: the photo above the text, 160px wide.
 */
export default function About() {
  return (
    <Reveal as="section" id="about" className="v2-about border-t border-rule">
      <div className="v2-wrap"><p className="v2-eyebrow v2-about__eyebrow">Outside work</p></div>
      <div className="v2-about__inner">
        <img
          className="v2-about__photo"
          src={`${import.meta.env.BASE_URL}yixin.jpg`}
          width="720"
          height="900"
          alt="Yixin Liu"
          loading="lazy"
        />
        <div className="v2-prose v2-about__text">
          {about.map((t) => <p key={t}><Inline text={t} /></p>)}
        </div>
      </div>
    </Reveal>
  );
}
