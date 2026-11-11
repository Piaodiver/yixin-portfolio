import { useEffect } from 'react';

/**
 * usePendulum — a damped pendulum driven by the pointer's speed across it.
 *
 * `hangRef` is the hanger (receives pointer events), `swingRef` the element
 * that rotates. At rest nothing runs: the loop starts on the first push and
 * stops when the swing has died down. Under reduced motion the hook does
 * nothing and the element stays still.
 */
export default function usePendulum(hangRef, swingRef) {
  useEffect(() => {
    const hang = hangRef.current;
    const swing = swingRef.current;
    if (!hang || !swing) return undefined;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;

    let angle = 0;   // internal units; rendered at a quarter of this
    let vel = 0;
    let lastX = null;
    let lastT = 0;
    let raf = 0;
    const K = 0.012;
    const DAMP = 0.985;
    const MAX = 14;

    const tick = () => {
      vel += -K * angle;
      vel *= DAMP;
      angle += vel;
      if (Math.abs(angle) > MAX) angle = Math.sign(angle) * MAX;
      swing.style.transform = `rotate(${(angle * 0.25).toFixed(3)}deg)`;
      if (Math.abs(angle) < 0.02 && Math.abs(vel) < 0.002) {
        angle = 0; vel = 0;
        swing.style.transform = '';
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    const start = () => { if (!raf) raf = requestAnimationFrame(tick); };

    const onMove = (e) => {
      const t = performance.now();
      if (lastX !== null) {
        const dt = Math.max(1, t - lastT);
        vel += ((e.clientX - lastX) / dt) * 0.9;
        start();
      }
      lastX = e.clientX;
      lastT = t;
    };
    const onLeave = () => { lastX = null; };
    hang.addEventListener('pointermove', onMove, { passive: true });
    hang.addEventListener('pointerleave', onLeave);
    return () => {
      hang.removeEventListener('pointermove', onMove);
      hang.removeEventListener('pointerleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [hangRef, swingRef]);
}
