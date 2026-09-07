import { expertise } from '../data/content';

function ExpertiseCard({ item }) {
  return (
    <div className="card-base flex flex-col gap-5 hover:border-forest-200 hover:shadow-md transition-all duration-300 group">
      <span className="text-3xl text-forest-500 leading-none select-none group-hover:text-forest-700 transition-colors">
        {item.icon}
      </span>
      <h3 className="font-display text-xl font-medium text-gray-900 leading-snug">
        {item.title}
      </h3>
      <p className="font-body text-sm md:text-base text-gray-600 leading-relaxed flex-1">
        {item.description}
      </p>
      <div className="flex flex-wrap gap-2 pt-1">
        {item.keywords.map((kw) => (
          <span
            key={kw}
            className="font-body text-xs text-gray-400 bg-warm-100 border border-warm-200 px-2.5 py-1 rounded-md"
          >
            {kw}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Expertise() {
  return (
    <section id="expertise" className="bg-white py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="mb-14">
          <h2 className="section-heading mb-3">Expertise</h2>
          <p className="font-body text-base text-gray-500">
            Where I create the most value.
          </p>
        </div>

        {/* Cards — 3-column on large screens */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {expertise.map((item) => (
            <ExpertiseCard key={item.title} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
