import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { hotspots } from '../../content/v2';

/**
 * SceneHotspots — step 34. Small hollow dots over a mounted scene; hovering
 * or tapping one floats a card on the painting. Lives as a sibling of the
 * scene host (band or full-screen overlay), so the scene keeps answering the
 * pointer everywhere except on the dots and the open card.
 *
 * Positioning: each spot is a fraction of an anchor inside the scene's own
 * DOM (see `hotspots` in content/v2.js), measured again on resize and when
 * the scene's images load. So the dots sit on the same brushstrokes in the
 * 1040px band, on a phone and in full screen. A spot whose anchor is not
 * drawn (narrow composition) or sits outside the box is not rendered.
 *
 * Cards: hover opens, leaving closes; a click pins the card open until the
 * next click on the dot, a click elsewhere, or Escape. One card per scene.
 * The guess card (Tel Aviv sailboat) reuses the step-32 pattern: pick one of
 * three, then the answer appears. Nothing is recorded.
 */

const NARROW = 720;
const EMPTY = [];
const SPOTS = new Proxy(hotspots, { get: (t, k) => t[k] || EMPTY });

function imgRect(host, sel) {
  const img = host.querySelector(sel);
  if (!img) return null;
  const h = host.getBoundingClientRect();
  const r = img.getBoundingClientRect();
  if (r.width === 0 || r.height === 0) return null;
  return { x: r.left - h.left, y: r.top - h.top, w: r.width, h: r.height };
}

/* object-fit: cover with the x anchor the scene wrote into object-position */
function coverRect(host, sel) {
  const img = host.querySelector(sel);
  if (!img || !img.naturalWidth) return null;
  const box = host.getBoundingClientRect();
  const W = box.width; const H = box.height;
  const ar = img.naturalWidth / img.naturalHeight;
  let w; let h;
  if (W / H > ar) { w = W; h = W / ar; } else { h = H; w = H * ar; }
  const ax = parseFloat(img.style.objectPosition || '0') / 100 || 0;
  return { x: (W - w) * ax, y: (H - h) / 2, w, h };
}

/* Golden Gate: everything below the deck is laid out from the deck line.
   The scene sets .fog top = deck - below*.10 and height = below*.60, so the
   deck can be read back from the fog element. */
function bridgeDeck(host) {
  const fog = host.querySelector('.fog');
  const H = host.getBoundingClientRect().height;
  const top = fog ? parseFloat(fog.style.top) : NaN;
  if (!Number.isFinite(top)) return H * 0.6153;
  return (top + 0.1 * H) / 1.1;
}

function locate(spot, host) {
  const box = host.getBoundingClientRect();
  const narrow = box.width < NARROW;
  if (narrow && spot.narrow === false) return null;
  let p = null;
  if (spot.anchor === 'temple' || spot.anchor === 'backdrop') {
    const r = imgRect(host, spot.anchor === 'temple' ? '.temple img' : 'img.backdrop');
    if (r) p = { x: r.x + spot.x * r.w, y: r.y + spot.y * r.h };
  } else if (spot.anchor === 'cover') {
    const r = coverRect(host, 'img.scene');
    if (r) p = { x: r.x + spot.x * r.w, y: r.y + spot.y * r.h };
  } else if (spot.anchor === 'bridge') {
    const deck = bridgeDeck(host);
    const y = spot.fixed ? spot.y * box.height : deck + (box.height - deck) * spot.y;
    p = { x: spot.x * box.width, y };
  }
  if (!p) return null;
  if (p.x < 8 || p.y < 8 || p.x > box.width - 8 || p.y > box.height - 8) return null;
  return { ...p, W: box.width, H: box.height };
}

