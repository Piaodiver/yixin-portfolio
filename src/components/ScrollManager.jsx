import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * HashRouter owns the fragment, so in-page anchors like #enterprise arrive as
 * routes ("/#enterprise" → path "/enterprise"). Nav links use "/#/…#id" form;
 * this resolves the trailing id after the route renders, and otherwise sends
 * a new route to the top.
 */
export default function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname, hash]);

  return null;
}
