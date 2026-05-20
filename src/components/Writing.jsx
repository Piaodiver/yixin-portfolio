import { writing } from '../data/content';

function ArticleCard({ article }) {
  return (
    <article className="group flex flex-col gap-3 p-6 bg-white rounded-2xl border border-warm-200 hover:border-forest-200 hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between">
        <span className="font-body text-xs font-medium text-forest-600 bg-forest-50 border border-forest-100 px-2.5 py-1 rounded-full">
          {article.tag}
        </span>
        <span className="font-body text-xs font-medium text-gray-400 bg-warm-100 px-2.5 py-1 rounded-full">
          Coming Soon
        </span>
      </div>
      <h3 className="font-display text-base md:text-lg font-medium text-gray-900 leading-snug group-hover:text-forest-700 transition-colors">
        {article.title}
      </h3>
      <p className="font-body text-sm text-gray-500 leading-relaxed">
        {article.description}
      </p>
    </article>
  );
}

export default function Writing() {
  return (
    <section id="thinking" className="bg-ivory py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="mb-14">
          <p className="section-label">Writing & Thinking</p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2 className="section-heading max-w-lg">
              What I think about
            </h2>
            <p className="font-body text-sm text-gray-500 max-w-xs">
              Perspectives on enterprise AI, solution architecture, and the craft of transformation.
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {writing.map((article) => (
            <ArticleCard key={article.title} article={article} />
          ))}
        </div>

        {/* Newsletter nudge */}
        <div className="mt-12 p-6 md:p-8 bg-white rounded-2xl border border-warm-200 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
          <div>
            <p className="font-display text-lg font-medium text-gray-900">Articles coming soon.</p>
            <p className="font-body text-sm text-gray-500 mt-1">
              Connect on LinkedIn to be notified when new pieces are published.
            </p>
          </div>
          <a
            href="https://www.linkedin.com/in/liuyixin/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 font-body text-sm font-medium text-forest-700 border border-forest-700 px-5 py-2.5 rounded-full hover:bg-forest-700 hover:text-white transition-all duration-200"
          >
            Follow on LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}
