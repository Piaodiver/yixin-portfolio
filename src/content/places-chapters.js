// Step 41: one door per picture. Copy for the Four places chapters that is
// not already in v2.js. The Singapore chapter keeps the two agents in The work
// and carries one paragraph about the place, an index card for each agent,
// in the hero cards' own words, and a way back up.
export const stopsHint = 'Click a place.';
export const chapterClose = (label) => `Close ${label}`;
export const singaporeChapter = {
  eyebrow: 'Wiz.AI, Salesforce · 2024–2026',
  // The only paragraph on the site about Singapore itself (2026-11-12).
  life: 'On weekends I went to the museums. The docents were volunteers, most of them retired, and they told the story of how the country was built as if they had a personal stake in it. They did. It is a small island that decided early what it wanted to be, wrote it down, and found people willing to keep becoming it.',
  lead: 'Two years, two employers, two agents in production. The full stories are in The work above; here is the index card for each.',
  cards: [
    { eyebrow: 'NOVA · Salesforce · 2025', href: '#nova-full', caseId: 'nova' },
    { eyebrow: 'Wiz.AI · 2024', href: '#wizai-full', caseId: 'wizai' },
  ],
  read: 'Read ↑',
};
