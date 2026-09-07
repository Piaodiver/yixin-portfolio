import { useEffect, useId, useRef, useState } from 'react';
import { useEnter } from './useReveal';

/**
 * Ink settling onto paper: the element arrives displaced by Perlin noise and
 * resolves as the displacement scale falls to zero.
 *
 * feTurbulence is evaluated per pixel, so this is deliberately expensive and
 * deliberately brief. Four rules keep it affordable and safe:
 *   1. the filter runs only during the ~700ms entrance;
 *   2. the instant it lands the filter is dropped and the <svg> unmounted, so
 *      no later repaint pays for it;
 *   3. narrow viewports and reduced-motion skip displacement and just fade;
 *   4. anything not armed by `useEnter` renders plainly — the text is never
 *      hostage to an observer.
 * Use on headings and rules: short, wide, under ~400px tall. Never a section.
 */
export default function InkReveal({ children, as: Tag = 'div', className = '', delay = 0, amount = 26 }) {
  const { ref, armed, entered, shown } = useEnter();
  const filterId = `ink-${useId().replace(/:/g, '')}`;
  const dispRef = useRef(null);
  const rafRef = useRef(0);
  const [filtering, setFiltering] = useState(false);
  const [landed, setLanded] = useState(false);

  useEffect(() => {
    if (!armed || !entered || landed) return;

    const cheap = typeof window !== 'undefined' && window.innerWidth < 768;
    if (cheap) { setLanded(true); return; }

    const start = performance.now() + delay;
    setFiltering(true);

    const tick = (now) => {
      const t = Math.min(1, Math.max(0, (now - start) / 700));
      const eased = 1 - Math.pow(1 - t, 3);   // most of the settling happens early
      dispRef.current?.setAttribute('scale', String(amount * (1 - eased)));

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setFiltering(false);   // drop the filter; nothing recomputes after this
        setLanded(true);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [armed, entered, landed, delay, amount]);

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        filter: filtering ? `url(#${filterId})` : 'none',
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : 'translateY(6px)',
        transition: armed
          ? `opacity var(--dur-ink) var(--ease-ink) ${delay}ms, transform var(--dur-ink) var(--ease-ink) ${delay}ms`
          : 'none',
        willChange: filtering ? 'filter' : 'auto',
      }}
    >
      {filtering && (
        <svg aria-hidden="true" width="0" height="0" style={{ position: 'absolute' }}>
          <filter id={filterId} x="-8%" y="-25%" width="116%" height="150%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.016 0.05" numOctaves="2" seed="7" result="noise" />
            <feDisplacementMap ref={dispRef} in="SourceGraphic" in2="noise" scale={amount} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>
      )}
      {children}
    </Tag>
  );
}
