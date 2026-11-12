import { useState } from 'react';
import { places } from '../../content/v2';

/**
 * RouteMap — the four places as stops on one line, in the hero. Hovering a
 * stop shows that scene's thumbnail; clicking scrolls to its section. The
 * thumbnails (public/scenes/<place>/thumb.jpg, ~13 KB each) load on first
 * hover. On the phone the thumbnails are off and the stops sit closer.
 *
 * Step 38, 2026-11-12: the big label is the country (same names as the
 * section headings and the scenes, so the Golden Gate under "Seattle" stops
 * looking wrong), the small line is "city · years". The phone keeps years
 * only; the sentence above the map already names the cities.
 */
const W = 1040;
const H = 150;
const XS = [0.125, 0.375, 0.625, 0.875];
const Y = 96;

function path() {
  // one gentle wave through the four stops
  const pts = XS.map((f) => f * W);
  let d = `M ${pts[0]} ${Y}`;
  for (let i = 1; i < pts.length; i += 1) {
    const x0 = pts[i - 1];
    const x1 = pts[i];
    const c = (x1 - x0) / 2;
    d += ` C ${x0 + c} ${Y - 56}, ${x1 - c} ${Y - 56}, ${x1} ${Y}`;
  }
  return d;
}

export default function RouteMap() {
  const [hot, setHot] = useState(new Set());
  const warm = (id) => setHot((s) => (s.has(id) ? s : new Set(s).add(id)));
  const jump = (e, id) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', `#${id}`);
  };

  return (
    <nav className="v2-route" aria-label="The route">
      <span className="v2-route__title" aria-hidden="true">The route</span>
      <svg className="v2-route__line" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
        <path d={path()} fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="4 5" />
      </svg>
      <ol className="v2-route__stops">
        {places.map((p, i) => (
          <li key={p.id} className="v2-route__stop" style={{ left: `${XS[i] * 100}%` }}>
            <a
              href={`#${p.id}`}
              onClick={(e) => jump(e, p.id)}
              onMouseEnter={() => warm(p.id)}
              onFocus={() => warm(p.id)}
            >
              <span
                className="v2-route__thumb"
                aria-hidden="true"
                style={hot.has(p.id) ? { backgroundImage: `url(${import.meta.env.BASE_URL}scenes/${p.id}/thumb.jpg)` } : undefined}
              />
              <span className="v2-route__dot" aria-hidden="true" />
              <span className="v2-route__name">{p.label}</span>
              <span className="v2-route__years">
                {p.city !== p.label && <span className="v2-route__city">{p.city} · </span>}
                {p.years}
              </span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
