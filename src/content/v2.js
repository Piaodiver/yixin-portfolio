// v2 page content. Case text is copied verbatim from the owner's drafts
// (+个人网站/drafts/case-*.md, v1 "after copy-edit" files). Anything in
// square brackets is a placeholder the owner will replace.

export const links = {
  github: 'https://github.com/Piaodiver',
  linkedin: 'https://www.linkedin.com/in/liuyixin/',
  email: 'liuyixin10@gmail.com',
};

export const israel = [
  // Rewritten 2026-11-11 from the owner's account (why Israel: a Wesleyan course,
  // a boss's remark); draft and choices in +个人网站/drafts/israel.md. The
  // Israel-Asia Center line was dropped; no superlatives, no private names.
  "At Wesleyan, newly abroad and often homesick, I took Vera Schwarcz's course on the Jewish experiences in China: Kaifeng under the Northern Song, Shanghai in the 1940s, two peoples who have each spent centuries living in other people's countries. I was studying diaspora while starting my own. Later my boss at a Beijing internship, who ran a Jewish community association there, mentioned a technology MBA at Tel Aviv University. I applied at twenty-two and got in.",
  'The internship was at EyeSight Technologies, now [Cipia](https://cipia.com/), in Herzliya Pituach: computer vision that watches drivers for signs of fatigue. I handled marketing and international partnerships there, among them Continental AG and Kuang-Chi, the Shenzhen group that [put US$20 million into the company in 2016](https://www.globenewswire.com/news-release/2016/05/04/1228645/0/en/Chinese-Technology-Conglomerate-Kuang-Chi-to-Invest-20-Million-in-eyeSight-Technologies-a-Leader-in-Embedded-Computer-Vision.html).',
  'I got the internship by writing to the CEO on LinkedIn when nothing said the company wanted an intern. I sent about 30 messages like that, about one in eight got a reply, and I asked each for a meeting.',
];

// About, step 28 (2026-11-11): the reader who gets here has just read the
// four places, so the route paragraph went (archived in
// +个人网站/drafts/about.v1-before-step28.md, git tag about-v1-route-280px).
// What stays is the one thing they have not read: outside work.
export const about = [
  'The sea first. In 2013 I crewed [a research sailing ship](https://sea.edu/) for two months from Tahiti to Hawaii, standing watches through the night and writing papers in between, and I have been diving ever since, mostly in Southeast Asia. On land it is long walks: 80 kilometers through the Altay mountains of northern Xinjiang in two days, and the wadi from St. George\'s Monastery down to Jericho, where people have lived for ten thousand years. Four times I went to Lhasa to lead volunteer teachers at [two schools for children with disabilities](https://www.braillewithoutborders.org/ENGLISH/). These days I am in Seattle, camping on weekends in the national parks around the city when it is not too cold, and teaching myself to cook the food I grew up on. And once a year, a road trip with my family.',
];

// Open questions (C1, 2026-11-11): a band of its own between About and End,
// five things the owner is turning over, no answers on purpose. One optional line of provenance each. Wording went
// through the copy-editor; drafts and rounds in +个人网站/drafts/questions.md.
export const questions = {
  eyebrow: 'Open questions · November 2026',
  items: [
    { q: 'When the agent is not sure and hands over to a person, how often was that the right call, and how would I know?', from: 'NOVA and the Wiz.AI deployment both do this.' },
    { q: "Who should own an agent's knowledge base, the people who write the documents or the people who build the agent?", from: null },
    { q: 'When the model only classifies and the math is deterministic, what is left for the model to get wrong?', from: 'Tariff Engine, in progress.' },
    { q: 'If the reader can play a demon who gets one line in the original, what has to stay fixed for it still to be Journey to the West?', from: 'MultiVerse I, with Shane Zhang.' },
    { q: "At three in the morning on watch, at thirty meters down, and in an agent's hand-off, the same decision: how do I know it is time to call someone?", from: 'The Pacific, 2013; Southeast Asia, 2024 to 2026.' },
  ],
};

