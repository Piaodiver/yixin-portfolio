import { timeline, education } from '../data/content';

function TimelineItem({ item, isLast }) {
  return (
    <div className="relative flex gap-6 md:gap-10">
      {/* Vertical line */}
      <div className="flex flex-col items-center">
        <div
          className={`w-3 h-3 rounded-full border-2 mt-1.5 flex-shrink-0 ${
            item.current ? 'bg-forest-700 border-forest-700' : 'bg-white border-gray-300'
          }`}
        />
        {!isLast && <div className="w-px flex-1 bg-warm-300 mt-2" />}
      </div>

      {/* Content */}
      <div className={`pb-12 ${isLast ? 'pb-0' : ''}`}>
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="font-body text-xs font-medium text-gray-400 uppercase tracking-widest">
            {item.period}
          </span>
          {item.current && (
            <span className="font-body text-xs font-medium text-forest-700 bg-forest-50 border border-forest-100 px-2 py-0.5 rounded-full">
              Current
            </span>
          )}
        </div>
        <h3 className="font-display text-xl font-medium text-gray-900 mb-0.5">
          {item.company}
        </h3>
        <p className="font-body text-sm font-medium text-forest-600 mb-0.5">{item.role}</p>
        <p className="font-body text-xs text-gray-400 mb-3">{item.location}</p>
        <p className="font-body text-sm md:text-base text-gray-600 leading-relaxed max-w-xl">
          {item.description}
        </p>
      </div>
    </div>
  );
}

export default function TimelineSection() {
  return (
    <section id="journey" className="bg-ivory py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-12 gap-12 md:gap-16">

          {/* Label column */}
          <div className="md:col-span-4">
            <div className="md:sticky md:top-28 space-y-4">
              <p className="section-label">Career Journey</p>
              <h2 className="section-heading">Nine years of enterprise transformation</h2>
              <div className="w-12 h-0.5 bg-forest-700" />
              <p className="font-body text-sm text-gray-500 leading-relaxed">
                From Baidu to Salesforce, across Beijing, Singapore, Silicon Valley, Tel Aviv, and beyond.
              </p>

              {/* Education */}
              <div className="pt-8 space-y-5">
                <p className="section-label">Education</p>
                {education.map((ed) => (
                  <div key={ed.school} className="space-y-0.5">
                    <p className="font-display text-base font-medium text-gray-900">{ed.school}</p>
                    <p className="font-body text-sm text-gray-600">{ed.degree}</p>
                    {ed.note && (
                      <p className="font-body text-xs text-gold-600 font-medium">{ed.note}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="md:col-span-8 pt-2">
            {timeline.map((item, i) => (
              <TimelineItem key={item.company} item={item} isLast={i === timeline.length - 1} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
