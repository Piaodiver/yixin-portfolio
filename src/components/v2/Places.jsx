import { useCallback, useEffect, useRef, useState } from 'react';
import Reveal from './Reveal';
import SceneOverlay from './SceneOverlay';
import { places, fourPlaces } from '../../content/v2';

/**
 * Places — "Four places", step 39 (2026-11-12). The four scenes side by side
 * as stops, each with its poster, the "city · employers · years" line and one
 * fold. On wide screens the folds open in one shared row under the stops
 * (CSS order + grid-column), one at a time; on the phone each fold opens
 * under its own stop.
 *
 * The small frames show the poster only. The live scene opens full screen
 * from the frame (SceneOverlay), where it has the room it was drawn for;
 * four live canvases at a quarter width were not worth it. The old full-width
 * bands are archived at git tag places-v1-before-step39.
 *
 * Hash routing: #china opens nothing; #china-full, or the id of anything
 * inside a fold (#lgmg from the hero cards), opens that stop's fold first
 * and then scrolls to the target.
 */
export default function Places({ stops }) {
  const [open, setOpen] = useState(null); // place id, or null
  const [scene, setScene] = useState(null); // place id, or null
  const openerRef = useRef(null);
  const closeScene = useCallback(() => {
    setScene(null);
    openerRef.current?.focus();
  }, []);

  // one open at a time; folding back brings the toggle to the middle of the view
  const toggle = (id) => {
    const next = open === id ? null : id;
    setOpen(next);
    history.replaceState(null, '', next ? `#${id}-full` : `#${id}`);
    if (!next) document.getElementById(`${id}-toggle`)?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  };

  // open the right fold for a hash, on load and on hash change
  useEffect(() => {
    const follow = () => {
      const hash = window.location.hash.slice(1);
      if (!hash) return;
      for (const s of stops) {
        if (hash === `${s.id}-full` || s.inside?.includes(hash)) {
          setOpen(s.id);
          // the target is inside a fold that is only now opening
          requestAnimationFrame(() => requestAnimationFrame(() => {
            document.getElementById(hash)?.scrollIntoView({ block: 'start' });
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
          return (
            <div key={p.id} id={p.id} className="v2-stop">
              <button
                type="button"
                className="v2-stop__frame"
                onClick={(e) => { openerRef.current = e.currentTarget; setScene(p.id); }}
                aria-label={`Open the ${p.label} scene`}
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
                <span className="v2-stop__expand" aria-hidden="true">Open <span>↗</span></span>
              </button>
              <div className="v2-stop__text">
                <p className="v2-eyebrow">{p.sub}</p>
                {stop?.children ? (
                  <button
                    type="button"
                    id={`${p.id}-toggle`}
                    className="v2-fold__toggle"
                    aria-expanded={open === p.id}
                    aria-controls={`${p.id}-panel`}
                    onClick={() => toggle(p.id)}
                  >
                    <span className="v2-fold__chev" aria-hidden="true" />
                    {open === p.id ? 'Fold it back' : fourPlaces.folds[p.id]}
                  </button>
                ) : (
                  <p className="v2-stop__up">
                    <a className="v2-link" href={fourPlaces.singaporeUp.href}>{fourPlaces.singaporeUp.label}</a>
                    <span aria-hidden="true"> ↑</span>
                  </p>
                )}
              </div>
              {stop?.children ? (
                <div id={`${p.id}-panel`} className="v2-fold v2-stop__panel" data-open={open === p.id ? 'true' : undefined}>
                  <div>
                    <div className="v2-fold__inner v2-prose-wrap">
                      {stop.children}
                      {open === p.id && (
                        <button type="button" className="v2-fold__toggle mt-8" onClick={() => toggle(p.id)}>
                          <span className="v2-fold__chev" data-up aria-hidden="true" />
                          Fold it back
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
      {scene ? <SceneOverlay place={scene} onClose={closeScene} /> : null}
    </section>
  );
}