export const hero = {
  name: 'Yixin Liu',
  headline: 'Most enterprise AI projects are content problems in disguise. I find out which kind you have.',
  // The headline split for the quiz (step 33): the promise is underlined while the quiz is open.
  headlineBefore: 'Most enterprise AI projects are content problems in disguise. I find out ',
  headlinePromise: 'which kind you ',
  headlineLast: 'have', // kept on one line with the full stop and the beacon, so the dot never sits alone
  headlineAfter: '.',
  subline: 'Over eight years of this. The technology kept changing. The problem did not.',
  person: 'Seattle, by way of Beijing, Tel Aviv and Singapore. Underwater when I can be.',
  // where things stand, and what the next role should be: was the first About paragraph
  now: 'In mid-2026 I moved from Singapore to Seattle, left a job I liked to do it, and started building on my own. What I want from the next one: a hard problem, people who want it solved, and a seat close enough to the users to know whether it is.',
  // the ask: one line, email link on 'Write to me'
  looking: 'Looking for the next role. Seattle first, elsewhere for the right one.',
  lookingCta: 'Write to me',
  lookingTail: ' and I will send a resume.',
};

// Step 33: the headline's promise, kept. Three questions, one at a time, behind a
// beacon at the end of the headline. Nothing is recorded. Each option maps to a
// kind (0 writing-down, 1 ownership, 2 judgment); majority wins, the third
// question breaks a three-way tie. Draft and research check:
// +个人网站/drafts/which-kind-quiz.md. The "what the research says" lines wait
// for the Reading section (the owner writes a take on each paper first).
export const heroQuiz = {
  beaconLabel: 'Three questions',
  ariaLabel: 'Find out which kind in three questions',
  questions: [
    {
      text: 'When a customer asks your best person a hard question today, where does the answer come from?',
      options: [
        'Honestly? Whoever has been here longest. If she is on leave, we wait.',
        'There is a document. There are a few, actually, and they do not all say the same thing.',
        'Depends who is asking. We check their account before we answer, every time.',
      ],
    },
    {
      text: 'If the rule behind that answer changed next month, how would you find out?',
      options: [
        'Usually when a customer tells us we got it wrong.',
        'Someone updates the main page. The other copies catch up when someone notices.',
        'It would not change for everyone. The question is always which customers it applies to.',
      ],
    },
    {
      text: 'What worries you most about letting an agent answer instead?',
      options: [
        'That it will make something up and sound confident doing it.',
        'That it will be right at launch and quietly wrong by March.',
        'That it will give the right answer to the wrong person, or not know when to stop and get a human.',
      ],
    },
  ],
  resultLead: 'Which kind you have, probably:',
  results: [
    {
      title: 'A writing-down problem.',
      text: 'The agent is the easy part. Before any model, someone has to write the answers down, and that is the real project.',
      links: [{ label: 'Read the Salesforce year', href: '#singapore' }],
    },
    {
      title: 'An ownership problem.',
      text: 'The answers exist, in more than one place. Decide which system is the source of truth and whose approval carries through to the agent. I made that call twice.',
      links: [{ label: 'Read Wiz.AI', href: '#wizai' }, { label: 'Read NOVA', href: '#nova' }],
    },
    {
      title: 'A judgment problem.',
      text: "The content is there and someone keeps it. What is missing is which rule applies to the person asking, and when the agent must hand over. That is where the first workshop usually ended, and it was the whole of NOVA's design.",
      links: [{ label: 'Read the three decisions', href: '#nova-full' }],
    },
  ],
  closing: 'Three questions is a guess, not a diagnosis. If none of this sounds like you, it may not be a content problem. Those exist too, and they are usually easier.',
  closingCta: 'Write to me',
  closingTail: ' with the real version.',
};

// The Salesforce year, as the frame around NOVA. Sits first in the Singapore section.
export const salesforce = {
  eyebrow: 'Salesforce · Senior Technical Architect, AI & Data · 2025–2026',
  paragraphs: [
    'From 2025 I was a senior technical architect for AI and data at Salesforce in Singapore. The clients were spread across Southeast Asia: banks and other financial firms, universities, retailers, entertainment and cultural venues, manufacturers. Most had run a pilot and wanted something in production. The first workshop usually ended on the same question: what the agent would be allowed to say. That depended on what the company had already written down, and who kept it current. The line at the top of this page is that answer, shortened. NOVA, below, is the one project from that year that was announced publicly.',
  ],
};

// The four places, in page order. Used by the section headings, the nav,
// the scene bands and overlay, and the route map in the hero.
export const places = [
  { id: 'china', label: 'China', city: 'Beijing', sub: 'Beijing · Baidu, SAP · 2017–2023', years: '2017–2023' },
  { id: 'israel', label: 'Israel', city: 'Tel Aviv', sub: 'Tel Aviv · Tel Aviv University · 2015–2017', years: '2015–2017' },
  { id: 'singapore', label: 'Singapore', city: 'Singapore', sub: 'Wiz.AI, Salesforce · 2024–2026', years: '2024–2026' },
  { id: 'united-states', label: 'United States', city: 'Seattle', sub: 'Connecticut 2014 · San Ramon 2019–2020 · Seattle since 2026', years: 'since 2026' },
];
export const placeById = Object.fromEntries(places.map((p) => [p.id, p]));

