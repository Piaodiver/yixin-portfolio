import { useCallback, useRef, useState } from 'react';
import useScene, { hasScene } from './useScene';
import SceneOverlay from './SceneOverlay';

/**
 * SceneBand — a fixed-height band holding one Kinetic Curtains scene.
 *
 * Embedding contract (kinetic-curtains/docs/EMBEDDING.md): each scene is an
 * ES module exporting mount<Scene>(host, options) and returns a handle with
 * destroy() / setTheme() / setSound(). The host is ONE EMPTY DIV; the scene
 * generates its own DOM inside it, scopes its CSS under its root class
 * (.toh-scene / .gg-scene), sizes itself from --kc-height / --gg-height and
 * uses container queries, so the host div must be the sizing box. Scenes
 * write data-theme on their own root, never on <html>.
 *
 * All four places mount (useScene). Mounting happens lazily when the band
 * is near the viewport, and the band height is fixed by CSS, so the scene
 * arriving causes no layout shift.
 *
 * Poster: public/scenes/<place>/poster.jpg is a still of the scene at band
 * size. It sits under the host from the first paint and fades out once the
 * scene has mounted, so the band is never an empty box: before the chunk
 * loads, if it fails, and under reduced motion (where nothing mounts), the
 * poster is what the reader sees.
 */

const LABELS = {
  china: 'China',
  'united-states': 'United States',
  israel: 'Israel',
  singapore: 'Singapore',
};

export default function SceneBand({ place }) {
  const id = `scene-${place}`;
  const label = LABELS[place] ?? place;
  const hostRef = useRef(null);
  const mounted = hasScene(place);
  const state = useScene(hostRef, place);
  const poster = `${import.meta.env.BASE_URL}scenes/${place}/poster.jpg`;

  // dev only: ?expand=china opens the overlay on load, for screenshots
  const [open, setOpen] = useState(() =>
    import.meta.env.DEV && new URLSearchParams(window.location.search).get('expand') === place);
  const expandRef = useRef(null);
  const close = useCallback(() => {
    setOpen(false);
    expandRef.current?.focus();
  }, []);

  return (
    <div className="scene-band" data-place={place}>
      <span className="scene-band__label" aria-hidden="true">{label}</span>
      {mounted ? (
        <img
          className="scene-band__poster"
          src={poster}
          alt=""
          width="1280"
          height={place === 'china' ? 768 : 720}
          loading="lazy"
          decoding="async"
          data-state={state}
        />
      ) : (
        <span className="scene-band__caption" aria-hidden="true">scene loads here</span>
      )}
      {/* mount target — must stay an empty div with this id; the scene owns its children */}
      <div ref={hostRef} id={id} className="scene-band__host" data-place={place} />
      {mounted ? (
        <button
          ref={expandRef}
          type="button"
          className="scene-band__expand"
          data-scene={place}
          onClick={() => setOpen(true)}
          aria-label={`Expand the ${label} scene`}
        >
          Expand <span aria-hidden="true">↗</span>
        </button>
      ) : null}
      {open ? <SceneOverlay place={place} onClose={close} /> : null}
    </div>
  );
}
