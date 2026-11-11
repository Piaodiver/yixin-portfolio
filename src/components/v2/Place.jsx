import SceneBand from './SceneBand';
import Reveal from './Reveal';

/**
 * A place section: a heading (the place, and one small line of city, employers
 * and years), the scene band, then prose. Every place gets the same heading
 * so the four sections read at one level. `place` must match SceneBand's set.
 */
export default function Place({ place, id = place, title, sub, children }) {
  return (
    <section id={id} className="pt-10 md:pt-14">
      <Reveal className="v2-wrap pb-5">
        <h2 className="v2-h2">
          {title}
          {sub ? <small className="v2-h2__sub">{sub}</small> : null}
        </h2>
      </Reveal>
      <SceneBand place={place} />
      <Reveal className="v2-wrap py-10 md:py-12">
        {children}
      </Reveal>
    </section>
  );
}

/** Small case heading: client, platform, year. */
export function CaseHead({ item }) {
  return (
    <h3 id={item.id} className="v2-eyebrow pt-2">
      {item.client}
      <span className="text-ink-300"> · </span>
      {item.platform}
      <span className="text-ink-300"> · </span>
      {item.year}
    </h3>
  );
}

const LINK = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;

/** Paragraph text with [text](url) links; everything else is plain text. */
export function Inline({ text }) {
  const out = [];
  let last = 0;
  for (const m of text.matchAll(LINK)) {
    if (m.index > last) out.push(text.slice(last, m.index));
    out.push(<a key={m.index} href={m[2]} target="_blank" rel="noreferrer">{m[1]}</a>);
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function Prose({ paragraphs }) {
  return (
    <div className="v2-prose mt-4">
      {paragraphs.map((p, i) => <p key={i}><Inline text={p} /></p>)}
    </div>
  );
}
