import { useRef } from 'react';
import { hero, heroCards, links } from '../../content/v2';
import RouteMap from './RouteMap';
import usePendulum from './usePendulum';

export default function Hero() {
  const hangRef = useRef(null);
  const swingRef = useRef(null);
  usePendulum(hangRef, swingRef);
  return (
    <header className="v2-wrap v2-hero pt-12 pb-8 md:pt-16 md:pb-10">
      {/* no portrait here for now: with the same photo in About it read as a
          repeat (2026-11-10). The About block is due a rethink; see the plan. */}
      <p className="v2-eyebrow">{hero.name}</p>
      <h1 className="v2-h1 mt-4">{hero.headline}</h1>
      {/* hangs from two threads; a real pendulum, pushed by the pointer (usePendulum) */}
      <p ref={hangRef} className="v2-sub v2-hang mt-5">
        <span ref={swingRef} className="v2-hang__swing">{hero.subline}</span>
      </p>
      {/* the person, not the job: one line, small, under the hanging sub-line */}
      <p className="v2-person mt-4">{hero.person}</p>
      {/* where things stand and what the next role should be; was the first About paragraph */}
      <p className="v2-now mt-3">{hero.now}</p>
      {/* the ask: its own line, in the accent, so it is the one thing on the screen in colour */}
      <p className="v2-ask mt-3">
        {hero.looking} <a href={`mailto:${links.email}`}>{hero.lookingCta}</a>{hero.lookingTail}
      </p>

      {/* the route: four stops, one line (RouteMap) */}
      <RouteMap />

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
