import { about } from '../data/content';

export default function About() {
  return (
    <section id="about" className="bg-white py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-12 gap-12 md:gap-16">

          {/* Sticky label column */}
          <div className="md:col-span-4">
            <div className="md:sticky md:top-28 space-y-6">
              <p className="section-label">About</p>
              <h2 className="section-heading">The person behind the work</h2>
              <div className="w-12 h-0.5 bg-forest-700" />
              <p className="font-body text-sm text-gray-500 leading-relaxed">
                Solution architect. AI transformation practitioner. Globally minded professional.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                {about.stats.map((s) => (
                  <div key={s.label} className="space-y-1">
                    <p className="font-display text-2xl font-medium text-forest-700">{s.value}</p>
                    <p className="font-body text-xs text-gray-500 leading-snug">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Content column */}
          <div className="md:col-span-8 space-y-6">
            {about.paragraphs.map((p, i) => (
              <p
                key={i}
                className={`font-body leading-relaxed ${
                  i === 0
                    ? 'text-lg text-gray-900 font-medium'
                    : 'text-base md:text-lg text-gray-600'
                }`}
              >
                {p}
              </p>
            ))}

            {/* Highlight quote */}
            <blockquote className="mt-8 border-l-2 border-forest-700 pl-6 py-2">
              <p className="font-display text-xl md:text-2xl text-gray-800 italic font-normal leading-relaxed">
                "She understands AI, but more importantly, she knows how to make AI real inside complex enterprises."
              </p>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}
