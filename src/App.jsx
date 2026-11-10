// v2: one scrolling page, no router. The v1 components under
// src/components/{sections,ink,tech} and src/routes are kept in the tree but
// are no longer imported. In-page anchors (#china, #nova …) would collide with
// HashRouter, which is why the router is gone.
import Page from './components/v2/Page';

export default function App() {
  return (
    <>
      <a href="#main" className="u-skip">Skip to content</a>
      <Page />
    </>
  );
}
