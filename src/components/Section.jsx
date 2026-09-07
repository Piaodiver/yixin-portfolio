export default function Section({ id, children, className = '' }) {
  return (
    <section id={id} className={`mx-auto w-full max-w-[68rem] scroll-mt-20 px-5 py-16 sm:px-8 md:py-24 ${className}`}>
      {children}
    </section>
  );
}
