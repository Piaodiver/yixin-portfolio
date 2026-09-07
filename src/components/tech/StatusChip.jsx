const TONE = {
  shipped:  { label: 'Shipped',   fg: 'var(--sage-ink)',   bd: 'var(--wash-sage)' },
  live:     { label: 'Live',      fg: 'var(--sage-ink)',   bd: 'var(--wash-sage)' },
  building: { label: 'Building',  fg: 'var(--ochre-ink)',  bd: 'var(--wash-ochre)' },
  ios:      { label: 'iOS ready', fg: 'var(--ochre-ink)',  bd: 'var(--wash-ochre)' },
  concept:  { label: 'Concept',   fg: 'var(--ink-400)',     bd: 'var(--ink-100)' },
  queued:   { label: 'Queued',    fg: 'var(--ink-400)',     bd: 'var(--ink-100)' },
  delivered:{ label: 'Delivered', fg: 'var(--indigo-ink)', bd: 'var(--wash-indigo)' },
};

export default function StatusChip({ status, children }) {
  const t = TONE[status] ?? TONE.concept;
  return (
    <span
      className="u-label inline-block whitespace-nowrap rounded-[2px] border px-[7px] py-[2px] text-[10px]"
      style={{ color: t.fg, borderColor: t.bd }}
    >
      {children ?? t.label}
    </span>
  );
}
