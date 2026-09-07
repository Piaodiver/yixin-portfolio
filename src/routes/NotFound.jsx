import { Link } from 'react-router-dom';
import Section from '../components/Section';

export default function NotFound() {
  return (
    <Section className="min-h-[60vh]">
      <p className="u-label text-wash-sage-ink">404</p>
      <h1 className="mt-3 font-display text-[2rem] font-semibold text-ink-900">That page does not exist.</h1>
      <Link to="/" className="mt-6 inline-block border-b border-ink-300 pb-0.5 text-ink-700 hover:border-wash-ochre hover:text-wash-ochre-ink">
        Back to the start
      </Link>
    </Section>
  );
}
