import Reveal from './Reveal';
import { about } from '../../content/v2';

/**
 * About — the portrait beside the route and the outside-work paragraphs.
 * The first paragraph (where things stand) lives in the hero now.
 *
 * Desktop: two columns, the photo in a fixed 280px column at its own 4:5
 * ratio (the file is 720x900, so nothing is cropped), which comes to about
 * the height of the three paragraphs at 64ch. Measuring the text and sizing
 * the photo from it was tried and feeds back on itself: the photo's width
 * sets the text column's width, which sets the text height. Phone: the photo
 * above the text, at most 280px wide.
 */
export default function About() {
  return (
    <Reveal as="section" id="about" className="v2-about border-t border-rule">
      <p className="v2-eyebrow v2-about__eyebrow">More about me</p>
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
          {about.map((t) => <p key={t}>{t}</p>)}
        </div>
      </div>
    </Reveal>
  );
}
