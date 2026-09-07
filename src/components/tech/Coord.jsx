/**
 * A surveyor's mark. Reads as instrumentation without any sci-fi vocabulary —
 * the same role the tally marks and tiny pine trees play in the reference
 * sketch: evidence that someone was measuring.
 */
export default function Coord({ children, className = '' }) {
  return (
    <span aria-hidden="true" className={`u-label u-nums inline-flex items-center gap-1.5 text-ink-400 ${className}`}>
      <svg width="7" height="7" viewBox="0 0 7 7" className="shrink-0">
        <path d="M3.5 0v7M0 3.5h7" stroke="currentColor" strokeWidth="0.75" />
      </svg>
      {children}
    </span>
  );
}
