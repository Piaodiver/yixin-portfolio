import { useState } from 'react';
import SceneBand from './SceneBand';
import Reveal from './Reveal';

/**
 * A place section: a heading (the place, and one small line of city, employers
 * and years), the scene band, then prose. Every place gets the same heading
 * so the four sections read at one level. `place` must match SceneBand's set.
 */
export default function Place({ place, id = place, title, sub, children }) {
  return (
    <section id={id} className="pt-10 md:pt-14">
      <Reveal className="v2-wrap pb-5">
        <h2 className="v2-h2">
          {title}
          {sub ? <small className="v2-h2__sub">{sub}</small> : null}
        </h2>
      </Reveal>
      <SceneBand place={place} />
      <Reveal className="v2-wrap py-10 md:py-12">
        {children}
      </Reveal>
    </section>
  );
}

/** Small case heading: client, platform, year. */
export function CaseHead({ item }) {
  return (
    <h3 id={item.id} className="v2-eyebrow pt-2">
      {item.client}
      <span className="text-ink-300"> · </span>
      {item.platform}
      <span className="text-ink-300"> · </span>
      {item.year}
    </h3>
  );
}

const LINK = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;

/** Paragraph text with [text](url) links; everything else is plain text. */
export function Inline({ text }) {
  const out = [];
  let last = 0;
  for (const m of text.matchAll(LINK)) {
    if (m.index > last) out.push(text.slice(last, m.index));
    out.push(<a key={m.index} href={m[2]} target="_blank" rel="noreferrer">{m[1]}</a>);
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

const NOTE = /\{\{([^|}]+)\|([^}]+)\}\}/g;

/**
 * Para — one paragraph. `{{word|aside}}` in the text marks a word that can be
 * clicked (dotted underline) to show one extra sentence under the paragraph,
 * as a small note with a hairline at the left (step 35). Several notes in one
 * paragraph are independent. Nothing else in the text changes.
 */
export function Para({ text }) {
  const [open, setOpen] = useState(() => new Set());
  const parts = [];
  const notes = [];
  let last = 0;
  for (const m of text.matchAll(NOTE)) {
    if (m.index > last) parts.push(<Inline key={last} text={text.slice(last, m.index)} />);
    const i = notes.length;
    notes.push({ word: m[1], aside: m[2] });
    const on = open.has(i);
    parts.push(
      <button
        key={`n${i}`}
        type="button"
        className="v2-note"
        aria-expanded={on}
        onClick={() => setOpen((prev) => { const next = new Set(prev); if (next.has(i)) next.delete(i); else next.add(i); return next; })}
      >
        {m[1]}
      </button>,
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(<Inline key={last} text={text.slice(last)} />);
  if (notes.length === 0) return <p><Inline text={text} /></p>;
  return (
    <>
      <p>{parts}</p>
      {notes.map((n, i) => open.has(i) && (
        <p key={i} className="v2-note__aside">
          <b>{n.word.charAt(0).toUpperCase() + n.word.slice(1)}</b> {n.aside}
        </p>
      ))}
    </>
  );
}

export function Prose({ paragraphs }) {
  return (
    <div className="v2-prose mt-4">
      {paragraphs.map((p, i) => <Para key={i} text={p} />)}
    </div>
  );
}
