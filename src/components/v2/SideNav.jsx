import { useEffect, useState } from 'react';

const ITEMS = [
  { id: 'china', label: 'China' },
  { id: 'israel', label: 'Israel' },
  { id: 'singapore', label: 'Singapore' },
  { id: 'united-states', label: 'United States' },
  { id: 'about', label: 'About' },
];

// 0, .05, .1 … 1: fine enough steps that the visible-height ranking below
// updates as sections slide through the viewport.
const THRESHOLDS = Array.from({ length: 21 }, (_, i) => i / 20);

/**
 * Section nav: a fixed column at the right edge on wide viewports, a sticky
 * horizontal row at the top otherwise (see .v2-nav in v2.css). The active
 * label is the section with the most visible height, tracked with one
 * IntersectionObserver; no scroll listeners.
 */
export default function SideNav() {
  const [active, setActive] = useState(null);

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

  return (
    <nav className="v2-nav" aria-label="Sections">
      {ITEMS.map(({ id, label }) => (
        <a key={id} href={`#${id}`} aria-current={active === id ? 'true' : undefined}>
          {label}
        </a>
      ))}
    </nav>
  );
}
