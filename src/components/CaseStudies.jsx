import { caseStudies } from '../data/content';

function CaseCard({ study, index }) {
  return (
    <article className="card-base group hover:border-forest-200 hover:shadow-md transition-all duration-300">
      <div className="flex items-start justify-between mb-5">
        <span className="font-body text-xs font-medium text-forest-600 bg-forest-50 border border-forest-100 px-3 py-1 rounded-full">
          {study.tag}
        </span>
        <div className="text-right">
          <span className="font-display text-4xl font-medium text-warm-200 select-none block">
            {String(index + 1).padStart(2, '0')}
          </span>
          {study.subtitle && (
            <p className="font-body text-xs text-gray-400 mt-1">{study.subtitle}</p>
          )}
        </div>
      </div>

      <h3 className="font-display text-xl md:text-2xl font-medium text-gray-900 leading-tight mb-6">
        {study.title}
      </h3>

      <div className="space-y-5 text-sm">
        {study.intro && (
          <p className="font-body text-sm text-gray-600 leading-relaxed italic border-l-2 border-forest-100 pl-4">
            {study.intro}
          </p>
        )}

        <div>
          <p className="font-body font-semibold text-gray-500 uppercase tracking-wider text-xs mb-1.5">Context</p>
          <p className="font-body text-gray-600 leading-relaxed">{study.context}</p>
        </div>

        <div className="w-full h-px bg-warm-200" />

        <div>
          <p className="font-body font-semibold text-gray-500 uppercase tracking-wider text-xs mb-1.5">My Role</p>
          <p className="font-body text-gray-600 leading-relaxed">{study.role}</p>
        </div>

        <div className="w-full h-px bg-warm-200" />

        <div>
          <p className="font-body font-semibold text-gray-500 uppercase tracking-wider text-xs mb-1.5">Impact</p>
          <p className="font-body text-gray-700 font-medium leading-relaxed">{study.impact}</p>
        </div>
      </div>
    </article>
  );
}

export default function CaseStudies() {
  return (
    <section id="work" className="bg-ivory py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="mb-14">
          <h2 className="section-heading mb-3">Selected Work</h2>
          <p className="font-body text-base text-gray-500">
            Proof points from enterprise AI, Data, and CRM transformation.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {caseStudies.map((study, i) => (
            <CaseCard key={study.id} study={study} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
