# What only you can write

These sections are the difference between a portfolio that passes an architect
interview and one that fails it. They are deliberately empty: a fabricated
architecture section is the one thing on this site that would actively hurt you,
because the interview will spend twenty minutes exactly there.

They render in `npm run dev` as an orange box at the foot of each case study, and
are stripped from the production build. To fill one in, replace its `todo` string
with a `body: [ ... ]` array in the matching file under `src/content/`.

## Scaling enterprise AI with Agentforce & Data Cloud

`Enterprise · Salesforce · 2025–26`  —  `#/work/salesforce-agentforce`

- [ ] **Architecture** — Pick ONE of these 20 engagements and draw it: where Data Cloud sat, how identity resolution was handled, what grounded the agent, and where the trust boundary was. Then 3–5 decisions in the form "constraint → options → chose → would revisit if". This is the section an Applied AI Architect interview will spend twenty minutes on.
- [ ] **What I'd do differently** — One honest thing. The 35% figure implies you found a bottleneck — name what it was and what you would sequence differently now.

## First-of-its-kind Salesforce AI implementation in the region

`Enterprise · Salesforce · 2025`  —  `#/work/salesforce-regional-first`

- [ ] **Architecture** — What made this "first of its kind"? Name the specific capability nobody in the region had put into production before, and what was unresolved about it. That is the whole story and it is currently missing.
- [ ] **What I'd do differently** — Being first means something went sideways. What was it?

## Wiz.AI's first LLM product customer

`Enterprise · Wiz.AI · 2024`  —  `#/work/wizai-first-llm-customer`

- [ ] **Architecture** — This is the single most Anthropic-relevant case on the page and it is currently three sentences long. Expand it: what the LLM actually did, how you grounded it, what you did about hallucination and escalation to a human, how quality was measured before go-live, and what the customer was afraid of. Treat this as the flagship.
- [ ] **What I'd do differently** — First-of-anything deployments teach the most. What would you set up differently on day one?

## Lead-to-Cash CRM transformation for a lighthouse customer

`Enterprise · SAP · 2019–23`  —  `#/work/sap-lighthouse`

- [ ] **Architecture** — Multi-entity Lead-to-Cash is genuinely hard and this is your longest engagement. Sketch the entity model and the integration boundary, and name the two or three decisions that made or nearly broke it.
- [ ] **What I'd do differently** — Four years is long enough to have watched a decision age. Which one?

## Enterprise LLM deployment TCO calculator

`Built · Open source · 2026`  —  `#/work/llm-tco-calculator`

- [ ] **A worked scenario** — Take one real enterprise shape you have actually sold into — SAP, Wiz.AI, or Salesforce — and walk it end to end: volume, token shape, what you would recommend, what the year costs, what you would tell the CFO. Two or three paragraphs. This is the section that proves you have been in the room, and it is the one an AI cannot write for you.
- [ ] **What I would ask before quoting any of this** — The five or six questions you would actually ask in a scoping call before putting a number on a slide. This is the difference between a calculator and a pre-sales conversation — and it is knowledge you already have.

---

## Needed, but not in the site content

- [ ] **Your split with Shane**, one or two sentences, on the Journey to the West reader. Recruiters read co-founded projects asking exactly one question: what did *this* person do.
- [x] The second venture is **withheld at the co-founder's request** and is deliberately absent from both the site and this repo's history. Nothing to do here until that changes.
- [ ] **Screenshots at 2x.** The MultiVerse captures are 285x620 (1x simulator), so they are soft on a retina screen. Re-export at 2x or 3x.
- [ ] **resume.pdf** into `public/` if you want a download link in the hero.
- [ ] **llm-tco-calculator is not a git repo.** It has a LICENSE and a README written for publication but has never been committed or pushed. The site links to a repo that does not exist yet.
- [ ] **DECISIONS.md** in that repo is a template with empty fields — and its own header says an AI should not fill it in.

_10 case-study sections outstanding._