// One line at the top of the China section, before Baidu and LGMG. Reworded
// 2026-11-11: names the two departures so "came back" has somewhere to come back from.
export const china = [
  "Beijing is where I grew up, and where I came back to after college in the United States and a master's in Israel: two years at Baidu, then four at SAP.",
];

// Baidu, 2017–2019. Facts from the owner's resume bullets (2026-11-10).
export const baidu = {
  eyebrow: 'Baidu · 2017–2019',
  paragraphs: [
    "Every quarter Baidu brought 200-odd leaders from eight business units together for a summit, and it took a team of twelve to run it. I built the event app: each person's agenda, the logistics, the day's changes, as a mini-program on their phone. The coordination team went from twelve to three. The feature was later folded into [Baidu Hi](https://infoflow.baidu.com/newweb/#/), the company's own messaging app. Between summits I did the quarterly analyses for the executive and general-manager meetings: where operations were stuck, and where the growth was.",
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
    // The summary layer: what stays visible when the case is folded (step 30).
    summary:
      "Malaysia's first university admissions agent. Over half of Nottingham Malaysia's applicants are international, and they ask about eligibility, fees and visas at night, Malaysian time. NOVA answers from the documents the admissions team already maintains, picks the rule that applies to the student in front of it, books a counselor or a campus tour, and hands over to a person when it is not sure. [Announced in December 2025](https://www.salesforce.com/ap/news/press-releases/2025/12/15/university-of-nottingham-malaysia-deploys-agentforce-to-create-a-seamless-experience-for-prospective-students/) on the website, WhatsApp, Facebook and WeChat. I was its technical architect.",
    foldLabel: 'The full story: how it is put together, and three decisions',
    long: [
      "Over half of Nottingham Malaysia's applicants are international, from more than 70 countries, and they ask about courses, eligibility, fees and scholarships at night, Malaysian time. In 2025 the university built NOVA, its admissions agent on Salesforce Agentforce, [the first at a Malaysian university](https://www.nottingham.edu.my/NewsEvents/News/2025/University-of-Nottingham-Malaysia-Deploys-Agentforce-to-Create-a-Seamless-Experience-for-Prospective-Students.aspx). I was the Salesforce technical architect on the project, working alongside the implementation partner.",
      "Eligibility needs two inputs. The student's side is structured: nationality, qualification system (A-Level, STPM, IB, Gaokao), intended level and area of study, collected before the conversation starts and kept on their record in Salesforce. The requirements are documents, chunked and indexed in Data Cloud. The agent uses the student's attributes to pick the paragraph that applies, and says so when none does.",
      "The agent also acts. A student can book a counselor session or a campus tour in seconds, and a counselor stays reachable from inside the conversation. NOVA was [announced in December 2025](https://www.salesforce.com/ap/news/press-releases/2025/12/15/university-of-nottingham-malaysia-deploys-agentforce-to-create-a-seamless-experience-for-prospective-students/), on the website, WhatsApp, Facebook and WeChat.",
    ],
    // The architecture half. Facts: the owner's account (2026-11-11), the
    // resume library, and public Salesforce documentation; see
    // +个人网站/drafts/case-nova-architecture.md for the source of each line.
    architecture: {
      eyebrow: 'How NOVA is put together',
      diagram: [
        'student or parent ──► pre-chat form: name · nationality · email · phone · level · area of study',
        '                              │',
        '        website · WhatsApp · Facebook · WeChat ──► one agent configuration',
        '                              │',
        '        Agentforce (Atlas reasoning engine; 2025: topics + plain-language instructions)',
        '                              │',
        '      ┌───────────────────────┼──────────────────────────────┐',
        '  the student                 the rules                     the actions',
        '  a record in Sales Cloud     documents chunked into a       book a counselor session',
        '  (and Marketing Cloud),      Data Cloud search index:       or campus tour (Flow)',
        '  matched on email / phone    entry requirements, program    hand off to a counselor',
        '                              requirements, international    (Omni-Channel)',
        '                              student matters, fees, visas,',
        '                              accommodation, 2+2 / 3+1',
      ],
      paragraphs: [
        'Before the first message, the student fills in a short form: name, nationality, email, phone, the level they intend to study at and the area they are interested in. The form does three things. It is where the privacy notice sits. It gives the agent the inputs that decide which entry requirements apply, so it never has to ask for them mid-conversation. And it matches the person to a record, using an email address or phone number the form or the channel already has, so the enquiry and the person stay one record.',
        'The knowledge itself is documents: entry requirements by nationality and qualification system, program requirements by discipline and level, international-student matters, fees and scholarships, accommodation, and the 2+2 and 3+1 routes between Malaysia and the UK. I chunked and indexed them in Data Cloud (now Data 360), and deciding the cut, by discipline, by degree type or by delivery mode, was the part that took the longest.',
        'Three things bound what the agent does. Scope: each topic has a description and plain-language instructions saying what the agent may answer, and the admissions team can read and change them without a developer. Data: the agent runs as a named Salesforce user and sees only what that user may see, and prompts go to the model provider under zero data retention. Hand-off: I wrote four conditions with the admissions team. The question is outside the knowledge base, the agent is not confident in its answer, the topic is one the university decided a person should always handle, or the student asks. The agent is also instructed never to ask for passport numbers or other sensitive identifiers.',
      ],
      decisionsTitle: 'Three decisions, and what would change them',
      decisionsLead: 'Each one was a real fork. Pick what you would have done, then see what I did.',
      // The index of `options` I actually chose; the quiz compares against it.

      decisions: [
        {
          chosen: 2,
          constraint: 'Eligibility depends on who is asking (nationality, qualifications, level, area) and on rules that change every intake.',
          options: ['Let the model read the documents and judge', 'Put the rules in structured tables and compute with Flow', "Collect the student's side up front and use it to retrieve the right rule"],
          chose: "The third. The student's attributes are structured; the rules stay as documents the admissions team already maintains.",
          change: 'The logs show the agent combining two documents to reach a verdict. Then the rules go into a table and a Flow.',
        },
        {
          chosen: 1,
          constraint: 'The boundary has to move with admissions policy, and admissions, not IT, owns the policy.',
          options: ['A similarity threshold', 'Plain-language scope instructions', 'Hard-coded gates (Agent Script did not exist in 2025)'],
          chose: 'Plain-language instructions the admissions team can edit.',
          change: 'The same instruction keeps being edited to close the same gap. Today, with Agent Script, the hard refusals (passport numbers, visa verdicts) would go into a deterministic block and only tone and scope would stay as prose.',
        },
        {
          chosen: 0,
          constraint: 'The same applicant may arrive on the web, then on WhatsApp, then in the admissions system.',
          options: ['Ask for identity before the conversation', 'Resolve it afterwards with a Data Cloud ruleset on normalized email and phone', 'De-duplicate per channel'],
          chose: 'Ask before the conversation. Some people leave at the form. In return the agent has the grounding inputs before the first message.',
          change: 'The agent moves to a channel without a form: voice, or an anonymous widget added to cut drop-off. Then identity has to be resolved after the fact, and that is the case for Data Cloud identity resolution.',
        },
      ],
      // Held back from the page (the owner wants three, 2026-11-11); kept so they can be swapped in.
      tally: {
        3: 'Three of three. We would have built the same thing. That is either reassuring or a reason to talk.',
        2: 'Two of three. Enough overlap to start, enough difference to be worth a call.',
        1: 'One of three. Different instincts, same constraints. I would like to hear yours.',
        0: 'None the same. Now I am curious.',
      },
      decisionsHeld: [
        {
          constraint: 'The 2+2 and 3+1 routes between Malaysia and the UK are neither a discipline nor a degree level.',
          options: ['Cut by discipline', 'Cut by degree type', 'Make delivery mode a third axis'],
          chose: 'A third axis.',
          change: 'Students start asking by destination rather than by program. Then delivery mode becomes the top level of the knowledge base instead of a tag.',
        },
        {
          constraint: 'Four channels, and a visitor arrives with a different amount of identity and a different first language on each.',
          options: ['One agent per channel', 'One configuration behind every channel'],
          chose: 'One configuration. Same topics, grounding and hand-off everywhere; only presentation differs.',
          change: "One channel's audience splits from the others. Parents ask about safety, cost and whether the degree carries weight at home, and on WeChat they ask in Chinese. Split the welcome and the language first; the topics stay shared.",
        },
      ],
    },
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
      '[LGMG](https://www.lgmglifts.com/) makes aerial work platforms and mining equipment in Shandong. By 2022 its output had passed US$1.4 billion (¥10 billion) for the first time, with subsidiaries in Europe, North America and Japan and a plan to earn half its revenue from exports. Each subsidiary had grown up with its own standards. A machine reaches its buyer through a dealer, on credit or a lease, shipped by a logistics provider, cleared through customs, then needs parts for a decade.',
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
    summary:
      "[Wiz.AI](https://www.wiz.ai/)'s first LLM deployment, for a Singapore entertainment destination whose CMS already held every approved fact. I kept the CMS as the single source of truth, feeding the vector store on a schedule, so the agent inherited the editors' approvals instead of a hand-built knowledge base. Anything the agent was not sure of went to the official site or a person. One thing I would do differently: write down what \"correct\" means before building.",
    foldLabel: 'The full story',
    long: [
      "The customer's CMS already held every fact the agent would need, years of approved content run by an editorial team with its own approval workflow. In 2024 this Singapore entertainment destination wanted its first LLM deployment. It was [Wiz.AI](https://www.wiz.ai/)'s first too, with no platform yet.",
      'I decided the CMS would stay the source of truth, with a scheduled ingestion pipeline feeding the vector store, instead of a hand-built knowledge base. That costs freshness, up to one refresh cycle. The editors keep one place to edit and the agent inherits their approvals. Anything below the bar went to the official site or the customer service line rather than to a guess.',
      'What I would change: I never wrote down what "correct" meant before we built, as a scoring rubric or as acceptance criteria. And who maintains the knowledge base was a negotiation. We treated it as something the architecture would settle. I left before there was enough operating history to quote. I made the same two decisions on NOVA the next year: the customer\'s own system as the source of truth, and a hand-off to a person when the agent is not sure.',
    ],
  },
};

