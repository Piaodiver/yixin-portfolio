import { Link } from 'react-router-dom';
import { beliefs } from '../../content/site';
import Section from '../Section';
import SectionHead from '../tech/SectionHead';
import InkRule from '../ink/InkRule';

export default function Beliefs() {
  return (
    <Section id="beliefs">
      <SectionHead
        num="07"
        aside="Beliefs"
        title="How I think about building this"
        lede="Three, and each one is meant to be arguable. The last is the one I would most want to be challenged on."
      />

      <div className="space-y-12">
        {beliefs.map((b) => (
          <article key={b.title} className="max-w-prose">
            <span aria-hidden="true" className="text-[1.1rem] text-wash-sage">{b.mark}</span>
            <h3 className="mt-2 font-display text-[1.25rem] font-semibold leading-snug text-ink-900 md:text-[1.4rem]">
              {b.title}
            </h3>
            <InkRule className="my-4 max-w-[6rem]" />
            <div className="space-y-3.5 text-[0.98rem] leading-relaxed text-ink-500">
              {b.body.map((p, i) => <p key={i}>{p}</p>)}
            </div>
            {b.seeAlso && (
              <p className="mt-4">
                {b.seeAlso.href.startsWith('#/') ? (
                  <Link
                    to={b.seeAlso.href.slice(1)}
                    className="u-label border-b border-ink-100 pb-0.5 text-wash-ochre-ink transition-colors hover:border-wash-ochre"
                  >
                    {b.seeAlso.label} →
                  </Link>
                ) : (
                  <a
                    href={b.seeAlso.href}
                    className="u-label border-b border-ink-100 pb-0.5 text-wash-ochre-ink transition-colors hover:border-wash-ochre"
                  >
                    {b.seeAlso.label} →
                  </a>
                )}
              </p>
            )}
          </article>
        ))}
      </div>
    </Section>
  );
}
