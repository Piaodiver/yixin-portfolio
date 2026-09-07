import { useEffect, useRef, useState } from 'react';
import { useEnter, prefersReducedMotion } from '../ink/useReveal';

/** Splits "$2M+" into "$" / 2 / "M+" so only the digits count up. */
function parse(value) {
  const m = String(value).match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)$/);
  if (!m) return null;
  return {
    prefix: m[1],
    num: parseFloat(m[2]),
    suffix: m[3],
    decimals: (m[2].split('.')[1] || '').length,
  };
}

export default function Metric({ value, label }) {
  const { ref, armed, entered } = useEnter();
  const parsed = parse(value);

  // Two rules, both learned the hard way:
  //   1. the true figure is the default — a metric rendering "$0M+" because
  //      an observer has not fired is worse than one that never animates;
  //   2. a figure already on screen at mount is never animated (useEnter
  //      only arms what starts below the fold), because counting up from
  //      zero something the reader is already looking at reads as a glitch.
  const [n, setN] = useState(parsed?.num ?? null);
  const decided = useRef(false);

  useEffect(() => {
    if (!armed || !entered || !parsed || decided.current) return;
    decided.current = true;

    if (prefersReducedMotion()) return;

    let raf = 0;
    const start = performance.now();
    setN(0);
    const tick = (now) => {
      const t = Math.min(1, (now - start) / 900);
      setN(parsed.num * (1 - Math.pow(1 - t, 3)));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setN(parsed.num);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); setN(parsed.num); };
    // parsed derives from value; keying on value keeps this to a single run
  }, [armed, entered, value]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div ref={ref}>
      <div className="u-nums font-display text-[2rem] font-semibold leading-none text-ink-900 md:text-[2.4rem]">
        {parsed ? `${parsed.prefix}${n.toFixed(parsed.decimals)}${parsed.suffix}` : value}
      </div>
      <div className="u-label mt-2 text-ink-500">{label}</div>
    </div>
  );
}
