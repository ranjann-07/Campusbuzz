import React from 'react';

export default function Sparkline({ points = [10, 15, 8, 22, 18, 27, 24, 32], color = "#a855f7" }) {
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  const w = 90;
  const h = 28;

  const path = points.map((p, i) => {
    const x = (i / (points.length - 1)) * w;
    const y = h - ((p - min) / range) * (h - 6) - 3;
    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  return (
    <svg width={w} height={h} className="overflow-visible opacity-85">
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: `drop-shadow(0 0 4px ${color}88)` }}
      />
    </svg>
  );
}
