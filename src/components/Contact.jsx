import { contact } from '../data/content';

export default function Contact() {
  return (
    <section id="contact" className="bg-white py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6 md:px-10">

        {/* Top row */}
        <div className="grid md:grid-cols-12 gap-12 items-start mb-16 md:mb-20">

          {/* Left */}
          <div className="md:col-span-7 space-y-6">
            <p className="section-label">Contact</p>
            <h2 className="font-display text-4xl md:text-5xl font-medium text-gray-900 leading-tight">
              {contact.heading}
            </h2>
            <div className="w-12 h-0.5 bg-forest-700" />
            <p className="font-body text-base md:text-lg text-gray-600 leading-relaxed max-w-lg">
              {contact.body}
            </p>
            <p className="font-body text-sm text-gray-500 max-w-lg">
              {contact.subtext}
            </p>

            {/* Links */}
            <div className="flex flex-wrap gap-4 pt-2">
              {contact.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                  className={`font-body inline-flex items-center gap-2 font-medium text-sm px-6 py-3 rounded-full transition-all duration-200 ${
                    link.label === 'LinkedIn'
                      ? 'bg-forest-700 text-white hover:bg-forest-800'
                      : 'border border-gray-300 text-gray-700 hover:border-forest-700 hover:text-forest-700'
                  }`}
                >
                  {link.label === 'LinkedIn' && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  )}
                  {link.label === 'Email' && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  )}
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Right: Open to card */}
          <div className="md:col-span-5">
            <div className="bg-ivory rounded-2xl border border-warm-200 p-8 space-y-6">
              <p className="font-body text-xs font-medium text-gray-400 uppercase tracking-widest">
                Open to
              </p>
              {[
                'Enterprise AI Transformation',
                'Solution Architecture Leadership',
                'Advisory & Consulting',
                'Speaking Engagements',
                'Strategic Partnerships',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-forest-700 flex-shrink-0" />
                  <p className="font-body text-sm text-gray-700">{item}</p>
                </div>
              ))}
              <div className="pt-2 border-t border-warm-200">
                <p className="font-body text-xs text-gray-400">
                  Open to opportunities globally, especially in the U.S.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
