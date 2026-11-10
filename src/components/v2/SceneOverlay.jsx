import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { mountFull } from './useScene';

/**
 * SceneOverlay — the full-screen version of one scene, opened from a band's
 * Expand button. A fresh mount into a viewport-sized host, with the scene's
 * own chrome back on (day/night, sound, settings panel), its title block and
 * the touch counter, so there is something to play with. The band's small
 * mount stays as it was underneath; closing destroys this one.
 */
const LABELS = {
  china: 'China',
  'united-states': 'United States',
  israel: 'Israel',
  singapore: 'Singapore',
};

export default function SceneOverlay({ place, onClose }) {
  const hostRef = useRef(null);
  const closeRef = useRef(null);
  const label = LABELS[place] ?? place;

  // mount / destroy
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;
    let cancelled = false;
    let handle = null;
    mountFull(host, place).then((h) => {
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
    };
  }, [place]);

  // escape key, scroll lock, focus
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
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
    <div className="scene-overlay" role="dialog" aria-modal="true" aria-label={`${label} scene`}>
      <div ref={hostRef} className="scene-overlay__host" data-place={place} />
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
