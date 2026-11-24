import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import AiOrb from './AiOrb';
import { X, Sparkles, CheckCircle2, Star, TrendingUp, Users, ArrowUpRight } from 'lucide-react';

export default function MatchScoreModal({ isOpen, onClose }) {
  const { setSelectedCreatorForModal } = useApp();
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch('/api/match-score')
        .then(r => r.json())
        .then(data => {
          if (data.success) setMatchData(data);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        
        {/* Backdrop click dismiss */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0"
        />

        {/* Modal Window with Kanbo spring physics */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ type: "spring", stiffness: 450, damping: 28 }}
          className="relative z-10 w-full max-w-2xl rounded-3xl glass-panel border border-purple-500/40 p-6 sm:p-8 shadow-[0_0_60px_rgba(168,85,247,0.35)] max-h-[90vh] overflow-y-auto"
        >
          
          <motion.button
            whileHover={{ scale: 1.15, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </motion.button>

          {/* Header featuring glowing AI Orb */}
          <div className="flex items-center gap-4 mb-6">
            <AiOrb size="md" interactive={false} />
            <div>
              <h2 className="text-xl sm:text-2xl font-black font-display text-white">
                Influencer Match Score & Algorithm
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Automated collegiate creator ranking based on engagement consistency, followers, and niche relevance.
              </p>
            </div>
          </div>

          {/* Match Breakdown Card */}
          <motion.div 
            whileHover={{ y: -2 }}
            className="p-5 rounded-2xl bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-[#12141c] border border-purple-500/30 mb-6 shadow-lg"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-purple-300 font-bold tracking-wider">
                  COMPOSITE MATCH SCORE
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-4xl font-black font-display text-white">92</span>
                  <span className="text-lg text-purple-400 font-mono">/ 100</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold ml-2">
                    OPTIMAL MATCH
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span><strong>High Engagement:</strong> 4.92% avg (Top 5% on campus)</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span><strong>Relevant Category:</strong> Lifestyle, Media & Tech</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span><strong>Strong Follower Base:</strong> 18,400+ authentic collegiate reach</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Recommended Creators List */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
              Algorithmically Recommended Creators
            </h4>

            {loading ? (
              <div className="flex items-center gap-3 py-6 justify-center">
                <div className="w-5 h-5 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
                <p className="text-xs text-slate-400 font-mono">Calculating collegiate match scores...</p>
              </div>
            ) : (
              matchData?.suggestions?.map((creator) => (
                <motion.div
                  key={creator.id}
                  whileHover={{ x: 4, scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 450, damping: 25 }}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] hover:border-purple-500/30 transition"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={creator.profile_photo}
                      alt={creator.full_name}
                      className="w-11 h-11 rounded-xl object-cover ring-1 ring-purple-500/40"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h5 className="text-xs font-bold text-white">{creator.full_name}</h5>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-300">
                          {creator.creator_category}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
                        {creator.college_name} • {(creator.followers_count / 1000).toFixed(1)}K followers • {creator.engagement_rate}% eng
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {creator.match_score}% Match
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        onClose();
                        setSelectedCreatorForModal({
                          ...creator,
                          name: creator.full_name,
                          college: creator.college_name,
                          category: creator.creator_category,
                          followers: creator.followers_count,
                          avatar_url: creator.profile_photo,
                          rating: 4.90
                        });
                      }}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-purple-600/30 text-slate-300 hover:text-white transition"
                      title="View creator"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              ))
            )}
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
