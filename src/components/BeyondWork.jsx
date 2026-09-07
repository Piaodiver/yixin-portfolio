import { beyondWork } from '../data/content';

function BeyondCard({ card }) {
  return (
    <div className="card-base space-y-5 hover:border-forest-200 hover:shadow-md transition-all duration-300">
      <div className="flex items-center gap-3">
        <span className="text-2xl text-gold-500 leading-none select-none">{card.icon}</span>
        <h3 className="font-display text-xl font-medium text-gray-900">{card.category}</h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {card.tags.map((t) => (
          <span
            key={t}
            className="font-body text-xs font-medium text-gold-600 bg-gold-300/20 border border-gold-300/40 px-2.5 py-1 rounded-md"
          >
            {t}
          </span>
        ))}
      </div>

      <p className="font-body text-sm md:text-base text-gray-600 leading-relaxed">
        {card.body}
      </p>
    </div>
  );
}

export default function BeyondWork() {
  return (
    <section id="beyond" className="bg-white py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="mb-14">
          <h2 className="section-heading mb-3">Beyond Work</h2>
          <p className="font-body text-base text-gray-500">
            The person beyond the professional profile.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {beyondWork.cards.map((card) => (
            <BeyondCard key={card.category} card={card} />
          ))}
        </div>

        {/* Closing line */}
        <div className="mt-14 border-t border-warm-200 pt-10 flex items-center gap-4">
          <div className="w-6 h-0.5 bg-gold-500 flex-shrink-0" />
          <p className="font-display text-lg md:text-xl text-gray-700 italic font-normal leading-relaxed">
            {beyondWork.closing}
          </p>
        </div>
      </div>
    </section>
  );
}
