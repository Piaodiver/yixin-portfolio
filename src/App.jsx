import Nav from './components/Nav';
import Hero from './components/Hero';
import CaseStudies from './components/CaseStudies';
import Expertise from './components/Expertise';
import Timeline from './components/Timeline';
import Beliefs from './components/Beliefs';
import BeyondWork from './components/BeyondWork';
import Writing from './components/Writing';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-ivory font-body">
      <Nav />
      <main>
        <Hero />
        <CaseStudies />
        <Expertise />
        <Timeline />
        <Beliefs />
        <BeyondWork />
        <Writing />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
