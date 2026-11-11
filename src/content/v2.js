// v2 page content. Case text is copied verbatim from the owner's drafts
// (+个人网站/drafts/case-*.md, v1 "after copy-edit" files). Anything in
// square brackets is a placeholder the owner will replace.

export const links = {
  github: 'https://github.com/Piaodiver',
  linkedin: 'https://www.linkedin.com/in/liuyixin/',
  email: 'liuyixin10@gmail.com',
};

export const israel = [
  'Tel Aviv, 2015 to 2017. An MBA in innovative technology at Tel Aviv University, and alongside it an internship at EyeSight Technologies, now [Cipia](https://cipia.com/), in Herzliya Pituach: a computer vision company whose software watches drivers for signs of fatigue. I handled marketing and international partnerships there, among them Continental AG and Kuang-Chi, the Shenzhen group that [put US$20 million into the company in 2016](https://www.globenewswire.com/news-release/2016/05/04/1228645/0/en/Chinese-Technology-Conglomerate-Kuang-Chi-to-Invest-20-Million-in-eyeSight-Technologies-a-Leader-in-Embedded-Computer-Vision.html). I was also the China representative of the [Israel-Asia Center](https://israelasiacenter.org/).',
  'I got the internship by writing to the CEO on LinkedIn when nothing said the company wanted an intern. I sent about 30 messages like that, about one in four got a reply, and I asked each for a meeting.',
];

export const about = [
  'In mid-2026 I moved from Singapore to Seattle, left a job I liked to do it, and started building on my own. Now I am looking for the next one. What I want from it: a hard problem, people who want it solved, and a seat close enough to the users to know whether it is.',
  'The route, by place. I grew up in Beijing. A liberal arts education at Wesleyan in Connecticut, with economics on the diploma. Tel Aviv for a master\'s in the management of innovative technology. Beijing for two years at Baidu, improving how internal teams ran their processes and building an app for them, and then for SAP, which selected me for its global presales academy in San Ramon, California, the only presales trainee from East Asia that year, and brought me back as a solution architect on the LGMG program. Singapore from 2024, covering Southeast Asia for Wiz.AI, then Salesforce as a technical architect for AI and data. Seattle since mid-2026.',
  'Outside work, the sea first. In 2013 I crewed a research sailing ship for two months from Tahiti to Hawaii, standing watches through the night and writing papers in between, and I have been diving ever since, mostly in Southeast Asia. On land it is long walks: 80 kilometers across the Altai mountains in two days, and the wadi from St. George\'s Monastery down to Jericho, where people have lived for ten thousand years. Four times I went to Lhasa to lead volunteer teachers at two schools for children with disabilities. And once a year, a road trip with my family.',
];

export const hero = {
  name: 'Yixin Liu',
  headline: 'Most enterprise AI projects are content problems in disguise. I find out which kind you have.',
  subline: 'Over eight years of this. The technology kept changing. The problem did not.',
  person: 'Seattle, by way of Beijing, Tel Aviv and Singapore. Underwater when I can be.',
  // the ask: one line, email link on 'Write to me'
  looking: 'Looking for the next role. Seattle first, elsewhere for the right one.',
  lookingCta: 'Write to me',
  lookingTail: ' and I will send a resume.',
};

// The Salesforce year, as the frame around NOVA. Sits first in the Singapore section.
export const salesforce = {
  eyebrow: 'Salesforce · Technical Architect, AI & Data · 2025–2026',
  paragraphs: [
    'From 2025 I was a technical architect for AI and data at Salesforce in Singapore. The clients were spread across Southeast Asia: banks and other financial firms, universities, retailers, entertainment and cultural venues, manufacturers. Most had run a pilot and wanted something in production. The first workshop usually ended on the same question: what the agent would be allowed to say. That depended on what the company had already written down, and who kept it current. The line at the top of this page is that answer, shortened. NOVA, below, is the one project from that year that was announced publicly.',
  ],
};

// One line at the top of the China section, before the LGMG case.
export const china = [
  'I grew up in Beijing, and came back to it after Tel Aviv: two years at Baidu, then SAP.',
];

