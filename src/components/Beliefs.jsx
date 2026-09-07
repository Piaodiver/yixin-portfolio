import { beliefs } from '../data/content';

export default function Beliefs() {
  return (
    <section id="beliefs" className="bg-forest-700 py-24 md:py-36">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="mb-16 md:mb-20">
          <h2 className="font-display text-3xl md:text-5xl font-medium text-white leading-tight mb-4">
            What I Believe
          </h2>
          <p className="font-body text-base text-forest-200 max-w-xl">
            The principles behind how I think, build, and lead.
          </p>
        </div>

        {/* Beliefs grid */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {beliefs.map((belief, i) => (
            <div
              key={i}
              className="bg-forest-800/40 border border-forest-600 rounded-2xl p-8 md:p-10 flex flex-col gap-6 hover:bg-forest-800/60 transition-colors duration-200"
            >
              <div className="flex items-start gap-4">
                <span className="font-display text-gold-400 text-lg mt-1 flex-shrink-0 select-none">✦</span>
                <h3 className="font-display text-lg md:text-xl font-medium text-white leading-snug">
                  {belief.title}
                </h3>
              </div>

              <p className="font-body text-sm md:text-base text-forest-200 leading-relaxed pl-8">
                {belief.body}
              </p>

              {belief.body2 && (
                <p className="font-body text-sm md:text-base text-forest-200 leading-relaxed pl-8">
                  {belief.body2}
                </p>
              )}

              <div className="pl-8 pt-2 border-t border-forest-600">
                <p className="font-display text-sm md:text-base text-gold-300 italic leading-relaxed">
                  {belief.insight}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
