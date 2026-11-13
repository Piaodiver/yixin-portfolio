import Hero from './Hero';
import SideNav from './SideNav';
import Places from './Places';
import { CaseHead, Prose } from './Place';
import CaseArchitecture from './CaseArchitecture';
import Fold from './Fold';
import Reveal from './Reveal';
import About from './About';
import End from './End';
import Questions from './Questions';
import Reading from './Reading';
import { cases, built, israel, salesforce, china, baidu, unitedStates, work } from '../../content/v2';
import { archGraphs } from '../../content/arch-graphs';
import { singaporeChapter } from '../../content/places-chapters';

/**
 * The page in two speeds (step 39, 2026-11-12): hero, then The work (the two
 * agents, in full, no scene), then Four places (the four scenes side by side,
 * each picture a door to its chapter, step 41), then Building now, About, Questions,
 * Reading, End. The old order, four equal place chapters, is at git tag
 * places-v1-before-step39.
 */
export default function Page() {
  const stops = [
    {
      id: 'china',
      inside: ['lgmg', 'baidu'],
      children: (
        <>
          <Prose paragraphs={china} />
          <div className="mt-10">
            <p id="baidu" className="v2-eyebrow pt-2">{baidu.eyebrow}</p>
            <Prose paragraphs={baidu.paragraphs} />
          </div>
          <div className="mt-10">
            <CaseHead item={cases.lgmg} />
            <Prose paragraphs={cases.lgmg.long} />
          </div>
        </>
      ),
    },
    {
      id: 'israel',
      inside: [],
      children: (
        <>
          <p className="v2-eyebrow">Tel Aviv University · EyeSight Technologies · 2015–2017</p>
          <Prose paragraphs={israel} />
        </>
      ),
    },
    {
      id: 'singapore',
      inside: [],
      children: (
        <>
          <p className="v2-eyebrow">{singaporeChapter.eyebrow}</p>
          <p className="v2-chapter__lead mt-3">{singaporeChapter.life}</p>
          <p className="v2-chapter__lead">{singaporeChapter.lead}</p>
          <div className="v2-chapter__cards">
            {singaporeChapter.cards.map((c) => (
              <a key={c.caseId} className="v2-chapter__card" href={c.href}>
                <span className="v2-eyebrow">{c.eyebrow}</span>
                <span>{cases[c.caseId].card}</span>
                <span className="v2-chapter__card-read">{singaporeChapter.read}</span>
              </a>
            ))}
          </div>
        </>
      ),
    },
    {
      id: 'united-states',
      inside: [],
      children: unitedStates.map((block, i) => (
        <div key={block.eyebrow} className={i === 0 ? '' : 'mt-10'}>
          <p className="v2-eyebrow pt-2">{block.eyebrow}</p>
          <Prose paragraphs={block.paragraphs} />
        </div>
      )),
    },
  ];

  return (
    <main id="main">
      <SideNav />
      <Hero />

      <section id="work" className="pt-10 md:pt-14">
        <Reveal className="v2-wrap pb-5">
          <h2 className="v2-h2">
            {work.title}
            <small className="v2-h2__sub">{work.sub}</small>
          </h2>
          <p className="v2-work__line">{work.line}</p>
        </Reveal>
        <Reveal className="v2-wrap py-6 md:py-8">
          <p id="salesforce" className="v2-eyebrow pt-2">{salesforce.eyebrow}</p>
          <Prose paragraphs={salesforce.paragraphs} />
          <div className="mt-12">
            <CaseHead item={cases.nova} />
            <Prose paragraphs={[cases.nova.summary]} />
            <Fold id={cases.nova.id} label={cases.nova.foldLabel}>
              <Prose paragraphs={cases.nova.long} />
              <CaseArchitecture arch={cases.nova.architecture} graph={archGraphs.nova} />
            </Fold>
          </div>
          <div className="mt-12">
            <CaseHead item={cases.wizai} />
            <Prose paragraphs={[cases.wizai.summary]} />
            <Fold id={cases.wizai.id} label={cases.wizai.foldLabel}>
              <Prose paragraphs={cases.wizai.long} />
            </Fold>
          </div>
        </Reveal>
      </section>

      <Places stops={stops} />

      <section id="building" className="pt-10 md:pt-14">
        <Reveal className="v2-wrap pb-10 md:pb-12">
          <h2 className="v2-h2">Building now<small className="v2-h2__sub">Seattle · since 2026</small></h2>
          <ul className="mt-6 divide-y divide-rule border-y border-rule">
            {built.map((b) => (
              <li key={b.title} id={b.id} className="py-4">
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
        </Reveal>
      </section>

      <About />
      <Questions />
      <Reading />
      <End />
    </main>
  );
}
