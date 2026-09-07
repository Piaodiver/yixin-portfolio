/**
 * Lane §02 — 0→1 products built with a co-founder.
 *
 * CONFIDENTIALITY. Shane cleared the Journey to the West reader's front-end
 * demo on 2026-09-07 — screenshots and product positioning only, no backend
 * and no implementation detail. Everything below is either copy Yixin wrote
 * himself or what is visible on screen.
 *
 * A second venture exists and is NOT cleared for publication. Do not add it
 * in any form — not as a card, a placeholder, a teaser, or commented-out
 * data. This repository is public, so anything written in this file is
 * published whether or not it renders, and git history keeps it even after
 * a later deletion. Add it only when Shane says so, in writing.
 */
import xiyouHome from '../assets/shots/xiyou-zh-1-home.jpg';
import xiyouReader from '../assets/shots/xiyou-zh-2-reader.jpg';
import xiyouFate from '../assets/shots/xiyou-zh-3-fate.jpg';
import xiyouEn from '../assets/shots/xiyou-en-2-reader.jpg';

export const ventures = [
  {
    slug: 'multiverse-xiyou',
    lane: 'venture',
    org: 'MULTIVERSE I',
    region: 'with Shane',
    year: '2026',
    status: 'ios',
    kicker: 'Journey to the West, as anyone in it',
    title: 'Become any character. Live a life of your own.',
    summary: 'An AI interactive reader set in Journey to the West. Play Sun Wukong or Tang Sanzang — or a minor demon, a villager, a bystander who appears for one line in the original.',
    loop: ['Enter a character', 'Face a decision', 'Reach a full ending'],
    loopNote: '90% reading and living it · 10% changing fate',
    shots: [
      { src: xiyouHome,   alt: 'Chapter opening screen: the chapter title 白虎岭 set in serif type on warm paper, with a thin curved line marking three points in the chapter.' },
      { src: xiyouReader, alt: 'Reading view with justified Chinese body text on a paper background.' },
      { src: xiyouFate,   alt: 'A decision point offering three choices plus a free-text field, none of them showing any numeric consequence.' },
      { src: xiyouEn,     alt: 'The same reading view in English, using a separate set of typographic rules.' },
    ],
    sections: [
      {
        heading: 'The premise',
        body: [
          'Most interactive fiction asks you to drive the plot. This does the opposite: you mostly read, and occasionally the story stops and asks what you would do. The ratio is deliberate and it is the product — 90% reading and living it, 10% changing fate. Push the second number up and it stops being a novel; push it down and your choices stop mattering.',
          'The reach of the idea is that you need not be a protagonist. The original text is dense with characters who exist for a single line. Playing one of them is a different novel entirely.',
        ],
      },
      {
        heading: 'How it works',
        body: [
          'The world is hand-authored: the source text and deliberate design fix the characters, their relationships, the rules, the key events, and the boundaries of the story. The model works inside that frame — given the character you chose and every decision you have made, it writes what actually happens to you.',
          'That split is the whole design. A generative system with no authored frame drifts into incoherence within a few turns; an authored system with no generation is a branching tree someone has to write by hand, forever. Holding the boundary in one place and the generation in the other is what makes it both coherent and unbounded.',
        ],
      },
      {
        heading: 'What is hard about it',
        body: [
          'The interesting problem is not making a model write well. It is making a model write inside a frame it cannot see the edges of, and keeping it there over an arc long enough to end. That is the same constraint enterprise deployment runs into — a system that is useful precisely to the degree it stays inside a boundary somebody else drew — with the pleasant difference that here the failure mode is a bad story rather than a bad quarter.',
          'The second hard part is restraint in the interface. A choice screen that shows you what each option is worth turns reading into optimisation. So the choices carry no numbers, and what they cost you surfaces only afterwards.',
        ],
      },
      {
        heading: 'My role',
        todo: 'One or two sentences on the split with Shane — who owns what. Recruiters read co-founded projects with a specific question in mind: what did THIS person actually do. Answer it plainly.',
      },
    ],
    links: [],
    note: 'A front-end demo: it runs on local content with no network calls. Bilingual, with a separate set of typographic rules for each language.',
  },
];
