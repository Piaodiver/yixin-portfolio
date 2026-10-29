import { useEnter } from './useReveal';

const DOT = ['var(--wash-ochre)', 'var(--wash-indigo)', 'var(--wash-sage)'];

/** The brush stroke the stations sit on. Drawn across a fixed 600-unit box and
 *  stretched to whatever width the column happens to be, so the waver stays
 *  the same shape regardless of how many stations there are. */
function strokePath(n) {
  const W = 600, pad = 2;
  const x = (i) => pad + ((W - 2 * pad) / (n - 1)) * i;
  let d = `M${x(0)},6`;
  for (let i = 1; i < n; i++) {
    const mid = (x(i - 1) + x(i)) / 2;
    d += ` Q${mid},${i % 2 ? 2 : 9} ${x(i)},${i % 2 ? 5.5 : 6}`;
  }
  return d;
}

/**
 * The product mechanism drawn as a brush stroke with stations on it —
 * deliberately the same gesture the Journey to the West reader uses on its
 * own chapter screen: one thin waving line, a few coloured points, no boxes.
 * Labels alternate above and below so neighbours never share a band.
 *
 * The stroke is SVG; the labels are ordinary CSS text. That split is the
 * whole point. The first version set the labels as <text> inside a viewBox
 * sized `steps.length * 100`, which meant a three-station diagram was scaled
 * up ~3x in the same column a seven-station one filled comfortably — the type
 * ballooned and the labels collided. The deeper fault was placing text in a
 * coordinate system that has no idea how wide text is. CSS does, so layout
 * belongs to it and the drawing belongs to SVG.
 *
 * Dots are absolutely centred on a fixed-height row, so they stay on one line
 * no matter which side a label is parked on.
 */
export default function LoopDiagram({ steps, note }) {
  const { ref, armed, shown } = useEnter();
  const n = steps.length;

  return (
    <figure ref={ref} className="my-8">
      {/* wide: one stroke, stations alternating above and below it */}
      <div className="relative hidden md:block">
        <svg
          aria-hidden="true"
          viewBox="0 0 600 10"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-x-0 top-1/2 h-2.5 w-full -translate-y-1/2"
        >
          <path
            d={strokePath(n)}
            fill="none"
            stroke="var(--ink-100)"
            strokeWidth="1.1"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            pathLength="1"
            style={{
              strokeDasharray: 1,
              strokeDashoffset: shown ? 0 : 1,
              transition: armed ? 'stroke-dashoffset 1400ms var(--ease-ink)' : 'none',
            }}
          />
        </svg>

        <ol className="relative grid" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
          {steps.map((s, i) => {
            const first = i === 0, last = i === n - 1;
            const atX = first ? 'left-0' : last ? 'right-0' : 'left-1/2 -translate-x-1/2';
            const above = i % 2 === 0;
            return (
              <li key={s} className="relative h-[72px]">
                <span
                  className={`absolute top-1/2 h-[9px] w-[9px] -translate-y-1/2 rounded-full ${atX}`}
                  style={{
                    background: DOT[i % DOT.length],
                    opacity: shown ? 1 : 0,
                    transition: armed ? `opacity 400ms var(--ease-ink) ${300 + i * 130}ms` : 'none',
                  }}
                />
                <span
                  className={`u-label absolute whitespace-nowrap text-ink-500 ${atX} ${
                    above ? 'bottom-[calc(50%+11px)]' : 'top-[calc(50%+11px)]'
                  }`}
                  style={{
                    opacity: shown ? 1 : 0,
                    transition: armed ? `opacity 400ms var(--ease-ink) ${360 + i * 130}ms` : 'none',
                  }}
                >
                  {s}
                </span>
              </li>
            );
          })}
        </ol>
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
