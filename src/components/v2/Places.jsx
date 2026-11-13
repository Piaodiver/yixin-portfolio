import { useEffect, useState } from 'react';
import Reveal from './Reveal';
import SceneBand from './SceneBand';
import { places, fourPlaces } from '../../content/v2';
import { stopsHint, chapterClose } from '../../content/places-chapters';
import '../../styles/places.css';

/**
 * Places — "Four places", one door per picture (step 41, 2026-11-12; the
 * step-39 version with two doors, picture → full screen and chevron → fold,
 * is at commit 47c7da1). The four posters side by side; clicking one opens
 * that place's chapter under the row: the live scene band first (SceneBand,
 * which still opens full screen on click or Expand), then the story. The
 * title under the picture is the same door's handle. One chapter open at a
 * time; on wide screens it spans the row (CSS order + grid-column), on the
 * phone it opens under its own picture, where the band takes the picture's
 * place.
 *
 * Hash routing: #china opens nothing; #china-full, or the id of anything
 * inside a chapter (#lgmg from the hero cards), opens that chapter first and
 * then scrolls to the target.
 */
export default function Places({ stops }) {
  const [open, setOpen] = useState(null); // place id, or null

  // one open at a time; opening brings the band to the top of the view,
  // closing brings the picture back to the middle
  const toggle = (id) => {
    const next = open === id ? null : id;
    setOpen(next);
    history.replaceState(null, '', next ? `#${id}-full` : `#${id}`);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (next) document.getElementById(`${id}-panel`)?.scrollIntoView({ block: 'start', behavior: 'smooth' });
      else document.getElementById(`${id}-frame`)?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }));
  };

  // open the right chapter for a hash, on load and on hash change
  useEffect(() => {
    const follow = () => {
      const hash = window.location.hash.slice(1);
      if (!hash) return;
      for (const s of stops) {
        if (hash === `${s.id}-full` || s.inside?.includes(hash)) {
          setOpen(s.id);
          requestAnimationFrame(() => requestAnimationFrame(() => {
            document.getElementById(hash === `${s.id}-full` ? `${s.id}-panel` : hash)?.scrollIntoView({ block: 'start' });
          }));
          return;
        }
      }
    };
    follow();
    window.addEventListener('hashchange', follow);
    return () => window.removeEventListener('hashchange', follow);
  }, [stops]);

  return (
    <section id="places" className="pt-10 md:pt-14">
      <Reveal className="v2-wrap pb-5">
        <h2 className="v2-h2">{fourPlaces.title}</h2>
      </Reveal>
      <div className="v2-stops">
        {places.map((p) => {
          const stop = stops.find((s) => s.id === p.id);
          const on = open === p.id;
          const title = fourPlaces.folds[p.id] ?? fourPlaces.singaporeUp.label;
          return (
            <div key={p.id} id={p.id} className="v2-stop" data-open={on || undefined}>
              <button
                type="button"
                id={`${p.id}-frame`}
                className="v2-stop__frame"
                aria-expanded={on}
                aria-controls={`${p.id}-panel`}
                aria-label={on ? `Close ${p.label}` : `Open ${p.label}`}
                onClick={() => toggle(p.id)}
              >
                <img
                  src={`${import.meta.env.BASE_URL}scenes/${p.id}/poster.jpg`}
                  alt=""
                  width="2076"
                  height={p.id === 'china' ? 1244 : 1166}
                  loading="lazy"
                  decoding="async"
                />
                <span className="v2-stop__label" aria-hidden="true">{p.label}</span>
                <span className="v2-stop__expand" aria-hidden="true">{on ? 'Close ↑' : 'Open ↓'}</span>
              </button>
              <div className="v2-stop__text">
                <p className="v2-eyebrow">{p.sub}</p>
                <button
                  type="button"
                  id={`${p.id}-toggle`}
                  className="v2-stop__title"
                  aria-expanded={on}
                  aria-controls={`${p.id}-panel`}
                  onClick={() => toggle(p.id)}
                >
                  {title}
                </button>
              </div>
              <div id={`${p.id}-panel`} className="v2-fold v2-stop__panel" data-open={on ? 'true' : undefined}>
                <div>
                  <div className="v2-fold__inner">
                    <div className="v2-chapter__band">
                      {on ? <SceneBand place={p.id} /> : null}
                    </div>
                    <div className="v2-prose-wrap mt-8">
                      {stop?.children}
                      {on && (
                        <button type="button" className="v2-fold__toggle v2-chapter__close" onClick={() => toggle(p.id)}>
                          <span className="v2-fold__chev" data-up aria-hidden="true" />
                          {chapterClose(p.label)}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <p className="v2-stops__hint" aria-hidden="true">{stopsHint}</p>
      </div>
    </section>
  );
}
