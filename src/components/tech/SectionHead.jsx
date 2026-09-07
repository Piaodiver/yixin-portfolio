import InkReveal from '../ink/InkReveal';
import InkRule from '../ink/InkRule';

export default function SectionHead({ num, title, lede, aside }) {
  return (
    <header className="mb-12 md:mb-16">
      <div className="flex items-baseline justify-between gap-6">
        <span className="u-label u-nums text-wash-sage-ink">§{num}</span>
        {aside && <span className="u-label u-nums text-ink-400">{aside}</span>}
      </div>

      <InkReveal as="h2" className="mt-3 font-display text-[1.9rem] font-semibold leading-[1.15] text-ink-900 md:text-[2.6rem]">
        {title}
      </InkReveal>

      <InkRule className="my-5 max-w-[9rem]" />

      {lede && <p className="max-w-prose text-[1.02rem] leading-relaxed text-ink-500">{lede}</p>}
    </header>
  );
}
