import Hero from './Hero';
import SideNav from './SideNav';
import Place, { CaseHead, Prose } from './Place';
import About from './About';
import End from './End';
import { cases, built, israel, salesforce, china, baidu, unitedStates, placeById as P } from '../../content/v2';

export default function Page() {
  return (
    <main id="main">
      <SideNav />
      <Hero />

      <Place place="china" title={P["china"].label} sub={P["china"].sub}>
        <Prose paragraphs={china} />
        <div className="mt-12">
          <p className="v2-eyebrow pt-2">{baidu.eyebrow}</p>
          <Prose paragraphs={baidu.paragraphs} />
        </div>
        <div className="mt-12">
          <CaseHead item={cases.lgmg} />
          <Prose paragraphs={cases.lgmg.long} />
        </div>
      </Place>

      <Place place="israel" title={P["israel"].label} sub={P["israel"].sub}>
        <p className="v2-eyebrow">Tel Aviv University · EyeSight Technologies · 2015–2017</p>
        <Prose paragraphs={israel} />
      </Place>

      <Place place="singapore" title={P["singapore"].label} sub={P["singapore"].sub}>
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

      <Place place="united-states" title={P["united-states"].label} sub={P["united-states"].sub}>
        {unitedStates.map((block, i) => (
          <div key={block.eyebrow} className={i === 0 ? '' : 'mt-12'}>
            <p className="v2-eyebrow pt-2">{block.eyebrow}</p>
            <Prose paragraphs={block.paragraphs} />
          </div>
        ))}
        <p className="v2-eyebrow mt-12 pt-2">Seattle · since 2026</p>
        <p className="v2-eyebrow mt-6">Building now</p>
        <ul className="mt-3 divide-y divide-rule border-y border-rule">
          {built.map((b) => (
            <li key={b.title} className="py-4">
              <p className="font-body text-[1rem] font-medium text-ink-900">
                {b.href ? <a className="v2-link" href={b.href}>{b.title}</a> : b.title}
              </p>
              <p className="mt-1 max-w-prose text-[0.92rem] text-ink-700">{b.body}</p>
              {b.more ? (
                <p className="mt-1 max-w-prose text-[0.92rem] text-ink-700">
                  {b.more.text}<a className="v2-link" href={b.more.href}>{b.more.label}</a>.
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      </Place>

      <About />
      <End />
    </main>
  );
}
