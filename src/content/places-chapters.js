// Step 41: one door per picture. Copy for the Four places chapters that is
// not already in v2.js. The Singapore chapter has no long text of its own
// (the two agents live in The work), so it carries an index card for each,
// in the hero cards' own words, and a way back up.
export const stopsHint = 'Click a place.';
export const chapterClose = (label) => `Close ${label}`;
export const singaporeChapter = {
  eyebrow: 'Wiz.AI, Salesforce · 2024–2026',
  lead: 'Two years, two employers, two agents in production. The full stories are in The work above; here is the index card for each.',
  cards: [
    { eyebrow: 'NOVA · Salesforce · 2025', href: '#nova-full', caseId: 'nova' },
    { eyebrow: 'Wiz.AI · 2024', href: '#wizai-full', caseId: 'wizai' },
  ],
  read: 'Read ↑',
};
