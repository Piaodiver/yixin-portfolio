import { expertise } from '../../content/site';
import Section from '../Section';
import SectionHead from '../tech/SectionHead';

export default function Expertise() {
  return (
    <Section id="expertise">
      <SectionHead num="05" aside="Expertise" title="Where I create the most value" />
      <div className="grid gap-x-10 gap-y-10 md:grid-cols-2">
        {expertise.map((e) => (
          <div key={e.title}>
            <span aria-hidden="true" className="text-[1.1rem] text-wash-sage">{e.mark}</span>
            <h3 className="mt-2 font-display text-[1.2rem] font-semibold text-ink-900">{e.title}</h3>
            <p className="mt-2 max-w-prose text-[0.96rem] leading-relaxed text-ink-500">{e.body}</p>
            <ul className="mt-3.5 flex flex-wrap gap-1.5">
              {e.tags.map((t) => (
                <li key={t} className="u-label rounded-[2px] border border-ink-50 px-2 py-1 text-[10px] text-ink-500">{t}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
