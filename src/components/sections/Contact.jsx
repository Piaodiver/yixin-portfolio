import { contact } from '../../content/site';
import Section from '../Section';
import SectionHead from '../tech/SectionHead';

export default function Contact() {
  return (
    <Section id="contact">
      <SectionHead num="09" aside="Contact" title="Let's talk" lede={contact.lede} />

      <div className="grid gap-10 md:grid-cols-[1fr_auto]">
        <div>
          <p className="u-label mb-3.5 text-ink-400">Open to</p>
          <ul className="space-y-2">
            {contact.open.map((o) => (
              <li key={o} className="flex items-baseline gap-2.5 text-[0.98rem] text-ink-700">
                <span aria-hidden="true" className="text-wash-sage-ink">·</span>{o}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap items-start gap-3">
          {contact.links.map((l, i) => (
            <a
              key={l.label}
              href={l.href}
              target={l.href.startsWith('http') ? '_blank' : undefined}
              rel={l.href.startsWith('http') ? 'noreferrer' : undefined}
              className={
                i === 0
                  ? 'u-label rounded-[2px] bg-ink-900 px-4 py-2.5 text-paper transition-colors hover:bg-wash-sage'
                  : 'u-label rounded-[2px] border border-ink-100 px-4 py-2.5 text-ink-700 transition-colors hover:border-wash-ochre hover:text-wash-ochre-ink'
              }
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </Section>
  );
}
