/**
 * The ground the whole site sits on: paper colour, paper fibre, and two
 * washes that drift slowly enough to read as atmosphere rather than motion.
 *
 * Both washes are composited transforms on blurred radial gradients — no
 * filter recomputation per frame, so the cost is a couple of GPU layers.
 */
export default function PaperGround() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-paper">
      {/* 花青 — the cloud, upper right */}
      <div
        className="absolute -right-[18vw] -top-[22vh] h-[70vh] w-[70vw] rounded-full opacity-[0.16] blur-[70px] motion-safe:animate-[drift-a_90s_ease-in-out_infinite_alternate]"
        style={{ background: 'radial-gradient(circle at 40% 40%, var(--wash-indigo), transparent 68%)' }}
      />
      {/* 石绿 — the ground, lower left */}
      <div
        className="absolute -bottom-[26vh] -left-[16vw] h-[62vh] w-[64vw] rounded-full opacity-[0.14] blur-[70px] motion-safe:animate-[drift-b_110s_ease-in-out_infinite_alternate]"
        style={{ background: 'radial-gradient(circle at 55% 50%, var(--wash-sage), transparent 68%)' }}
      />
      {/* paper fibre */}
      <div
        className="absolute inset-0 opacity-[0.055] mix-blend-multiply"
        style={{ backgroundImage: 'var(--grain)', backgroundRepeat: 'repeat' }}
      />
    </div>
  );
}
