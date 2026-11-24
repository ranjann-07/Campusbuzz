import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Instagram, 
  Youtube, 
  CheckCircle2, 
  Star, 
  GraduationCap, 
  Sparkles, 
  MessageSquare, 
  Award,
  TrendingUp,
  Share2
} from 'lucide-react';

export default function CreatorDetailModal() {
  const { selectedCreatorForModal, setSelectedCreatorForModal, setDashboardTab, setCurrentView, showToast, triggerConfetti } = useApp();

  if (!selectedCreatorForModal) return null;

  const creator = selectedCreatorForModal;

  const handleInvite = () => {
    showToast(`Collaboration invitation sent to ${creator.name}!`, 'success');
    triggerConfetti();
    setSelectedCreatorForModal(null);
    setCurrentView('dashboard');
    setDashboardTab('collaborations');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl glass-panel border border-purple-500/40 p-6 sm:p-8 shadow-[0_0_50px_rgba(168,85,247,0.3)] max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={() => setSelectedCreatorForModal(null)}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Profile Cover / Avatar */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-white/[0.08]">
          <div className="relative">
            <img
              src={creator.avatar_url}
              alt={creator.name}
              className="w-24 h-24 rounded-3xl object-cover ring-4 ring-purple-500/50 shadow-xl"
            />
            {creator.verification_status === 'verified' && (
              <div className="absolute -bottom-2 -right-2 p-1 bg-[#08090D] rounded-full">
                <CheckCircle2 className="w-6 h-6 text-cyan-400 fill-cyan-400/20" />
              </div>
            )}
          </div>

          <div className="text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-2xl font-extrabold font-display text-white">{creator.name}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {creator.category}
              </span>
            </div>
            
            <p className="text-xs text-purple-300 font-medium mt-1 flex items-center justify-center sm:justify-start gap-1">
              <GraduationCap className="w-4 h-4 text-purple-400" />
              <span>{creator.college} • {creator.department}</span>
            </p>

            <div className="flex items-center justify-center sm:justify-start gap-4 mt-3 text-xs">
              <a
                href={`https://instagram.com/${creator.instagram}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-pink-400 hover:underline"
              >
                <Instagram className="w-4 h-4" /> @{creator.instagram}
              </a>
              {creator.youtube && (
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Youtube className="w-4 h-4 text-red-500" /> {creator.youtube}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="py-4 border-b border-white/[0.08]">
          <p className="text-xs font-mono uppercase text-slate-500 mb-1">About Creator</p>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            {creator.bio || "Dedicated collegiate creator focused on storytelling and community engagement."}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="py-4 border-b border-white/[0.08] grid grid-cols-3 gap-3 text-center">
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Followers</span>
            <span className="text-lg font-bold text-white font-mono">{creator.followers.toLocaleString()}</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Engagement</span>
            <span className="text-lg font-bold text-pink-400 font-mono">{creator.engagement_rate}%</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Rating</span>
            <span className="text-lg font-bold text-amber-400 font-mono flex items-center justify-center gap-1">
              <Star className="w-4 h-4 fill-amber-400" /> {creator.rating}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-6 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleInvite}
            className="w-full sm:flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white font-bold text-xs tracking-wide shadow-[0_0_20px_rgba(168,85,247,0.4)] transition flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Invite to Campaign</span>
          </button>

          <button
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              showToast('Creator profile link copied!', 'info');
            }}
            className="w-full sm:w-auto px-4 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs text-slate-300 font-semibold transition flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Profile</span>
          </button>
        </div>

      </div>
    </div>
  );
}
