import { useEffect, useState } from 'react';

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

/* The scenes always mount in day mode. Night by the visitor's clock was
   tried on 2026-11-10 and dropped: the night renders did not earn it. */
export const themeNow = () => 'day';

/* Embedding options from kinetic-curtains/docs/EMBEDDING.md: no masthead,
   no title block, no HUD, silent, no localStorage writes, pause offscreen.
   The host page does its own typography around the band. */
const EMBED_OPTIONS = {
  chrome: false,
  title: false,
  hud: false,
  sound: 'off',
  persistTheme: false,
  pauseOffscreen: true,
};

/* Full-screen options (SceneOverlay): the scene's own chrome comes back so
   the viewer can switch day/night, turn the sound off and open the settings
   panel; the title block too. No HUD: the touch counter read as tracking
   (owner, 2026-11-12), and the progress line it comes with is never drawn.
   The nav links are demo placeholders upstream, so they stay off. Sound
   starts on (step 42): the overlay opens from a click, so the audio context
   is allowed to run. */
const FULL_OPTIONS = {
  chrome: true,
  title: true,
  hud: false,
  cursor: true,
  settings: true,
  nav: [],
  sound: 'on',
  persistTheme: false,
  pauseOffscreen: false,
};

/* The scenes' own copy is Chinese upstream (brand, eyebrow, button labels,
   touch counter). The site's readers are international, so every visible
   string is passed in English here (step 42, 2026-11-12). The characters in
   the curtain and the words in the water are the pictures themselves and
   stay. Sound labels are words, so the scene renders them as a pill. The
   counter labels are kept for completeness; the HUD is off. */
const LABELS = {
  theme: 'Day / night',
  sound: 'Sound',
  soundOn: 'Sound on',
  soundOff: 'Sound off',
  settings: 'Settings',
};
const TEXT = {
  china: {
    brand: 'Temple of Heaven · Beijing',
    eyebrow: 'Move across the curtain',
    labels: { ...LABELS, counter: 'Touches' },
    ariaLabel: 'A curtain of Chinese characters hanging from the Temple of Heaven roof; move across it and the strands swing',
    templeAlt: 'The roof of the Hall of Prayer for Good Harvests, Temple of Heaven',
  },
  'united-states': {
    brand: 'Golden Gate',
    brandSuffix: ' · San Francisco',
    locality: 'SAN FRANCISCO · PLUCK THE CABLES',
    labels: { ...LABELS, counter: 'Plucks' },
    ariaLabel: 'The main cables and suspenders of the Golden Gate Bridge; pluck them and they vibrate like strings, with words along the cables',
  },
  israel: {
    brand: 'Jaffa',
    brandSuffix: ' · Tel Aviv',
    eyebrow: 'Push the wind lines',
    labels: { ...LABELS, counter: 'Gusts' },
    ariaLabel: 'Seven lines of Hebrew and Arabic words drifting in from the sea on the Mediterranean wind',
    backdropAlt: 'A Jaffa sandstone arch framing the Mediterranean, with the old town, a lighthouse and a small sailboat beyond',
  },
  singapore: {
    brand: 'Merlion',
    brandSuffix: ' · Singapore',
    eyebrow: 'Stir the water',
    labels: { ...LABELS, counter: 'Ripples' },
    ariaLabel: 'The Merlion’s stream of water as a curtain you can stir, carrying words in English, Chinese, Malay and Tamil',
    backdropAlt: 'The Merlion on its stone base at Marina Bay, facing right, with Marina Bay Sands and the ArtScience Museum beyond',
  },
};

/** Mounts the full-screen version of `place` into `host`. Resolves to the
    scene handle (destroy it on close), or null if the module fails. */
export async function mountFull(host, place) {
  const load = LOADERS[place];
  if (!host || !load) return null;
  try {
    const mod = await load();
    return mod.mount(host, { ...FULL_OPTIONS, ...TEXT[place], theme: themeNow(), assetBase: mod.assetBase });
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
 * `prefers-reduced-motion: reduce` we do not mount and leave the poster.
 *
 * Returns the mount state: 'idle' (not yet, or never), 'mounted', 'failed'.
 * SceneBand keeps its poster image visible until 'mounted'.
 */
export default function useScene(hostRef, place) {
  const [state, setState] = useState('idle');
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
        setState('failed');
        return;
      }
      if (cancelled || !hostRef.current) return;
      try {
        handle = mod.mount(host, { ...EMBED_OPTIONS, ...TEXT[place], theme: themeNow(), assetBase: mod.assetBase });
        setState('mounted');
      } catch (err) {
        console.warn(`[scene:${place}] failed to mount`, err);
        setState('failed');
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
  return state;
}
