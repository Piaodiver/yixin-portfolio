# yixin-portfolio

Personal site for Yixin Liu — enterprise AI solutions architecture.
**[piaodiver.github.io/yixin-portfolio](https://piaodiver.github.io/yixin-portfolio/)**

React + Vite + Tailwind, deployed to GitHub Pages by Actions on every push to `main`.

---

## What the site is trying to do

A portfolio for an architect has a different job than one for a front-end
engineer. Nobody needs proof I can centre a div; they need to believe two
things at once — that I have shipped enterprise systems at real scale, and
that I actually build rather than only specify. So the work is split into
three lanes, and the reader is told which kind of evidence they are looking at:

| Lane | Claim | Evidence |
|---|---|---|
| **Enterprise** | I ship at scale, under governance | Four delivered engagements — SAP, Wiz.AI, Salesforce |
| **0→1** | I build LLM-native products | Two products with a co-founder |
| **Built** | I write the code | A cost model with a test suite; a product atlas |

Each case study is a route of its own (`#/work/<slug>`) so a single project
can be linked directly in a cold email.

### On not shipping empty pages

Two of the planned projects have no code yet. They appear as a dated **build
log** rather than as project cards, because a card implies something you can
open. A section with a heading and nothing under it is worse than no section:
it reads as abandoned rather than as planned.

Unwritten case-study sections work the same way. Each one carries a `todo`
string describing what needs writing and why; those render in `npm run dev`
as a visible queue and are stripped from the production build. Nothing ships
half-written.

---

## Design system

「科技 × 水墨」 — instruments drawn on paper.

Ink is atmosphere, not decoration: a warm paper ground, two washes drifting
slowly enough to read as weather, and entrances that settle rather than
slide. The technical register comes from **instrumentation** rather than
sci-fi vocabulary — section numbers, coordinate marks, tabular figures,
status chips, diagrams drawn as line work. Glow and neon would fight the ink;
a surveyor's crosshair does not.

Tokens live in [`src/styles/tokens.css`](src/styles/tokens.css).

**Two registers of the same three colours.** The bright washes are for marks —
diagram dots, strokes, chip borders. At 10–11px none of them clears 4.5:1 on
paper, so text that happens to be sage or ochre uses the `-ink` variants:
same hue, same role, readable. Every value in the file carries its measured
contrast ratio in a comment.

**Light only, on purpose.** Ink on paper is the concept; a dark inversion
would need a different palette logic ("night paper"), not a flipped one.
`body` paints `--paper` explicitly so a dark host theme never shows through.

### Motion budget

Restraint here is a set of numbers, not a preference:

- ≤6 animated elements per viewport, each ≤800ms
- no WebGL, no Three.js, no Lottie, no scroll-jacking, no parallax on mobile
- `prefers-reduced-motion` turns all of it off

`feTurbulence` is the right tool for ink bleeding into paper and it is
evaluated per pixel, so [`InkReveal`](src/components/ink/InkReveal.jsx) keeps
it on a short leash: only during the ~700ms entrance, only on elements under
~400px tall, and **the filter is dropped and its `<svg>` unmounted the moment
it lands** — otherwise every later repaint keeps paying for it.

### Entrances can only add

[`useEnter`](src/components/ink/useReveal.js) exists because the obvious
implementation of reveal-on-scroll has a failure mode that costs you the
whole page. If the default is `opacity: 0` and an observer reveals it, then
anything the reader *jumps past* — a deep link, browser Find, a restored
scroll position — is never intersected and stays invisible forever.

So the default is visible. An element arms an entrance only when it can
prove, before first paint, that it starts below the fold. Same rule for
`Metric`: the real figure is the initial state, so a slow load shows
`$2M+`, never `$0M+`.

---

## Running it

```bash
npm install
npm run dev      # http://localhost:5173/yixin-portfolio/
npm run build
npm run preview
```

Content is plain data in [`src/content/`](src/content) — `enterprise.js`,
`ventures.js`, `built.js`, `site.js`. Editing the site is editing those four
files; the components do not contain copy.

---

## Layout

```
src/
  content/        the entire text of the site, as data
  components/
    ink/          PaperGround · InkReveal · InkRule · LoopDiagram · Marginalia
    tech/         Coord · Metric · StatusChip · SectionHead
    sections/     one per section of the home page
  routes/         Home · WorkDetail · NotFound
  styles/         tokens.css (palette, motion) · fonts.css (self-hosted faces)
```

Routing is `HashRouter`. This is a project site served from
`/yixin-portfolio/`, where `BrowserRouter` needs a 404.html redirect and
flashes on entry; hash routes are ugly but deep-link reliably, and being
linkable matters more here than being pretty.

Fonts are self-hosted variable woff2 (Fraunces, Inter, JetBrains Mono).
Google's CDN costs two extra handshakes before the first glyph can paint and
its stylesheet blocks render.

---

## Measured

`npx lighthouse http://localhost:4173/yixin-portfolio/` against a production
preview:

| | |
|---|---|
| Performance | 95–97 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |
| CLS | 0 |
| First view | ~231 KB |

---

## Notes

Built with Claude Code. The visual system, the content structure, and the two
entrance-animation fixes described above came out of that work; the case
studies, the enterprise history, and the judgment in them are mine.

Sections I have not written yet are tracked in
[WRITING-QUEUE.md](WRITING-QUEUE.md) and are deliberately absent from the
build rather than shipped half-finished.
