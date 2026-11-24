import React from 'react';
import { useApp } from '../context/AppContext';
import EngagementChart from '../components/EngagementChart';
import Sparkline from '../components/Sparkline';
import TiltCard from '../components/TiltCard';
import { 
  BarChart2, 
  TrendingUp, 
  Users, 
  Radio, 
  Flame, 
  Award, 
  Target, 
  PieChart, 
  Activity,
  Layers
} from 'lucide-react';

export default function AnalyticsModule() {
  const { chartData, creators, overviewStats } = useApp();

  const categoryBreakdown = [
    { label: "Lifestyle & Vlog", percentage: 32, count: "78 Creators", color: "#a855f7" },
    { label: "Technology & Coding", percentage: 24, count: "59 Creators", color: "#00f0ff" },
    { label: "Fashion & Aesthetics", percentage: 18, count: "44 Creators", color: "#ec4899" },
    { label: "Gaming & Esports", percentage: 14, count: "35 Creators", color: "#ff7a00" },
    { label: "Music & Performing Arts", percentage: 12, count: "32 Creators", color: "#ffbe0b" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="pb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_#a855f7]" />
          <span className="text-[10px] font-mono tracking-widest uppercase text-purple-400 font-semibold">
            DEEP DATA ENGINE
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight">
          Campus Creator Intelligence & Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Aggregate cross-platform metrics, viral multiplier coefficients, and collegiate ROI.
        </p>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <TiltCard glowColor="purple" className="glass-panel p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Viral Coefficient</span>
            <span className="text-emerald-400 font-mono text-xs font-bold">+18.4%</span>
          </div>
          <div className="text-3xl font-black font-display text-white mt-2">
            2.48x
          </div>
          <p className="text-xs text-slate-400 mt-1">Organic student repost multiplier</p>
          <div className="mt-4 pt-3 border-t border-white/[0.05]">
            <Sparkline points={[1.2, 1.5, 1.8, 1.6, 2.1, 2.35, 2.48]} color="#a855f7" />
          </div>
        </TiltCard>

        <TiltCard glowColor="cyan" className="glass-panel p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Total Impressions</span>
            <span className="text-emerald-400 font-mono text-xs font-bold">+34.2%</span>
          </div>
          <div className="text-3xl font-black font-display text-white mt-2">
            1.24M
          </div>
          <p className="text-xs text-slate-400 mt-1">Total quarterly campus views</p>
          <div className="mt-4 pt-3 border-t border-white/[0.05]">
            <Sparkline points={[400, 520, 680, 810, 950, 1100, 1240]} color="#00f0ff" />
          </div>
        </TiltCard>

        <TiltCard glowColor="orange" className="glass-panel p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Average ROI</span>
            <span className="text-emerald-400 font-mono text-xs font-bold">4.8:1</span>
          </div>
          <div className="text-3xl font-black font-display text-white mt-2">
            ₹4.82
          </div>
          <p className="text-xs text-slate-400 mt-1">Earned media value per ₹1 spent</p>
          <div className="mt-4 pt-3 border-t border-white/[0.05]">
            <Sparkline points={[3.2, 3.8, 4.1, 4.0, 4.4, 4.6, 4.82]} color="#ff7a00" />
          </div>
        </TiltCard>

      </div>

      {/* Engagement Curve */}
      <div className="glass-panel p-6 rounded-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">TIME SERIES TREND</span>
            <h3 className="text-lg font-bold text-white font-display">Student Content Reach vs. Interactions</h3>
          </div>
        </div>
        <EngagementChart data={chartData} />
      </div>

      {/* Category Breakdown & Performance Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Category Share */}
        <div className="glass-panel p-6 rounded-2xl">
          <h3 className="text-base font-bold text-white font-display mb-4">
            Creator Domain Distribution
          </h3>
          <div className="space-y-4">
            {categoryBreakdown.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-200">{item.label}</span>
                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-slate-400 text-[11px]">{item.count}</span>
                    <span className="text-white font-bold">{item.percentage}%</span>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full bg-white/[0.05] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Colleges Reach Leaderboard */}
        <div className="glass-panel p-6 rounded-2xl">
          <h3 className="text-base font-bold text-white font-display mb-4">
            Top Performing College Ecosystems
          </h3>
          <div className="space-y-3">
            {[
              { rank: "01", name: "Delhi University", creators: "48 Creators", reach: "182K Impressions", eng: "4.8%" },
              { rank: "02", name: "IIT Bombay", creators: "36 Creators", reach: "145K Impressions", eng: "4.2%" },
              { rank: "03", name: "Christ University", creators: "29 Creators", reach: "118K Impressions", eng: "5.1%" },
              { rank: "04", name: "NIFT Delhi", creators: "22 Creators", reach: "94K Impressions", eng: "3.9%" },
              { rank: "05", name: "SRM Chennai", creators: "25 Creators", reach: "89K Impressions", eng: "4.9%" },
            ].map((col, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-purple-400 w-6">{col.rank}</span>
                  <div>
                    <p className="text-xs font-bold text-white">{col.name}</p>
                    <p className="text-[10px] text-slate-400">{col.creators}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-200 font-mono block">{col.reach}</span>
                  <span className="text-[10px] text-pink-400 font-mono">{col.eng} avg eng</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
