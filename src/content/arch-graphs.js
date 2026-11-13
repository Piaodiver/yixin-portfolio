// Step 40: the NOVA architecture as a diagram you can click. Every number and
// sentence below is taken from the NOVA paragraphs already on the site
// (cases.nova.architecture in v2.js); nothing new is claimed here. Each node
// has a number, a unit and one sentence; edges name the two nodes they join.
// Coordinates are in the SVG's own 680 x 400 space.
export const archGraphs = {
  nova: {
    width: 680,
    height: 400,
    nodes: [
      {
        id: 'form', x: 100, y: 20, w: 480, h: 34,
        lines: ['student or parent ──► pre-chat form'],
        n: '6', unit: 'fields',
        s: 'Name, nationality, email, phone, level, area of study. Collected before the first message, so the agent never asks mid-conversation.',
      },
      {
        id: 'channels', x: 100, y: 84, w: 480, h: 34,
        lines: ['website · WhatsApp · Facebook · WeChat ──► one agent configuration'],
        n: '4', unit: 'channels, one configuration',
        s: 'Website, WhatsApp, Facebook and WeChat. The same agent configuration behind all of them.',
      },
      {
        id: 'agent', x: 100, y: 148, w: 480, h: 38,
        lines: ['Agentforce (Atlas reasoning engine)', '2025: topics + plain-language instructions'],
        n: '3', unit: 'things bound what it does',
        s: 'Scope, data, and hand-off. The scope instructions are plain language the admissions team can read and change without a developer.',
      },
      {
        id: 'student', x: 28, y: 226, w: 184, h: 150,
        title: 'the student',
        lines: ['a record in Sales Cloud', '(and Marketing Cloud),', 'matched on email / phone'],
        n: '1', unit: 'record per person',
        s: 'Matched on an email address or phone number the form or the channel already has, so the inquiry and the person stay one record.',
      },
      {
        id: 'rules', x: 248, y: 226, w: 184, h: 150,
        title: 'the rules',
        lines: ['documents chunked into a', 'Data Cloud search index:', 'entry requirements, program', 'requirements, international', 'student matters, fees, visas,', 'accommodation, 2+2 / 3+1'],
        n: '4', unit: 'qualification systems',
        s: 'A-Level, STPM, IB, Gaokao. The requirement differs by each, which is why the student\'s side has to be structured before the conversation starts.',
      },
      {
        id: 'actions', x: 468, y: 226, w: 184, h: 150,
        title: 'the actions',
        lines: ['book a counselor session', 'or campus tour (Flow)', '', 'hand off to a counselor', '(Omni-Channel)'],
        n: '4', unit: 'hand-off conditions',
        s: 'Outside the knowledge base, not confident, a topic a person should always handle, or the student asks. Written with the admissions team.',
      },
    ],
    edges: [
      { id: 'form-channels', from: 'form', to: 'channels', d: 'M340 54 V84' },
      { id: 'channels-agent', from: 'channels', to: 'agent', d: 'M340 118 V148' },
      { id: 'agent-student', from: 'agent', to: 'student', d: 'M340 186 V206 H120 V226' },
      { id: 'agent-rules', from: 'agent', to: 'rules', d: 'M340 186 V226' },
      { id: 'agent-actions', from: 'agent', to: 'actions', d: 'M340 186 V206 H560 V226' },
      { id: 'student-rules', from: 'student', to: 'rules', d: 'M212 360 H248', dashed: true },
    ],
    hint: 'Click a box. Each one has a number and a sentence behind it.',
    back: 'Click again to put it back',
  },
};