export const heroCards = [cases.nova, cases.lgmg, cases.wizai];

// United States, before Seattle: the degree and the Academy year. Facts and
// memories from the owner (2026-11-10); draft in +个人网站/drafts/united-states.md.
export const unitedStates = [
  {
    eyebrow: 'Wesleyan University · Connecticut · class of 2014',
    paragraphs: [
      'A liberal arts education at Wesleyan in Connecticut. What it left me with is a habit: read closely, argue from more than one side, and go a few levels deeper than the question asked for. I remember a history seminar where the discussion ran so far past the hour that nobody noticed, and a paper finished at three in the morning, too awake to sleep, walking under the moon and still arguing with myself.',
    ],
  },
  {
    eyebrow: 'SAP Academy for Presales · San Ramon, California · 2019–2020',
    paragraphs: [
      'A year in the Bay Area with trainees from more than twenty countries, the only one from East Asia that year. The program ran from how to present, through the SAP stack and an ERP certification, to building demos, pitching to customers, and reading the people across the table. Before each assessed presentation most of us rehearsed until two or three in the morning. It left me more confident, and with two rules I still use: practice until it is good, and when it is not ready, go anyway. Starting matters more than perfect. It was also my first step into SaaS as a solution architect. The road since began there.',
    ],
  },
];

