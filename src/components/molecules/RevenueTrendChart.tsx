type Point = { date: string; total: number };

const WIDTH = 600;
const HEIGHT = 180;
const PAD = 8;

export function RevenueTrendChart({ points }: { points: Point[] }) {
  const max = Math.max(1, ...points.map((p) => p.total));
  const stepX = (WIDTH - PAD * 2) / Math.max(1, points.length - 1);

  const coords = points.map((p, i) => {
    const x = PAD + i * stepX;
    const y = HEIGHT - PAD - (p.total / max) * (HEIGHT - PAD * 2);
    return [x, y] as const;
  });

  const linePath = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const last = coords[coords.length - 1];
  const first = coords[0];
  const areaPath = `${linePath} L${last[0].toFixed(1)},${HEIGHT - PAD} L${first[0].toFixed(1)},${HEIGHT - PAD} Z`;

  const hasRevenue = points.some((p) => p.total > 0);

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="h-full w-full" preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id="revenue-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#141414" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#141414" stopOpacity="0" />
        </linearGradient>
      </defs>
      {hasRevenue ? (
        <>
          <path d={areaPath} fill="url(#revenue-fill)" />
          <path d={linePath} fill="none" stroke="#141414" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </>
      ) : (
        <>
          <line x1={PAD} y1={PAD} x2={WIDTH - PAD} y2={PAD} stroke="#e4e5e8" strokeWidth={1.5} strokeDasharray="4 4" />
          <line x1={PAD} y1={HEIGHT - PAD} x2={WIDTH - PAD} y2={HEIGHT - PAD} stroke="#e4e5e8" strokeWidth={1.5} strokeDasharray="4 4" />
        </>
      )}
    </svg>
  );
}
