import { about } from '../../content/site';
import Section from '../Section';
import SectionHead from '../tech/SectionHead';
import Marginalia from '../ink/Marginalia';

export default function About() {
  return (
    <Section id="about">
      <SectionHead num="01" title="The person behind the work" aside="About" />
      <div className="relative lg:ml-[13.5rem]">
        <Marginalia>Nine years specifying systems. Since May, building them.</Marginalia>
        <div className="max-w-prose space-y-5 text-[1.02rem] leading-relaxed text-ink-700">
          {about.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </div>
    </Section>
  );
}
