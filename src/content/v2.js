// v2 page content. Case text is copied verbatim from the owner's drafts
// (+个人网站/drafts/case-*.md, v1 "after copy-edit" files). Anything in
// square brackets is a placeholder the owner will replace.

export const links = {
  github: 'https://github.com/Piaodiver',
  linkedin: 'https://www.linkedin.com/in/liuyixin/',
  email: '[email]', // mailto placeholder
};

export const hero = {
  name: 'Yixin Liu',
  headline: 'Most enterprise AI projects are content problems in disguise. I find out which kind you have.',
  subline: 'Nine years of this. The technology changed twice. The problem did not.',
};

export const cases = {
  nova: {
    id: 'nova',
    name: 'NOVA',
    client: 'University of Nottingham Malaysia',
    platform: 'Salesforce Agentforce',
    year: '2025',
    section: 'singapore',
    card:
      "Admissions agent for the University of Nottingham Malaysia on Salesforce Agentforce, 2025. Answers eligibility and visa timing questions from Data Cloud and books counsellor sessions. Live on the website and WhatsApp. Malaysia's first university on Agentforce.",
    long: [
      "Over half of Nottingham Malaysia's applicants are international, and they ask about eligibility, fees and visas at night, Malaysian time. In 2025 I directed the solution architecture for NOVA, the university's admissions agent on Salesforce Agentforce.",
      'I grounded the agent in structured data in Data Cloud rather than a document corpus, because eligibility has to be computed. It depends on nationality, qualification system (A-Level, STPM, IB, Gaokao), discipline, degree level and today’s date, since visa processing time differs by passport.',
      'What cost us most was deciding whether to organise the data by discipline or by degree type. The 2+2 and 3+1 routes between Malaysia and the UK broke both cuts, because a split-campus route is neither. It is a delivery mode. The first phase launched on schedule, on the website and WhatsApp.',
    ],
  },
  lgmg: {
    id: 'lgmg',
    name: 'LGMG',
    client: 'LGMG',
    platform: 'SAP Commerce Cloud, S/4HANA Cloud Private Edition',
    year: '2022',
    section: 'china',
    card:
      'SAP global lighthouse case. A Chinese machinery maker with subsidiaries on three continents needed dealers, customers, logistics and finance on one set of orders. I won the bid and stayed as solution architect through go-live, Q1 2022.',
    long: [
      'LGMG had just passed ¥10 billion in output and opened subsidiaries in Europe, North America and Japan, each with its own standards. It makes aerial work platforms and mining equipment in China. A machine reaches its buyer through a dealer, on credit or a lease, shipped by a logistics provider, cleared through customs, then needs parts for a decade.',
      'I won the bid and stayed as solution architect to go-live. The hardest requirement was pricing. Prices differ by region, and dealers must not see each other’s. I put that rule in the data model instead of a report filter.',
      'Requirements kept arriving, so I re-stated [needs: to whom, in which document] what a successful delivery meant. Phase one went live in Q1 2022 on SAP Commerce Cloud with S/4HANA Cloud Private Edition.',
    ],
  },
  wizai: {
    id: 'wizai',
    name: 'Wiz.AI',
    client: 'A Singapore entertainment destination',
    platform: 'Wiz.AI',
    year: '2024',
    section: 'singapore',
    card:
      "Retrieval agent for a Singapore entertainment destination, Wiz.AI's first LLM customer, 2024. The CMS stayed the source of truth through scheduled ingestion. Uncertain answers went to a human, not a guess.",
    long: [
      "The customer's CMS already held every fact the agent would need, years of approved content run by an editorial team with its own approval workflow. In 2024 this Singapore entertainment destination wanted its first LLM deployment. It was Wiz.AI's first too, with no platform yet.",
      'I decided the CMS would stay the source of truth, with a scheduled ingestion pipeline feeding the vector store, instead of a hand-built knowledge base. That costs freshness, up to one refresh cycle. The editors keep one place to edit and the agent inherits their approvals. Anything below the answer bar went to the official site or the service line, not to a guess.',
      'What I would change: I never wrote down what "correct" meant before we built, as a scoring rubric or as acceptance criteria. And who maintains the knowledge base was a negotiation. We treated it as something the architecture would settle. I left before there was enough operating history to quote.',
    ],
  },
};

export const heroCards = [cases.nova, cases.lgmg, cases.wizai];

// Built list. First two sentences are from yixinportfolio架构20260908.md §04.
// Kinetic Curtains is not in §04, so its sentence is mine and marked [check].
export const built = [
  {
    title: 'LLM deployment TCO calculator',
    body: 'A cost model for a year of a Claude workload, and, more usefully, which architectural levers actually move the number.',
    href: 'https://github.com/Piaodiver/llm-tco-calculator',
  },
  {
    title: 'Anthropic Claude adoption atlas',
    body: 'An interactive map of Anthropic’s product line as landmark buildings, each panel covering one product, with comparison tables and code previews.',
    href: 'https://piaodiver.github.io/anthropic-claude-adoption-atlas/',
  },
  {
    title: 'Kinetic Curtains',
    body: 'The four interactive scenes on this page. [check]',
    href: null,
  },
];
