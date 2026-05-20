export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-warm-100 border-t border-warm-200 py-8">
      <div className="max-w-6xl mx-auto px-6 md:px-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-display text-sm font-medium text-gray-500">
          Yixin Liu
        </p>
        <p className="font-body text-xs text-gray-400">
          © {year} · Enterprise AI Transformation Lead · Singapore
        </p>
        <div className="flex items-center gap-5">
          <a
            href="https://www.linkedin.com/in/liuyixin/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-xs text-gray-400 hover:text-forest-700 transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="mailto:liuyixin10@outlook.com"
            className="font-body text-xs text-gray-400 hover:text-forest-700 transition-colors"
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
