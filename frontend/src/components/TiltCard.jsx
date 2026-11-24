import React from 'react';

export default function TiltCard({ children, className = "", glowColor = "purple" }) {
  const glowColorMap = {
    purple: 'hover:border-purple-500/40 hover:shadow-[0_0_25px_rgba(168,85,247,0.15)]',
    orange: 'hover:border-orange-500/40 hover:shadow-[0_0_25px_rgba(255,103,0,0.15)]',
    cyan: 'hover:border-cyan-500/40 hover:shadow-[0_0_25px_rgba(0,240,255,0.15)]',
    magenta: 'hover:border-pink-500/40 hover:shadow-[0_0_25px_rgba(236,72,153,0.15)]'
  };

  const hoverStyle = glowColorMap[glowColor] || glowColorMap.purple;

  return (
    <div
      className={`relative rounded-2xl transition-all duration-200 ${hoverStyle} ${className}`}
    >
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}
