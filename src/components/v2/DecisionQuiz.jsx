import { useState } from 'react';

/**
 * DecisionQuiz — the decisions as choose-then-reveal (step 31). Each decision
 * shows its constraint and options; the reader picks one, and only then do
 * "chose" and "would change if" appear. A pick that matches gets "Same call";
 * one that does not gets a hairline strike and "I went another way" on mine.
 * Nothing is recorded. "Show all" reveals everything for readers who would
 * rather just read.
 */
export default function DecisionQuiz({ arch }) {
  const items = arch.decisions;
  const [picks, setPicks] = useState(() => items.map(() => null));
  const answered = picks.filter((p) => p !== null).length;
  const done = answered === items.length;
  const same = picks.filter((p, i) => p === items[i].chosen).length;
  const skipped = picks.some((p) => p === -1);

  function pick(i, j) {
    if (picks[i] !== null) return;
    setPicks(picks.map((p, k) => (k === i ? j : p)));
  }
  function showAll() {
    setPicks(picks.map((p) => (p === null ? -1 : p)));
  }

  return (
    <div className="v2-quiz">
      <p className="v2-eyebrow mt-10">{arch.decisionsTitle}</p>
      <p className="v2-quiz__lead">{arch.decisionsLead}</p>
      <div className="v2-quiz__bar">
        <span className="v2-quiz__pips" aria-hidden="true">
          {items.map((d, i) => {
            const p = picks[i];
            const on = p === null ? undefined : p === -1 || p === d.chosen ? 'same' : 'diff';
            return <i key={i} className="v2-quiz__pip" data-on={on} />;
          })}
        </span>
        <span className="v2-quiz__count" aria-live="polite">
          {skipped ? 'All shown' : `${answered} of ${items.length} answered`}
        </span>
        {!done && (
          <button type="button" className="v2-quiz__skip" onClick={showAll}>
            Show all {items.length}
          </button>
        )}
      </div>

      <ol className="v2-quiz__list">
        {items.map((d, i) => {
          const p = picks[i];
          const state = p === null ? 'open' : 'done';
          return (
            <li key={i} className="v2-quiz__item" data-state={state}>
              <p className="v2-quiz__n">{i + 1} / {items.length}</p>
              <p className="v2-quiz__constraint">{d.constraint}</p>
              <div className="v2-quiz__opts" role={state === 'open' ? 'group' : undefined}>
                {d.options.map((o, j) => {
                  const mine = j === d.chosen;
                  const picked = j === p;
                  const tag = state === 'done' && mine && p !== -1 ? (picked ? 'Same call' : 'I went another way') : '';
                  return (
                    <button
                      key={o}
                      type="button"
                      className="v2-quiz__opt"
                      data-mine={mine || undefined}
                      data-picked={picked || undefined}
                      disabled={state === 'done'}
                      onClick={() => pick(i, j)}
                    >
                      <span className="v2-quiz__ring" aria-hidden="true" />
                      <span>
                        <span className="v2-quiz__t">{o}</span>
                        {tag && <span className="v2-quiz__tag">{tag}</span>}
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="v2-quiz__reveal" aria-hidden={state !== 'done'}>
                <div>
                  <div className="v2-quiz__reveal-in">
                    <p className="v2-quiz__chose">{d.chose}</p>
                    <p className="v2-quiz__change">
                      <span className="v2-quiz__change-k">It would change if</span> {d.change}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="v2-quiz__tally" data-on={done && !skipped ? 'true' : undefined} aria-live="polite">
        <div>
          <div className="v2-quiz__tally-in">
            {done && !skipped && (
              <>
                <p className="v2-quiz__tally-line">{arch.tally[same]}</p>
                <p className="v2-quiz__tally-sub">Same calls or not, the reasons are the useful part. <a className="v2-link" href="#end">Write to me</a> if you would have argued one of them.</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
