/**
 * The handwritten note in the margin — the single element that most carries
 * the reference sketchbook. Sparse by design: a page with three of these
 * reads as edited; a page with ten reads as decorated.
 *
 * On narrow screens it stops floating and sits inline, indented under a rule.
 */
export default function Marginalia({ children, className = '' }) {
  return (
    <aside
      className={`
        my-6 border-l border-ink-100 pl-4 text-[13.5px] italic leading-relaxed text-ink-500
        lg:absolute lg:-left-[13.5rem] lg:my-0 lg:w-[11.5rem] lg:border-l-0 lg:pl-0 lg:text-right
        ${className}
      `}
    >
      <span className="hidden lg:mb-1 lg:block lg:not-italic lg:text-ink-400" aria-hidden="true">✓</span>
      {children}
    </aside>
  );
}
