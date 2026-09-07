import { Link } from 'react-router-dom';
import StatusChip from './tech/StatusChip';

export default function CaseCard({ item }) {
  const { slug, org, region, year, status, title, summary, metrics } = item;

  return (
    <Link
      to={`/work/${slug}`}
      className="group relative block rounded-[3px] border border-ink-50 bg-paper-raise/60 p-6 transition-all duration-300 ease-ink hover:-translate-y-0.5 hover:border-ink-100 hover:bg-paper-raise md:p-7"
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="u-label text-wash-sage-ink">{org}</span>
        {region && <span className="u-label text-ink-400">· {region}</span>}
        <span className="u-label u-nums ml-auto text-ink-400">{year}</span>
      </div>

      <h3 className="mt-3 font-display text-[1.35rem] font-semibold leading-snug text-ink-900 md:text-[1.5rem]">
        {title}
      </h3>

      <p className="mt-2.5 max-w-prose text-[0.95rem] leading-relaxed text-ink-500">{summary}</p>

      {metrics?.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3 border-t border-ink-50 pt-4">
          {metrics.map((m) => (
            <div key={m.label}>
              <div className="u-nums font-display text-[1.15rem] font-semibold leading-none text-ink-700">{m.value}</div>
              <div className="u-label mt-1.5 text-[10px] text-ink-400">{m.label}</div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-5 flex items-center justify-between gap-4">
        <StatusChip status={status} />
        <span className="u-label text-ink-400 transition-colors group-hover:text-wash-ochre-ink" aria-hidden="true">
          Read →
        </span>
      </div>
    </Link>
  );
}
