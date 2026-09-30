// Small, restrained brand mark: a sun/star glyph (jyotiṣa = "science of light").
// Sits beside the wordmark. Uses currentColor so it inherits the terracotta.
export default function Logo({ size = 26 }: { size?: number }) {
  const rays = Array.from({ length: 12 });
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" className="shrink-0">
      <g stroke="currentColor" fill="none" strokeWidth="1.6" strokeLinecap="round">
        <circle cx="24" cy="24" r="9" />
        {rays.map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          const r1 = i % 3 === 0 ? 13 : 14.5;
          const r2 = i % 3 === 0 ? 21 : 18;
          return (
            <line key={i}
              x1={24 + r1 * Math.cos(a)} y1={24 + r1 * Math.sin(a)}
              x2={24 + r2 * Math.cos(a)} y2={24 + r2 * Math.sin(a)} />
          );
        })}
      </g>
      {/* inner four-point star */}
      <path d="M24 18 L25.6 22.4 L30 24 L25.6 25.6 L24 30 L22.4 25.6 L18 24 L22.4 22.4 Z"
        fill="currentColor" />
    </svg>
  );
}
