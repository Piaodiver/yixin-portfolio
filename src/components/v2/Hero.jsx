import { useState } from 'react';
import { hero, heroCards, links } from '../../content/v2';
import RouteMap from './RouteMap';
import { Beacon, QuizPanel } from './HeroQuiz';

/**
 * Hero — 2026-11-13, an About-style opening. A hiring team could not tell in
 * five seconds what Yixin does when the thesis was the headline, so the name
 * is the heading now and three short paragraphs follow: who, what, what I
 * want. The portrait (public/portrait-2026-11.jpg, the flower photo) hangs in the
 * left margin like an author's picture, 96px, above the name on the phone.
 *
 * The thesis did not go away: it is the line above the three cards, and the
 * three-question quiz (step 33) still hangs from its last word. The cards
 * step back while the quiz is open (data-dim).
 */
export default function Hero() {
  const [quizOpen, setQuizOpen] = useState(false);
  return (
    <header className="v2-wrap v2-hero pt-12 pb-8 md:pt-16 md:pb-10" data-focus={quizOpen ? 'true' : undefined}>
      <div className="v2-hero__grid">
        <img
          className="v2-hero__photo"
          src={`${import.meta.env.BASE_URL}portrait-2026-11.jpg`}
          width="480"
          height="480"
          alt=""
          fetchPriority="high"
        />
        <div className="v2-hero__text">
          <h1 className="v2-hero__name">{hero.name}</h1>
          {/* who: role and years, then the places, both in the body face */}
          <p className="v2-hero__who">
            {hero.who}
            <span className="v2-hero__where">{hero.where}</span>
          </p>
          {/* what: the one serif paragraph on the screen */}
          <p className="v2-hero__what">{hero.what}</p>
          {/* what I want: the ask first, in the accent, then the preferences */}
          <p className="v2-hero__want">
            <strong>{hero.lookingLead}</strong>
            {hero.lookingRest}
            <a href={`mailto:${links.email}`}>{hero.lookingCta}</a>{hero.lookingTail}
          </p>
        </div>
      </div>

      {/* the route: four stops, one line (RouteMap) */}
      <RouteMap />

      {/* the thesis, above the three cards, with the quiz behind the beacon */}
      <div className="v2-kicker">
        <p className="v2-eyebrow v2-kicker__label">{hero.kickerLabel}</p>
        <p className="v2-kicker__line">
          {hero.headlineBefore}<span className="v2-promise">{hero.headlinePromise}</span>
          <span className="whitespace-nowrap"><span className="v2-promise">{hero.headlineLast}</span>{hero.headlineAfter}<Beacon open={quizOpen} onToggle={() => setQuizOpen((o) => !o)} /></span>
        </p>
        <QuizPanel open={quizOpen} onClose={() => setQuizOpen(false)} />
      </div>

      {/* three cards: a row on desktop, a swipeable row on the phone (.v2-cards) */}
      <ul className="v2-cards mt-7" data-dim>
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
