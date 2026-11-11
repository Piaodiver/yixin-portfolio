import { useCallback, useEffect, useRef, useState } from 'react';
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
 *
 * Invitation: the scenes answer the pointer, but nothing says so. The first
 * time a mounted band is half in view, a small pill says to move the cursor
 * (or drag, on touch) and goes away after a moment or as soon as the pointer
 * comes in. Once per band per page load; not persisted. The whole band opens
 * the full-screen scene on click, unless the click ends a drag across the
 * scene; the Expand button stays as the keyboard route.
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

  // the invitation: shown once, when the mounted band is half in view
  const bandRef = useRef(null);
  const [hint, setHint] = useState('unseen'); // unseen | shown | done
  useEffect(() => {
    if (state !== 'mounted' || hint !== 'unseen') return undefined;
    const el = bandRef.current;
    if (!el || !('IntersectionObserver' in window)) return undefined;
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        io.disconnect();
        setHint('shown');
      }
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [state, hint]);
  useEffect(() => {
    if (hint !== 'shown') return undefined;
    const t = setTimeout(() => setHint('done'), 2800);
    return () => clearTimeout(t);
  }, [hint]);
  const dismissHint = () => { if (hint === 'shown') setHint('done'); };
  const touch = typeof window !== 'undefined' && window.matchMedia?.('(hover: none)').matches;

  // whole band opens the overlay, but not at the end of a drag across the scene
  const down = useRef(null);
  const onPointerDown = (e) => { down.current = { x: e.clientX, y: e.clientY }; };
  const onClick = (e) => {
    if (state !== 'mounted') return;
    if (e.target.closest('button')) return;
    const d = down.current;
    if (d && Math.hypot(e.clientX - d.x, e.clientY - d.y) > 8) return;
    setOpen(true);
  };

  return (
    <div
      ref={bandRef}
      className="scene-band"
      data-place={place}
      data-state={state}
      onPointerDown={onPointerDown}
      onClick={onClick}
      onPointerEnter={dismissHint}
    >
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
      {hint === 'shown' ? (
        <span className="scene-band__hint" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12h16M4 12l4-4M4 12l4 4M20 12l-4-4M20 12l-4 4" />
          </svg>
          {touch ? 'Drag across the scene' : 'Move your cursor across the scene'}
        </span>
      ) : null}
      {mounted ? (
        <button
          ref={expandRef}
          type="button"
          className="scene-band__expand"
          data-scene={place}
          onClick={() => setOpen(true)}
          aria-label={`Expand the ${label} scene`}
        >
          Expand scene <span aria-hidden="true">↗</span>
        </button>
      ) : null}
      {open ? <SceneOverlay place={place} onClose={close} /> : null}
    </div>
  );
}
