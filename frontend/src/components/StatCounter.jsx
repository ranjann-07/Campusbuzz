import React, { useEffect, useState, useRef } from 'react';

export default function StatCounter({ end, suffix = "", duration = 2000, label, icon: Icon, color = "purple" }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let startTime = null;
          const startVal = 0;

          const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            // Ease out cubic
            const easeOutProgress = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(startVal + easeOutProgress * (end - startVal)));

            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              setCount(end);
            }
          };

          requestAnimationFrame(step);
        }
      },
      { threshold: 0.2 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  const colorStyles = {
    purple: {
      border: 'border-purple-500/20 hover:border-purple-500/50',
      text: 'text-purple-400',
      glow: 'shadow-[0_0_25px_rgba(168,85,247,0.15)]',
      iconBg: 'bg-purple-500/10 text-purple-400'
    },
    orange: {
      border: 'border-orange-500/20 hover:border-orange-500/50',
      text: 'text-orange-400',
      glow: 'shadow-[0_0_25px_rgba(255,103,0,0.15)]',
      iconBg: 'bg-orange-500/10 text-orange-400'
    },
    cyan: {
      border: 'border-cyan-500/20 hover:border-cyan-500/50',
      text: 'text-cyan-400',
      glow: 'shadow-[0_0_25px_rgba(0,240,255,0.15)]',
      iconBg: 'bg-cyan-500/10 text-cyan-400'
    },
    magenta: {
      border: 'border-pink-500/20 hover:border-pink-500/50',
      text: 'text-pink-400',
      glow: 'shadow-[0_0_25px_rgba(236,72,153,0.15)]',
      iconBg: 'bg-pink-500/10 text-pink-400'
    }
  };

  const style = colorStyles[color] || colorStyles.purple;

  return (
    <div
      ref={elementRef}
      className={`glass-card-interactive p-6 rounded-2xl border ${style.border} ${style.glow} flex flex-col items-center sm:items-start text-center sm:text-left transition-all duration-300 group`}
    >
      {Icon && (
        <div className={`p-3 rounded-xl ${style.iconBg} mb-3 group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-6 h-6" />
        </div>
      )}
      <div className={`text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-white flex items-center`}>
        <span>{count.toLocaleString()}</span>
        <span className={style.text}>{suffix}</span>
      </div>
      <p className="text-sm font-medium text-slate-400 mt-1 uppercase tracking-wider text-xs">
        {label}
      </p>
    </div>
  );
}
