import { HashRouter, Routes, Route } from 'react-router-dom';
import PaperGround from './components/ink/PaperGround';
import Nav from './components/Nav';
import Footer from './components/Footer';
import ScrollManager from './components/ScrollManager';
import Home from './routes/Home';
import WorkDetail from './routes/WorkDetail';
import NotFound from './routes/NotFound';

export default function App() {
  return (
    <HashRouter>
      <ScrollManager />
      <PaperGround />
      <a href="#main" className="u-skip u-label">Skip to content</a>
      <Nav />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work/:slug" element={<WorkDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </HashRouter>
  );
}
