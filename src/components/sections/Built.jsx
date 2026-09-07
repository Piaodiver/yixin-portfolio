import { built, buildLog } from '../../content/built';
import Section from '../Section';
import SectionHead from '../tech/SectionHead';
import CaseCard from '../CaseCard';
import StatusChip from '../tech/StatusChip';
import Coord from '../tech/Coord';

export default function Built() {
  return (
    <Section id="built">
      <SectionHead
        num="04"
        aside="Built"
        title="Where I keep the deterministic core pure"
        lede="A cost model whose tests pin the claims its README makes, and a product atlas built without a framework to hide behind. Both are mine end to end, so this is where the engineering argument gets made with specifics."
      />

      <div className="grid gap-5 md:grid-cols-2">
        {built.map((b) => <CaseCard key={b.slug} item={b} />)}
      </div>

      {/* A roadmap, not projects. Cards imply something you can open. */}
      <div className="mt-14 rounded-[3px] border border-ink-50 bg-paper-sunk/40 p-6 md:p-7">
        <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-ink-50 pb-4">
          <span className="u-label text-ink-700">Build log</span>
          <Coord>updated {buildLog.updated}</Coord>
        </div>

        <ol className="mt-5 space-y-6">
          {buildLog.entries.map((e) => (
            <li key={e.name} className="grid gap-x-5 gap-y-2 sm:grid-cols-[7.5rem_1fr]">
              <div className="flex items-baseline gap-2.5 sm:flex-col sm:items-start sm:gap-2">
                <span className="u-label u-nums text-ink-400">{e.date}</span>
                <StatusChip status={e.status} />
              </div>
              <div>
                <p className="font-mono text-[0.9rem] font-medium text-ink-900">{e.name}</p>
                <p className="mt-1.5 max-w-prose text-[0.94rem] leading-relaxed text-ink-500">{e.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-6 border-t border-ink-50 pt-4 text-[13.5px] italic text-ink-500">
          Listed as a log rather than as project cards, because a card implies something you can open.
          Each moves up into the work above when there is code worth reading.
        </p>
      </div>
    </Section>
  );
}
