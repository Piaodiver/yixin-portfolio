import Nav from './components/Nav';
import Hero from './components/Hero';
import About from './components/About';
import Beliefs from './components/Beliefs';
import CaseStudies from './components/CaseStudies';
import Expertise from './components/Expertise';
import Timeline from './components/Timeline';
import BeyondWork from './components/BeyondWork';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-ivory font-body">
      <Nav />
      <main>
        <Hero />
        <About />
        <Beliefs />
        <CaseStudies />
        <Expertise />
        <Timeline />
        <BeyondWork />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
