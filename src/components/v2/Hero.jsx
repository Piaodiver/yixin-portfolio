import { hero, heroCards, links } from '../../content/v2';

export default function Hero() {
  return (
    <header className="v2-wrap v2-hero pt-12 pb-8 md:pt-16 md:pb-10">
      {/* the portrait: beside the column on wide screens, a small one by the
          name below that (.v2-hero__photo in v2.css). The face is in the first
          screen either way. */}
      <img
        className="v2-hero__photo"
        src={`${import.meta.env.BASE_URL}yixin.jpg`}
        width="720"
        height="900"
        alt="Yixin Liu"
        fetchPriority="high"
      />
      <p className="v2-eyebrow v2-hero__name">{hero.name}</p>
      <h1 className="v2-h1 mt-4">{hero.headline}</h1>
      {/* hangs from two threads; CSS sway is a stand-in for the pendulum physics */}
      <p className="v2-sub v2-hang mt-5">
        <span className="v2-hang__swing">{hero.subline}</span>
      </p>
      {/* the person, not the job: one line, small, under the hanging sub-line */}
      <p className="v2-person mt-4">{hero.person}</p>
      {/* where things stand and what the next role should be; was the first About paragraph */}
      <p className="v2-now mt-3">{hero.now}</p>
      {/* the ask: its own line, in the accent, so it is the one thing on the screen in colour */}
      <p className="v2-ask mt-3">
        {hero.looking} <a href={`mailto:${links.email}`}>{hero.lookingCta}</a>{hero.lookingTail}
      </p>

      {/* three cards: a row on desktop, a swipeable row on the phone (.v2-cards) */}
      <ul className="v2-cards mt-8">
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
