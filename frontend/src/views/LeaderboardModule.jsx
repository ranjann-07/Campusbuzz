import React from 'react';
import { useApp } from '../context/AppContext';
import { Trophy, Star, TrendingUp, Award, Instagram, Youtube, Sparkles } from 'lucide-react';
import TiltCard from '../components/TiltCard';

export default function LeaderboardModule() {
  const { creators, setSelectedCreatorForModal } = useApp();

  const sortedCreators = [...creators].sort((a, b) => b.followers - a.followers);
  const topThree = sortedCreators.slice(0, 3);
  const remaining = sortedCreators.slice(3);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="pb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_#ffbe0b]" />
          <span className="text-[10px] font-mono tracking-widest uppercase text-amber-400 font-semibold">
            CAMPUS RANKINGS
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight">
          Collegiate Creator Leaderboard
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Top-tier university creators ranked by aggregate reach, verified engagements, and brand performance.
        </p>
      </div>

      {/* Podium Showcase for Top 3 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        
        {/* Rank 2 */}
        {topThree[1] && (
          <TiltCard glowColor="cyan" className="glass-card-interactive p-6 flex flex-col items-center text-center order-2 md:order-1">
            <div className="w-12 h-12 rounded-full bg-cyan-500/20 text-cyan-400 font-bold font-mono text-lg flex items-center justify-center border border-cyan-500/40 mb-4 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
              #2
            </div>
            <img
              src={topThree[1].avatar_url}
              alt={topThree[1].name}
              className="w-20 h-20 rounded-full object-cover ring-2 ring-cyan-400 mb-3"
            />
            <h3 className="font-extrabold text-white text-base">{topThree[1].name}</h3>
            <p className="text-xs text-purple-400 font-medium">{topThree[1].college}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{topThree[1].category}</p>

            <div className="mt-4 pt-3 border-t border-white/[0.06] w-full grid grid-cols-2 gap-2 text-xs font-mono">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-sans">Followers</span>
                <span className="text-white font-bold">{topThree[1].followers.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-sans">Eng. Rate</span>
                <span className="text-cyan-400 font-bold">{topThree[1].engagement_rate}%</span>
              </div>
            </div>
            <button
              onClick={() => setSelectedCreatorForModal(topThree[1])}
              className="mt-4 w-full py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-slate-200"
            >
              View Profile
            </button>
          </TiltCard>
        )}

        {/* Rank 1 - Champion (Center with Purple Glow & Crown) */}
        {topThree[0] && (
          <TiltCard glowColor="purple" className="glass-card-interactive p-6 flex flex-col items-center text-center border-purple-500/40 shadow-[0_0_30px_rgba(168,85,247,0.25)] order-1 md:order-2 md:-translate-y-4">
            <div className="w-14 h-14 rounded-full bg-purple-500/30 text-purple-300 font-bold font-mono text-xl flex items-center justify-center border border-purple-500/50 mb-4 shadow-[0_0_20px_rgba(168,85,247,0.5)] animate-pulse">
              👑 #1
            </div>
            <img
              src={topThree[0].avatar_url}
              alt={topThree[0].name}
              className="w-24 h-24 rounded-full object-cover ring-4 ring-purple-500 mb-3 shadow-[0_0_25px_rgba(168,85,247,0.5)]"
            />
            <h3 className="font-extrabold text-white text-lg">{topThree[0].name}</h3>
            <p className="text-xs text-purple-300 font-medium">{topThree[0].college}</p>
            <span className="mt-1 px-3 py-0.5 rounded-full text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
              CAMPUS MVP
            </span>

            <div className="mt-4 pt-3 border-t border-white/[0.06] w-full grid grid-cols-2 gap-2 text-xs font-mono">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-sans">Followers</span>
                <span className="text-white font-bold">{topThree[0].followers.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-sans">Eng. Rate</span>
                <span className="text-pink-400 font-bold">{topThree[0].engagement_rate}%</span>
              </div>
            </div>
            <button
              onClick={() => setSelectedCreatorForModal(topThree[0])}
              className="mt-4 w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]"
            >
              View Champion Profile
            </button>
          </TiltCard>
        )}

        {/* Rank 3 */}
        {topThree[2] && (
          <TiltCard glowColor="orange" className="glass-card-interactive p-6 flex flex-col items-center text-center order-3">
            <div className="w-12 h-12 rounded-full bg-orange-500/20 text-orange-400 font-bold font-mono text-lg flex items-center justify-center border border-orange-500/40 mb-4 shadow-[0_0_15px_rgba(255,103,0,0.3)]">
              #3
            </div>
            <img
              src={topThree[2].avatar_url}
              alt={topThree[2].name}
              className="w-20 h-20 rounded-full object-cover ring-2 ring-orange-400 mb-3"
            />
            <h3 className="font-extrabold text-white text-base">{topThree[2].name}</h3>
            <p className="text-xs text-purple-400 font-medium">{topThree[2].college}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{topThree[2].category}</p>

            <div className="mt-4 pt-3 border-t border-white/[0.06] w-full grid grid-cols-2 gap-2 text-xs font-mono">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-sans">Followers</span>
                <span className="text-white font-bold">{topThree[2].followers.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-sans">Eng. Rate</span>
                <span className="text-orange-400 font-bold">{topThree[2].engagement_rate}%</span>
              </div>
            </div>
            <button
              onClick={() => setSelectedCreatorForModal(topThree[2])}
              className="mt-4 w-full py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-slate-200"
            >
              View Profile
            </button>
          </TiltCard>
        )}

      </div>

      {/* Remaining Rankings Table */}
      <div className="glass-panel p-6 rounded-2xl">
        <h3 className="text-base font-bold text-white font-display mb-4">Complete Network Rankings</h3>
        <div className="space-y-3">
          {remaining.map((creator, i) => (
            <div
              key={creator.id}
              onClick={() => setSelectedCreatorForModal(creator)}
              className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.04] transition cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs font-bold text-slate-500 w-8">
                  #{i + 4}
                </span>
                <img
                  src={creator.avatar_url}
                  alt={creator.name}
                  className="w-10 h-10 rounded-full object-cover ring-1 ring-white/10"
                />
                <div>
                  <p className="text-xs font-bold text-white">{creator.name}</p>
                  <p className="text-[10px] text-slate-400">{creator.college} • {creator.category}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 text-right">
                <div>
                  <span className="text-xs font-mono font-bold text-white block">
                    {creator.followers.toLocaleString()}
                  </span>
                  <span className="text-[9px] text-slate-500 uppercase">Followers</span>
                </div>
                <div>
                  <span className="text-xs font-mono font-bold text-pink-400 block">
                    {creator.engagement_rate}%
                  </span>
                  <span className="text-[9px] text-slate-500 uppercase">Engagement</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
