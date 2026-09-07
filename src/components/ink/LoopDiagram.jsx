import { useEnter } from './useReveal';

const DOT = ['var(--wash-ochre)', 'var(--wash-indigo)', 'var(--wash-sage)'];

/**
 * The product mechanism drawn as a brush stroke with stations on it —
 * deliberately the same gesture the Journey to the West reader uses on its
 * own chapter screen: one thin waving line, a few coloured points, no boxes.
 *
 * Horizontal on wide screens, vertical below `md` where a seven-station line
 * would otherwise be unreadable.
 */
export default function LoopDiagram({ steps, note }) {
  const { ref, armed, shown } = useEnter();
  const n = steps.length;

  return (
    <figure ref={ref} className="my-8">
      {/* wide: one stroke, stations along it */}
      <div className="hidden md:block">
        <svg viewBox={`0 0 ${n * 100} 46`} className="w-full overflow-visible" role="img"
             aria-label={`Sequence: ${steps.join(' → ')}`}>
          <path
            d={`M6,26 ${steps.map((_, i) => {
              const x = 6 + ((n * 100 - 12) / (n - 1)) * (i + 1);
              const prev = 6 + ((n * 100 - 12) / (n - 1)) * i;
              const mid = (prev + x) / 2;
              return `Q${mid},${i % 2 ? 30 : 21} ${Math.min(x, n * 100 - 6)},26`;
            }).join(' ')}`}
            fill="none"
            stroke="var(--ink-100)"
            strokeWidth="1.3"
            strokeLinecap="round"
            pathLength="1"
            style={{
              strokeDasharray: 1,
              strokeDashoffset: shown ? 0 : 1,
              transition: armed ? 'stroke-dashoffset 1400ms var(--ease-ink)' : 'none',
            }}
          />
          {steps.map((s, i) => {
            const x = 6 + ((n * 100 - 12) / (n - 1)) * i;
            return (
              <g key={s}>
                <circle
                  cx={x} cy="26" r="3.2"
                  fill={DOT[i % DOT.length]}
                  style={{
                    opacity: shown ? 1 : 0,
                    transition: armed ? `opacity 400ms var(--ease-ink) ${300 + i * 130}ms` : 'none',
                  }}
                />
                <text
                  x={x} y="12"
                  textAnchor={i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle'}
                  className="u-label"
                  style={{
                    fill: 'var(--ink-500)',
                    fontSize: '9.5px',
                    letterSpacing: '0.06em',
                    opacity: shown ? 1 : 0,
                    transition: armed ? `opacity 400ms var(--ease-ink) ${360 + i * 130}ms` : 'none',
                  }}
                >
                  {s}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* narrow: a vertical list, same stations */}
      <ol className="space-y-0 md:hidden">
        {steps.map((s, i) => (
          <li key={s} className="flex items-start gap-3">
            <div className="flex flex-col items-center self-stretch">
              <span className="mt-[7px] h-[7px] w-[7px] shrink-0 rounded-full" style={{ background: DOT[i % DOT.length] }} />
              {i < n - 1 && <span className="w-px flex-1 bg-ink-100" />}
            </div>
            <span className="u-label pb-5 text-ink-500">{s}</span>
          </li>
        ))}
      </ol>

      {note && (
        <figcaption className="mt-2 text-[13.5px] italic text-ink-500 md:mt-4">{note}</figcaption>
      )}
    </figure>
  );
}
