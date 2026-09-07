import { useLayoutEffect, useRef, useState } from 'react';

export function prefersReducedMotion() {
  return typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Entrance animation that can only ever ADD to a readable page.
 *
 * The obvious implementation — start at opacity 0, reveal on intersection —
 * has a failure mode that costs you the whole page: anything the reader
 * jumps past (a deep link, browser Find, a restored scroll position, a
 * hash in the URL) is never intersected, so it stays invisible forever.
 *
 * So the default is visible. An element arms itself for animation only when
 * it can prove, before first paint, that it starts below the fold — the one
 * case where an entrance is both meaningful and safe. Everything else just
 * renders. No observer, no animation, no way to lose the content.
 *
 * Returns { ref, armed, entered }:
 *   armed=false → render fully visible, no transition
 *   armed=true  → start hidden, transition in when `entered` flips
 */
export function useEnter(rootMargin = '0px 0px -10% 0px') {
  const ref = useRef(null);
  const [armed, setArmed] = useState(false);
  const [entered, setEntered] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion() || !('IntersectionObserver' in window)) return;

    // Below the fold at first paint? Then, and only then, animate it in.
    if (el.getBoundingClientRect().top <= window.innerHeight) return;

    setArmed(true);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setEntered(true); io.disconnect(); }
      },
      { rootMargin, threshold: 0.01 },
    );
    io.observe(el);

    // Failsafe: if the observer somehow never fires, show it anyway.
    const t = setTimeout(() => setEntered(true), 4000);

    return () => { io.disconnect(); clearTimeout(t); };
  }, [rootMargin]);

  return { ref, armed, entered, shown: !armed || entered };
}
