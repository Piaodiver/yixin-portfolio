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
  subline: 'Over eight years of this. The technology kept changing. The problem did not.',
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
      "Admissions agent for the University of Nottingham Malaysia on Salesforce Agentforce, 2025. I was the Salesforce technical architect, working with the implementation partner. Answers course, eligibility, fee and scholarship questions and books counselor sessions and campus tours. Malaysia's first university on Agentforce.",
    long: [
      "Over half of Nottingham Malaysia's applicants are international, from more than 70 countries, and they ask about courses, eligibility, fees and scholarships at night, Malaysian time. In 2025 the university built NOVA, its admissions agent on Salesforce Agentforce, the first at a Malaysian university. I was the Salesforce technical architect on the project, working alongside the implementation partner.",
      "We grounded the agent in structured student data in Salesforce rather than a document corpus, because eligibility has to be computed. It depends on nationality, qualification system (A-Level, STPM, IB, Gaokao), discipline and degree level. Scholarship eligibility works the same way, from a student's results.",
      "The agent also acts. A student can book a counselor session or a campus tour in seconds, and a counselor stays reachable from inside the conversation. What cost us most was deciding whether to organize the data by discipline or by degree type. The 2+2 and 3+1 routes between Malaysia and the UK broke both cuts, because a split-campus route is neither. It is a delivery mode. NOVA was announced in December 2025, on the website, WhatsApp, Facebook and WeChat.",
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
      'SAP global lighthouse case. A Chinese machinery maker with subsidiaries on three continents needed dealers, customers, logistics and finance on one set of orders. I won the bid and stayed as solution architect through go-live, Q1 2022. SAP reports order processing 25% faster.',
    long: [
      'LGMG makes aerial work platforms and mining equipment in Shandong. By 2022 its output had passed US$1.4 billion (¥10 billion) for the first time, with subsidiaries in Europe, North America and Japan and a plan to earn half its revenue from exports. Each subsidiary had grown up with its own standards. A machine reaches its buyer through a dealer, on credit or a lease, shipped by a logistics provider, cleared through customs, then needs parts for a decade.',
      'I won the bid and stayed as solution architect to go-live. The hardest part was not the software. Each subsidiary had its own material codes and its own way of booking a sale, so every requirements meeting was really an argument about whose definitions would become the group’s. We settled that first, as one master data hierarchy and one set of accounting rules, and built the portals on top of it. Credit checks moved to the moment an order is taken, not after.',
      'Phase one went live in Q1 2022 on SAP Commerce Cloud with S/4HANA Cloud Private Edition. SAP later published the program: order processing 25% faster, and one master data hierarchy and one set of accounting rules across the group.',
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
      "Retrieval agent for a Singapore entertainment destination, Wiz.AI's first LLM customer, 2024. The CMS stayed the source of truth through scheduled ingestion. Anything below the bar went to the official site or the customer service line rather than to a guess.",
    long: [
      "The customer's CMS already held every fact the agent would need, years of approved content run by an editorial team with its own approval workflow. In 2024 this Singapore entertainment destination wanted its first LLM deployment. It was Wiz.AI's first too, with no platform yet.",
      'I decided the CMS would stay the source of truth, with a scheduled ingestion pipeline feeding the vector store, instead of a hand-built knowledge base. That costs freshness, up to one refresh cycle. The editors keep one place to edit and the agent inherits their approvals. Anything below the bar went to the official site or the customer service line rather than to a guess.',
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
