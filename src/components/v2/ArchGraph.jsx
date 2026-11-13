import { useState } from 'react';
import '../../styles/arch.css';

/**
 * ArchGraph — step 40. The architecture diagram as boxes you can click.
 * Clicking a node lights the edges that touch it, dims the rest and shows
 * one number and one sentence in the card under the drawing. Clicking the same node again puts everything back. Nothing is
 * recorded. Keyboard: each box is a button, Enter or Space toggles it.
 *
 * Motion uses the site-wide tokens --v2-ease / --v2-dur / --v2-press
 * declared in arch.css; new work should reference those instead of writing
 * its own durations.
 */
export default function ArchGraph({ graph, eyebrow }) {
  const [cur, setCur] = useState(null);
  const node = graph.nodes.find((n) => n.id === cur) || null;
  const lit = new Set(node ? graph.edges.filter((e) => e.from === cur || e.to === cur).map((e) => e.id) : []);
  const near = new Set(node ? graph.edges.filter((e) => lit.has(e.id)).flatMap((e) => [e.from, e.to]) : []);

  function toggle(id) {
    setCur((c) => (c === id ? null : id));
  }
  function onKey(e, id) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle(id);
    }
  }

  return (
    <div className="v2-arch">
      {eyebrow && <p className="v2-eyebrow">{eyebrow}</p>}
      <div className="v2-arch__scroll">
        <svg
          className="v2-arch__svg"
          viewBox={`0 0 ${graph.width} ${graph.height}`}
          role="group"
          aria-label="Architecture diagram"
        >
          {graph.edges.map((e) => (
            <path
              key={e.id}
              className="v2-arch__edge"
              data-on={lit.has(e.id) || undefined}
              data-dim={(cur && !lit.has(e.id)) || undefined}
              d={e.d}
              strokeDasharray={e.dashed ? '3 3' : undefined}
            />
          ))}
          {graph.nodes.map((n) => {
            const on = n.id === cur;
            const dim = cur && !on && !near.has(n.id);
            const pad = 12;
            const start = n.y + (n.title ? 22 : n.lines.length === 1 ? 21 : 18);
            return (
              <g
                key={n.id}
                className="v2-arch__node"
                data-on={on || undefined}
                data-dim={dim || undefined}
                role="button"
                tabIndex={0}
                aria-pressed={on}
                aria-label={n.title || n.lines[0]}
                onClick={() => toggle(n.id)}
                onKeyDown={(e) => onKey(e, n.id)}
              >
                <rect x={n.x} y={n.y} width={n.w} height={n.h} rx="2" />
                {n.title && (
                  <text x={n.x + pad} y={start} className="v2-arch__title">{n.title}</text>
                )}
                {n.lines.map((line, i) => {
                  const y = n.title ? start + 22 + i * 15 : start + i * 13;
                  const centered = !n.title;
                  return (
                    <text
                      key={i}
                      x={centered ? n.x + n.w / 2 : n.x + pad}
                      y={y}
                      textAnchor={centered ? 'middle' : undefined}
                      className={n.title || i > 0 ? 'v2-arch__small' : undefined}
                    >
                      {line}
                    </text>
                  );
                })}
                <circle className="v2-arch__mark" cx={n.x + n.w - 10} cy={n.y + 10} r="2.5" />
              </g>
            );
          })}
        </svg>
      </div>
      <aside className="v2-arch__card" aria-live="polite">
        {node ? (
          <div className="v2-arch__fact" key={node.id}>
            <p className="v2-arch__num">
              {node.n}
              <small>{node.unit}</small>
            </p>
            <p className="v2-arch__s">{node.s}</p>
            <p className="v2-arch__back">
              {graph.nodes.indexOf(node) + 1} / {graph.nodes.length} · {graph.back}
            </p>
          </div>
        ) : (
          <p className="v2-arch__hint">{graph.hint}</p>
        )}
      </aside>
    </div>
  );
}
