import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { apiUrl } from '../config/api';
import { 
  X, 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  CheckCircle, 
  Share2, 
  ExternalLink, 
  DollarSign, 
  Trophy, 
  Award, 
  Instagram, 
  Youtube, 
  Linkedin, 
  CheckCircle2, 
  Sparkles, 
  Send, 
  Bookmark, 
  Tag, 
  AlertCircle,
  TrendingUp,
  FileText,
  Copy
} from 'lucide-react';

export default function DetailDrawer() {
  const { 
    detailDrawer, 
    closeDetailDrawer, 
    currentUser, 
    showToast, 
    triggerConfetti,
    setDashboardTab,
    setCurrentView
  } = useApp();

  const { isOpen, type, data } = detailDrawer;

  // Local state for campaign application within drawer
  const [pitchText, setPitchText] = useState('');
  const [portfolioLink, setPortfolioLink] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  // Local state for event registration toggle
  const [isRegistered, setIsRegistered] = useState(false);
  const [registeredCount, setRegisteredCount] = useState(0);

  // Local state for creator's own posts
  const [creatorPosts, setCreatorPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

  // Sync state when data changes
  useEffect(() => {
    if (data) {
      if (type === 'event') {
        setIsRegistered(Boolean(data.user_registered));
        setRegisteredCount(data.registered_attendees || data.registered_count || 120);
      } else if (type === 'campaign') {
        setHasApplied(false);
        setPitchText('');
        setPortfolioLink('');
      } else if (type === 'creator') {
        const creatorId = data.id;
        if (creatorId) {
          setLoadingPosts(true);
          fetch(apiUrl(`/api/posts?author_id=${creatorId}&limit=8`))
            .then(r => r.json())
            .then(res => {
              if (res.success && res.posts) {
                setCreatorPosts(res.posts);
              } else {
                setCreatorPosts([]);
              }
            })
            .catch(() => setCreatorPosts([]))
            .finally(() => setLoadingPosts(false));
        }
      }
    }
  }, [data, type]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        closeDetailDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeDetailDrawer]);

  if (!isOpen || !data) return null;

  // Toggle event registration
  const handleToggleEventRegistration = () => {
    if (isRegistered) {
      setIsRegistered(false);
      setRegisteredCount(prev => Math.max(0, prev - 1));
      showToast('Event registration cancelled', 'info');
    } else {
      setIsRegistered(true);
      setRegisteredCount(prev => prev + 1);
      showToast('Successfully registered for this event! 🎉', 'success');
      triggerConfetti();
    }
  };

  // Submit campaign application
  const handleApplyCampaign = (e) => {
    e.preventDefault();
    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
      setHasApplied(true);
      showToast(`Pitch submitted for "${data.name}"!`, 'success');
      triggerConfetti();
    }, 600);
  };

  // Copy share link
  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Link copied to clipboard!', 'info');
  };

  // Calculate event capacity %
  const maxAttendees = data.max_attendees || 500;
  const capacityPercent = Math.min(100, Math.round((registeredCount / maxAttendees) * 100));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={closeDetailDrawer}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        />

        {/* Drawer Panel Sliding from Right */}
        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10 pointer-events-none">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="w-screen max-w-xl bg-[#0f1019] border-l border-white/[0.08] shadow-2xl flex flex-col pointer-events-auto"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#141523]/80 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_#a855f7]" />
                <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-purple-400">
                  {type === 'event' ? 'Event Specification' : type === 'campaign' ? 'Campaign Brief' : 'Student Creator File'}
                </span>
                {data.code && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-slate-400 border border-white/[0.08]">
                    {data.code}
                  </span>
                )}
              </div>

              {/* Close Button with Rotating Hover */}
              <button
                onClick={closeDetailDrawer}
                className="group p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Close drawer (Esc)"
              >
                <X className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90 text-slate-300" />
              </button>
            </div>

            {/* Drawer Body (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* ============================================================== */}
              {/* EVENT DETAIL VIEW                                              */}
              {/* ============================================================== */}
              {type === 'event' && (
                <div className="space-y-6">
                  {/* Banner Image */}
                  <div className="relative rounded-2xl overflow-hidden aspect-[16/9] border border-white/[0.08] shadow-lg bg-[#141724]">
                    <img 
                      src={data.banner_image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80'} 
                      alt={data.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f1019] via-transparent to-black/30" />
                    
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-purple-600/90 text-white backdrop-blur-md shadow">
                        {data.category || 'Collegiate'}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold backdrop-blur-md ${
                        data.status === 'completed'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      }`}>
                        {data.status === 'completed' ? 'Completed Recap' : 'Upcoming Event'}
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3 flex items-center gap-2">
                      <button
                        onClick={handleShare}
                        className="p-2 rounded-xl bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/10 transition"
                        title="Share event"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Organizer */}
                  <div>
                    <h2 className="text-2xl font-black font-display text-white leading-tight">
                      {data.name}
                    </h2>
                    <p className="text-xs text-purple-300 font-medium mt-1 flex items-center gap-1.5">
                      <span>Organized by:</span>
                      <span className="font-bold text-white">{data.organizer || 'CampusBuzz Collegiate Guild'}</span>
                    </p>
                  </div>

                  {/* Key Event Metadata Cards */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-[#151726] border border-white/[0.06] flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 flex-shrink-0">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[10px] font-mono uppercase text-slate-400">Date</div>
                        <div className="text-xs font-bold text-white mt-0.5">{data.event_date || 'Upcoming 2026'}</div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#151726] border border-white/[0.06] flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 flex-shrink-0">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[10px] font-mono uppercase text-slate-400">Timing</div>
                        <div className="text-xs font-bold text-white mt-0.5">{data.start_time || '10:00 AM'} - {data.end_time || '06:00 PM'}</div>
                      </div>
                    </div>

                    <div className="col-span-2 p-3.5 rounded-xl bg-[#151726] border border-white/[0.06] flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 flex-shrink-0">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[10px] font-mono uppercase text-slate-400">Venue & Location</div>
                        <div className="text-xs font-bold text-white mt-0.5">{data.venue || 'Central Campus Auditorium'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Capacity & Live Attendees Meter */}
                  <div className="p-4 rounded-xl bg-[#141624] border border-white/[0.06] space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                        <Users className="w-3.5 h-3.5 text-purple-400" />
                        Attendee Capacity
                      </span>
                      <span className="font-mono font-bold text-white">
                        {registeredCount} / {maxAttendees} <span className="text-purple-400">({capacityPercent}%)</span>
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 transition-all duration-500"
                        style={{ width: `${capacityPercent}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {capacityPercent >= 90 ? '🔥 High demand! Only a few seats remaining.' : 'Free registration open for all verified university students.'}
                    </p>
                  </div>

                  {/* Description & Agenda */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                      Event Overview
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed bg-[#141624]/60 p-4 rounded-xl border border-white/[0.04]">
                      {data.description || 'Join fellow collegiate creators, developers, and campus leaders for this immersive event. Engage in live interactive workshops, networking opportunities, and creator showcases.'}
                    </p>
                  </div>

                  {/* Highlights / Highlights recap */}
                  {data.highlights && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                        <Trophy className="w-3.5 h-3.5" />
                        Key Highlights & Winners
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed bg-[#191724]/60 p-4 rounded-xl border border-amber-500/20">
                        {data.highlights}
                      </p>
                    </div>
                  )}

                  {/* Action Register Button */}
                  {data.status !== 'completed' && (
                    <div className="pt-2">
                      <button
                        onClick={handleToggleEventRegistration}
                        className={`w-full py-3.5 rounded-xl text-xs font-bold tracking-wide transition flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                          isRegistered
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-red-500/20 hover:text-red-300'
                            : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:opacity-95 text-white shadow-[0_0_25px_rgba(168,85,247,0.4)]'
                        }`}
                      >
                        {isRegistered ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                            <span>Registered • Click to Cancel</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 text-purple-200" />
                            <span>Register Free for this Event</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ============================================================== */}
              {/* CAMPAIGN DETAIL VIEW                                           */}
              {/* ============================================================== */}
              {type === 'campaign' && (
                <div className="space-y-6">
                  {/* Banner Image */}
                  <div className="relative rounded-2xl overflow-hidden aspect-[16/9] border border-white/[0.08] shadow-lg bg-[#141724]">
                    <img 
                      src={data.image_url || 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80'} 
                      alt={data.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f1019] via-transparent to-black/30" />
                    
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500/90 text-white backdrop-blur-md shadow">
                        {data.required_category || 'All Creators'}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/40 backdrop-blur-md">
                        {data.status === 'completed' ? 'Completed Cohort' : 'Active Brief'}
                      </span>
                    </div>
                  </div>

                  {/* Brand & Campaign Title */}
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-purple-400 font-bold mb-1">
                      <span>{data.brand_name || data.brand || 'Partner Brand'}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400/20" />
                    </div>
                    <h2 className="text-2xl font-black font-display text-white leading-tight">
                      {data.name}
                    </h2>
                  </div>

                  {/* Budget & Rewards Highlight */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-500/30 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-wider text-purple-300 font-semibold">Total Campaign Budget</div>
                      <div className="text-xl font-bold font-mono text-white mt-0.5">
                        ₹{(data.budget || 150000).toLocaleString('en-IN')}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">Per Creator Payout</div>
                      <div className="text-sm font-bold font-mono text-pink-400 mt-0.5">
                        {data.rewards ? data.rewards.split('+')[0] : '₹15,000 - ₹35,000'}
                      </div>
                    </div>
                  </div>

                  {/* Rewards Breakdown */}
                  {data.rewards && (
                    <div className="p-3.5 rounded-xl bg-[#141624] border border-white/[0.06] space-y-1">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5" />
                        Creator Compensation & Perks
                      </div>
                      <p className="text-xs text-slate-300">{data.rewards}</p>
                    </div>
                  )}

                  {/* Criteria Grid */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-[#141624] border border-white/[0.06]">
                      <span className="text-[10px] font-mono uppercase text-slate-400 block">Target Audience</span>
                      <span className="font-semibold text-white mt-1 block truncate">
                        {data.target_audience || 'University Students'}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#141624] border border-white/[0.06]">
                      <span className="text-[10px] font-mono uppercase text-slate-400 block">Application Deadline</span>
                      <span className="font-mono font-semibold text-purple-300 mt-1 block">
                        {data.application_deadline || 'Open Enrollment'}
                      </span>
                    </div>
                  </div>

                  {/* Detailed Description */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                      Deliverables & Brief
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed bg-[#141624]/60 p-4 rounded-xl border border-white/[0.04]">
                      {data.description || 'Creators will craft 2 high-energy Instagram Reels / TikToks showcasing the brand experience on campus. Selected creators will receive direct product seeding and guaranteed cash stipends upon milestone completion.'}
                    </p>
                  </div>

                  {/* Interactive Application Form */}
                  {data.status !== 'completed' && (
                    <div className="pt-2 border-t border-white/[0.08] space-y-3">
                      <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        Apply for this Creator Campaign
                      </h4>

                      {hasApplied ? (
                        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-1">
                          <CheckCircle className="w-6 h-6 text-emerald-400 mx-auto" />
                          <div className="text-xs font-bold text-white">Application Received!</div>
                          <p className="text-[11px] text-slate-400">
                            The brand review team will review your pitch within 48 hours. Check Notifications for status updates.
                          </p>
                        </div>
                      ) : (
                        <form onSubmit={handleApplyCampaign} className="space-y-3">
                          <div>
                            <label className="text-[11px] font-medium text-slate-400 block mb-1">
                              Your Campaign Pitch / Angle
                            </label>
                            <textarea
                              rows={2}
                              required
                              value={pitchText}
                              onChange={(e) => setPitchText(e.target.value)}
                              placeholder="Describe your creative concept or how you will showcase this to your campus audience..."
                              className="w-full bg-[#12141c] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 resize-none"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-medium text-slate-400 block mb-1">
                              Creator Portfolio or Instagram Handle
                            </label>
                            <input
                              type="text"
                              required
                              value={portfolioLink}
                              onChange={(e) => setPortfolioLink(e.target.value)}
                              placeholder="@handle or portfolio URL"
                              className="w-full bg-[#12141c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={isApplying}
                            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 disabled:opacity-50 text-white font-bold text-xs shadow-[0_0_20px_rgba(168,85,247,0.4)] transition flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>{isApplying ? 'Submitting Application...' : 'Submit Creator Pitch'}</span>
                          </button>
                        </form>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ============================================================== */}
              {/* CREATOR / STUDENT DETAIL VIEW                                  */}
              {/* ============================================================== */}
              {type === 'creator' && (
                <div className="space-y-6">
                  {/* Top Profile Card */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-[#1a1c2d] to-[#111322] border border-purple-500/30 flex items-center gap-4">
                    <div className="relative flex-shrink-0">
                      <img 
                        src={data.avatar_url || `https://randomuser.me/api/portraits/women/${(data.id || 1) % 100}.jpg`} 
                        alt={data.name} 
                        className="w-20 h-20 rounded-2xl object-cover ring-2 ring-purple-500/50 shadow-md"
                      />
                      <div className="absolute -bottom-1 -right-1 p-1 bg-[#0f1019] rounded-full">
                        <CheckCircle2 className="w-5 h-5 text-cyan-400 fill-cyan-400/20" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-white truncate">{data.name}</h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          {data.category || 'Creator'}
                        </span>
                      </div>
                      <p className="text-xs text-purple-300 font-medium mt-1 truncate">{data.college || 'University'}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5 font-mono">{data.student_id || 'CB-2026-TALENT'}</p>
                    </div>
                  </div>

                  {/* Metrics Stats Grid */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-[#141624] border border-white/[0.06] text-center">
                      <span className="text-[10px] font-mono uppercase text-slate-400 block">Followers</span>
                      <span className="text-base font-bold font-mono text-white mt-1 block">
                        {(data.followers || 15400).toLocaleString()}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#141624] border border-white/[0.06] text-center">
                      <span className="text-[10px] font-mono uppercase text-slate-400 block">Engagement</span>
                      <span className="text-base font-bold font-mono text-pink-400 mt-1 block">
                        {data.engagement_rate || '4.8'}%
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#141624] border border-white/[0.06] text-center">
                      <span className="text-[10px] font-mono uppercase text-slate-400 block">Star Rating</span>
                      <span className="text-base font-bold font-mono text-amber-400 mt-1 block flex items-center justify-center gap-1">
                        {data.rating || '4.9'} ★
                      </span>
                    </div>
                  </div>

                  {/* Social Handles */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                      Connected Channels
                    </h4>
                    <div className="space-y-2">
                      {data.instagram && (
                        <div className="flex items-center justify-between p-3 rounded-xl bg-[#141624] border border-white/[0.06]">
                          <span className="flex items-center gap-2 text-xs text-white">
                            <Instagram className="w-4 h-4 text-pink-400" />
                            <span>@{data.instagram}</span>
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">Instagram Verified</span>
                        </div>
                      )}
                      {data.youtube && (
                        <div className="flex items-center justify-between p-3 rounded-xl bg-[#141624] border border-white/[0.06]">
                          <span className="flex items-center gap-2 text-xs text-white">
                            <Youtube className="w-4 h-4 text-red-400" />
                            <span>{data.youtube}</span>
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">YouTube Channel</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bio & Department */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                      About Student Creator
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed bg-[#141624]/60 p-4 rounded-xl border border-white/[0.04]">
                      {data.bio || `${data.name} is a verified collegiate creator from ${data.college || 'university'}, specializing in high-engagement storytelling, brand partnerships, and campus activations.`}
                    </p>
                  </div>

                  {/* Creator's Live Posts Showcase */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Recent Campus Posts ({creatorPosts.length})</span>
                      </h4>
                      <span className="text-[10px] font-mono text-slate-500">Live Creator Feed</span>
                    </div>

                    {loadingPosts ? (
                      <p className="text-xs text-slate-500 italic py-2 font-mono">Loading posts...</p>
                    ) : creatorPosts.length === 0 ? (
                      <p className="text-xs text-slate-500 italic py-2">No posts published yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {creatorPosts.map((post) => (
                          <div
                            key={post.id}
                            className="p-3.5 rounded-xl bg-[#141624] border border-white/[0.06] hover:border-purple-500/30 transition space-y-2"
                          >
                            <p className="text-xs text-slate-200 leading-relaxed">
                              {post.content}
                            </p>
                            {post.hashtags && (
                              <p className="text-[11px] font-mono text-purple-400 font-medium">
                                {post.hashtags}
                              </p>
                            )}
                            {post.media_url && (
                              <div className="rounded-lg overflow-hidden aspect-[16/9] max-h-48 w-full bg-[#10121d] border border-white/[0.04]">
                                <img
                                  src={post.media_url}
                                  alt="Post media"
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                              </div>
                            )}
                            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-white/[0.04]">
                              <div className="flex items-center gap-3">
                                <span>❤️ {post.likes_count || 42}</span>
                                <span>💬 {post.comments_count || 8}</span>
                              </div>
                              <span className="font-mono text-[10px] text-slate-500">
                                {post.created_at ? new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Recent'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Quick Action Button */}
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        showToast(`Collaboration invitation sent to ${data.name}!`, 'success');
                        triggerConfetti();
                        closeDetailDrawer();
                        setCurrentView('dashboard');
                        setDashboardTab('collaborations');
                      }}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white font-bold text-xs shadow-[0_0_20px_rgba(168,85,247,0.4)] transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-purple-200" />
                      <span>Send Direct Collaboration Invite</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
