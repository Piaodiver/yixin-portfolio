import { useParams, Link } from 'react-router-dom';
import { enterprise } from '../content/enterprise';
import { ventures } from '../content/ventures';
import { built } from '../content/built';
import NotFound from './NotFound';
import Section from '../components/Section';
import InkReveal from '../components/ink/InkReveal';
import InkRule from '../components/ink/InkRule';
import LoopDiagram from '../components/ink/LoopDiagram';
import StatusChip from '../components/tech/StatusChip';
import Coord from '../components/tech/Coord';

const ALL = [...enterprise, ...ventures, ...built];

export default function WorkDetail() {
  const { slug } = useParams();
  const item = ALL.find((c) => c.slug === slug);
  if (!item) return <NotFound />;

  const { org, region, year, status, kicker, title, summary,
          metrics, sections, loop, loopNote, shots, links, note } = item;

  // `todo` sections are Yixin's writing queue, not content. They surface in
  // `npm run dev` and never reach the build.
  const visible = sections.filter((s) => s.body?.length);
  const pending = import.meta.env.DEV ? sections.filter((s) => s.todo) : [];

  return (
    <article>
      <Section className="!pb-6">
        <Link to="/" className="u-label inline-block text-ink-400 transition-colors hover:text-wash-ochre-ink">
          ← All work
        </Link>

        <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="u-label text-wash-sage-ink">{org}</span>
          {region && <span className="u-label text-ink-400">· {region}</span>}
          <Coord className="ml-auto">{year}</Coord>
        </div>

        {kicker && <p className="u-label mt-5 text-ink-400">{kicker}</p>}

        <InkReveal as="h1" className="mt-2.5 max-w-[24ch] font-display text-[2rem] font-semibold leading-[1.12] text-ink-900 md:text-[2.9rem]">
          {title}
        </InkReveal>

        <InkRule className="my-6 max-w-[9rem]" />

        <p className="max-w-prose text-[1.08rem] leading-relaxed text-ink-700">{summary}</p>

        <div className="mt-6"><StatusChip status={status} /></div>

        {metrics?.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-x-12 gap-y-6 border-t border-ink-50 pt-7">
            {metrics.map((m) => (
              <div key={m.label}>
                <div className="u-nums font-display text-[1.6rem] font-semibold leading-none text-ink-900">{m.value}</div>
                <div className="u-label mt-2 max-w-[15rem] text-ink-500">{m.label}</div>
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section className="!pt-4">
        {loop && <LoopDiagram steps={loop} note={loopNote} />}

        <div className="mt-4 space-y-11">
          {visible.map((s) => (
            <section key={s.heading}>
              <h2 className="u-label text-wash-sage-ink">{s.heading}</h2>
              <div className="mt-3.5 max-w-prose space-y-4 text-[1.01rem] leading-relaxed text-ink-700">
                {s.body.map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </section>
          ))}
        </div>

        {shots?.length > 0 && (
          <ul className="mt-12 flex snap-x gap-4 overflow-x-auto pb-3">
            {shots.map((s) => (
              <li key={s.src} className="shrink-0 snap-start">
                <img
                  src={s.src} alt={s.alt} loading="lazy" decoding="async"
                  width="160" height="348"
                  className="h-[348px] w-[160px] rounded-[4px] object-cover ring-1 ring-ink-50"
                />
              </li>
            ))}
          </ul>
        )}

        {note && (
          <p className="mt-10 max-w-prose border-l border-ink-100 pl-4 text-[13.5px] italic leading-relaxed text-ink-500">
            {note}
          </p>
        )}

        {links?.filter((l) => l.href && !l.pending).length > 0 && (
          <div className="mt-10 flex flex-wrap gap-3 border-t border-ink-50 pt-7">
            {links.filter((l) => l.href && !l.pending).map((l) => (
              <a
                key={l.label} href={l.href} target="_blank" rel="noreferrer"
                className="u-label rounded-[2px] border border-ink-100 px-4 py-2.5 text-ink-700 transition-colors hover:border-wash-ochre hover:text-wash-ochre-ink"
              >
                {l.label} ↗
              </a>
            ))}
          </div>
        )}

        {pending.length > 0 && (
          <aside className="mt-14 rounded-[3px] border border-dashed border-wash-ochre/50 bg-wash-ochre/[0.04] p-6">
            <p className="u-label text-wash-ochre-ink">Dev only · your writing queue</p>
            <ul className="mt-4 space-y-4">
              {pending.map((s) => (
                <li key={s.heading}>
                  <p className="font-display text-[1.05rem] font-semibold text-ink-900">{s.heading}</p>
                  <p className="mt-1.5 max-w-prose text-[0.94rem] leading-relaxed text-ink-500">{s.todo}</p>
                </li>
              ))}
            </ul>
          </aside>
        )}

        <div className="mt-14 border-t border-ink-50 pt-7">
          <Link to="/" className="u-label text-ink-400 transition-colors hover:text-wash-ochre-ink">← All work</Link>
        </div>
      </Section>
    </article>
  );
}
