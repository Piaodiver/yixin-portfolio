import { useEffect, useState } from 'react';

// Two lines per entry on the desktop column: the section, and under it the
// names a recruiter scans for. The phone row shows the first line only.
// Step 39: four sections, The work first; the places are one section.
// Step 36/37 (2026-11-12, scheme D): every small word is a link, and the one
// being read goes dark. That darkening, walking from NOVA down to Reading,
// is the only progress indicator; the hairline under the column is gone.
const ITEMS = [
  { id: 'work', label: 'The work', sub: [
    { id: 'nova', label: 'NOVA', href: '#nova' },
    { id: 'wizai', label: 'Wiz.AI', href: '#wizai' },
  ] },
  { id: 'places', label: 'Four places', sub: [
    { id: 'china', label: 'China', href: '#china-full' },
    { id: 'israel', label: 'Israel', href: '#israel-full' },
    { id: 'singapore', label: 'Singapore', href: '#singapore-full' },
    { id: 'united-states', label: 'United States', href: '#united-states-full' },
  ] },
  { id: 'building', label: 'Building now', sub: [
    { id: 'tco', label: 'TCO', href: '#tco' },
    { id: 'tariff', label: 'Tariff Engine', href: '#tariff' },
    { id: 'multiverse', label: 'MultiVerse I', href: '#multiverse' },
  ] },
  // Questions and Reading are their own sections on the page but belong to
  // About in the column; End counts as About too so the column stays lit
  { id: 'about', label: 'About', observe: ['about', 'questions', 'reading', 'end'], sub: [
    { id: 'about', label: 'Outside work', href: '#about' },
    { id: 'questions', label: 'Questions', href: '#questions' },
    { id: 'reading', label: 'Reading', href: '#reading' },
  ] },
];

// 0, .05, .1 … 1: fine enough steps that the visible-height ranking below
// updates as sections slide through the viewport.
const THRESHOLDS = Array.from({ length: 21 }, (_, i) => i / 20);

// the reading line: a third of the way down the viewport
const READ_LINE = 0.35;

/**
 * Section nav: a fixed column at the right edge on wide viewports, a sticky
 * horizontal row at the top otherwise (see .v2-nav in v2.css). The active
 * section is the one with the most visible height, tracked with one
 * IntersectionObserver. The active small word is the last of the active
 * section's anchors above the reading line (for Four places: the open
 * chapter), measured on scroll, rAF-batched.
 */
export default function SideNav() {
  const [active, setActive] = useState(null);
  const [word, setWord] = useState(null);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;
    const visible = new Map(); // id -> visible px height
    const pick = () => {
      const byItem = new Map(); // nav item id -> summed visible height
      for (const [sid, h] of visible) {
        const id = owner.get(sid);
        byItem.set(id, (byItem.get(id) ?? 0) + h);
      }
      let best = null;
      let bestH = 0;
      for (const [id, h] of byItem) {
        if (h > bestH) { best = id; bestH = h; }
      }
      setActive(best);
    };
    const owner = new Map(); // observed element id -> nav item id
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        visible.set(e.target.id, e.isIntersecting ? e.intersectionRect.height : 0);
      }
      pick();
    }, { threshold: THRESHOLDS });

    for (const { id, observe } of ITEMS) {
      for (const sid of observe ?? [id]) {
        const el = document.getElementById(sid);
        if (el) { owner.set(sid, id); io.observe(el); }
      }
    }
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const item = ITEMS.find((it) => it.id === active);
      if (!item) { setWord(null); return; }
      if (item.id === 'places') {
        setWord(document.querySelector('.v2-stop[data-open]')?.id ?? null);
        return;
      }
      const line = window.innerHeight * READ_LINE;
      let on = null;
      for (const w of item.sub) {
        const el = document.getElementById(w.id);
        if (el && el.getBoundingClientRect().top <= line) on = w.id;
      }
      setWord(on);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(measure); };
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener('hashchange', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('hashchange', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [active]);

  const toTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (window.location.hash) history.replaceState(null, '', window.location.pathname + window.location.search);
  };

  // a chapter link whose hash is already in the URL would not fire
  // hashchange, so Places would not reopen it; clear the hash first
  const toWord = (e, href) => {
    if (window.location.hash === href) {
      e.preventDefault();
      history.replaceState(null, '', window.location.pathname + window.location.search);
      window.location.hash = href;
    }
  };

  return (
    <nav className="v2-nav" aria-label="Sections">
      <a href="#" className="v2-nav__home" onClick={toTop}>Yixin Liu</a>
      {ITEMS.map(({ id, label, sub }) => (
        <div key={id} className="v2-nav__item" data-current={active === id ? 'true' : undefined}>
          <a href={`#${id}`} aria-current={active === id ? 'true' : undefined}>
            <span className="v2-nav__label">{label}</span>
          </a>
          <span className="v2-nav__sub">
            {sub.map((w, i) => (
              <span key={w.id}>
                {i > 0 && <span className="v2-nav__dot" aria-hidden="true"> · </span>}
                <a href={w.href} onClick={(e) => toWord(e, w.href)} data-on={active === id && word === w.id ? 'true' : undefined}>{w.label}</a>
              </span>
            ))}
          </span>
        </div>
      ))}
    </nav>
  );
}
