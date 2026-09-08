/**
 * Lane §01 — enterprise delivery.
 *
 * Every `body` string here is carried forward verbatim from the copy Yixin
 * already wrote and published. The `todo` fields are the sections that make a
 * case study convincing to an architect audience — the design decisions and
 * the retrospective — and they are deliberately empty. Nobody but Yixin can
 * write them truthfully, and a fabricated architecture section is the one
 * thing on this site that would fail an interview rather than pass one.
 * Empty sections simply do not render.
 */
export const enterprise = [
  {
    slug: 'salesforce-agentforce',
    lane: 'enterprise',
    org: 'Salesforce',
    region: 'APAC',
    year: '2025–26',
    status: 'delivered',
    kicker: 'Scaled AI architecture',
    title: 'Scaling enterprise AI with Agentforce & Data Cloud',
    summary: 'Agentforce and Data Cloud architecture for 20+ APAC enterprises moving past AI experimentation.',
    metrics: [
      { value: '$800K+', label: 'Pipeline generated' },
      { value: '35%',    label: 'Faster PoC to production' },
      { value: '20+',    label: 'Enterprise clients' },
    ],
    sections: [
      {
        heading: 'The problem',
        body: ['Enterprise clients across APAC were exploring how to move beyond AI experimentation and identify production-grade use cases.'],
      },
      {
        heading: 'What I did',
        body: ['Led Agentforce and Data Cloud architecture for 20+ enterprise clients, facilitated AI discovery workshops, translated business needs into technical solution designs, and aligned stakeholders across sales, product, and technical teams.'],
      },
      {
        heading: 'Outcome',
        body: ['Generated over $800K in sales pipeline, reduced average PoC-to-production time by 35%, and helped clients define scalable AI and data roadmaps.'],
      },
      {
        heading: 'Architecture',
        todo: 'Pick ONE of these 20 engagements and draw it: where Data Cloud sat, how identity resolution was handled, what grounded the agent, and where the trust boundary was. Then 3–5 decisions in the form "constraint → options → chose → would revisit if". This is the section an Applied AI Architect interview will spend twenty minutes on.',
      },
      {
        heading: "What I'd do differently",
        todo: 'One honest thing. The 35% figure implies you found a bottleneck — name what it was and what you would sequence differently now.',
      },
    ],
  },
  {
    slug: 'salesforce-regional-first',
    lane: 'enterprise',
    org: 'Salesforce',
    region: 'Regional first',
    year: '2025',
    status: 'delivered',
    kicker: 'First of its kind in region',
    title: 'First-of-its-kind Salesforce AI implementation in the region',
    summary: 'A multinational institute bridging complex business requirements with AI and data capabilities in production.',
    metrics: [
      { value: '100%', label: 'Successful activation' },
    ],
    sections: [
      {
        heading: 'The problem',
        body: ['A multinational institute needed to bridge complex business requirements with AI and data capabilities in a production environment.'],
      },
      {
        heading: 'What I did',
        body: ['Directed solution architecture, clarified technical feasibility, aligned business and technical teams, and supported production activation.'],
      },
      {
        heading: 'Outcome',
        body: ['Achieved 100% successful activation and became a flagship regional AI/Data use case.'],
      },
      {
        heading: 'Architecture',
        todo: 'What made this "first of its kind"? Name the specific capability nobody in the region had put into production before, and what was unresolved about it. That is the whole story and it is currently missing.',
      },
      {
        heading: "What I'd do differently",
        todo: 'Being first means something went sideways. What was it?',
      },
    ],
  },
  {
slug: 'wizai-first-llm-customer',
    lane: 'enterprise',
    org: 'Wiz.AI',
    region: 'Singapore',
    year: '2024',
    status: 'delivered',
    kicker: "The company's first LLM customer",
    title: "Wiz.AI's first LLM product customer",
    summary: 'A retrieval agent for a major Singapore destination, grounded strictly in content the customer already owned — and the first LLM deployment for the customer and for us both.',
    metrics: [
      { value: '1st', label: 'LLM customer for the company' },
      { value: '8',   label: 'Deployment modules built from zero' },
    ],
    sections: [
      {
        heading: 'The problem',
        body: [
          'The obvious way to give an organisation an AI agent is to build it a knowledge base. It is also the way to guarantee the agent will be wrong within a month.',
          'A leading Singapore entertainment destination already held years of official content — attractions, events, visitor guides, transport, ticketing, FAQs — in their CMS, maintained by an editorial team with its own approval workflow. They were exploring their first enterprise LLM deployment. It was also our first: no mature platform to configure, no playbook, and no prior deployment to copy.',
        ],
      },
      {
        heading: 'Architecture',
        body: [
          'The CMS stays the source of truth. The editorial team already had a publishing workflow and no appetite for a second one. The options were a hand-curated AI knowledge base, scheduled ingestion from the CMS, or live retrieval at query time. We chose scheduled ingestion: it costs freshness, since content can lag by up to one refresh cycle, and it adds a pipeline to operate. It buys one place to edit, no dual maintenance, and an agent that inherits the CMS\u2019s existing editorial approval for free.',
          'The bar for answering is set high, and uncertainty routes to a human. This is a product decision wearing technical clothes: it turns on which costs more, answering wrong or not answering at all. For a destination where a wrong opening time or ticket price becomes a real complaint at a real gate, that is not a close call. Anything below the bar went to the official site or the customer service line rather than to a guess.',
          'The customer judges correctness. We built the evaluation set with their content editors and agreed the scoring criteria with them, because they owned the facts. That is the same decision as the first one, one layer up — authority stays with the people who hold it already, and the generated layer stays downstream and rebuildable.',
        ],
      },
      {
        heading: 'What I built',
        body: [
          'Without a mature platform underneath, the deployment surface was the deliverable: a chat layer on the customer\u2019s site, an orchestration backend, an ingestion pipeline that pulled approved CMS content and cleaned, chunked and tagged it, a vector store, integration with a third-party frontier model, guardrails and fallback logic, and a maintenance process for the knowledge base.',
          'The model was the language engine. Everything that made it dependable for an enterprise — what it was allowed to say, what it had to refuse, where its facts came from, and how they stayed current — sat in the layer around it. That distinction is most of what enterprise AI work actually is.',
        ],
      },
      {
        heading: 'How it was evaluated',
        body: [
          'Before launch: a labelled question set built with the customer\u2019s content editors, spread across attractions, events, transport, ticketing and FAQs, scored against criteria agreed with them.',
          'After launch: their team reviewed conversation logs on a fixed daily cadence. Two failure modes appeared, and separating them mattered more than fixing either. Content that had gone stale in the CMS, which the system faithfully repeated, is a content problem and goes back to the editors. Retrieval that pulled the adjacent-but-wrong section is a chunking and metadata problem and comes back to us. A team that cannot tell those apart fixes the wrong layer.',
          'What I would add now is fallback rate as the primary health metric. It moves only for diagnosable reasons — a content gap, a new class of question, a CMS restructure — and it is the number I would have wanted on a dashboard from day one.',
          'I left before there was enough operating history to quote, and I do not quote numbers I did not verify myself.',
        ],
      },
      {
        heading: "What I'd do differently",
        body: [
          'We drew two of the four boundaries. Content ownership and correctness judgment both sat correctly with the customer. Two others were never drawn at all: who maintains the knowledge base over time, and what counts as a successful delivery.',
          'Both are the same missing artefact as my third regret — never writing down what "correct" meant before we started building. At the answer level that is a scoring rubric, at the project level it is acceptance criteria, and after go-live it is an operating agreement. All three were left to be worked out later, and later is the worst time to open them.',
          'The asymmetry is why it hurt. A small vendor negotiating with a large, senior customer has the least leverage to start that conversation and the most to lose from leaving it open — which is exactly backwards from what is prudent. "Who maintains this" was never a technical question; it was a negotiation, and we treated it as something the architecture would settle on its own.',
          'The delivery team also did not know the customer\u2019s domain well enough going in, and we paid for it in communication overhead — time spent building shared context that should have gone into the build. On a first-of-its-kind project that gap compounds, because there is no reference implementation to argue from.',
        ],
      },
    ],
  },
  {
    slug: 'sap-lighthouse',
    lane: 'enterprise',
    org: 'SAP',
    region: 'China',
    year: '2019–23',
    status: 'delivered',
    kicker: 'SAP Global Lighthouse case',
    title: 'Lead-to-Cash CRM transformation for a lighthouse customer',
    summary: "One of China's top construction machinery conglomerates: enterprise-wide CRM across multiple business divisions, multi-entity operations, and global expansion.",
    metrics: [
      { value: '85%+',  label: 'Operational needs covered' },
      { value: '22.3%', label: 'Efficiency gain in six months' },
    ],
    sections: [
      {
        heading: 'The problem',
        body: ["One of China's top construction machinery conglomerates needed an enterprise-wide CRM system to support complex multi-entity operations and global expansion."],
      },
      {
        heading: 'What I did',
        body: ['Led architecture, blueprint design, system build, integration, testing, and go-live across multiple business divisions.'],
      },
      {
        heading: 'Outcome',
        body: ['Delivered a solution covering 85%+ of operational needs, improved sales and operational efficiency by 22.3% within six months, and helped the project become an SAP Global Lighthouse Customer Case.'],
      },
      {
        heading: 'Architecture',
        todo: 'Multi-entity Lead-to-Cash is genuinely hard and this is your longest engagement. Sketch the entity model and the integration boundary, and name the two or three decisions that made or nearly broke it.',
      },
      {
        heading: "What I'd do differently",
        todo: 'Four years is long enough to have watched a decision age. Which one?',
      },
    ],
  },
];
