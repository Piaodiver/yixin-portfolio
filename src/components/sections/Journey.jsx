import { journey } from '../../content/site';
import Section from '../Section';
import SectionHead from '../tech/SectionHead';

export default function Journey() {
  return (
    <Section id="journey">
      <SectionHead num="06" aside="Journey" title="The path that shaped the perspective" />

      <div className="mb-12 flex flex-wrap gap-x-12 gap-y-5 border-b border-ink-50 pb-8">
        {journey.education.map((e) => (
          <div key={e.school}>
            <p className="font-display text-[1.05rem] font-semibold text-ink-900">{e.school}</p>
            <p className="mt-1 text-[0.92rem] text-ink-500">{e.detail}</p>
            {e.note && <p className="u-label mt-1.5 text-wash-ochre-ink">{e.note}</p>}
          </div>
        ))}
      </div>

      <ol className="space-y-9">
        {journey.roles.map((r) => (
          <li key={r.period} className="grid gap-x-8 gap-y-2 md:grid-cols-[11rem_1fr]">
            <div className="flex items-center gap-2">
              {r.current && (
                <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-wash-ochre" />
              )}
              <span className="u-label u-nums text-ink-400">{r.period}</span>
            </div>
            <div>
              <div className="flex flex-wrap items-baseline gap-x-3">
                <h3 className="font-display text-[1.15rem] font-semibold text-ink-900">{r.org}</h3>
                <span className="text-[0.95rem] text-ink-700">{r.title}</span>
                <span className="u-label ml-auto text-ink-400">{r.place}</span>
              </div>
              <p className="mt-2 max-w-prose text-[0.95rem] leading-relaxed text-ink-500">{r.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
