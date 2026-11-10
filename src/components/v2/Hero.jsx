import { hero, heroCards, links } from '../../content/v2';

export default function Hero() {
  return (
    <header className="v2-wrap pt-16 pb-14 md:pt-28 md:pb-20">
      <p className="v2-eyebrow">{hero.name}</p>
      <h1 className="v2-h1 mt-5">{hero.headline}</h1>
      {/* hangs from two threads; CSS sway is a stand-in for the pendulum physics */}
      <p className="v2-sub v2-hang mt-6">
        <span className="v2-hang__swing">{hero.subline}</span>
      </p>

      <ul className="mt-14 grid gap-6 md:grid-cols-3 md:gap-8">
        {heroCards.map((c) => (
          <li key={c.id} className="border-t border-rule pt-3">
            <a href={`#${c.id}`} className="v2-card-link">
              <span className="v2-eyebrow">{c.name}</span>
              <p className="mt-2 text-[0.92rem] leading-relaxed text-ink-700">{c.card}</p>
            </a>
          </li>
        ))}
      </ul>

      <p className="mt-12 text-[0.92rem]">
        <a className="v2-link" href={links.github}>GitHub</a>
        <span className="mx-3 text-ink-300">/</span>
        <a className="v2-link" href={links.linkedin}>LinkedIn</a>
      </p>
    </header>
  );
}
