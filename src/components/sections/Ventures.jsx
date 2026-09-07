import { ventures } from '../../content/ventures';
import Section from '../Section';
import SectionHead from '../tech/SectionHead';
import CaseCard from '../CaseCard';
import LoopDiagram from '../ink/LoopDiagram';
import Marginalia from '../ink/Marginalia';

/**
 * The one section allowed a heavier hand: the subject is classical Chinese
 * narrative, so ink here is native rather than applied. Everything else on
 * the site stays restrained.
 *
 * Only cleared work appears in this lane. See the confidentiality note in
 * src/content/ventures.js before adding anything.
 */
export default function Ventures() {
  return (
    <Section id="ventures">
      <SectionHead
        num="03"
        aside="0 → 1"
        title="A product I am building, not specifying"
        lede="An LLM-native product built with a co-founder, and an attempt at a question I keep meeting in enterprise work from the other direction: what does a generative system feel like when someone has drawn its boundaries on purpose?"
      />

      <div className="relative lg:ml-[13.5rem]">
        <Marginalia>90% reading and living it. 10% changing fate.</Marginalia>

        <div className="space-y-14">
          {ventures.map((v) => (
            <article key={v.slug}>
              <LoopDiagram steps={v.loop} note={v.loopNote} />
              <CaseCard item={v} />
              {v.shots?.length > 0 && (
                <ul className="mt-5 flex snap-x gap-3 overflow-x-auto pb-2">
                  {v.shots.map((s) => (
                    <li key={s.src} className="shrink-0 snap-start">
                      <img
                        src={s.src} alt={s.alt} loading="lazy" decoding="async"
                        width="120" height="261"
                        className="h-[261px] w-[120px] rounded-[3px] object-cover ring-1 ring-ink-50"
                      />
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
}