// Built list. TCO sentence is from yixinportfolio架构20260908.md §04; the
// adoption atlas and the Kinetic Curtains line were dropped on 2026-11-10.
export const built = [
  {
    title: 'LLM deployment TCO calculator',
    body: 'A cost model for a year of a Claude workload, and, more usefully, which architectural levers actually move the number.',
    href: 'https://github.com/Piaodiver/llm-tco-calculator',
    // one more line, added 2026-11-11: the README's scoping-questions section
    more: { text: 'Five questions I ask before quoting one, ', label: 'in the README', href: 'https://github.com/Piaodiver/llm-tco-calculator#what-i-would-ask-before-quoting-any-of-this' },
  },
  {
    // Tariff Engine: repository is private until its README is finished, so no
    // link yet, same treatment as MultiVerse. Added 2026-11-11 (step 24).
    title: 'Tariff Engine',
    body: 'Estimates US import duties layer by layer, every dollar traced to its legal source. The LLM only classifies the product; the duty math is deterministic. In progress, 2026.',
    href: null,
  },
  {
    // MultiVerse I: title and a few lines for now, a page of its own later.
    // Cleared with the co-founder on 2026-09-07 for positioning and screenshots;
    // no backend or implementation detail here. Split of work added 2026-11-11
    // from the owner's own account (step 25); source note in
    // +个人网站/drafts/multiverse-split.md.
    title: 'MultiVerse I: Journey to the West, as anyone in it',
    body: 'An AI interactive reader, built with Shane Zhang. Play Sun Wukong, or a demon who gets one line in the original. 90% reading, 10% changing fate. I design and build the front end and write the story logic, where the reader gets a choice and what it changes. Shane builds the backend. iOS, 2026.',
    href: null,
  },
];
