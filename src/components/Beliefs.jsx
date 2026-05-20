import { beliefs } from '../data/content';

export default function Beliefs() {
  return (
    <section id="beliefs" className="bg-forest-700 py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="mb-14">
          <p className="text-xs font-body font-medium tracking-widest uppercase text-forest-200 mb-4">
            What I Believe
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-medium text-white leading-tight max-w-xl">
            Principles that guide the work
          </h2>
        </div>

        {/* Beliefs grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {beliefs.map((belief, i) => (
            <div
              key={i}
              className="bg-forest-800/50 border border-forest-600 rounded-2xl p-7 md:p-8 space-y-4 hover:bg-forest-800/70 transition-colors duration-200"
            >
              <div className="flex items-start gap-3">
                <span className="font-display text-gold-400 text-xl mt-0.5 flex-shrink-0 select-none">✦</span>
                <h3 className="font-display text-lg md:text-xl font-medium text-white leading-snug">
                  {belief.title}
                </h3>
              </div>
              <p className="font-body text-sm md:text-base text-forest-200 leading-relaxed pl-7">
                {belief.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
