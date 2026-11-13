import { useEffect, useId, useState } from 'react';

/**
 * Fold — the summary layer stays visible; the full story sits behind a quiet
 * one-line toggle and expands in place (step 30, plan A). The grid-rows
 * transition keeps the page from jumping; folding back scrolls the toggle to
 * the middle of the viewport so the reader does not land somewhere else.
 * `#<id>-full` in the URL opens it on load so a shared link shows the whole case.
 */
export default function Fold({ id, label, closeLabel = 'Fold it back', children }) {
  const panelId = useId();
  const [open, setOpen] = useState(false);

  // open on load for a shared link, and later when a link on the page (the
  // Four places index cards, step 41) sets the hash
  useEffect(() => {
    const follow = (scroll) => {
      if (window.location.hash !== `#${id}-full`) return;
      setOpen(true);
      if (scroll) {
        requestAnimationFrame(() => requestAnimationFrame(() => {
          document.getElementById(`${id}-toggle`)?.scrollIntoView({ block: 'start', behavior: 'smooth' });
        }));
      }
    };
    follow(false);
    const onHash = () => follow(true);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [id]);

  function toggle() {
    const next = !open;
    setOpen(next);
    if (next) {
      history.replaceState(null, '', `#${id}-full`);
    } else {
      history.replaceState(null, '', `#${id}`);
      const head = document.getElementById(`${id}-toggle`);
      head?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }

  return (
    <>
      <button
        type="button"
        id={`${id}-toggle`}
        className="v2-fold__toggle"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={toggle}
      >
        <span className="v2-fold__chev" aria-hidden="true" />
        {open ? closeLabel : label}
      </button>
      <div id={panelId} className="v2-fold" data-open={open ? 'true' : undefined}>
        <div>
          <div className="v2-fold__inner">
            {children}
            {open && (
              <button type="button" className="v2-fold__toggle mt-8" onClick={toggle}>
                <span className="v2-fold__chev" data-up aria-hidden="true" />
                {closeLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
