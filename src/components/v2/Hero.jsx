import { hero, heroCards, links } from '../../content/v2';

export default function Hero() {
  return (
    <header className="v2-wrap pt-12 pb-10 md:pt-16 md:pb-12">
      <p className="v2-eyebrow">{hero.name}</p>
      <h1 className="v2-h1 mt-4">{hero.headline}</h1>
      {/* hangs from two threads; CSS sway is a stand-in for the pendulum physics */}
      <p className="v2-sub v2-hang mt-5">
        <span className="v2-hang__swing">{hero.subline}</span>
      </p>
      {/* the person, not the job: one line, small, under the hanging sub-line */}
      <p className="v2-person mt-4">{hero.person}</p>
      {/* the ask: its own line, in the accent, so it is the one thing on the screen in colour */}
      <p className="v2-ask mt-3">
        {hero.looking} <a href={`mailto:${links.email}`}>{hero.lookingCta}</a>{hero.lookingTail}
      </p>

      {/* three cards: a row on desktop, a swipeable row on the phone (.v2-cards) */}
      <ul className="v2-cards mt-10">
        {heroCards.map((c) => (
          <li key={c.id} className="v2-card">
            <a href={`#${c.id}`} className="v2-card-link">
              <span className="v2-eyebrow">{c.name}</span>
              <p className="mt-2 text-[0.92rem] leading-relaxed text-ink-700">{c.card}</p>
              <span className="v2-card-link__read mt-2 inline-block text-[0.85rem]">Read <span aria-hidden="true">↓</span></span>
            </a>
          </li>
        ))}
      </ul>
    </header>
  );
}
