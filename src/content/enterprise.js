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
    summary: 'A leading Singapore entertainment group taking on its first enterprise LLM deployment — end to end, from solution design to delivery.',
    metrics: [
      { value: '1st', label: 'LLM customer for the company' },
    ],
    sections: [
      {
        heading: 'The problem',
        body: ['A leading entertainment group in Singapore was exploring its first enterprise LLM adoption.'],
      },
      {
        heading: 'What I did',
        body: ["Secured Wiz.AI's first LLM product customer and led the end-to-end implementation from solution design to delivery."],
      },
      {
        heading: 'Outcome',
        body: ['Created a strategic breakthrough reference case for both Wiz.AI and the client.'],
      },
      {
        heading: 'Architecture',
        todo: 'This is the single most Anthropic-relevant case on the page and it is currently three sentences long. Expand it: what the LLM actually did, how you grounded it, what you did about hallucination and escalation to a human, how quality was measured before go-live, and what the customer was afraid of. Treat this as the flagship.',
      },
      {
        heading: "What I'd do differently",
        todo: 'First-of-anything deployments teach the most. What would you set up differently on day one?',
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
