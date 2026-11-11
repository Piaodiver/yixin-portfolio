import { useState } from 'react';
import Reveal from './Reveal';
import { links } from '../../content/v2';

/**
 * End — the ask, once more, for the reader who got this far. The address is
 * selectable text with a copy button (mailto links fail quietly in some
 * clients), then GitHub and LinkedIn.
 */
export default function End() {
  const [copied, setCopied] = useState(false);

  const select = () => {
    const el = document.getElementById('v2-email');
    if (!el) return;
    const range = document.createRange();
    range.selectNodeContents(el);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
  };
  const copy = () => {
    const done = () => { setCopied(true); setTimeout(() => setCopied(false), 1600); };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(links.email).then(done, select);
    } else {
      select();
    }
  };

  return (
    <Reveal as="section" id="end" className="v2-end border-t border-rule">
      <div className="v2-wrap">
        <h2 className="v2-h2">Still here? Then write to me.</h2>
        <p className="v2-person mt-3">A short note is enough. I reply to every one, and the resume comes with the reply.</p>
        <p className="v2-end__mail mt-6">
          <a id="v2-email" className="v2-end__address" href={`mailto:${links.email}`}>{links.email}</a>
          <button type="button" className="v2-end__copy" onClick={copy} aria-live="polite">
            {copied ? 'Copied' : 'Copy'}
          </button>
        </p>
        <p className="mt-6 text-[0.92rem]">
          <a className="v2-link" href={links.github}>GitHub</a>
          <span className="mx-3 text-ink-300">/</span>
          <a className="v2-link" href={links.linkedin}>LinkedIn</a>
        </p>
      </div>
    </Reveal>
  );
}
