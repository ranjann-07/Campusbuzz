import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import Sparkline from '../components/Sparkline';
import EngagementChart from '../components/EngagementChart';
import AiOrb from '../components/AiOrb';
import InteractiveCalendar from '../components/InteractiveCalendar';
import { 
  Plus, 
  ArrowUpRight, 
  Users, 
  Users2,
  Radio, 
  Heart, 
  Megaphone, 
  Calendar, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Instagram,
  Activity,
  MessageSquare,
  FileText,
  Share2,
  Trophy,
  BarChart2,
  Compass,
  Zap,
  Flame,
  ThumbsUp,
  MapPin,
  ChevronRight,
  Eye
} from 'lucide-react';

export default function DashboardOverview() {
  const { 
    setDashboardTab, 
    setCreateCampaignModalOpen,
    setSelectedCreatorForModal,
    setMatchScoreModalOpen,
    openDetailDrawer,
    showToast,
    triggerConfetti,
    creators: contextCreators,
    events: contextEvents,
    campaigns: contextCampaigns
  } = useApp();

  const [dbStats, setDbStats] = useState({
    totalStudents: 10200,
    totalCreators: 5000,
    totalPosts: 9755,
    activeCampaigns: 15,
    upcomingEvents: 20,
    totalEngagement: "2.18M",
    totalReach: "3.45M"
  });

  const handleOpenCreator = (creator) => {
    if (openDetailDrawer) {
      openDetailDrawer('creator', {
        id: creator.id,
        name: creator.full_name || creator.name,
        avatar_url: creator.profile_photo || creator.avatar_url,
        college: creator.college_name || creator.college || 'University',
        category: creator.creator_category || creator.category || 'Creator',
        followers: creator.followers_count || creator.followers || 15400,
        engagement_rate: creator.engagement_rate || '4.8',
        instagram: creator.instagram || (creator.username ? `${creator.username}_official` : undefined),
        bio: creator.bio
      });
    } else {
      setSelectedCreatorForModal(creator);
    }
  };

  const [trendingCreators, setTrendingCreators] = useState([
    {
      id: 5,
      student_id: 'CB-2026-00005',
      full_name: 'Shivani Negi',
      profile_photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80',
      college_name: 'Shoolini University',
      creator_category: 'Lifestyle',
      followers_count: 184500,
      engagement_rate: '5.70'
    },
    {
      id: 1,
      student_id: 'CB-2026-00001',
      full_name: 'Aanya Sharma',
      profile_photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
      college_name: 'Delhi University',
      creator_category: 'Media & Journalism',
      followers_count: 128400,
      engagement_rate: '6.45'
    },
    {
      id: 2,
      student_id: 'CB-2026-00002',
      full_name: 'Arjun Mehta',
      profile_photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80',
      college_name: 'IIT Bombay',
      creator_category: 'Technology',
      followers_count: 96800,
      engagement_rate: '6.55'
    },
    {
      id: 3,
      student_id: 'CB-2026-00003',
      full_name: 'Riya Patel',
      profile_photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=80',
      college_name: 'NIFT Delhi',
      creator_category: 'Fashion & Design',
      followers_count: 74200,
      engagement_rate: '5.33'
    },
    {
      id: 4,
      student_id: 'CB-2026-00004',
      full_name: 'Admin Karan',
      profile_photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80',
      college_name: 'Delhi University',
      creator_category: 'Technology',
      followers_count: 62000,
      engagement_rate: '3.89'
    }
  ]);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [activeCampaigns, setActiveCampaigns] = useState([]);
  const [topCreator, setTopCreator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState({});
  const [floatingLikes, setFloatingLikes] = useState({});
  const [calendarViewMode, setCalendarViewMode] = useState('list'); // 'list' or 'calendar'

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then(r => r.json())
      .then(data => {
        if (data.stats) setDbStats(data.stats);
        if (data.topCreatorOfTheMonth) setTopCreator(data.topCreatorOfTheMonth);
        if (data.trendingCreators && data.trendingCreators.length > 0) {
          setTrendingCreators(data.trendingCreators);
        } else if (contextCreators && contextCreators.length > 0) {
          const sorted = [...contextCreators].sort((a, b) => (b.followers || 0) - (a.followers || 0));
          setTrendingCreators(sorted.slice(0, 5).map(c => ({
            id: c.id,
            student_id: c.student_id,
            full_name: c.name || c.full_name,
            username: c.username,
            profile_photo: c.avatar_url || c.profile_photo,
            college_name: c.college || c.college_name,
            creator_category: c.category || c.creator_category,
            followers_count: c.followers || c.followers_count || 184500,
            engagement_rate: c.engagement_rate || '4.92'
          })));
        }
        if (data.trendingPosts) setTrendingPosts(data.trendingPosts);
        if (data.upcomingEvents && data.upcomingEvents.length > 0) {
          setUpcomingEvents(data.upcomingEvents);
        } else if (contextEvents && contextEvents.length > 0) {
          setUpcomingEvents(contextEvents.slice(0, 4));
        }
        if (data.activeCampaigns && data.activeCampaigns.length > 0) {
          setActiveCampaigns(data.activeCampaigns);
        } else if (contextCampaigns && contextCampaigns.length > 0) {
          setActiveCampaigns(contextCampaigns.slice(0, 6));
        }
      })
      .catch((err) => {
        console.error(err);
        if (contextEvents && contextEvents.length > 0) setUpcomingEvents(contextEvents.slice(0, 4));
        if (contextCampaigns && contextCampaigns.length > 0) setActiveCampaigns(contextCampaigns.slice(0, 6));
      })
      .finally(() => setLoading(false));
  }, [contextEvents, contextCampaigns, contextCreators]);

  const handleLikePost = (postId, e) => {
    e.stopPropagation();
    const isLiked = !!likedPosts[postId];
    setLikedPosts(prev => ({ ...prev, [postId]: !isLiked }));
    setTrendingPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          likes_count: isLiked ? p.likes_count - 1 : p.likes_count + 1
        };
      }
      return p;
    }));

    if (!isLiked) {
      setFloatingLikes(prev => ({ ...prev, [postId]: true }));
      setTimeout(() => {
        setFloatingLikes(prev => ({ ...prev, [postId]: false }));
      }, 1000);

      showToast('Liked post! ❤️', 'success');
      triggerConfetti();
    }
  };

  const handleShare = (post, e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: post.content?.slice(0, 40),
        text: `${post.content} - via CampusBuzz`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      showToast('Post link copied to clipboard! 📋', 'info');
    }
  };

  const spotlightCreator = topCreator || {
    id: 5,
    student_id: "CB-2026-00005",
    full_name: "Shivani Negi",
    creator_category: "Lifestyle",
    followers_count: 184500,
    engagement_rate: "5.70",
    reach_display: "220K Reach",
    college_name: "Shoolini University",
    profile_photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80"
  };

  const chartData = [
    { date: "Oct 25", reach: 18000, engagement: 8200 },
    { date: "Oct 28", reach: 24000, engagement: 11500 },
    { date: "Nov 1", reach: 21000, engagement: 9800 },
    { date: "Nov 3", reach: 17590, engagement: 6309 },
    { date: "Nov 5", reach: 26000, engagement: 13200 },
    { date: "Nov 7", reach: 31000, engagement: 16800 },
    { date: "Nov 9", reach: 28500, engagement: 14100 },
    { date: "Nov 11", reach: 35000, engagement: 18900 },
    { date: "Nov 13", reach: 39000, engagement: 21500 },
    { date: "Nov 15", reach: 34000, engagement: 17800 },
    { date: "Nov 18", reach: 42000, engagement: 23600 },
    { date: "Nov 22", reach: 48000, engagement: 27900 }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 400, damping: 25 } 
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8"
    >
      
      {/* 3. HERO BANNER: Mountain campus sunset background */}
      <motion.div 
        variants={itemVariants}
        className="relative rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(168,85,247,0.15)] group"
      >
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105 cursor-pointer"
          onClick={() => setDashboardTab('feed')}
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80')`
          }}
        />
        {/* Dark gradient overlay & neon lighting */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#08090D] via-[#08090D]/85 to-[#08090D]/40 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090D] via-transparent to-purple-900/20 pointer-events-none" />
        
        {/* Floating particles effect */}
        <div className="absolute top-4 right-12 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-4 right-1/4 w-40 h-40 bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative p-6 sm:p-10 lg:p-12 z-10 max-w-3xl">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => showToast(`10,200 Students Connected across 6 Collegiate Chapters ✨`, 'info')}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-mono font-semibold mb-4 backdrop-blur-md cursor-pointer hover:bg-purple-500/30 transition"
            title="Click to check network status"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>COLLEGIATE CREATOR & INFLUENCER MANAGEMENT PLATFORM</span>
          </motion.div>

          <h1 
            onClick={() => setDashboardTab('overview')}
            className="text-3xl sm:text-5xl font-black font-display text-white tracking-tight leading-tight cursor-pointer hover:opacity-90 transition"
          >
            Campus<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300">Buzz</span>
          </h1>

          <p 
            onClick={() => setDashboardTab('creators')}
            className="text-lg sm:text-xl font-bold text-slate-200 mt-2 font-display cursor-pointer hover:text-purple-300 transition"
          >
            College Influencer & Creator Management Platform
          </p>

          <p 
            onClick={() => setDashboardTab('feed')}
            className="text-sm sm:text-base text-slate-300 mt-1 font-medium text-purple-200/90 cursor-pointer hover:text-white transition"
          >
            Promote Events • Showcase Your Talent • Be a Campus Star!
          </p>

          <p className="text-xs sm:text-sm text-slate-400 mt-3 leading-relaxed max-w-xl">
            Discover 10,000+ verified student creators, manage 15 active brand campaigns, register for 20+ post-Dec 10 upcoming events, and transform collegiate networks into high-impact digital stars.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              onClick={() => setDashboardTab('events')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-[0_0_25px_rgba(168,85,247,0.4)] cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Explore Events</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              onClick={() => setDashboardTab('creators')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 text-white font-bold text-xs backdrop-blur-md cursor-pointer"
            >
              <Users className="w-4 h-4 text-purple-300" />
              <span>Explore Creators</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* 4. STATISTICS CARDS: 5 database-driven cards (All Clickable) */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
      >
        
        {/* Card 1: 10,200+ Total Students */}
        <motion.div 
          whileHover={{ y: -5, scale: 1.015 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setDashboardTab('creators')}
          className="glass-panel p-5 rounded-2xl relative group hover:border-purple-500/50 transition-colors cursor-pointer"
          title="Click to view all 10,200 Students"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold group-hover:text-purple-300 transition">
              <Users className="w-4 h-4 text-purple-400" />
              <span>Total Students</span>
            </div>
            <Sparkline points={[9200, 9500, 9800, 10050, 10120, 10180, 10200]} color="#a855f7" />
          </div>
          <div className="text-3xl font-black font-display text-white tracking-tight group-hover:text-purple-200 transition">
            10,200+
          </div>
          <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_#a855f7]" />
            {(dbStats.totalStudents || 10200).toLocaleString()} Verified profiles
          </p>
        </motion.div>

        {/* Card 2: 1,000+ Active Creators */}
        <motion.div 
          whileHover={{ y: -5, scale: 1.015 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setDashboardTab('creators')}
          className="glass-panel p-5 rounded-2xl relative group hover:border-pink-500/50 transition-colors cursor-pointer"
          title="Click to explore active verified creators"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold group-hover:text-pink-300 transition">
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span>Total Creators</span>
            </div>
            <Sparkline points={[620, 710, 800, 890, 940, 990, 1020]} color="#ec4899" />
          </div>
          <div className="text-3xl font-black font-display text-white tracking-tight group-hover:text-pink-200 transition">
            1,000+
          </div>
          <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-500 shadow-[0_0_8px_#ec4899]" />
            {(dbStats.totalCreators || 3724).toLocaleString()} Creator network
          </p>
        </motion.div>

        {/* Card 3: 20+ Upcoming Events */}
        <motion.div 
          whileHover={{ y: -5, scale: 1.015 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setDashboardTab('events')}
          className="glass-panel p-5 rounded-2xl relative group hover:border-cyan-500/50 transition-colors cursor-pointer"
          title="Click to view 20+ events scheduled post-Dec 10, 2026"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold group-hover:text-cyan-300 transition">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>Upcoming Events</span>
            </div>
            <Sparkline points={[12, 14, 16, 18, 19, 20, 20]} color="#00f0ff" />
          </div>
          <div className="text-3xl font-black font-display text-white tracking-tight group-hover:text-cyan-200 transition">
            20+
          </div>
          <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff]" />
            Post-Dec 10, 2026 scheduled
          </p>
        </motion.div>

        {/* Card 4: 15+ Active Campaigns */}
        <motion.div 
          whileHover={{ y: -5, scale: 1.015 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setDashboardTab('campaigns')}
          className="glass-panel p-5 rounded-2xl relative group hover:border-amber-500/50 transition-colors cursor-pointer"
          title="Click to view 15 brand sponsorships"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold group-hover:text-amber-300 transition">
              <Megaphone className="w-4 h-4 text-amber-400" />
              <span>Active Campaigns</span>
            </div>
            <Sparkline points={[4, 6, 9, 11, 13, 14, 15]} color="#f59e0b" />
          </div>
          <div className="text-3xl font-black font-display text-white tracking-tight group-hover:text-amber-200 transition">
            15+
          </div>
          <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
            Open brand sponsorships
          </p>
        </motion.div>

        {/* Card 5: 48+ Total Clubs */}
        <motion.div 
          whileHover={{ y: -5, scale: 1.015 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setDashboardTab('clubs')}
          className="glass-panel p-5 rounded-2xl relative group hover:border-emerald-500/50 transition-colors cursor-pointer sm:col-span-2 lg:col-span-1"
          title="Click to explore campus student clubs"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold group-hover:text-emerald-300 transition">
              <Users2 className="w-4 h-4 text-emerald-400" />
              <span>Total Clubs</span>
            </div>
            <Sparkline points={[18, 24, 31, 38, 42, 45, 48]} color="#10b981" />
          </div>
          <div className="text-3xl font-black font-display text-white tracking-tight group-hover:text-emerald-200 transition">
            48+
          </div>
          <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
            Active student societies
          </p>
        </motion.div>

      </motion.div>

      {/* Row 2: Performance (Engagement Overview Chart) & Creator Spotlight */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Engagement Overview Chart (2/3 width) */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-2 glass-panel p-6 rounded-2xl flex flex-col justify-between"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <div 
                onClick={() => setDashboardTab('analytics')}
                className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-slate-400 cursor-pointer hover:text-purple-300 transition"
              >
                <Activity className="w-3.5 h-3.5 text-purple-400" />
                <span>PERFORMANCE</span>
              </div>
              <h2 
                onClick={() => setDashboardTab('analytics')}
                className="text-xl font-bold text-white font-display mt-0.5 cursor-pointer hover:text-purple-200 transition"
              >
                Engagement overview
              </h2>
            </div>
          </div>

          <EngagementChart data={chartData} />
        </motion.div>

        {/* 6. TOP CREATOR OF THE MONTH (1/3 width, All Clickable) */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -5, scale: 1.015 }}
          className="glass-panel rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between group"
        >
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-purple-600/25 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <span 
                onClick={() => setDashboardTab('leaderboard')}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono uppercase font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 cursor-pointer hover:bg-purple-500/30 transition"
              >
                <Sparkles className="w-3 h-3 text-purple-400" />
                CREATOR SPOTLIGHT
              </span>
              <motion.button 
                whileHover={{ scale: 1.2, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleOpenCreator(spotlightCreator)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
                title="View full creator profile"
              >
                <ArrowUpRight className="w-4 h-4" />
              </motion.button>
            </div>

            <div 
              onClick={() => handleOpenCreator(spotlightCreator)}
              className="relative rounded-2xl overflow-hidden aspect-[4/3] mb-4 group-hover:scale-[1.02] transition-transform duration-300 cursor-pointer"
              title="Click to view creator profile"
            >
              <img
                src={spotlightCreator.profile_photo || spotlightCreator.avatar_url}
                alt={spotlightCreator.full_name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#08090D] via-transparent to-transparent opacity-85" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                <span className="px-2.5 py-1 rounded-md bg-purple-950/80 border border-purple-500/40 text-purple-200 text-[10px] font-semibold backdrop-blur-sm">
                  ★ TOP CREATOR OF THE MONTH
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold">
                  {spotlightCreator.reach_display || "12.5K Reach"}
                </span>
              </div>
            </div>

            <h3 
              onClick={() => handleOpenCreator(spotlightCreator)}
              className="text-xl font-extrabold text-white font-display cursor-pointer hover:text-purple-300 transition"
            >
              {spotlightCreator.full_name || "Shivani Negi"}
            </h3>
            <p 
              onClick={() => setDashboardTab('creators')}
              className="text-xs text-slate-300 mt-1 font-medium cursor-pointer hover:text-white transition"
            >
              {spotlightCreator.creator_category || "Art & Animation"} • {spotlightCreator.college_name || "Shoolini University"}
            </p>
            <div 
              onClick={() => setDashboardTab('leaderboard')}
              className="flex items-center gap-4 mt-3 text-xs font-mono cursor-pointer p-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] transition"
              title="Click to open leaderboard"
            >
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Followers</span>
                <span className="font-bold text-white">{((spotlightCreator.followers_count || 18400) / 1000).toFixed(1)}K</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Eng. Rate</span>
                <span className="font-bold text-pink-400">{spotlightCreator.engagement_rate || "4.92"}%</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Rank</span>
                <span className="font-bold text-emerald-400">#1 on Campus</span>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setDashboardTab('leaderboard')}
            className="mt-6 w-full py-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 hover:border-purple-500/50 text-xs font-semibold text-purple-200 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>View Leaderboard</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </motion.button>
        </motion.div>

      </div>

      {/* Row 3: 7. INFLUENCER MATCH SCORE & 10. QUICK ACTION LINKS (All Clickable) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 7. INFLUENCER MATCH SCORE */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-2 rounded-2xl bg-gradient-to-r from-purple-900/60 via-indigo-900/50 to-[#0d101d] border border-purple-500/40 p-6 sm:p-7 relative overflow-hidden shadow-[0_0_40px_rgba(168,85,247,0.15)] flex flex-col justify-between group"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
            <div className="flex items-start gap-4">
              {/* Interactive Glowing AI Orb */}
              <AiOrb size="lg" onClick={() => setMatchScoreModalOpen(true)} />

              <div>
                <div 
                  onClick={() => setMatchScoreModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono uppercase font-bold bg-purple-500/20 text-purple-200 border border-purple-500/30 mb-2 cursor-pointer hover:bg-purple-500/30 transition"
                >
                  <Sparkles className="w-3 h-3 text-purple-300" />
                  <span>AI MATCH ENGINE • ACTIVE</span>
                </div>
                <h3 
                  onClick={() => setMatchScoreModalOpen(true)}
                  className="text-xl sm:text-2xl font-black font-display text-white cursor-pointer hover:text-purple-300 transition"
                >
                  Influencer Match Score
                </h3>
                <p 
                  onClick={() => setMatchScoreModalOpen(true)}
                  className="text-xs sm:text-sm text-purple-200/90 mt-1 font-medium cursor-pointer hover:text-white transition"
                >
                  “Find the best creators for your campaign!”
                </p>
              </div>
            </div>

            <div 
              onClick={() => setMatchScoreModalOpen(true)}
              className="flex items-center gap-3 bg-purple-950/60 border border-purple-500/40 px-4 py-2.5 rounded-2xl backdrop-blur-md self-start sm:self-auto cursor-pointer hover:border-purple-400 transition"
              title="Click to view algorithmic score details"
            >
              <span className="text-3xl sm:text-4xl font-black font-display text-white">92</span>
              <div className="text-left">
                <span className="text-xs font-mono font-bold text-purple-300 block">/ 100</span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">Optimal Match</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-2">
            <motion.div 
              whileHover={{ y: -3, scale: 1.02 }}
              onClick={() => setMatchScoreModalOpen(true)}
              className="flex items-center gap-2 p-3 rounded-xl bg-black/30 border border-white/5 cursor-pointer hover:border-purple-500/40 transition"
              title="Click to view engagement criteria"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <div className="text-left">
                <span className="text-xs font-bold text-white block">High Engagement</span>
                <span className="text-[10px] text-slate-400">4.92% avg across campus</span>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -3, scale: 1.02 }}
              onClick={() => setMatchScoreModalOpen(true)}
              className="flex items-center gap-2 p-3 rounded-xl bg-black/30 border border-white/5 cursor-pointer hover:border-purple-500/40 transition"
              title="Click to view niche categories"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <div className="text-left">
                <span className="text-xs font-bold text-white block">Relevant Category</span>
                <span className="text-[10px] text-slate-400">Media, Tech & Lifestyle</span>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -3, scale: 1.02 }}
              onClick={() => setMatchScoreModalOpen(true)}
              className="flex items-center gap-2 p-3 rounded-xl bg-black/30 border border-white/5 cursor-pointer hover:border-purple-500/40 transition"
              title="Click to view follower tier requirements"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <div className="text-left">
                <span className="text-xs font-bold text-white block">Strong Follower Base</span>
                <span className="text-[10px] text-slate-400">18.4K verified students</span>
              </div>
            </motion.div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 pt-3 border-t border-white/10">
            <p className="text-[11px] text-purple-200/80">
              Interactive AI model ranking 10,200+ students with instant brand pitch alignment.
            </p>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMatchScoreModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-white text-purple-950 font-extrabold text-xs hover:bg-purple-100 transition shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center justify-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <span>Get Suggestions</span>
              <ArrowUpRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>

        {/* 10. QUICK LINKS (All Clickable) */}
        <motion.div 
          variants={itemVariants}
          className="glass-panel p-6 rounded-2xl flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-2">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>QUICK ACTIONS</span>
            </div>
            <h3 className="text-lg font-bold text-white font-display">
              Quick Links
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Instant shortcuts to creator tools
            </p>
          </div>

          <div className="space-y-2.5 my-4">
            <motion.button
              whileHover={{ x: 4, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setDashboardTab('feed')}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-white/[0.03] hover:bg-purple-600/20 border border-white/5 hover:border-purple-500/40 text-left transition group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-300">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white group-hover:text-purple-300 block">Create Post</span>
                  <span className="text-[10px] text-slate-400">Share campus updates & media</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-0.5 transition" />
            </motion.button>

            <motion.button
              whileHover={{ x: 4, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setDashboardTab('events')}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-white/[0.03] hover:bg-cyan-600/20 border border-white/5 hover:border-cyan-500/40 text-left transition group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-300">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white group-hover:text-cyan-300 block">Register for Event</span>
                  <span className="text-[10px] text-slate-400">20+ events after Dec 10, 2026</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition" />
            </motion.button>

            <motion.button
              whileHover={{ x: 4, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setDashboardTab('analytics')}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-white/[0.03] hover:bg-pink-600/20 border border-white/5 hover:border-pink-500/40 text-left transition group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center text-pink-300">
                  <BarChart2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white group-hover:text-pink-300 block">View Analytics</span>
                  <span className="text-[10px] text-slate-400">Deep engagement metrics</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-pink-400 group-hover:translate-x-0.5 transition" />
            </motion.button>

            <motion.button
              whileHover={{ x: 4, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setDashboardTab('collaborations')}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-white/[0.03] hover:bg-amber-600/20 border border-white/5 hover:border-amber-500/40 text-left transition group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-300">
                  <Megaphone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white group-hover:text-amber-300 block">My Collaborations</span>
                  <span className="text-[10px] text-slate-400">Campaign pitches & sponsorships</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition" />
            </motion.button>
          </div>

          <div className="text-[10px] text-slate-500 font-mono">
            Direct routing to all CampusBuzz subsystems
          </div>
        </motion.div>

      </div>

      {/* 5. TRENDING CONTENT: 3-4 content cards (All Clickable) */}
      <motion.div 
        variants={itemVariants}
        className="glass-panel p-6 sm:p-7 rounded-2xl"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-white/[0.06]">
          <div>
            <div 
              onClick={() => setDashboardTab('feed')}
              className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-slate-400 cursor-pointer hover:text-pink-300 transition"
            >
              <Flame className="w-3.5 h-3.5 text-pink-400" />
              <span>COLLEGE SOCIAL FEED</span>
            </div>
            <h2 
              onClick={() => setDashboardTab('feed')}
              className="text-xl font-bold text-white font-display mt-0.5 cursor-pointer hover:text-purple-200 transition"
            >
              Trending Content
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live viral posts across campus creators from our 5,200+ post dataset
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setDashboardTab('feed')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-purple-300 hover:text-white transition cursor-pointer"
          >
            <span>View All (5,200+ Posts)</span>
            <ArrowUpRight className="w-4 h-4" />
          </motion.button>
        </div>

        {/* 3-4 Trending Content Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {trendingPosts.slice(0, 4).map((post) => {
            const isLiked = !!likedPosts[post.id];
            const isFloating = !!floatingLikes[post.id];

            const authorCreatorObj = {
              id: post.author_id,
              name: post.author_name,
              full_name: post.author_name,
              avatar_url: post.author_avatar,
              profile_photo: post.author_avatar,
              college: post.author_college,
              college_name: post.author_college,
              category: 'Student Creator',
              followers: 14500,
              engagement_rate: 4.8,
              rating: 4.90
            };

            return (
              <motion.div
                key={post.id}
                whileHover={{ y: -5, scale: 1.015 }}
                className="rounded-2xl bg-[#0c0e17] border border-white/[0.08] hover:border-purple-500/40 overflow-hidden flex flex-col justify-between transition-colors group relative"
              >
                <div>
                  {/* Post Image (Clickable) */}
                  <div 
                    onClick={() => setDashboardTab('feed')}
                    className="relative aspect-video overflow-hidden cursor-pointer"
                    title="Click to view full post in feed"
                  >
                    <img
                      src={post.media_url || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80'}
                      alt={post.content}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c0e17] via-transparent to-transparent opacity-80" />
                    
                    {/* Post type badge */}
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[9px] font-mono text-purple-300 uppercase font-semibold">
                      {post.post_type || 'image'}
                    </span>
                  </div>

                  {/* Author Header (Clickable -> Opens Creator Profile Modal) */}
                  <div className="p-4 pb-2">
                    <div 
                      onClick={() => setSelectedCreatorForModal(authorCreatorObj)}
                      className="flex items-center gap-2.5 mb-2.5 cursor-pointer group/author"
                      title="Click to view author creator profile"
                    >
                      <img
                        src={post.author_avatar || `https://randomuser.me/api/portraits/women/${(post.id || 1) % 100}.jpg`}
                        alt={post.author_name}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-purple-500/30 group-hover/author:ring-purple-400 transition"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white group-hover/author:text-purple-300 transition truncate">
                          {post.author_name}
                        </h4>
                        <p className="text-[10px] text-slate-400 truncate">{post.author_college} • Just now</p>
                      </div>
                    </div>

                    {/* Post Content (Clickable) */}
                    <p 
                      onClick={() => setDashboardTab('feed')}
                      className="text-xs text-slate-200 line-clamp-2 leading-relaxed cursor-pointer hover:text-white transition"
                    >
                      {post.content}
                    </p>

                    {/* Hashtags (Clickable) */}
                    {post.hashtags && (
                      <p 
                        onClick={() => setDashboardTab('feed')}
                        className="text-[11px] font-mono text-purple-400 mt-2 truncate cursor-pointer hover:underline"
                      >
                        {post.hashtags}
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Action Buttons (Clickable Like, Comment, Share, View Post) */}
                <div className="p-4 pt-2 border-t border-white/[0.04] mt-2 relative">
                  
                  {/* Floating +1 Heart micro-animation */}
                  <AnimatePresence>
                    {isFloating && (
                      <motion.div
                        initial={{ opacity: 1, y: 0, scale: 0.8 }}
                        animate={{ opacity: 0, y: -30, scale: 1.4 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="absolute left-6 bottom-12 pointer-events-none text-pink-400 font-bold text-sm drop-shadow-[0_0_8px_#ec4899] flex items-center gap-1 z-30"
                      >
                        <span>+1</span>
                        <span>❤️</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2.5">
                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.85 }}
                      onClick={(e) => handleLikePost(post.id, e)}
                      className={`flex items-center gap-1.5 transition cursor-pointer ${isLiked ? 'text-pink-400 font-bold' : 'hover:text-pink-400'}`}
                      title="Like this post"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-pink-400 text-pink-400' : ''}`} />
                      <span>{post.likes_count}</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setDashboardTab('feed')}
                      className="flex items-center gap-1.5 hover:text-purple-300 transition cursor-pointer"
                      title="Comment on post"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{post.comments_count}</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => handleShare(post, e)}
                      className="flex items-center gap-1.5 hover:text-white transition cursor-pointer"
                      title="Share post link"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share</span>
                    </motion.button>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setDashboardTab('feed')}
                    className="w-full py-1.5 rounded-lg bg-white/[0.04] hover:bg-purple-600/20 border border-white/5 hover:border-purple-500/30 text-[11px] font-semibold text-slate-300 hover:text-purple-300 transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>View Post</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Row 5: Top Creators Ranking Table & Upcoming Events (All Clickable) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Creator Rankings Table (2/3 width) */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-2 glass-panel p-6 rounded-2xl flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/[0.04]">
              <div>
                <p 
                  onClick={() => setDashboardTab('creators')}
                  className="text-[10px] font-mono uppercase tracking-widest text-slate-400 cursor-pointer hover:text-purple-300 transition"
                >
                  CREATOR RANKINGS
                </p>
                <h2 
                  onClick={() => setDashboardTab('creators')}
                  className="text-lg font-bold text-white font-display cursor-pointer hover:text-purple-200 transition"
                >
                  Top creators
                </h2>
              </div>
              <motion.button
                whileHover={{ x: 3 }}
                onClick={() => setDashboardTab('creators')}
                className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 transition cursor-pointer"
              >
                <span>View all →</span>
              </motion.button>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-12 text-[10px] font-mono uppercase text-slate-500 pb-2 px-3 border-b border-white/[0.04]">
              <span className="col-span-1">#</span>
              <span className="col-span-5">CREATOR</span>
              <span className="col-span-2 text-right">FOLLOWERS</span>
              <span className="col-span-2 text-right">ENG. RATE</span>
              <span className="col-span-2 text-right">PROFILE</span>
            </div>

            {/* Table Rows (Clickable with side View Button) */}
            <div className="divide-y divide-white/[0.03]">
              {trendingCreators.slice(0, 5).map((creator, i) => (
                <motion.div
                  key={creator.id}
                  whileHover={{ x: 4, backgroundColor: 'rgba(255,255,255,0.05)' }}
                  onClick={() => handleOpenCreator(creator)}
                  className="grid grid-cols-12 items-center py-3 px-3 rounded-xl transition cursor-pointer group"
                  title="Click to view creator details & posts"
                >
                  <span className="col-span-1 font-mono text-xs text-slate-500 font-bold">
                    0{i + 1}
                  </span>

                  <div className="col-span-5 flex items-center gap-3 min-w-0">
                    <img
                      src={creator.profile_photo || creator.avatar_url}
                      alt={creator.full_name || creator.name}
                      className="w-9 h-9 rounded-full object-cover ring-1 ring-purple-500/30 group-hover:ring-purple-500 transition flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white group-hover:text-purple-300 transition truncate">
                        {creator.full_name || creator.name}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {creator.college_name || creator.college || creator.creator_category || creator.category}
                      </p>
                    </div>
                  </div>

                  <div className="col-span-2 text-right">
                    <span className="text-xs font-mono font-bold text-slate-200">
                      {(((creator.followers_count || creator.followers) || 10000) / 1000).toFixed(1)}K
                    </span>
                  </div>

                  <div className="col-span-2 text-right">
                    <span className="text-xs font-mono font-bold text-pink-400">
                      {creator.engagement_rate || '4.50'}%
                    </span>
                  </div>

                  <div className="col-span-2 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenCreator(creator);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-600/20 hover:bg-purple-600 text-[10px] font-bold text-purple-200 hover:text-white border border-purple-500/35 transition shadow-sm cursor-pointer"
                      title="View Profile Details"
                    >
                      <Eye className="w-3 h-3 text-purple-300" />
                      <span>View</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div 
            onClick={() => setDashboardTab('leaderboard')}
            className="pt-3 mt-2 border-t border-white/[0.04] text-[11px] text-slate-500 font-mono cursor-pointer hover:text-purple-400 transition"
          >
            Ranks computed by follower tier, engagement consistency, and verified student posts • Click to view full Leaderboard
          </div>
        </motion.div>

        {/* 8. ON THE CALENDAR / UPCOMING EVENTS (1/3 width, post-Dec 10, 2026, All Clickable) */}
        <motion.div 
          variants={itemVariants}
          className="glass-panel p-6 rounded-2xl flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/[0.04]">
              <div>
                <p 
                  onClick={() => setDashboardTab('events')}
                  className="text-[10px] font-mono uppercase tracking-widest text-slate-400 cursor-pointer hover:text-purple-300 transition"
                >
                  ON THE CALENDAR (POST-DEC 10, 2026)
                </p>
                <h2 
                  onClick={() => setDashboardTab('events')}
                  className="text-lg font-bold text-white font-display cursor-pointer hover:text-purple-200 transition"
                >
                  Upcoming events
                </h2>
              </div>
              
              <div className="flex items-center gap-2">
                {/* View toggle */}
                <div className="flex items-center gap-1 bg-[#12141c] border border-white/10 rounded-lg p-0.5">
                  <button
                    onClick={() => setCalendarViewMode('list')}
                    className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold transition cursor-pointer ${
                      calendarViewMode === 'list' 
                        ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    List
                  </button>
                  <button
                    onClick={() => setCalendarViewMode('calendar')}
                    className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold transition cursor-pointer ${
                      calendarViewMode === 'calendar' 
                        ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Calendar
                  </button>
                </div>

                <motion.button
                  whileHover={{ x: 3 }}
                  onClick={() => setDashboardTab('events')}
                  className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 transition cursor-pointer"
                >
                  <span>View all →</span>
                </motion.button>
              </div>
            </div>

            {/* List or Calendar View */}
            {calendarViewMode === 'calendar' ? (
              <div className="space-y-2">
                <InteractiveCalendar 
                  events={upcomingEvents} 
                  isCompact={true}
                  className="border-0 bg-transparent p-0 shadow-none"
                />
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingEvents.slice(0, 4).map((ev) => {
                  const dateObj = new Date(ev.event_date);
                  const dayStr = dateObj.toLocaleDateString('en-US', { day: '2-digit' });
                  const monthStr = dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();

                  return (
                    <motion.div
                      key={ev.id}
                      whileHover={{ x: 4, scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setDashboardTab('events')}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.04] transition group cursor-pointer"
                      title="Click to register for this event"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-[#141824] border border-white/10 flex flex-col items-center justify-center flex-shrink-0 group-hover:border-purple-500/50 transition">
                          <span className="text-[9px] uppercase font-mono text-purple-400 font-bold">{monthStr}</span>
                          <span className="text-base font-bold font-display text-white leading-tight">{dayStr}</span>
                        </div>

                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-white group-hover:text-purple-300 transition truncate">
                            {ev.name}
                          </h4>
                          <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                            <MapPin className="w-2.5 h-2.5 text-cyan-400 flex-shrink-0" />
                            <span className="truncate">{ev.venue}</span>
                          </p>
                        </div>
                      </div>

                      <div className="p-1.5 rounded-lg bg-white/5 group-hover:bg-purple-600/30 text-slate-400 group-hover:text-white transition flex-shrink-0 ml-2">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setDashboardTab('events')}
            className="mt-4 w-full py-2 rounded-xl bg-white/[0.03] hover:bg-purple-600/20 border border-white/10 text-xs font-bold text-slate-300 hover:text-purple-300 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Open Interactive Calendar (20 Events)</span>
          </motion.button>
        </motion.div>

      </div>

      {/* 9. ACTIVE CAMPAIGNS: 10 to 15 campaigns (All Clickable) */}
      <motion.div 
        variants={itemVariants}
        className="glass-panel p-6 sm:p-7 rounded-2xl"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-white/[0.06]">
          <div>
            <div 
              onClick={() => setDashboardTab('campaigns')}
              className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-slate-400 cursor-pointer hover:text-amber-300 transition"
            >
              <Megaphone className="w-3.5 h-3.5 text-amber-400" />
              <span>BRAND COLLABORATIONS</span>
            </div>
            <h2 
              onClick={() => setDashboardTab('campaigns')}
              className="text-xl font-bold text-white font-display mt-0.5 cursor-pointer hover:text-purple-200 transition"
            >
              Active Campaigns
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              15 active campaigns open for students with verified budgets & creator rewards
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setDashboardTab('campaigns')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white transition shadow-[0_0_15px_rgba(168,85,247,0.3)] cursor-pointer"
          >
            <span>View All 15 Campaigns</span>
            <ArrowUpRight className="w-4 h-4" />
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {activeCampaigns.slice(0, 6).map((camp) => (
            <motion.div
              key={camp.id}
              whileHover={{ y: -5, scale: 1.015 }}
              onClick={() => setDashboardTab('campaigns')}
              className="rounded-2xl bg-[#0c0e17] border border-white/[0.08] hover:border-purple-500/40 p-5 flex flex-col justify-between transition-colors group cursor-pointer"
              title="Click to view campaign & apply"
            >
              <div>
                <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
                  <img
                    src={camp.image_url}
                    alt={camp.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c0e17] via-transparent to-transparent opacity-80" />
                  
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white">
                    {camp.brand_name}
                  </span>

                  <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold">
                    ₹{(parseFloat(camp.budget) / 1000).toFixed(0)}K Budget
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition line-clamp-1">
                  {camp.name}
                </h4>

                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {camp.description}
                </p>

                <div className="flex items-center gap-2 mt-3 text-[11px] font-mono text-purple-300">
                  <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">
                    {camp.required_category || 'All Categories'}
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400">{camp.applicants_count} applicants</span>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-white/[0.05] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Reward</span>
                  <span className="text-xs font-bold text-amber-400 line-clamp-1">{camp.rewards?.split('+')[0] || '₹25,000'}</span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setDashboardTab('campaigns');
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-purple-600 text-slate-200 hover:text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <span>Apply</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

    </motion.div>
  );
}
