import SceneBand from './SceneBand';

/** A place section: scene band, then prose. `place` must match SceneBand's set. */
export default function Place({ place, id = place, title, children }) {
  return (
    <section id={id} className="scroll-mt-6">
      <SceneBand place={place} />
      <div className="v2-wrap py-12 md:py-16">
        {title ? <h2 className="v2-h2">{title}</h2> : null}
        {children}
      </div>
    </section>
  );
}

/** Small case heading: client, platform, year. */
export function CaseHead({ item }) {
  return (
    <h3 id={item.id} className="v2-eyebrow scroll-mt-6 pt-2">
      {item.client}
      <span className="text-ink-300"> · </span>
      {item.platform}
      <span className="text-ink-300"> · </span>
      {item.year}
    </h3>
  );
}

export function Prose({ paragraphs }) {
  return (
    <div className="v2-prose mt-4">
      {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
    </div>
  );
}
