/**
 * Lane §03 — things I wrote the code for.
 *
 * Unlike §02 there is no confidentiality constraint here: both projects are
 * Yixin's own, written for publication. So this is the lane where the
 * engineering argument gets made with specifics.
 */
export const built = [
  {
    slug: 'llm-tco-calculator',
    lane: 'built',
    org: 'Open source',
    region: 'Python · Streamlit',
    year: '2026',
    status: 'shipped',
    kicker: 'What a Claude workload actually costs',
    title: 'Enterprise LLM deployment TCO calculator',
    summary: 'A cost model for a year of a Claude workload, and — more usefully — which architectural levers actually move the number. Three of its findings contradict the standard advice.',
    metrics: [
      { value: '21.7%',    label: 'Cache hit rate below which caching costs more' },
      { value: '50%',      label: 'Batch API discount, the largest single lever' },
      { value: '745',      label: 'Lines, model and UI kept separate' },
    ],
    sections: [
      {
        heading: 'The problem',
        body: [
          'Every cost calculator multiplies tokens by a price. That is the easy half, and it is the half that tells a customer nothing. The useful half is knowing which levers are real, which are marginal, and which ones quietly make the bill bigger — and no spreadsheet I was handed in a customer meeting ever answered that.',
        ],
      },
      {
        heading: 'Three findings that survive contact with a customer',
        body: [
          'Prompt caching is sold as "90% off your input tokens." That is true of a cache read — but a cache write costs 1.25× a plain input token, and every miss is a write. So caching is a bet on hit rate, and the bet has a breakeven at 21.7%. Below that line, turning caching on makes the bill larger. It matters most exactly where people reach for it first: a 200-request/day pilot on Opus 5 with a 20K prefix and a 15% hit rate costs $9,143/year with caching on versus $8,578 with it off. The optimisation loses $566.',
          'Even a great hit rate is not a great discount, because caching cannot touch output and output is priced at 5× input. On a coding-agent shape — 30K of repo context re-read every turn, 6K generated — a 90% hit rate on the prefix cuts the total bill by 37%, not 90%. And 6K of output costs exactly as much as re-reading that 30K prefix every single turn. On output-heavy agent workloads, capping generation length is the bigger lever, and it is the one nobody puts in the architecture diagram.',
          'The Batch API is the largest single lever and it costs only latency: a flat 50% off input and output. On 20K nightly extractions that is $306,600 → $153,300. The question is never affordability, it is whether anyone needs the answer inside an hour — and for overnight extraction the answer is usually no.',
        ],
      },
      {
        heading: 'How it is built',
        body: [
          'The cost model is pure functions over dataclasses in `tco.py`, which never imports Streamlit; `app.py` only renders. Every dollar figure in the project lives in `pricing.py` next to the URL it came from and the date it was read — a cost model that does not say when its numbers were taken is not a model, it is a screenshot.',
          'The test suite is not there for regression safety on a 200-line model. It pins the claims the README makes, so that if the breakeven figure or the caching-trap example stops being true, a test fails instead of the documentation quietly becoming wrong.',
        ],
      },
      {
        heading: 'What it deliberately does not model',
        body: [
          'Retries and failures (routinely 5–15% on top), evaluation and monitoring traffic, tokenizer differences between model generations, and everything that is not inference — vector storage, orchestration, egress, and the engineering time to run any of it. Being explicit about the edges is part of the deliverable: an estimate whose limits are unstated is not usable in a procurement conversation.',
          'It also cannot tell you whether the cheaper model is good enough. That is an evaluation question, and it is the one that should be answered first.',
        ],
      },
      {
        heading: 'A worked scenario',
        todo: 'Take one real enterprise shape you have actually sold into — SAP, Wiz.AI, or Salesforce — and walk it end to end: volume, token shape, what you would recommend, what the year costs, what you would tell the CFO. Two or three paragraphs. This is the section that proves you have been in the room, and it is the one an AI cannot write for you.',
      },
      {
        heading: 'What I would ask before quoting any of this',
        todo: 'The five or six questions you would actually ask in a scoping call before putting a number on a slide. This is the difference between a calculator and a pre-sales conversation — and it is knowledge you already have.',
      },
    ],
    links: [
      { label: 'Repo', href: 'https://github.com/Piaodiver/llm-tco-calculator' },
      { label: 'Live app', href: '', pending: true },
    ],
    note: 'Pricing retrieved from claude.com/pricing on 2026-09-07 and recorded with that date in the source.',
  },
  {
    slug: 'claude-adoption-atlas',
    lane: 'built',
    org: 'Open source',
    region: 'HTML · CSS · JS',
    year: '2026',
    status: 'live',
    kicker: 'Front-end fundamentals, built in public',
    title: 'Anthropic Claude adoption atlas',
    summary: "An interactive map of Anthropic's product line as landmark buildings — each panel covering one product, with comparison tables and code previews.",
    sections: [
      {
        heading: 'What it is',
        body: [
          "An interactive map presenting Anthropic's product line as a set of landmark buildings. Each panel covers one product — Claude.ai, Claude for Enterprise, the Claude API — with verified positioning, comparison tables, and code previews.",
        ],
      },
      {
        heading: 'Why I built it',
        body: [
          'Two reasons, and the second is the real one. It is a working reference for explaining the product line to an enterprise buyer — which is a thing I do constantly and had no good artefact for. And it was how I learned front-end fundamentals properly: semantic HTML, layout and theming in CSS, data-driven rendering, and accessibility standards, with no framework to hide behind.',
        ],
      },
      {
        heading: 'Status',
        body: [
          'Three of five building panels are deployed with verified content; two remain placeholders. Listed here as it stands rather than as it will be.',
        ],
      },
    ],
    links: [
      { label: 'Live site', href: 'https://piaodiver.github.io/anthropic-claude-adoption-atlas/' },
      { label: 'Repo', href: 'https://github.com/Piaodiver/anthropic-claude-adoption-atlas' },
    ],
  },
];

/**
 * Not projects — a roadmap. Rendered as a dated log rather than as cards,
 * because a card implies something you can open and these cannot be opened
 * yet. Each graduates into `built` above when it has code worth reading.
 */
export const buildLog = {
  updated: '2026-09-07',
  entries: [
    {
      date: '2026-10',
      name: 'crm-claude-mcp',
      status: 'building',
      body: 'An MCP server exposing CRM objects to Claude — pipeline queries, record updates, account briefings — with the permission boundary, audit trail, and data residency story written down as carefully as the code. The narrow version of what Claudeforce does at scale, and the closest thing to my own moat.',
    },
    {
      date: '2026-11',
      name: 'rag-eval-bench',
      status: 'queued',
      body: 'A RAG system over a regulated-industry document set where the point is not the retrieval but the bench beside it: a labelled question set, retrieval hit rate, answer scoring, and a comparison across chunking strategies. Plenty of people can build RAG; far fewer can show whether theirs works.',
    },
  ],
};
