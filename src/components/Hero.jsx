import { hero } from '../data/content';
import profilePhoto from '../assets/profile.png';

export default function Hero() {
  return (
    <section id="top" className="min-h-screen flex items-center bg-ivory pt-16">
      <div className="max-w-6xl mx-auto px-6 md:px-10 w-full py-24 md:py-32">
        <div className="grid md:grid-cols-12 gap-12 items-center">

          {/* Left: text content */}
          <div className="md:col-span-7 space-y-8">
            {/* Name */}
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-medium text-gray-900 leading-[1.1] tracking-tight">
              {hero.name}
            </h1>

            {/* Title */}
            <p className="font-body text-base md:text-lg font-medium text-forest-700 bg-forest-50 inline-block px-4 py-1.5 rounded-full border border-forest-100">
              {hero.title}
            </p>

            {/* Tagline */}
            <p className="font-display text-xl md:text-2xl text-gray-700 leading-relaxed max-w-xl italic font-normal">
              "{hero.tagline}"
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="#work"
                className="font-body inline-flex items-center gap-2 bg-forest-700 text-white px-6 py-3 rounded-full font-medium text-sm hover:bg-forest-800 transition-colors duration-200"
              >
                View My Work
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/liuyixin/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-body inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-full font-medium text-sm hover:border-forest-700 hover:text-forest-700 transition-colors duration-200"
              >
                LinkedIn
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              <a
                href="#contact"
                className="font-body inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-full font-medium text-sm hover:border-forest-700 hover:text-forest-700 transition-colors duration-200"
              >
                Contact Me
              </a>
            </div>
          </div>

          {/* Right: profile photo */}
          <div className="md:col-span-5 flex justify-center md:justify-end">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              {/* Outer decorative ring */}
              <div className="absolute inset-0 rounded-full border border-forest-200" />
              {/* Mid ring */}
              <div className="absolute inset-3 rounded-full border border-warm-300" />
              {/* Photo circle */}
              <div className="absolute inset-6 rounded-full overflow-hidden shadow-md">
                <img
                  src={profilePhoto}
                  alt="Yixin Liu"
                  className="w-full h-full object-cover object-top scale-110"
                />
              </div>
              {/* Accent dots */}
              <div className="absolute top-4 right-8 w-3 h-3 rounded-full bg-gold-400 opacity-70" />
              <div className="absolute bottom-8 left-4 w-2 h-2 rounded-full bg-forest-300 opacity-60" />
              <div className="absolute top-1/2 right-0 w-1.5 h-1.5 rounded-full bg-gold-300 opacity-50" />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="mt-16 flex items-center gap-3 text-gray-400">
          <div className="w-8 h-px bg-gray-300" />
          <span className="font-body text-xs tracking-widest uppercase">Scroll to explore</span>
        </div>
      </div>
    </section>
  );
}
