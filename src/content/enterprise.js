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
    region: 'Malaysia',
    year: '2025',
    status: 'delivered',
    kicker: 'First university in Malaysia on Agentforce',
    title: 'NOVA — an admissions agent for the University of Nottingham Malaysia',
    summary: 'An AI assistant for prospective students and their parents — courses, entry requirements, fees, visas, accommodation — that also books them time with a human counsellor. The first tertiary institution in Malaysia to deploy Agentforce.',
    metrics: [
      { value: '1st',  label: 'Tertiary institution in Malaysia on Agentforce' },
      { value: '50%+', label: 'Of applicants are international students' },
    ],
    sections: [
      {
        heading: 'The problem',
        body: [
          'More than half of the university’s applicants are international, and they ask their questions when it is the middle of the night in Malaysia. They are also the highest-stakes questions a prospective student asks: am I eligible, what will it cost, can I get a visa in time, do I need a foundation year first.',
          'Agentforce had only just launched. Neither the Salesforce technical architect nor the implementation partner had delivered on it before, and there was no reference implementation to argue from. I was brought in after implementation had already started, when the partner reported they could not complete it alone.',
        ],
      },
      {
        heading: 'Architecture',
        body: [
          'Eligibility is not a fact you retrieve. It is a judgment you compute, and one of its inputs is today’s date. Entry requirements sit on a matrix of nationality, qualification system (A-Level, STPM, IB, Gaokao and the rest), discipline and degree level — and time cuts across all of it, because visa processing differs by passport. The same intake is still reachable for an applicant from one country and already out of reach for another. Add the students who want a foundation year first, to build English and adjust, and the timeline rearranges again.',
          'That is why the agent was grounded in structured data in Data Cloud rather than a document corpus. Retrieval over documents answers "what is the requirement"; it cannot answer "can I still make this intake", because no document contains that sentence. Prospective-student data connected through to Sales Cloud and Marketing Cloud, so the enquiry and the person making it stayed one record.',
          'The agent also acts rather than only answering. Students self-schedule a counsellor session or a campus tour in seconds instead of waiting on a reply — the step that turns an enquiry into a conversation with the university.',
          'Knowing when to stop is written, not tuned. On a custom RAG stack, "I don’t know" is a similarity score falling below a threshold, and you tune it by moving a number. Here the reasoning engine classifies the question against topic descriptions and follows scope instructions written in plain language, so the boundary is a paragraph the admissions team can read and change themselves. Anything outside it, or any request from the student, goes to a human counsellor. When a wrong answer about entry requirements or visa timing can cost someone an intake, a boundary the people who own the facts can actually read beats one that is precisely tuned.',
        ],
      },
      {
        heading: 'What I did',
        body: [
          'I directed the solution architecture for phase one: roughly a dozen topics spanning pre-college, undergraduate and postgraduate study, curriculum and academic requirements by discipline, entry requirements by nationality, visas, fees and scholarships, accommodation, employability, the 2+2 and 3+1 routes split between Malaysia and the UK, appointment booking, and escalation.',
          'Phase one launched on the website and WhatsApp, from a single agent configuration behind both. Facebook and WeChat came later and were not mine. One agent behind every channel is the part worth keeping: topics, actions, grounding and escalation policy stay shared, and only presentation differs. If the same question gets two different answers on two channels, that is a defect, not a channel difference.',
          'A quieter design point: parents are a second audience with their own questions — safety, cost, employability, whether the degree carries weight back home — and they do not ask in the same register as their children.',
        ],
      },
      {
        heading: 'How it was evaluated',
        body: [
          'Phase one passed UAT in full and the planned scope went live on schedule. We tracked containment and escalation rates, topic coverage against incoming questions, UAT pass rate, response time against the human baseline, volume handled outside business hours, and satisfaction.',
          'The metric I would add now is self-scheduled appointments. Everything else on that list measures the conversation; that one measures whether the conversation became the thing the university actually wanted \u2014 a student sitting in front of a counsellor. On an admissions agent it is the closest available proxy for business value, and it is the one we did not instrument.',
          'Operating figures belong to the customer to publish, not to me. I was also there for the launch rather than for a long enough history to draw on, and I do not quote numbers I have not verified myself.',
        ],
      },
      {
        heading: "What I'd do differently",
        body: [
          'What cost us most was not the platform. It was deciding how to organise the data: by discipline, or by degree type. A student asking what they can study in engineering and a student asking what undergraduate degrees exist want the same information cut two different ways — and the 2+2 and 3+1 routes break both cuts, because a split-campus route is neither a discipline nor a level. It is a mode of delivery, a third axis. How to chunk all of it took real trial and error, and with the product newly launched there was nobody to ask.',
          'I would arrive on day one. I came in partway through, after the partner had already run into trouble, and some of the structure was set by then. Failing that, I would ask the partner to write down the problems they already knew about before I joined, so I could judge where the real blockage was instead of reconstructing it.',
          'Both of my enterprise AI deployments turned out to be content problems wearing AI clothes, but they were different content problems. One was static facts that had to stay fresh. This one was a judgment that had to be computed, against a matrix that moves with the calendar. Working out early which of the two you are looking at decides the whole architecture.',
        ],
      },
    ],
    links: [
      { label: 'Salesforce press release', href: 'https://www.salesforce.com/ap/news/press-releases/2025/12/15/university-of-nottingham-malaysia-deploys-agentforce-to-create-a-seamless-experience-for-prospective-students/' },
      { label: 'University announcement', href: 'https://www.nottingham.edu.my/NewsEvents/News/2025/University-of-Nottingham-Malaysia-Deploys-Agentforce-to-Create-a-Seamless-Experience-for-Prospective-Students.aspx' },
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
    region: 'China → global',
    year: '2019–23',
    status: 'delivered',
    kicker: 'SAP global lighthouse customer case',
    title: 'Lead-to-Cash for LGMG, from the bid to go-live',
    summary: 'A multi-sided commercial network for a top-ten Chinese construction machinery manufacturer — dealers, end customers, logistics providers and finance transacting on the same orders, across subsidiaries on three continents.',
    metrics: [
      { value: '25%', label: 'Faster order processing (published by SAP)' },
      { value: '20%', label: 'Faster shipment approval cycle (published by SAP)' },
      { value: '30%', label: 'Faster creditor rights management (published by SAP)' },
    ],
    sections: [
      {
        heading: 'The problem',
        body: [
          'Selling heavy machinery is not one transaction between two parties. A machine reaches its buyer through a dealer, on credit or a lease, shipped by a logistics provider, cleared through customs if it is leaving the country — and then it needs parts for the next decade, bought by a different person for different reasons.',
          'LGMG makes aerial work platforms and mining equipment, and had just crossed ¥10 billion in output for the first time. Subsidiaries in Europe, North America and Japan had gone up fast, and the growth brought its own problem: standards had diverged between countries, and the group could no longer manage its branches consistently. The old commerce system had cumbersome approvals, no real multilingual or multicurrency support, and material master data that was duplicated rather than shared. The brief was to bring all of it back under one set of rules without slowing the expansion down.',
        ],
      },
      {
        heading: 'Architecture',
        body: [
          'The shape of the answer is a network, not a CRM. Four external parties each get their own portal — dealers, end customers, logistics providers, and the logistics operation itself — alongside an internal finance portal. They transact on the same orders and see different faces of them, which makes visibility a first-class design problem rather than a permissions afterthought.',
          'Four constraints did most of the shaping. Commercial terms vary per deal, so an order carries its contract type — consignment, payment in full, instalments, financial leasing, or a gift agreement — and the downstream accounting follows from it. Machines are bought on credit, so rating, limit, balance and overdue status are checked as the order is taken, not after — the part of the programme SAP later measured at 30% faster creditor rights management. Whole machines and parts are separate order streams because they are different purchases by different people: a machine is capital expenditure signed off by a buyer, while parts are recurring aftermarket orders placed by a technician working from an exploded diagram. And export adds its own chain — booking shipping space, then customs progress visible to whoever is waiting on it.',
          'The sharpest constraint was pricing. The same machine carries different prices by region, and dealers must not see each other’s. That is a requirement on the data model rather than a filter on a report, and it constrains pricing, authorisation and reporting together. Quote approval worked on the same logic in a smaller way: inside an agreed band a quote needed no approval, outside it finance signed.',
        ],
      },
      {
        heading: 'What I did',
        body: [
          'Presales through to go-live, which is not the usual split. I won the deal by organising a cross-functional bid response in a very short window, then stayed on as solution architect: end-user interviews across the divisions, blueprint design, working with the engineering team through the build, system testing, and launch.',
          'Phase one shipped in Q1 2022, covering order management, sales, quotation, customer and credit master data, parts, the finance portal, and the dealer, customer and logistics portals.',
        ],
      },
      {
        heading: 'Outcome',
        body: [
          'SAP published the programme as a customer story: order processing 25% faster, shipment approval 20% faster, creditor rights management 30% faster, on SAP Commerce Cloud with S/4HANA Cloud Private Edition. Beyond the throughput numbers, the result SAP records is the one the brief actually asked for — a master data hierarchy and unified accounting categories, models and rules across the group.',
          'It became an SAP global lighthouse customer case. Those are SAP’s figures for the whole programme, which ran wider and later than the phase I delivered.',
        ],
      },
      {
        heading: "What I'd do differently",
        body: [
          'The hard part was never the technology. The divisions wanted different things and sometimes wanted them at each other’s expense — which, seen properly, was not a personality problem but the thing the programme existed to fix. Standards had diverged because the subsidiaries had grown fast and separately, so every requirements conversation was really a negotiation about whose way of working would become the group’s. Reaching agreement meant two jobs that are easy to confuse: building consensus on the substance, and maintaining the relationships that let the substance be discussed at all. Neither substitutes for the other.',
          'The other constant was expectation. New requirements arrived throughout, so a standing part of the work was holding the scope and re-stating what a successful delivery meant — not once at kickoff, but repeatedly, as the thing everyone was measuring against drifted.',
          'That is worth putting next to my later work at Wiz.AI, where the central regret is that nobody wrote down what "delivered" meant. It was not that I had forgotten the lesson; it was that I no longer had the standing to insist on it. At SAP I came in through the bid, on a structured programme, representing a vendor the customer had chosen deliberately. At a small vendor facing a much larger customer, the person with the least leverage to open that conversation is the one with the most to lose from leaving it open. Knowing the right thing to do and being positioned to do it are different problems, and the second one is structural.',
        ],
      },
    ],
    links: [
      { label: 'SAP customer story', href: 'https://www.sap.com/documents/2024/02/fc105f35-a87e-0010-bca6-c68f7e60039b.html' },
    ],
  },
];