// Baidu, 2017–2019. Facts from the owner's resume bullets (2026-11-10).
export const baidu = {
  eyebrow: 'Baidu · 2017–2019',
  paragraphs: [
    "Every quarter Baidu brought 200-odd leaders from eight business units together for a summit, and it took a team of twelve to run it. I built the event app: each person's agenda, the logistics, the day's changes, as a mini-program on their phone. The coordination team went from twelve to three. The feature was later folded into Baidu Hi, the company's own messaging app. Between summits I did the quarterly analyses for the executive and general-manager meetings: where operations were stuck, and where the growth was.",
  ],
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
      "Malaysia's first university admissions agent, on Salesforce Agentforce, 2025. I was its technical architect.",
    long: [
      "Over half of Nottingham Malaysia's applicants are international, from more than 70 countries, and they ask about courses, eligibility, fees and scholarships at night, Malaysian time. In 2025 the university built NOVA, its admissions agent on Salesforce Agentforce, [the first at a Malaysian university](https://www.nottingham.edu.my/NewsEvents/News/2025/University-of-Nottingham-Malaysia-Deploys-Agentforce-to-Create-a-Seamless-Experience-for-Prospective-Students.aspx). I was the Salesforce technical architect on the project, working alongside the implementation partner.",
      "We grounded the agent in structured student data in Salesforce rather than a document corpus, because eligibility has to be computed. It depends on nationality, qualification system (A-Level, STPM, IB, Gaokao), discipline and degree level. Scholarship eligibility works the same way, from a student's results.",
      "The agent also acts. A student can book a counselor session or a campus tour in seconds, and a counselor stays reachable from inside the conversation. What cost us most was deciding whether to organize the data by discipline or by degree type. The 2+2 and 3+1 routes between Malaysia and the UK broke both cuts, because a split-campus route is neither. It is a delivery mode. NOVA was [announced in December 2025](https://www.salesforce.com/ap/news/press-releases/2025/12/15/university-of-nottingham-malaysia-deploys-agentforce-to-create-a-seamless-experience-for-prospective-students/), on the website, WhatsApp, Facebook and WeChat.",
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
      "One set of orders across three continents for a Chinese machinery maker, 2022. I won the bid and stayed to go-live. SAP's global lighthouse case.",
    long: [
      'LGMG makes aerial work platforms and mining equipment in Shandong. By 2022 its output had passed US$1.4 billion (¥10 billion) for the first time, with subsidiaries in Europe, North America and Japan and a plan to earn half its revenue from exports. Each subsidiary had grown up with its own standards. A machine reaches its buyer through a dealer, on credit or a lease, shipped by a logistics provider, cleared through customs, then needs parts for a decade.',
      'I won the bid and stayed as solution architect to go-live. The hardest part was not the software. Each subsidiary had its own material codes and its own way of booking a sale, so every requirements meeting was really an argument about whose definitions would become the group’s. We settled that first, as one master data hierarchy and one set of accounting rules, and built the portals on top of it. Credit checks moved to the moment an order is taken, not after.',
      'Phase one went live in Q1 2022 on SAP Commerce Cloud with S/4HANA Cloud Private Edition. [SAP later published the program](https://www.sap.com/documents/2024/02/fc105f35-a87e-0010-bca6-c68f7e60039b.html): order processing 25% faster, and one master data hierarchy and one set of accounting rules across the group.',
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
      "Wiz.AI's first LLM deployment, 2024. The CMS stayed the source of truth, and unsure answers went to a person.",
    long: [
      "The customer's CMS already held every fact the agent would need, years of approved content run by an editorial team with its own approval workflow. In 2024 this Singapore entertainment destination wanted its first LLM deployment. It was [Wiz.AI](https://www.wiz.ai/)'s first too, with no platform yet.",
      'I decided the CMS would stay the source of truth, with a scheduled ingestion pipeline feeding the vector store, instead of a hand-built knowledge base. That costs freshness, up to one refresh cycle. The editors keep one place to edit and the agent inherits their approvals. Anything below the bar went to the official site or the customer service line rather than to a guess.',
      'What I would change: I never wrote down what "correct" meant before we built, as a scoring rubric or as acceptance criteria. And who maintains the knowledge base was a negotiation. We treated it as something the architecture would settle. I left before there was enough operating history to quote. I made the same two decisions on NOVA the next year: the customer\'s own system as the source of truth, and a hand-off to a person when the agent is not sure.',
    ],
  },
};

export const heroCards = [cases.nova, cases.lgmg, cases.wizai];

// Built list. TCO sentence is from yixinportfolio架构20260908.md §04; the
// adoption atlas and the Kinetic Curtains line were dropped on 2026-11-10.
export const built = [
  {
    title: 'LLM deployment TCO calculator',
    body: 'A cost model for a year of a Claude workload, and, more usefully, which architectural levers actually move the number.',
    href: 'https://github.com/Piaodiver/llm-tco-calculator',
  },
  {
    // MultiVerse I: title and one line only for now, a page of its own later.
    // Cleared with the co-founder on 2026-09-07 for positioning and screenshots;
    // no backend or implementation detail here.
    title: 'MultiVerse I: Journey to the West, as anyone in it',
    body: 'An AI interactive reader, built with a co-founder. Play Sun Wukong, or a demon who gets one line in the original. 90% reading, 10% changing fate. iOS, 2026.',
    href: null,
  },
];
