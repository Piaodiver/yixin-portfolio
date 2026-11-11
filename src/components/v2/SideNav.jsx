import { useEffect, useState } from 'react';
import { places } from '../../content/v2';

// Two lines per entry on the desktop column: the place, and under it the
// names a recruiter scans for. The phone row shows the place only.
const NAV_SUBS = { china: 'LGMG · SAP', israel: 'TAU · MBA', singapore: 'Salesforce · Wiz.AI', 'united-states': 'Building now' };
const ITEMS = [
  ...places.map((p) => ({ id: p.id, label: p.label, sub: NAV_SUBS[p.id] })),
  { id: 'about', label: 'About', sub: 'Outside work' },
];

// 0, .05, .1 … 1: fine enough steps that the visible-height ranking below
// updates as sections slide through the viewport.
const THRESHOLDS = Array.from({ length: 21 }, (_, i) => i / 20);

/**
 * Section nav: a fixed column at the right edge on wide viewports, a sticky
 * horizontal row at the top otherwise (see .v2-nav in v2.css). The active
 * label is the section with the most visible height, tracked with one
 * IntersectionObserver. A hairline under the column fills with the accent as
 * the reader moves down the page (one passive scroll listener, rAF-batched).
 */
export default function SideNav() {
  const [active, setActive] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;
    const visible = new Map(); // id -> visible px height
    const pick = () => {
      let best = null;
      let bestH = 0;
      for (const [id, h] of visible) {
        if (h > bestH) { best = id; bestH = h; }
      }
      setActive(best);
    };
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        visible.set(e.target.id, e.isIntersecting ? e.intersectionRect.height : 0);
      }
      pick();
    }, { threshold: THRESHOLDS });

    for (const { id } of ITEMS) {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(measure); };
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const toTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (window.location.hash) history.replaceState(null, '', window.location.pathname + window.location.search);
  };

  return (
    <nav className="v2-nav" aria-label="Sections">
      <a href="#" className="v2-nav__home" onClick={toTop}>Yixin Liu</a>
      {ITEMS.map(({ id, label, sub }) => (
        <a key={id} href={`#${id}`} aria-current={active === id ? 'true' : undefined}>
          <span className="v2-nav__label">{label}</span>
          <span className="v2-nav__sub">{sub}</span>
        </a>
      ))}
      <span className="v2-nav__progress" aria-hidden="true">
        <i style={{ transform: `scaleX(${progress})` }} />
      </span>
    </nav>
  );
}
