import { useEffect, useRef, useState } from 'react';
import { heroQuiz as Q, links } from '../../content/v2';

/**
 * HeroQuiz — step 33. The beacon (a route stop you can visit) sits at the end
 * of the headline; the panel opens under the sub-line. One question at a time,
 * then a result that points at the case that shows that kind. The hero's
 * lower lines step back while it is open (data-focus on the header, desktop
 * only), and the headline's promise is underlined so the game reads as that
 * sentence being kept. Nothing is recorded; a reload clears it.
 */
export function Beacon({ open, onToggle }) {
  const [pulsed, setPulsed] = useState(false);
  return (
    <button
      type="button"
      className="v2-beacon"
      aria-expanded={open}
      aria-controls="hero-quiz"
      aria-label={Q.ariaLabel}
      data-pulse={!open && !pulsed ? 'true' : undefined}
      onAnimationEnd={() => setPulsed(true)}
      onClick={onToggle}
    >
      <span className="v2-beacon__halo" aria-hidden="true" />
      <span className="v2-beacon__dot" aria-hidden="true" />
      <span className="v2-beacon__lbl" aria-hidden="true">{Q.beaconLabel}</span>
    </button>
  );
}

export function QuizPanel({ open, onClose }) {
  const [picks, setPicks] = useState([]);
  const [leaving, setLeaving] = useState(false);
  const step = picks.length;
  const done = step === Q.questions.length;
  const stageRef = useRef(null);

  function pick(j) {
    if (leaving) return;
    setLeaving(true);
    setTimeout(() => { setPicks((p) => [...p, j]); setLeaving(false); }, 320);
  }
  function restart() { setPicks([]); }

  useEffect(() => {
    if (open && stageRef.current) stageRef.current.focus({ preventScroll: true });
  }, [open, step]);

  let kind = null;
  if (done) {
    const c = [0, 0, 0];
    picks.forEach((p) => { c[p] += 1; });
    kind = c.indexOf(Math.max(...c));
    if (new Set(picks).size === 3) kind = picks[2];
  }

  return (
    <div id="hero-quiz" className="v2-hq" data-open={open ? 'true' : undefined} aria-hidden={!open}>
      <div>
        <div className="v2-hq__in">
          <div className="v2-hq__head">
            <span className="v2-hq__pips" aria-hidden="true">
              {Q.questions.map((_, i) => <i key={i} className="v2-hq__pip" data-on={i < step ? 'true' : undefined} />)}
            </span>
            <span className="v2-hq__count" aria-live="polite">{done ? 'Done' : `${step + 1} of ${Q.questions.length}`}</span>
            {done && <button type="button" className="v2-hq__link" onClick={restart}>Start over</button>}
            <button type="button" className="v2-hq__link" onClick={onClose}>Fold it back</button>
          </div>
          <div ref={stageRef} tabIndex={-1} className="v2-hq__stage" data-leaving={leaving ? 'true' : undefined} key={step}>
            {!done ? (
              <>
                <p className="v2-hq__q">{Q.questions[step].text}</p>
                <div className="v2-hq__opts" role="group" aria-label={`Question ${step + 1}`}>
                  {Q.questions[step].options.map((o, j) => (
                    <button key={o} type="button" className="v2-hq__opt" onClick={() => pick(j)}>
                      <span className="v2-hq__ring" aria-hidden="true" />
                      <span>{o}</span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <p className="v2-hq__k">{Q.resultLead}</p>
                <p className="v2-hq__t">{Q.results[kind].title}</p>
                <p className="v2-hq__p">{Q.results[kind].text}</p>
                <p className="v2-hq__go">
                  {Q.results[kind].links.map((l) => (
                    <a key={l.href} className="v2-link" href={l.href}>{l.label} <span aria-hidden="true">↓</span></a>
                  ))}
                </p>
                {Q.results[kind].research && (
                  <p className="v2-hq__r">
                    <span className="v2-hq__rk">What the research says</span>
                    {Q.results[kind].research} <a href={Q.results[kind].source.href}>{Q.results[kind].source.label}</a>
                  </p>
                )}
                <p className="v2-hq__c">
                  {Q.closing} <a className="v2-link" href={`mailto:${links.email}`}>{Q.closingCta}</a>{Q.closingTail}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