export default function SceneHotspots({ hostRef, place, onGo }) {
  const spots = SPOTS[place];
  // the scene arrives in the host asynchronously; watch for it rather than
  // asking the band or overlay to report it
  const [active, setActive] = useState(false);
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;
    const check = () => setActive(host.children.length > 0 && host.dataset.place === place);
    check();
    const mo = new MutationObserver(check);
    mo.observe(host, { childList: true });
    return () => mo.disconnect();
  }, [hostRef, place]);
  const [pos, setPos] = useState({});
  const [open, setOpen] = useState(null);      // spot id
  const [pinned, setPinned] = useState(false);
  const [picks, setPicks] = useState({});      // guess answers, per spot id
  const layerRef = useRef(null);
  const leaveT = useRef(null);

  const measure = useCallback(() => {
    const host = hostRef.current;
    if (!host || !active) { setPos({}); return; }
    const next = {};
    for (const s of spots) {
      const p = locate(s, host);
      if (p) next[s.id] = p;
    }
    setPos(next);
  }, [hostRef, active, spots]);

  useLayoutEffect(() => {
    if (!active) return undefined;
    const host = hostRef.current;
    if (!host) return undefined;
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(host);
    // the scene's images arrive after mount; measure once they have a size
    const imgs = Array.from(host.querySelectorAll('img'));
    imgs.forEach((im) => im.addEventListener('load', measure));
    // the scene lays itself out on its own resize handler, after ours
    const t = setTimeout(measure, 300);
    const t2 = setTimeout(measure, 1200);
    return () => {
      ro.disconnect();
      imgs.forEach((im) => im.removeEventListener('load', measure));
      clearTimeout(t); clearTimeout(t2);
    };
  }, [active, hostRef, measure]);

  // close on Escape or a click outside the layer
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') { setOpen(null); setPinned(false); } };
    const onDown = (e) => {
      if (layerRef.current && !layerRef.current.contains(e.target)) { setOpen(null); setPinned(false); }
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown, true);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown, true);
    };
  }, [open]);

  if (!active || spots.length === 0) return null;
  const touch = typeof window !== 'undefined' && window.matchMedia?.('(hover: none)').matches;

  const stop = (e) => { e.stopPropagation(); };

  const openSpot = spots.find((s) => s.id === open && pos[s.id]);
  const closeAll = () => { setOpen(null); setPinned(false); };
  // hover: leaving the dot for the card must not close the card, so the
  // close waits a beat and an enter on either cancels it
  const hoverIn = (sid) => { clearTimeout(leaveT.current); setOpen(sid); };
  const hoverOut = () => { clearTimeout(leaveT.current); leaveT.current = setTimeout(() => setOpen(null), 160); };

  return (
    <div ref={layerRef} className="v2-hs" onClick={stop} onPointerDown={stop} data-touch={touch ? 'true' : undefined}>
      {spots.map((s) => {
        const p = pos[s.id];
        if (!p) return null;
        const on = open === s.id;
        return (
          <div
            key={s.id}
            className="v2-hs__spot"
            style={{ left: `${p.x}px`, top: `${p.y}px` }}
            data-on={on ? 'true' : undefined}
            onPointerEnter={(e) => { if (e.pointerType === 'mouse' && !pinned) hoverIn(s.id); }}
            onPointerLeave={(e) => { if (e.pointerType === 'mouse' && !pinned) hoverOut(); }}
          >
            <button
              type="button"
              className="v2-hs__dot"
              aria-expanded={on}
              aria-label={s.guess ? 'A question about this place' : 'A note about this place'}
              onClick={() => {
                if (on && pinned) closeAll();
                else { setOpen(s.id); setPinned(true); }
              }}
            >
              <span aria-hidden="true" />
            </button>
          </div>
        );
      })}
      {openSpot ? (
        <div
          className="v2-hs__at"
          style={{ left: `${pos[openSpot.id].x}px`, top: `${pos[openSpot.id].y}px` }}
          onPointerEnter={(e) => { if (e.pointerType === 'mouse') hoverIn(openSpot.id); }}
          onPointerLeave={(e) => { if (e.pointerType === 'mouse' && !pinned) hoverOut(); }}
        >
          <Card
            spot={openSpot}
            at={pos[openSpot.id]}
            pick={picks[openSpot.id]}
            onPick={(j) => { setPicks({ ...picks, [openSpot.id]: j }); setPinned(true); }}
            onGo={(place) => { closeAll(); onGo?.(place); }}
          />
        </div>
      ) : null}
    </div>
  );
}

function Card({ spot: s, at: p, pick, onPick, onGo }) {
  const v = p.y / p.H < 0.42 ? 'below' : 'above';
  const h = p.x / p.W < 0.3 ? 'left' : p.x / p.W > 0.7 ? 'right' : 'center';
  return (
    <div className="v2-hs__card" data-v={v} data-h={h} role="note">
      {s.guess ? (
        <Guess spot={s} pick={pick} onPick={onPick} />
      ) : (
        <p className="v2-hs__text">{s.text}</p>
      )}
      {s.links && (!s.guess || pick !== undefined) ? (
        <p className="v2-hs__links">
          {s.links.map((l) => (
            <button key={l.place} type="button" className="v2-link v2-hs__go" onClick={() => onGo(l.place)}>
              {l.label} <span aria-hidden="true">→</span>
            </button>
          ))}
        </p>
      ) : null}
    </div>
  );
}

function Guess({ spot, pick, onPick }) {
  const g = spot.guess;
  const done = pick !== undefined;
  return (
    <div className="v2-hs__guess" data-state={done ? 'done' : 'open'}>
      <p className="v2-hs__text">{g.question}</p>
      <div className="v2-hs__opts" role={done ? undefined : 'group'}>
        {g.options.map((o, j) => {
          const mine = j === g.answer;
          const picked = j === pick;
          return (
            <button
              key={o}
              type="button"
              className="v2-hs__opt"
              data-mine={done && mine ? 'true' : undefined}
              data-picked={picked ? 'true' : undefined}
              disabled={done}
              onClick={() => onPick(j)}
            >
              <span className="v2-hs__ring" aria-hidden="true" />
              <span>{o}</span>
            </button>
          );
        })}
      </div>
      {done ? <p className="v2-hs__reveal">{g.reveal}</p> : null}
    </div>
  );
}
