import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import ThreeCanvas from '../components/ThreeCanvas';
import TiltCard from '../components/TiltCard';
import StatCounter from '../components/StatCounter';
import { 
  Sparkles, 
  ArrowRight, 
  Users, 
  Rocket, 
  GraduationCap, 
  Flame, 
  Instagram, 
  Youtube, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  BarChart3, 
  TrendingUp, 
  Radio, 
  Star,
  Award,
  Calendar,
  Megaphone,
  Compass,
  Trophy,
  ArrowUpRight,
  ChevronRight,
  Heart,
  MessageSquare,
  Play
} from 'lucide-react';

export default function LandingPage() {
  const { 
    setCurrentView, 
    setDashboardTab, 
    setIsAuthOpen, 
    setAuthMode, 
    creators,
    events,
    campaigns,
    openDetailDrawer,
    showToast,
    theme
  } = useApp();

  // Active story panel index for Novu-inspired pinned storytelling section
  const [activeStoryPanel, setActiveStoryPanel] = useState(0);

  const handleJoinBuzz = () => {
    setCurrentView('dashboard');
    setDashboardTab('overview');
  };

  const handleExploreFeed = () => {
    setCurrentView('dashboard');
    setDashboardTab('feed');
  };

  const handleOpenEvents = () => {
    setCurrentView('dashboard');
    setDashboardTab('events');
  };

  const handleOpenCampaigns = () => {
    setCurrentView('dashboard');
    setDashboardTab('campaigns');
  };

  const handleOpenCreators = () => {
    setCurrentView('dashboard');
    setDashboardTab('creators');
  };

  // Story Panels Definition
  const storyPanels = [
    {
      id: "01",
      badge: "DISCOVER YOUR CAMPUS",
      title: "Explore Events, Trending Discussions & Student Culture",
      description: "Step into an unfiltered feed of what is happening across university campuses nationwide. From midnight hackathons to cultural battle of the bands, stay plugged into the real heartbeat of collegiate life.",
      highlights: [
        "Live interactive collegiate event radar",
        "Student-exclusive community discussions",
        "Campus clubs and society hubs in one place"
      ],
      tag: "Community Pulse",
      gradient: "from-purple-600/30 via-indigo-600/20 to-transparent",
      accentColor: "text-purple-400",
      borderColor: "border-purple-500/30",
      mockupType: "feed"
    },
    {
      id: "02",
      badge: "BECOME A CREATOR",
      title: "Build Your Verified Portfolio, Partner With Brands & Monetize",
      description: "Turn your campus creativity into industry influence. Unlock official student creator passes, connect your Instagram and YouTube metrics, and land paid sponsorships from top tier brands looking for authentic collegiate voices.",
      highlights: [
        "Verified student creator credential with CB-ID",
        "Direct brand sponsorships with guaranteed UPI payouts",
        "Transparent engagement analytics & portfolio showcases"
      ],
      tag: "Creator Monetization",
      gradient: "from-pink-600/30 via-purple-600/20 to-transparent",
      accentColor: "text-pink-400",
      borderColor: "border-pink-500/30",
      mockupType: "creator"
    },
    {
      id: "03",
      badge: "MAKE THINGS HAPPEN",
      title: "Host Campus Fests, Launch Activations & Lead Communities",
      description: "Whether you are running an esports championship, distributing student film festival passes, or launching an all-campus influencer challenge, CampusBuzz gives you the digital infrastructure to lead with impact.",
      highlights: [
        "Automated event registration with QR check-ins",
        "Live attendee velocity and audience metrics",
        "Escrow-protected campus campaigns and brand briefs"
      ],
      tag: "Campus Leadership",
      gradient: "from-cyan-600/30 via-blue-600/20 to-transparent",
      accentColor: "text-cyan-400",
      borderColor: "border-cyan-500/30",
      mockupType: "campaign"
    }
  ];

  // Brand partners
  const brandLogos = [
    { name: "Red Bull India", tag: "Energy Partner", logoText: "RED BULL" },
    { name: "Spotify Campus", tag: "Audio Sponsor", logoText: "SPOTIFY" },
    { name: "Notion Fellowship", tag: "Productivity AI", logoText: "NOTION" },
    { name: "OnePlus Pioneer", tag: "Mobile Tech", logoText: "ONEPLUS" },
    { name: "Myntra Glam", tag: "Fashion Brand", logoText: "MYNTRA" },
    { name: "Google Cloud", tag: "Dev Partner", logoText: "GOOGLE" }
  ];

  const featuredCreators = creators.slice(0, 3);

  return (
    <div className="relative min-h-screen bg-[#08090D] overflow-hidden text-slate-200">
      
      {/* 3D Interactive Three.js Background Canvas */}
      <ThreeCanvas className="opacity-75" />

      {/* Cyber Grid Overlay */}
      <div className="absolute inset-0 cyber-grid pointer-events-none opacity-40 z-0" />

      {/* Ambient Radial Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[550px] bg-purple-600/15 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute top-2/3 right-10 w-[550px] h-[450px] bg-pink-600/10 rounded-full blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-10 left-10 w-[450px] h-[350px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* ==================================================================== */}
      {/* 1. HERO SECTION                                                      */}
      {/* ==================================================================== */}
      <section className="relative z-10 pt-20 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        
        {/* Futuristic Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#141724]/90 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-8 backdrop-blur-md shadow-[0_0_20px_rgba(168,85,247,0.25)] animate-pulse-glow">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="tracking-wide">CAMPUSBUZZ®️ • STUDENT CREATOR & CAMPUS MANAGEMENT PLATFORM</span>
          <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
          <span className="text-pink-400 font-mono">2026 EDITION</span>
        </div>

        {/* Large Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-display tracking-tight text-white max-w-5xl leading-[1.06] drop-shadow-2xl">
          YOUR CAMPUS. <br className="hidden sm:block" />
          YOUR COMMUNITY. <br className="hidden sm:block" />
          <span className="gradient-text-purple">YOUR BUZZ.</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-3xl font-normal leading-relaxed drop-shadow">
          One unified ecosystem for university students, campus creators, collegiate societies, and industry brands to connect, create, and collaborate.
        </p>

        {/* Primary & Secondary Call to Actions */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          <button
            onClick={handleJoinBuzz}
            className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white font-bold text-sm sm:text-base tracking-wide shadow-[0_0_35px_rgba(168,85,247,0.45)] hover:shadow-[0_0_50px_rgba(168,85,247,0.7)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-3 overflow-hidden cursor-pointer"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-200 fill-purple-200" />
              Join the Buzz
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          <button
            onClick={handleExploreFeed}
            className="px-8 py-4 rounded-2xl bg-[#121520]/80 hover:bg-[#1a1e2c] border border-white/15 text-slate-200 hover:text-white font-semibold text-sm sm:text-base tracking-wide backdrop-blur-md shadow-lg hover:border-purple-500/50 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 cursor-pointer"
          >
            <Compass className="w-4 h-4 text-purple-400" />
            <span>Explore Feed</span>
          </button>
        </div>

        {/* Floating Featured Creator Spotlight Cards */}
        <div className="mt-16 w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {featuredCreators.map((creator, i) => (
            <TiltCard 
              key={creator.id} 
              glowColor={i === 0 ? "purple" : (i === 1 ? "cyan" : "orange")}
              className="glass-card-interactive p-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img 
                      src={creator.avatar_url} 
                      alt={creator.name} 
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-purple-500/40"
                    />
                    <div className="absolute -bottom-1 -right-1 p-1 bg-[#08090D] rounded-full">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 fill-cyan-400/20" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base leading-tight flex items-center gap-1.5">
                      {creator.name}
                    </h3>
                    <p className="text-xs text-purple-400 font-medium">{creator.category}</p>
                    <p className="text-[11px] text-slate-400 truncate max-w-[150px]">{creator.college}</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  {creator.rating} ★
                </span>
              </div>

              <div className="mt-4 pt-4 border-t border-white/[0.06] grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[11px] text-slate-400 block">Followers</span>
                  <span className="font-bold text-white text-sm font-mono">
                    {creator.followers.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">Engagement</span>
                  <span className="font-bold text-pink-400 text-sm font-mono">
                    {creator.engagement_rate}%
                  </span>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/[0.04]">
                <span className="flex items-center gap-1 text-[11px]">
                  <Instagram className="w-3.5 h-3.5 text-pink-400" /> @{creator.instagram}
                </span>
                <button
                  onClick={() => openDetailDrawer && openDetailDrawer('creator', creator)}
                  className="text-[10px] text-purple-300 hover:text-white font-medium hover:underline cursor-pointer"
                >
                  View Details →
                </button>
              </div>
            </TiltCard>
          ))}
        </div>

      </section>

      {/* ==================================================================== */}
      {/* 2. PLATFORM STATISTICS SECTION WITH COUNT-UP                          */}
      {/* ==================================================================== */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-y border-white/[0.06] bg-[#0c0e17]/50 backdrop-blur-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <StatCounter
            end={10000}
            suffix="+"
            label="Verified Students"
            icon={Users}
            color="purple"
          />
          <StatCounter
            end={20}
            suffix="+"
            label="Upcoming Events"
            icon={Calendar}
            color="cyan"
          />
          <StatCounter
            end={15}
            suffix="+"
            label="Active Campaigns"
            icon={Megaphone}
            color="orange"
          />
          <StatCounter
            end={100}
            suffix="+"
            label="Student Creators"
            icon={Flame}
            color="magenta"
          />
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 3. CAMPUS COMMUNITY STORY (NOVU LONDON INSPIRED PINNED PANELS)        */}
      {/* ==================================================================== */}
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Campus Community Story</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-white tracking-tight leading-tight">
            Designed for the <span className="gradient-text-purple">Modern Collegiate Era</span>
          </h2>
          <p className="mt-4 text-slate-400 text-base sm:text-lg">
            Experience how CampusBuzz unites daily campus buzz, verified creator monetization, and collegiate leadership into one seamless journey.
          </p>
        </div>

        {/* Pinned Story Navigation Tabs (01, 02, 03) */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 rounded-2xl bg-[#121422] border border-white/[0.08] shadow-xl">
            {storyPanels.map((panel, idx) => {
              const isActive = activeStoryPanel === idx;
              return (
                <button
                  key={panel.id}
                  onClick={() => setActiveStoryPanel(idx)}
                  className={`relative px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-mono font-bold tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? 'text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="storyTabHighlight"
                      className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 font-bold">{panel.id}</span>
                  <span className="relative z-10 hidden sm:inline">{panel.badge}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Pinned Story Panel Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStoryPanel}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className={`relative rounded-3xl p-8 sm:p-12 glass-panel border ${storyPanels[activeStoryPanel].borderColor} overflow-hidden shadow-2xl bg-gradient-to-br ${storyPanels[activeStoryPanel].gradient}`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: Narrative Details */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-white/[0.08] text-white border border-white/10">
                    Panel {storyPanels[activeStoryPanel].id}
                  </span>
                  <span className={`text-xs font-mono font-semibold uppercase tracking-wider ${storyPanels[activeStoryPanel].accentColor}`}>
                    {storyPanels[activeStoryPanel].tag}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-4xl font-black font-display text-white tracking-tight leading-tight">
                  {storyPanels[activeStoryPanel].title}
                </h3>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                  {storyPanels[activeStoryPanel].description}
                </p>

                {/* Highlights List */}
                <div className="space-y-3 pt-2">
                  {storyPanels[activeStoryPanel].highlights.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 flex-shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                      </div>
                      <span className="text-xs sm:text-sm text-slate-200">{item}</span>
                    </div>
                  ))}
                </div>

                {/* Contextual CTA */}
                <div className="pt-4 flex items-center gap-4">
                  <button
                    onClick={
                      activeStoryPanel === 0 
                        ? handleExploreFeed 
                        : activeStoryPanel === 1 
                        ? handleOpenCreators 
                        : handleOpenCampaigns
                    }
                    className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs tracking-wide shadow-lg transition flex items-center gap-2 cursor-pointer"
                  >
                    <span>
                      {activeStoryPanel === 0 ? "Open Campus Feed" : activeStoryPanel === 1 ? "Browse 10K+ Creators" : "View Active Campaigns"}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setActiveStoryPanel((activeStoryPanel + 1) % 3)}
                    className="px-4 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white text-xs font-semibold transition"
                  >
                    Next Story Step →
                  </button>
                </div>
              </div>

              {/* Right Column: Interactive Visual Showcase Mockup */}
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl p-6 bg-[#0c0d18]/90 border border-white/10 shadow-2xl backdrop-blur-xl space-y-4">
                  
                  {activeStoryPanel === 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                          <span className="text-xs font-bold text-white">Live Collegiate Feed</span>
                        </div>
                        <span className="text-[10px] font-mono text-purple-300">5,200+ Live</span>
                      </div>

                      <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center font-bold text-xs text-white">
                            AS
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white">Aanya Sharma</div>
                            <div className="text-[10px] text-slate-400">Delhi University • Cultural Secretary</div>
                          </div>
                        </div>
                        <p className="text-xs text-slate-300">
                          "Over 2,800 students registered for Autumn Youth Cultural Fest! Live battle of the bands kicking off at the amphitheatre."
                        </p>
                        <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                          <span className="flex items-center gap-1 text-pink-400"><Heart className="w-3.5 h-3.5 fill-pink-400" /> 342</span>
                          <span className="flex items-center gap-1 text-purple-300"><MessageSquare className="w-3.5 h-3.5" /> 48</span>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/20 text-xs">
                        <span className="text-purple-300 font-bold block mb-1">Trending On Campus:</span>
                        <div className="flex flex-wrap gap-1.5 font-mono text-[10px] text-purple-200">
                          <span className="px-2 py-0.5 rounded bg-purple-600/30">#WinterTechFest</span>
                          <span className="px-2 py-0.5 rounded bg-purple-600/30">#RedBullDance</span>
                          <span className="px-2 py-0.5 rounded bg-purple-600/30">#CampusCreatorPass</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeStoryPanel === 1 && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                        <span className="text-xs font-bold text-white">Collegiate Creator Pass</span>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          VERIFIED CB-2026
                        </span>
                      </div>

                      <div className="p-4 rounded-xl bg-gradient-to-br from-[#1a1b30] to-[#121324] border border-purple-500/30 text-center space-y-2">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-0.5 mx-auto">
                          <img
                            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80"
                            alt="Creator"
                            className="w-full h-full rounded-full object-cover"
                          />
                        </div>
                        <div className="font-bold text-sm text-white">Aanya Sharma</div>
                        <div className="text-[11px] text-purple-300">Niche: Lifestyle & Media • 4.9 ★ Rating</div>
                        
                        <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                          <div className="p-2 rounded-lg bg-black/40">
                            <span className="text-[10px] text-slate-400 block font-mono">Total Reach</span>
                            <span className="font-bold text-white font-mono">15.4K</span>
                          </div>
                          <div className="p-2 rounded-lg bg-black/40">
                            <span className="text-[10px] text-slate-400 block font-mono">Avg Engagement</span>
                            <span className="font-bold text-pink-400 font-mono">4.8%</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs">
                        <span className="text-slate-300">Sponsorship Escrow Balance</span>
                        <span className="font-mono font-bold text-emerald-400">₹35,000 Payout</span>
                      </div>
                    </div>
                  )}

                  {activeStoryPanel === 2 && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                        <span className="text-xs font-bold text-white">Campaign & Event Command</span>
                        <span className="text-[10px] font-mono text-amber-300">Active Escrow</span>
                      </div>

                      <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white">Red Bull Dance Qualifiers</span>
                          <span className="text-emerald-400 font-mono font-bold">₹1,50,000</span>
                        </div>
                        <p className="text-slate-400 text-[11px]">
                          45 Student creator reels submitted. 3.8M campus impressions delivered.
                        </p>
                        <div className="w-full h-2 rounded-full bg-white/[0.08] overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 w-[95%]" />
                        </div>
                        <div className="flex justify-between text-[10px] font-mono text-slate-400">
                          <span>Milestone 3 of 3</span>
                          <span>95% Completed</span>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/20 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-white">Winter Tech Hackathon 2026</div>
                          <div className="text-[10px] text-slate-400">490 / 500 Attendees Checked-in</div>
                        </div>
                        <span className="text-[10px] font-mono font-bold px-2 py-1 rounded bg-cyan-500/20 text-cyan-300">
                          98% FULL
                        </span>
                      </div>
                    </div>
                  )}

                </div>
              </div>

            </div>
          </motion.div>
        </AnimatePresence>

      </section>

      {/* ==================================================================== */}
      {/* 4. BRAND PARTNERS TICKER                                             */}
      {/* ==================================================================== */}
      <section className="relative z-10 py-12 px-4 max-w-7xl mx-auto text-center border-t border-white/[0.06]">
        <p className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-6">
          Empowering Brands & Collegiate Communities Across India
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 opacity-85">
          {brandLogos.map((brand, i) => (
            <div 
              key={i}
              className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-slate-300 hover:text-white hover:border-purple-500/30 transition duration-300"
            >
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              <span className="font-bold text-sm tracking-wide">{brand.name}</span>
              <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">({brand.tag})</span>
            </div>
          ))}
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 5. CALL TO ACTION BANNER                                             */}
      {/* ==================================================================== */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="relative rounded-3xl p-10 sm:p-16 overflow-hidden glass-panel border border-purple-500/30 shadow-[0_0_50px_rgba(168,85,247,0.25)] text-center">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-600/15 rounded-full blur-[100px] pointer-events-none" />

          <h2 className="relative z-10 text-3xl sm:text-5xl font-black font-display text-white tracking-tight">
            Ready to Amplify Your Campus Impact?
          </h2>
          <p className="relative z-10 mt-4 text-slate-300 max-w-2xl mx-auto text-base sm:text-lg">
            Join thousands of student creators, campus brand ambassadors, and collegiate societies scaling their digital influence.
          </p>

          <div className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => {
                setCurrentView('dashboard');
                showToast('Welcome to your CampusBuzz Dashboard!', 'success');
              }}
              className="px-10 py-4.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold text-base sm:text-lg shadow-[0_0_40px_rgba(168,85,247,0.65)] hover:shadow-[0_0_60px_rgba(236,72,153,0.85)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-3 cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>Enter Student Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                setCurrentView('login');
              }}
              className="px-8 py-4 rounded-xl bg-[#161925] hover:bg-[#1f2334] border border-white/10 text-slate-200 text-sm font-semibold transition cursor-pointer"
            >
              Switch Account / Login
            </button>
          </div>
        </div>
      </section>

      {/* Floating Bottom Quick Dashboard Bar while Scrolling Down */}
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="fixed bottom-6 right-6 z-40 hidden sm:flex items-center gap-3 p-2 pl-4 rounded-full bg-[#0d0f1e]/95 border border-purple-500/50 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.85)] ring-1 ring-purple-500/20"
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold text-slate-200">CampusBuzz Ready</span>
        </div>
        <button
          onClick={() => {
            setCurrentView('dashboard');
            showToast('Launching Campus Dashboard...', 'success');
          }}
          className="px-5 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs shadow-[0_0_20px_rgba(168,85,247,0.55)] transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95"
        >
          <span>Enter Dashboard</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </motion.div>

      {/* ==================================================================== */}
      {/* 6. COMPREHENSIVE MULTI-COLUMN FOOTER                                */}
      {/* ==================================================================== */}
      <footer className="relative z-10 border-t border-white/[0.08] bg-[#06070a] pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Main Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 pb-12 border-b border-white/[0.06]">
            
            {/* Brand Column (Span 2) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src={theme === 'light' ? "/campusbuzz-logo-light.png" : "/campusbuzz-logo-dark.png"}
                  alt="CampusBuzz"
                  className="h-9 w-auto object-contain"
                />
              </div>
              <p className="text-xs font-mono font-bold tracking-widest uppercase text-purple-400">
                CONNECT · CREATE · COLLABORATE
              </p>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                CampusBuzz is India's premier student community and creator management platform, empowering university creators, collegiate societies, and industry brands to partner at scale.
              </p>
              <div className="flex items-center gap-3 text-slate-400 text-xs pt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Systems Operational • 2026 Edition</span>
              </div>
            </div>

            {/* Col 1: Explore Campus */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                Explore Campus
              </h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>
                  <button onClick={handleJoinBuzz} className="hover:text-purple-400 transition cursor-pointer">
                    Home Dashboard
                  </button>
                </li>
                <li>
                  <button onClick={handleExploreFeed} className="hover:text-purple-400 transition cursor-pointer">
                    Collegiate Feed
                  </button>
                </li>
                <li>
                  <button onClick={handleOpenCreators} className="hover:text-purple-400 transition cursor-pointer">
                    10K+ Student Directory
                  </button>
                </li>
                <li>
                  <button onClick={() => { setCurrentView('dashboard'); setDashboardTab('leaderboard'); }} className="hover:text-purple-400 transition cursor-pointer">
                    Creator Leaderboard
                  </button>
                </li>
                <li>
                  <button onClick={() => { setCurrentView('dashboard'); setDashboardTab('clubs'); }} className="hover:text-purple-400 transition cursor-pointer">
                    Campus Clubs
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 2: Events & Fests */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                Events & Fests
              </h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>
                  <button onClick={handleOpenEvents} className="hover:text-cyan-400 transition cursor-pointer">
                    Upcoming Events
                  </button>
                </li>
                <li>
                  <button onClick={handleOpenEvents} className="hover:text-cyan-400 transition cursor-pointer">
                    Cultural Youth Fests
                  </button>
                </li>
                <li>
                  <button onClick={handleOpenEvents} className="hover:text-cyan-400 transition cursor-pointer">
                    Esports Tournaments
                  </button>
                </li>
                <li>
                  <button onClick={handleOpenEvents} className="hover:text-cyan-400 transition cursor-pointer">
                    Hackathons 2026
                  </button>
                </li>
                <li>
                  <button onClick={() => { setCurrentView('dashboard'); setDashboardTab('calendar'); }} className="hover:text-cyan-400 transition cursor-pointer">
                    Interactive Calendar
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Campaigns & Brands */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                Campaigns
              </h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>
                  <button onClick={handleOpenCampaigns} className="hover:text-amber-400 transition cursor-pointer">
                    Brand Sponsorships
                  </button>
                </li>
                <li>
                  <button onClick={handleOpenCampaigns} className="hover:text-amber-400 transition cursor-pointer">
                    Creator Fellowships
                  </button>
                </li>
                <li>
                  <button onClick={handleOpenCampaigns} className="hover:text-amber-400 transition cursor-pointer">
                    Product Seeding Kits
                  </button>
                </li>
                <li>
                  <button onClick={handleOpenCampaigns} className="hover:text-amber-400 transition cursor-pointer">
                    Campus Ambassador Cohort
                  </button>
                </li>
                <li>
                  <button onClick={() => { setCurrentView('dashboard'); setDashboardTab('collaborations'); }} className="hover:text-amber-400 transition cursor-pointer">
                    Direct Collaborations
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: Creators & Legal */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                Creators & Safety
              </h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>
                  <button onClick={handleOpenCreators} className="hover:text-purple-400 transition cursor-pointer">
                    Creator Verification
                  </button>
                </li>
                <li>
                  <button onClick={() => { setCurrentView('dashboard'); setDashboardTab('admin'); }} className="hover:text-purple-400 transition cursor-pointer">
                    Admin Governance
                  </button>
                </li>
                <li>
                  <a href="#privacy" onClick={(e) => { e.preventDefault(); }} className="hover:text-purple-400 transition">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#terms" onClick={(e) => { e.preventDefault(); }} className="hover:text-purple-400 transition">
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a href="#conduct" onClick={(e) => { e.preventDefault(); }} className="hover:text-purple-400 transition">
                    Campus Code of Conduct
                  </a>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Copyright Strip */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-400" />
              <span>© 2026 CampusBuzz Inc. All rights reserved.</span>
            </div>

            <div className="flex items-center gap-4">
              <span>Made with collegiate passion for Indian Universities</span>
              <span>•</span>
              <button 
                onClick={handleJoinBuzz}
                className="text-purple-400 hover:text-purple-300 font-semibold"
              >
                Launch Dashboard →
              </button>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
