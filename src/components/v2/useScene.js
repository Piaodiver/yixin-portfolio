import { useEffect } from 'react';

/**
 * Lazy loaders for the Kinetic Curtains scenes. Each resolves to a wrapper
 * module exporting { mount, assetBase } (see src/scenes/<place>/index.js).
 * Static import() strings keep every scene in its own Rollup chunk, with its
 * CSS attached to that chunk, so nothing lands in the main bundle until a
 * band is about to scroll into view.
 */
const LOADERS = {
  china: () => import('../../scenes/china/index.js'),
  'united-states': () => import('../../scenes/united-states/index.js'),
  israel: () => import('../../scenes/israel/index.js'),
  singapore: () => import('../../scenes/singapore/index.js'),
};

export const hasScene = (place) => Object.hasOwn(LOADERS, place);

/* Embedding options from kinetic-curtains/docs/EMBEDDING.md: no masthead,
   no title block, no HUD, silent, no localStorage writes, pause offscreen.
   The host page does its own typography around the band. */
const EMBED_OPTIONS = {
  chrome: false,
  title: false,
  hud: false,
  sound: 'off',
  theme: 'day',
  persistTheme: false,
  pauseOffscreen: true,
};

/* Full-screen options (SceneOverlay): the scene's own chrome comes back so
   the viewer can switch day/night, turn the sound on and open the settings
   panel; the title block and touch counter too. The nav links are demo
   placeholders upstream, so they stay off. */
const FULL_OPTIONS = {
  chrome: true,
  title: true,
  hud: true,
  cursor: true,
  settings: true,
  nav: [],
  sound: 'off',
  theme: 'day',
  persistTheme: false,
  pauseOffscreen: false,
};

/** Mounts the full-screen version of `place` into `host`. Resolves to the
    scene handle (destroy it on close), or null if the module fails. */
export async function mountFull(host, place) {
  const load = LOADERS[place];
  if (!host || !load) return null;
  try {
    const mod = await load();
    return mod.mount(host, { ...FULL_OPTIONS, assetBase: mod.assetBase });
  } catch (err) {
    console.warn(`[scene:${place}] full-screen mount failed`, err);
    return null;
  }
}

const NEAR_VIEWPORT = '200px';

/**
 * Mounts the scene for `place` into hostRef.current once it is within 200px
 * of the viewport. Returns nothing; the scene owns the host's children while
 * mounted and is destroyed on unmount (including React Fast Refresh and the
 * StrictMode double-invoke in dev).
 *
 * Reduced motion: neither module exposes a way to stop its loop or render one
 * still frame (Golden Gate only damps its forces), so under
 * `prefers-reduced-motion: reduce` we do not mount and leave the paper band.
 */
export default function useScene(hostRef, place) {
  useEffect(() => {
    const host = hostRef.current;
    const load = LOADERS[place];
    if (!host || !load) return undefined;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;

    let cancelled = false;
    let handle = null;

    const mountScene = async () => {
      let mod;
      try {
        mod = await load();
      } catch (err) {
        console.warn(`[scene:${place}] failed to load`, err);
        return;
      }
      if (cancelled || !hostRef.current) return;
      try {
        handle = mod.mount(host, { ...EMBED_OPTIONS, assetBase: mod.assetBase });
      } catch (err) {
        console.warn(`[scene:${place}] failed to mount`, err);
      }
    };

    let io = null;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          io = null;
          mountScene();
        }
      }, { rootMargin: NEAR_VIEWPORT });
      io.observe(host);
    } else {
      mountScene();
    }

    return () => {
      cancelled = true;
      io?.disconnect();
      if (handle) {
        try { handle.destroy(); } catch (err) { console.warn(`[scene:${place}] destroy failed`, err); }
        handle = null;
      }
    };
  }, [hostRef, place]);
}
