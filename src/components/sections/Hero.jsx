import { hero, proof } from '../../content/site';
import InkReveal from '../ink/InkReveal';
import InkRule from '../ink/InkRule';
import Metric from '../tech/Metric';
import Coord from '../tech/Coord';
import photo640 from '../../assets/profile-640.jpg';
import photo360 from '../../assets/profile-360.jpg';

export default function Hero() {
  return (
    <section className="mx-auto w-full max-w-[68rem] px-5 pb-10 pt-12 sm:px-8 md:pb-16 md:pt-20">
      <Coord className="mb-8">§00 · Singapore → United States</Coord>

      <div className="grid items-center gap-10 md:grid-cols-[1fr_auto] md:gap-16">
        <div>
          <InkReveal as="h1" className="font-display text-[2.7rem] font-semibold leading-[1.05] tracking-tight text-ink-900 sm:text-[3.4rem] md:text-[4rem]">
            {hero.name}
          </InkReveal>

          <p className="u-label mt-4 text-wash-sage-ink">{hero.title}</p>

          <InkRule className="my-6 max-w-[11rem]" />

          <p className="max-w-[34rem] font-display text-[1.15rem] font-normal italic leading-relaxed text-ink-700 md:text-[1.3rem]">
            {hero.tagline}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {hero.cta.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target={c.href.startsWith('http') ? '_blank' : undefined}
                rel={c.href.startsWith('http') ? 'noreferrer' : undefined}
                className={
                  c.primary
                    ? 'u-label rounded-[2px] bg-ink-900 px-4 py-2.5 text-paper transition-colors hover:bg-wash-sage'
                    : 'u-label rounded-[2px] border border-ink-100 px-4 py-2.5 text-ink-700 transition-colors hover:border-wash-ochre hover:text-wash-ochre-ink'
                }
              >
                {c.label}
              </a>
            ))}
          </div>
        </div>

        <div className="order-first justify-self-start md:order-none md:justify-self-end">
          <img
            src={photo640}
            srcSet={`${photo360} 360w, ${photo640} 640w`}
            sizes="(max-width: 768px) 128px, 232px"
            width="232"
            height="232"
            alt="Yixin Liu"
            fetchPriority="high"
            decoding="async"
            className="h-32 w-32 rounded-full object-cover object-top ring-1 ring-ink-50 md:h-[232px] md:w-[232px]"
          />
        </div>
      </div>

      <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-9 border-t border-ink-50 pt-9 md:mt-20 md:grid-cols-4">
        {proof.map((p) => (
          <div key={p.label}>
            <Metric value={p.value} label={p.label} />
          </div>
        ))}
      </div>
    </section>
  );
}
