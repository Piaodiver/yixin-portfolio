import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const LINKS = [
  { label: 'Enterprise', id: 'enterprise' },
  { label: '0→1',        id: 'ventures' },
  { label: 'Built',      id: 'built' },
  { label: 'Journey',    id: 'journey' },
  { label: 'Beliefs',    id: 'beliefs' },
];

export default function Nav() {
  const { pathname } = useLocation();
  const [solid, setSolid] = useState(false);
  const onHome = pathname === '/';
  const href = (id) => (onHome ? `#${id}` : `/#/#${id}`);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-300 ${
        solid ? 'border-b border-ink-50 bg-paper/85 backdrop-blur-sm' : 'border-b border-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-[68rem] items-center justify-between gap-6 px-5 py-3.5 sm:px-8">
        <Link to="/" className="shrink-0 font-display text-[1.05rem] font-semibold tracking-tight text-ink-900">
          Yixin Liu
        </Link>

        <ul className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <li key={l.id}>
              <a href={href(l.id)} className="u-label text-ink-500 transition-colors hover:text-wash-ochre-ink">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href={href('contact')}
          className="u-label shrink-0 rounded-[2px] border border-ink-300 px-3 py-1.5 text-ink-700 transition-colors hover:border-wash-ochre hover:text-wash-ochre-ink"
        >
          Get in touch
        </a>
      </nav>

      {/*
        Below md the links would otherwise disappear entirely, leaving a
        10,000px scroll with no way to jump. A scrolling rail beats a
        hamburger here: no JS, no overlay, and the section names stay visible.
      */}
      <ul
        className={`flex snap-x gap-5 overflow-x-auto px-5 pb-2.5 md:hidden ${solid ? '' : 'pt-0.5'}`}
        style={{ scrollbarWidth: 'none' }}
      >
        {LINKS.map((l) => (
          <li key={l.id} className="shrink-0 snap-start">
            <a href={href(l.id)} className="u-label text-ink-400 transition-colors active:text-wash-ochre-ink">
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </header>
  );
}
