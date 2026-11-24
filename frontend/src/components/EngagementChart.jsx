import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EngagementChart({ data = [] }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [timeframe, setTimeframe] = useState('30d');
  const [showReach, setShowReach] = useState(true);
  const [showEngagement, setShowEngagement] = useState(true);

  if (!data || data.length === 0) return null;

  // Adapt data based on timeframe
  const activeDataset = timeframe === '30d' 
    ? data 
    : [
        { date: "May", reach: 12000, engagement: 5400 },
        { date: "Jun", reach: 19000, engagement: 8100 },
        { date: "Jul", reach: 28000, engagement: 13500 },
        { date: "Aug", reach: 35000, engagement: 17200 },
        { date: "Sep", reach: 41000, engagement: 21900 },
        { date: "Oct", reach: 45000, engagement: 25400 },
        { date: "Nov", reach: 48000, engagement: 27900 }
      ];

  const maxVal = Math.max(...activeDataset.map(d => Math.max(d.reach, d.engagement))) * 1.15;
  const minVal = 0;

  const width = 800;
  const height = 240;
  const paddingX = 40;
  const paddingY = 30;

  const chartW = width - paddingX * 2;
  const chartH = height - paddingY * 2;

  // Convert points to SVG coordinates
  const getX = (idx) => paddingX + (idx / (activeDataset.length - 1)) * chartW;
  const getY = (val) => height - paddingY - ((val - minVal) / (maxVal - minVal)) * chartH;

  // Build smooth bezier curves
  const buildSmoothPath = (key) => {
    return activeDataset.reduce((acc, point, i, arr) => {
      const x = getX(i);
      const y = getY(point[key]);
      if (i === 0) return `M ${x},${y}`;

      const prevX = getX(i - 1);
      const prevY = getY(arr[i - 1][key]);
      const cp1x = prevX + (x - prevX) / 2;
      const cp1y = prevY;
      const cp2x = prevX + (x - prevX) / 2;
      const cp2y = y;

      return `${acc} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${x},${y}`;
    }, "");
  };

  const reachPath = buildSmoothPath('reach');
  const engagementPath = buildSmoothPath('engagement');

  // Closed paths for gradients
  const reachArea = `${reachPath} L ${getX(activeDataset.length - 1)},${height - paddingY} L ${getX(0)},${height - paddingY} Z`;
  const engArea = `${engagementPath} L ${getX(activeDataset.length - 1)},${height - paddingY} L ${getX(0)},${height - paddingY} Z`;

  const activeData = hoveredIndex !== null ? activeDataset[hoveredIndex] : activeDataset[activeDataset.length - 1];
  const activeX = hoveredIndex !== null ? getX(hoveredIndex) : getX(activeDataset.length - 1);

  return (
    <div className="relative w-full">
      {/* Header controls & Legend with interactive toggles */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-5 text-xs font-medium">
          <button
            onClick={() => setShowReach(!showReach)}
            className={`flex items-center gap-2 px-2.5 py-1 rounded-lg transition ${
              showReach ? 'text-slate-200 bg-purple-500/10' : 'text-slate-500 opacity-50'
            }`}
            title="Click to toggle Total Reach"
          >
            <span className={`w-2.5 h-2.5 rounded-full ${showReach ? 'bg-purple-500 shadow-[0_0_8px_#a855f7]' : 'bg-slate-600'}`} />
            <span>Total Reach</span>
          </button>

          <button
            onClick={() => setShowEngagement(!showEngagement)}
            className={`flex items-center gap-2 px-2.5 py-1 rounded-lg transition ${
              showEngagement ? 'text-slate-200 bg-pink-500/10' : 'text-slate-500 opacity-50'
            }`}
            title="Click to toggle Engagement"
          >
            <span className={`w-2.5 h-2.5 rounded-full ${showEngagement ? 'bg-pink-500 shadow-[0_0_8px_#ec4899]' : 'bg-slate-600'}`} />
            <span>Engagement</span>
          </button>
        </div>

        <div className="flex items-center gap-1 bg-[#121520] border border-white/10 rounded-xl p-1 text-xs text-slate-400">
          <button
            onClick={() => setTimeframe('30d')}
            className={`px-3 py-1 rounded-lg font-semibold transition ${
              timeframe === '30d' 
                ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]' 
                : 'hover:text-slate-200'
            }`}
          >
            Last 30 days
          </button>
          <button
            onClick={() => setTimeframe('all')}
            className={`px-3 py-1 rounded-lg font-semibold transition ${
              timeframe === 'all' 
                ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]' 
                : 'hover:text-slate-200'
            }`}
          >
            All time
          </button>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto min-w-[500px] overflow-visible"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <defs>
            <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="pinkGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ec4899" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0.25, 0.5, 0.75, 1].map((p, idx) => {
            const y = height - paddingY - chartH * p;
            return (
              <line
                key={idx}
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="rgba(255,255,255,0.04)"
                strokeDasharray="4 4"
              />
            );
          })}

          {/* Area Fills with fade-in */}
          {showReach && (
            <motion.path 
              d={reachArea} 
              fill="url(#purpleGrad)" 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2 }}
            />
          )}
          {showEngagement && (
            <motion.path 
              d={engArea} 
              fill="url(#pinkGrad)" 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.2 }}
            />
          )}

          {/* Curves with animated path drawing */}
          {showReach && (
            <motion.path
              d={reachPath}
              fill="none"
              stroke="#a855f7"
              strokeWidth="3.2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="filter drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]"
            />
          )}
          {showEngagement && (
            <motion.path
              d={engagementPath}
              fill="none"
              stroke="#ec4899"
              strokeWidth="3.2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.15 }}
              className="filter drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]"
            />
          )}

          {/* Active Hover Guide Line */}
          {hoveredIndex !== null && (
            <line
              x1={activeX}
              y1={paddingY}
              x2={activeX}
              y2={height - paddingY}
              stroke="rgba(255,255,255,0.2)"
              strokeDasharray="3 3"
            />
          )}

          {/* Interactive Trigger Points */}
          {data.map((d, i) => {
            const x = getX(i);
            const reachY = getY(d.reach);
            const engY = getY(d.engagement);
            const isSelected = hoveredIndex === i;

            return (
              <g key={i} onMouseEnter={() => setHoveredIndex(i)} className="cursor-pointer">
                {/* Hit area */}
                <rect
                  x={x - (chartW / data.length) / 2}
                  y={0}
                  width={chartW / data.length}
                  height={height}
                  fill="transparent"
                />

                {/* Point Reach */}
                <circle
                  cx={x}
                  cy={reachY}
                  r={isSelected ? 5.5 : 3.5}
                  fill="#08090D"
                  stroke="#a855f7"
                  strokeWidth={isSelected ? 3 : 2}
                  className="transition-all duration-200"
                />

                {/* Point Engagement */}
                <circle
                  cx={x}
                  cy={engY}
                  r={isSelected ? 5.5 : 3.5}
                  fill="#08090D"
                  stroke="#ec4899"
                  strokeWidth={isSelected ? 3 : 2}
                  className="transition-all duration-200"
                />

                {/* X-axis labels */}
                <text
                  x={x}
                  y={height - 8}
                  textAnchor="middle"
                  fill={isSelected ? '#c084fc' : '#64748b'}
                  fontSize="10"
                  fontFamily="Space Grotesk, sans-serif"
                >
                  {d.date}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip matching screenshot with spring animation */}
        <AnimatePresence>
          {hoveredIndex !== null && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 450, damping: 25 }}
              className="absolute pointer-events-none z-20 transform -translate-x-1/2 -translate-y-full bg-[#12141c]/95 border border-purple-500/40 rounded-xl px-3.5 py-2.5 shadow-[0_0_25px_rgba(168,85,247,0.3)] backdrop-blur-md text-xs font-mono"
              style={{
                left: `${(activeX / width) * 100}%`,
                top: '25%'
              }}
            >
              <div className="text-slate-400 font-sans font-medium text-[11px] mb-1">{activeData.date}, 2026</div>
              <div className="flex items-center justify-between gap-4 text-purple-300">
                <span className="flex items-center gap-1.5 font-sans">
                  <span className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_6px_#a855f7]" /> Reach:
                </span>
                <span className="font-bold">{activeData.reach.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-pink-300 mt-1">
                <span className="flex items-center gap-1.5 font-sans">
                  <span className="w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_6px_#ec4899]" /> Engagement:
                </span>
                <span className="font-bold">{activeData.engagement.toLocaleString()}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
