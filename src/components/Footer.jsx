import Coord from './tech/Coord';

export default function Footer() {
  return (
    <footer className="mx-auto w-full max-w-[68rem] px-5 pb-14 pt-8 sm:px-8">
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-t border-ink-50 pt-6">
        <Coord>Yixin Liu · 2026</Coord>
        <div className="flex gap-5">
          <a href="https://github.com/Piaodiver" className="u-label text-ink-500 hover:text-wash-ochre-ink">GitHub</a>
          <a href="https://www.linkedin.com/in/liuyixin/" className="u-label text-ink-500 hover:text-wash-ochre-ink">LinkedIn</a>
          <a href="mailto:liuyixin10@outlook.com" className="u-label text-ink-500 hover:text-wash-ochre-ink">Email</a>
        </div>
      </div>
    </footer>
  );
}
