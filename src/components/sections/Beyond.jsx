import { beyond } from '../../content/site';
import Section from '../Section';
import SectionHead from '../tech/SectionHead';

export default function Beyond() {
  return (
    <Section id="beyond">
      <SectionHead num="08" aside="Beyond work" title="The person beyond the profile" />
      <div className="grid gap-x-10 gap-y-10 md:grid-cols-3">
        {beyond.map((b) => (
          <div key={b.title}>
            <span aria-hidden="true" className="text-[1.1rem] text-wash-sage">{b.mark}</span>
            <h3 className="mt-2 font-display text-[1.1rem] font-semibold text-ink-900">{b.title}</h3>
            <ul className="mt-2.5 flex flex-wrap gap-1.5">
              {b.tags.map((t) => (
                <li key={t} className="u-label rounded-[2px] border border-ink-50 px-2 py-1 text-[10px] text-ink-500">{t}</li>
              ))}
            </ul>
            <p className="mt-3.5 text-[0.94rem] leading-relaxed text-ink-500">{b.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
