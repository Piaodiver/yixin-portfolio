import { useEnter } from './useReveal';

/**
 * A divider drawn as a brush stroke rather than a border: the path wavers
 * slightly and draws itself once on entry via stroke-dashoffset. Cheap —
 * no filter — and fully drawn by default if it never animates.
 */
export default function InkRule({ className = '' }) {
  const { ref, armed, shown } = useEnter();

  return (
    <svg ref={ref} aria-hidden="true" viewBox="0 0 600 8" preserveAspectRatio="none" className={`h-2 w-full ${className}`}>
      <path
        d="M1,4.6 C90,2.6 150,5.4 240,3.9 C330,2.4 400,5.2 480,3.6 C530,2.7 570,4.2 599,3.4"
        fill="none"
        stroke="var(--ink-100)"
        strokeWidth="1.25"
        strokeLinecap="round"
        pathLength="1"
        style={{
          strokeDasharray: 1,
          strokeDashoffset: shown ? 0 : 1,
          transition: armed ? 'stroke-dashoffset 900ms var(--ease-ink)' : 'none',
        }}
      />
    </svg>
  );
}
