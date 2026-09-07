export const hero = {
  name: 'Yixin Liu',
  title: 'Enterprise AI Solutions Architect',
  tagline: 'Nine years turning enterprise AI ambition into systems that survive production — and, lately, building the products myself.',
  cta: [
    { label: 'See the work', href: '#enterprise', primary: true },
    { label: 'GitHub', href: 'https://github.com/Piaodiver', primary: false },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/liuyixin/', primary: false },
  ],
};

export const proof = [
  { value: '9+',    label: 'Years in enterprise delivery' },
  { value: '$2M+',  label: 'Enterprise pipeline contributed' },
  { value: '4',     label: 'Countries worked' },
  { value: '20+',   label: 'Enterprise AI engagements' },
];

export const about = {
  paragraphs: [
    'My name is Yixin — pronounced like "e-scene," a scene you\'d want to be part of.',
    'I am an Enterprise AI Solutions Architect with nine years across Salesforce, SAP, Wiz.AI, and Baidu. My work sits where business strategy, technical architecture, and enterprise adoption meet — clarifying which use cases are worth building, designing systems that hold up under real load and real governance, and getting stakeholders to agree on what "done" means.',
    'Across my career I have contributed to $2M+ in enterprise pipeline with Fortune 500 and Global 2000 clients across manufacturing, retail, fintech, media, and the public sector. My perspective has been shaped by work and study across China, the United States, Israel, and Singapore.',
    'Since May 2026 I have been closing the gap between specifying systems and building them — writing the code, not just the architecture deck. The projects below are the evidence.',
  ],
};

export const expertise = [
  {
    mark: '◈',
    title: 'Enterprise AI solution & delivery',
    body: 'Turning AI use cases into production workflows, architectures, and adoption paths that survive contact with procurement and security review.',
    tags: ['Agentic AI', 'LLM deployment', 'RAG', 'NLP', 'Voice AI', 'Prompt engineering'],
  },
  {
    mark: '◇',
    title: 'Data & CRM architecture',
    body: 'Scalable data and CRM foundations connecting customer intelligence, operations, and business outcomes.',
    tags: ['Salesforce Data Cloud', 'Agentforce', 'SAP CRM', 'Lead-to-Cash', 'SaaS architecture'],
  },
  {
    mark: '◉',
    title: 'Executive alignment & solution storytelling',
    body: 'Getting business and technical stakeholders to agree on value, feasibility, roadmap, and sequencing — usually in the same room, often in two languages.',
    tags: ['Discovery workshops', 'Value framing', 'PoC demos', 'RFP/RFI', 'Executive presentations'],
  },
  {
    mark: '△',
    title: 'Building it myself',
    body: 'Python, Streamlit, and SwiftUI as of 2026 — enough to build the thing rather than only specify it. Growing deliberately; listed only once shipped.',
    tags: ['Python', 'Streamlit', 'SwiftUI', 'pytest', 'Cost modelling'],
  },
];

export const journey = {
  education: [
    { school: 'Tel Aviv University', detail: 'MBA in Innovative Technology', note: 'Merit Scholarship' },
    { school: 'Wesleyan University',  detail: 'BA in Economics', note: null },
  ],
  roles: [
    {
      period: 'MAY 2026 – PRESENT',
      org: 'Independent',
      title: 'Technical depth sprint',
      place: 'Building',
      body: 'A deliberate stretch spent closing the gap between architecting AI systems and building them: Python and CS50P, an LLM cost model with a test suite, and two LLM-native products with a co-founder. The projects on this page are the output.',
      current: true,
    },
    {
      period: 'MAR 2025 – MAY 2026',
      org: 'Salesforce',
      title: 'Technical Architect, AI & Data',
      place: 'Singapore',
      body: 'Led Agentforce and Data Cloud architecture for enterprise clients across APAC, converting AI interest into production-ready use cases and measurable pipeline.',
    },
    {
      period: 'MAR 2024 – FEB 2025',
      org: 'Wiz.AI',
      title: 'AI Presales & Delivery Architect',
      place: 'Singapore',
      body: 'Designed and delivered LLM, RAG, NLP, and voice AI solutions for enterprise opportunities across APAC, across both presales and delivery.',
    },
    {
      period: 'SEP 2019 – APR 2023',
      org: 'SAP',
      title: 'Presales Solution Architect / Lead Implementation Architect',
      place: 'Beijing, China & California, USA',
      body: 'Led CRM solution design, digital transformation roadmaps, and full-cycle implementation for enterprise clients across manufacturing, retail, and public sectors.',
    },
    {
      period: 'SEP 2017 – AUG 2019',
      org: 'Baidu',
      title: 'Project Manager',
      place: 'Beijing, China',
      body: 'Drove business process digitalisation and executive-facing product demonstrations for emerging digital solutions.',
    },
  ],
};

