import Hero from './Hero';
import SideNav from './SideNav';
import Place, { CaseHead, Prose } from './Place';
import { cases, built, links, israel, about } from '../../content/v2';

export default function Page() {
  return (
    <main id="main">
      <SideNav />
      <Hero />

      <Place place="china">
        <CaseHead item={cases.lgmg} />
        <Prose paragraphs={cases.lgmg.long} />
      </Place>

      <Place place="israel">
        <p className="v2-eyebrow">Tel Aviv University · EyeSight Technologies · 2015–2017</p>
        <Prose paragraphs={israel} />
      </Place>

      <Place place="singapore">
        <CaseHead item={cases.nova} />
        <Prose paragraphs={cases.nova.long} />
        <div className="mt-12">
          <CaseHead item={cases.wizai} />
          <Prose paragraphs={cases.wizai.long} />
        </div>
      </Place>

      <Place place="united-states" title="Now">
        <p className="v2-eyebrow mt-8">Built</p>
        <ul className="mt-3 divide-y divide-rule border-y border-rule">
          {built.map((b) => (
            <li key={b.title} className="py-4">
              <p className="font-body text-[1rem] font-medium text-ink-900">
                {b.href ? <a className="v2-link" href={b.href}>{b.title}</a> : b.title}
              </p>
              <p className="mt-1 max-w-prose text-[0.92rem] text-ink-700">{b.body}</p>
            </li>
          ))}
        </ul>
      </Place>

      <section id="about" className="v2-wrap border-t border-rule py-14 md:py-20">
        <img className="v2-photo" src={`${import.meta.env.BASE_URL}yixin.jpg`} width="720" height="900" alt="Yixin Liu" loading="lazy" />
        <div className="v2-prose mt-8">
          {about.map((t) => <p key={t}>{t}</p>)}
          <p className="v2-placeholder">[About: the route, eight years by place, pending]</p>
          <p className="v2-placeholder">[About: outside work, pending]</p>
        </div>
        <p className="mt-10 text-[0.92rem]">
          <a className="v2-link" href={`mailto:${links.email}`}>{links.email}</a>
          <span className="mx-3 text-ink-300">/</span>
          <a className="v2-link" href={links.github}>GitHub</a>
          <span className="mx-3 text-ink-300">/</span>
          <a className="v2-link" href={links.linkedin}>LinkedIn</a>
        </p>
      </section>
    </main>
  );
}
