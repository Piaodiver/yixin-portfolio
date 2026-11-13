import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { mountFull } from './useScene';
import { places } from '../../content/v2';
import SceneHotspots from './SceneHotspots';

/**
 * SceneOverlay — the full-screen scenes, opened from a band. A fresh mount
 * into a viewport-sized host, with the scene's own chrome back on (day/night,
 * sound, settings panel), its title block and the touch counter.
 *
 * L2: the overlay pages. Arrows at the sides and the keyboard's left/right
 * move through the four places without closing; four dots at the top say
 * where you are, a caption at the bottom says which place and when. Moving
 * on destroys the current scene and mounts the next into the same host.
 * The band's small mount stays as it was underneath; closing destroys this.
 */
export default function SceneOverlay({ place, onClose }) {
  const hostRef = useRef(null);
  const closeRef = useRef(null);
  const [index, setIndex] = useState(() => Math.max(0, places.findIndex((p) => p.id === place)));
  const current = places[index];
  const go = (delta) => setIndex((i) => (i + delta + places.length) % places.length);

  // mount / destroy, per place
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;
    let cancelled = false;
    let handle = null;
    mountFull(host, current.id).then((h) => {
      if (cancelled) { try { h?.destroy(); } catch { /* noop */ } return; }
      handle = h;
    });
    // the scene's brand link is href="#": keep it from scrolling the page
    const swallow = (e) => {
      const a = e.target.closest?.('a[href="#"]');
      if (a) e.preventDefault();
    };
    host.addEventListener('click', swallow);
    return () => {
      cancelled = true;
      host.removeEventListener('click', swallow);
      if (handle) { try { handle.destroy(); } catch { /* noop */ } }
      host.replaceChildren();
    };
  }, [current.id]);

  // keys, scroll lock, focus
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return createPortal(
    <div className="scene-overlay" role="dialog" aria-modal="true" aria-label={`${current.label} scene`}>
      <div ref={hostRef} className="scene-overlay__host" data-place={current.id} />
      <SceneHotspots
        hostRef={hostRef}
        place={current.id}
        onGo={(id) => { const i = places.findIndex((p) => p.id === id); if (i >= 0) setIndex(i); }}
      />
      <ol className="scene-overlay__dots" aria-hidden="true">
        {places.map((p, i) => <li key={p.id} data-on={i === index ? 'true' : undefined} />)}
      </ol>
      <button type="button" className="scene-overlay__arrow scene-overlay__arrow--prev" onClick={() => go(-1)} aria-label="Previous place">
        <span aria-hidden="true">←</span>
      </button>
      <button type="button" className="scene-overlay__arrow scene-overlay__arrow--next" onClick={() => go(1)} aria-label="Next place">
        <span aria-hidden="true">→</span>
      </button>
      <p className="scene-overlay__caption" aria-live="polite">
        <strong>{current.label}</strong>
        <span>{current.sub}</span>
        <span className="scene-overlay__count">{index + 1} / {places.length}</span>
      </p>
      <button
        ref={closeRef}
        type="button"
        className="scene-band__expand scene-overlay__close"
        onClick={onClose}
        aria-label="Close the scene"
      >
        Close <span aria-hidden="true">✕</span>
      </button>
    </div>,
    document.body,
  );
}