export const contact = {
  lede: 'I am open to conversations about enterprise AI deployment, solution architecture, and AI adoption strategy — globally, and especially in the United States.',
  open: [
    'Applied AI / solutions architecture',
    'Enterprise AI deployment & adoption',
    'Customer-facing technical leadership',
    'Advisory & consulting',
  ],
  links: [
    { label: 'Email',    href: 'mailto:liuyixin10@outlook.com' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/liuyixin/' },
    { label: 'GitHub',   href: 'https://github.com/Piaodiver' },
  ],
};

/**
 * Three, not four. The fourth ("growth compounds") was true but generic;
 * what replaced it is the one Anthropic-shaped belief that is actually
 * demonstrated by the repos rather than asserted.
 */
export const beliefs = [
  {
    mark: '✦',
    title: 'The frontier is better-organised intelligence, not only smarter models.',
    body: [
      'As individual agents get more capable, the question shifts from "can the model think?" to "can the work be organised, verified, improved, and delivered reliably?"',
      'For complex enterprise tasks, structure is what makes agent systems usable: workers create, verifiers challenge, leaders decide, and the system learns from each pass. The goal is not speed. It is trustworthy execution at scale.',
    ],
  },
  {
    mark: '◈',
    title: 'Architecture is a business conversation.',
    body: [
      'Good solution design starts with the business problem, the people involved, the systems already in place, and the outcome that actually matters.',
      'The work is bidirectional: turning business ambiguity into technical clarity, and technical complexity into executive confidence. Most failed AI programmes I have seen failed at that translation, not at the model.',
    ],
  },
  {
    mark: '◉',
    title: 'A system you cannot audit is a system you cannot deploy.',
    body: [
      'Enterprise adoption depends less on capability than on whether anyone can explain what the system did and why. That is a design constraint, not a compliance afterthought — and it has to be in the architecture from the first sketch.',
      'It shows up concretely in how I build: state stored as the events that produced it rather than the numbers derived from it, so any history can be replayed; the generative part held behind a seam so the deterministic core stays inspectable; every price carrying the date it was read. None of that is safety theatre. It is what makes a system arguable.',
    ],
    seeAlso: { label: 'Where this shows up in the code', href: '#built' },
  },
];

export const beyond = [
  {
    mark: '❋',
    title: 'Purpose',
    tags: ['Social wellbeing', "Women's empowerment", 'Disability inclusion'],
    body: 'I have supported fundraising and volunteer initiatives for children with disabilities, and I want to keep contributing where technology and human support widen who gets to participate.',
  },
  {
    mark: '✦',
    title: 'Perspective',
    tags: ['China', 'United States', 'Israel', 'Singapore'],
    body: 'Living and working across four countries shaped how I build trust, communicate across cultures, and read a room that does not share my first language.',
  },
  {
    mark: '◈',
    title: 'Adventure',
    tags: ['Diving', 'Hiking', 'Nature', 'Reading'],
    body: 'Diving and hiking keep me grounded and comfortable in unfamiliar conditions — which turns out to describe most interesting work, too.',
  },
];
