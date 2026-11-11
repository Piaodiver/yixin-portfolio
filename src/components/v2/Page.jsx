import Hero from './Hero';
import SideNav from './SideNav';
import Place, { CaseHead, Prose } from './Place';
import About from './About';
import End from './End';
import { cases, built, israel, salesforce, china } from '../../content/v2';

export default function Page() {
  return (
    <main id="main">
      <SideNav />
      <Hero />

      <Place place="china" title="China" sub="Beijing · Baidu, SAP · 2017–2023">
        <Prose paragraphs={china} />
        <div className="mt-12">
          <CaseHead item={cases.lgmg} />
          <Prose paragraphs={cases.lgmg.long} />
        </div>
      </Place>

      <Place place="israel" title="Israel" sub="Tel Aviv · Tel Aviv University · 2015–2017">
        <p className="v2-eyebrow">Tel Aviv University · EyeSight Technologies · 2015–2017</p>
        <Prose paragraphs={israel} />
      </Place>

      <Place place="singapore" title="Singapore" sub="Wiz.AI, Salesforce · 2024–2026">
        <p className="v2-eyebrow pt-2">{salesforce.eyebrow}</p>
        <Prose paragraphs={salesforce.paragraphs} />
        <div className="mt-12">
          <CaseHead item={cases.nova} />
          <Prose paragraphs={cases.nova.long} />
        </div>
        <div className="mt-12">
          <CaseHead item={cases.wizai} />
          <Prose paragraphs={cases.wizai.long} />
        </div>
      </Place>

      <Place place="united-states" title="United States" sub="Seattle · since 2026">
        <p className="v2-eyebrow">Building now</p>
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

      <About />
      <End />
    </main>
  );
}
