import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import EditProfileModal from './EditProfileModal';
import { 
  Sparkles, 
  Compass, 
  Calendar, 
  Megaphone, 
  Users2, 
  Trophy, 
  ShieldCheck, 
  User, 
  LogOut, 
  LogIn, 
  Menu, 
  X, 
  Zap,
  Bell,
  ExternalLink,
  FileText,
  PlusCircle,
  CheckCircle2,
  ChevronDown,
  Sparkle,
  Settings,
  Edit3,
  Copy,
  Check,
  GraduationCap,
  Sun,
  Moon
} from 'lucide-react';

export default function Navbar() {
  const { 
    currentView, 
    setCurrentView, 
    dashboardTab, 
    setDashboardTab, 
    currentUser, 
    logoutUser, 
    setIsAuthOpen, 
    setAuthMode,
    setCreateCampaignModalOpen,
    setSelectedCreatorForModal,
    showToast,
    mobileDrawerOpen,
    setMobileDrawerOpen,
    sidebarCollapsed,
    setSidebarCollapsed,
    theme,
    toggleTheme
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  const handleCopyId = (e) => {
    e.stopPropagation();
    const idToCopy = currentUser?.student_id || 'CB-2026-00001';
    navigator.clipboard?.writeText(idToCopy);
    setCopiedId(true);
    showToast(`Copied Student ID ${idToCopy} to clipboard!`, 'info');
    setTimeout(() => setCopiedId(false), 2000);
  };

  const notifications = [
    { id: 1, title: "Campaign Pitch Accepted!", text: "Red Bull Energy Fest approved your creator proposal.", time: "10m ago", read: false },
    { id: 2, title: "Upcoming Event Reminder", text: "Winter Tech Fest scheduled for Dec 12, 2026. Reserved seat confirmed.", time: "45m ago", read: false },
    { id: 3, title: "Trending Star", text: "Shivani Negi ranked #1 Top Creator of the Month 🎉", time: "2h ago", read: true }
  ];

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (view, tab = 'overview') => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    setCurrentView(view);
    if (tab && view === 'dashboard') setDashboardTab(tab);
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { id: 'landing', label: 'Home', view: 'landing' },
    { id: 'overview', label: 'Dashboard', view: 'dashboard' },
    { id: 'feed', label: 'Feed', view: 'dashboard' },
    { id: 'events', label: 'Events', view: 'dashboard' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-2xl bg-[#08090D]/90 border-b border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.5)] transition-all">
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* 1. BRAND LOGO & TOP SIDEBAR TOGGLE */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          {/* Sidebar Drawer Toggle Button (Visible on Home Page & Mobile) */}
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className={`p-2 sm:px-3 sm:py-1.5 rounded-xl text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition cursor-pointer flex items-center gap-1.5 group shadow-sm ${
              currentView === 'landing' ? 'flex' : 'flex lg:hidden'
            }`}
            title="Open CampusBuzz Navigation Sidebar"
          >
            <Menu className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline text-xs font-semibold text-slate-200 group-hover:text-white">Sidebar</span>
          </button>

          <div 
            onClick={() => handleNavClick('landing')}
            className={`cursor-pointer group flex-shrink-0 ${
              currentView === 'dashboard' ? 'flex lg:hidden' : 'flex'
            }`}
            title="CampusBuzz Landing Page"
          >
            <img
              src={theme === 'light' ? "/campusbuzz-logo-light.png" : "/campusbuzz-logo-dark.png"}
              alt="CampusBuzz"
              className="h-9 sm:h-10 md:h-11 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            />
          </div>
        </div>

        {/* 2. CENTER NAVIGATION TABS */}
        <nav className="hidden md:flex items-center gap-1 bg-[#121520]/80 border border-white/[0.06] rounded-full p-1 shadow-inner">
          {navLinks.map((link) => {
            const isActive = link.view === 'landing' ? currentView === 'landing' : (currentView === 'dashboard' && dashboardTab === link.id);

            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.view, link.id)}
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'text-white shadow-[0_0_15px_rgba(168,85,247,0.35)]'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="navbarActivePill"
                    className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
                {link.badge && (
                  <span className={`relative z-10 text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
                    isActive 
                      ? 'bg-white/20 text-white' 
                      : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  }`}>
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* 4. RIGHT CONTROLS & USER PROFILE */}
        <div className="flex items-center gap-2.5">
          
          {/* Quick Create Campaign / Post Action */}
          <button
            onClick={() => setCreateCampaignModalOpen(true)}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-95 text-white font-semibold text-xs shadow-[0_0_15px_rgba(168,85,247,0.35)] transition cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Launch Campaign</span>
          </button>

          {/* Light / Dark Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-[#12141c] hover:bg-[#1a1e2a] border border-white/5 text-slate-300 hover:text-white transition relative cursor-pointer group"
            title={theme === 'dark' ? "Switch to Light Mode ☀️" : "Switch to Dark Mode 🌙"}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-400 group-hover:-rotate-12 transition-transform" />
            )}
          </button>

          {/* Notifications Toggle */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 rounded-xl bg-[#12141c] hover:bg-[#1a1e2a] border border-white/5 text-slate-300 hover:text-white transition relative cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_8px_#ec4899] animate-pulse" />
            </button>

            {/* Notification Dropdown */}
            <AnimatePresence>
              {notificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-3 w-80 glass-panel rounded-2xl p-4 shadow-2xl border border-white/10 z-50"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-2">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Bell className="w-3.5 h-3.5 text-purple-400" />
                      Campus Notifications
                    </span>
                    <span className="text-[10px] text-pink-400 font-mono font-bold">2 Unread</span>
                  </div>
                  <div className="space-y-2">
                    {notifications.map((n) => (
                      <div 
                        key={n.id} 
                        onClick={() => {
                          showToast(n.title, 'info');
                          handleNavClick('dashboard', 'notifications');
                          setNotificationsOpen(false);
                        }}
                        className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition text-xs cursor-pointer"
                      >
                        <p className="text-white font-semibold text-[11px]">{n.title}</p>
                        <p className="text-slate-400 text-[10px] leading-relaxed mt-0.5">{n.text}</p>
                        <span className="text-[9px] text-purple-400 font-mono mt-1 block">{n.time}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 mt-2 border-t border-white/[0.06]">
                    <button
                      onClick={() => {
                        handleNavClick('dashboard', 'notifications');
                        setNotificationsOpen(false);
                      }}
                      className="w-full py-1.5 rounded-lg bg-purple-600/15 hover:bg-purple-600/30 text-purple-300 hover:text-white text-[11px] font-semibold transition text-center cursor-pointer"
                    >
                      Open Notification Center →
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile Pill with Dropdown */}
          {currentUser ? (
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className={`group relative p-[1.5px] rounded-full transition-all duration-300 cursor-pointer shadow-lg select-none ${
                  profileDropdownOpen
                    ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 shadow-[0_0_25px_rgba(168,85,247,0.45)] ring-1 ring-purple-400/50'
                    : 'bg-gradient-to-r from-purple-500/40 via-purple-500/20 to-indigo-500/40 hover:from-purple-400 hover:via-pink-400 hover:to-indigo-400 shadow-[0_4px_16px_rgba(0,0,0,0.4)] hover:shadow-[0_0_24px_rgba(168,85,247,0.35)]'
                }`}
                title="Collegiate Creator Profile"
              >
                <div className={`flex items-center gap-2.5 py-1.5 pl-3 pr-2 rounded-full transition-colors duration-300 ${
                  profileDropdownOpen
                    ? 'bg-[#121422]'
                    : 'bg-[#0d0f1a]/95 group-hover:bg-[#131626]'
                }`}>
                  {/* Left Identity Block */}
                  <div className="text-right hidden sm:block whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <span className="text-xs font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-purple-200 bg-clip-text text-transparent group-hover:from-white group-hover:to-pink-200 transition-all">
                        {currentUser?.name || 'Aanya Sharma'}
                      </span>
                      <span 
                        className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 text-[9px] text-white font-black shadow-[0_0_8px_rgba(168,85,247,0.6)] flex-shrink-0"
                        title="Verified Campus Creator"
                      >
                        ✓
                      </span>
                    </div>

                    <div className="flex items-center justify-end gap-1.5 mt-0.5 whitespace-nowrap">
                      <span className="font-mono text-[9.5px] font-bold px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/35 tracking-wider shadow-inner whitespace-nowrap flex-shrink-0">
                        {currentUser?.student_id || 'CB-2026-00001'}
                      </span>
                      <span className="text-[8.5px] font-extrabold uppercase tracking-wider px-1.5 py-0.2 rounded bg-gradient-to-r from-amber-500/25 to-pink-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-0.5 whitespace-nowrap flex-shrink-0">
                        <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                        PRO
                      </span>
                    </div>
                  </div>

                  {/* Gradient Ring Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="p-[2px] rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-amber-300 shadow-[0_0_12px_rgba(168,85,247,0.45)] group-hover:shadow-[0_0_18px_rgba(236,72,153,0.6)] transition-all duration-300">
                      <img
                        src={currentUser?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80'}
                        alt={currentUser?.name || 'Aanya Sharma'}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    </div>
                    {/* Glowing Live Green Dot */}
                    <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 ring-2 ring-[#0c0e18] shadow-[0_0_6px_#34d399]"></span>
                    </span>
                  </div>

                  {/* Chevron Indicator */}
                  <ChevronDown 
                    className={`w-3.5 h-3.5 text-slate-400 group-hover:text-purple-300 transition-transform duration-300 hidden sm:block ${
                      profileDropdownOpen ? 'rotate-180 text-purple-400' : ''
                    }`} 
                  />
                </div>
              </button>

              {/* Profile Menu Dropdown */}
              <AnimatePresence>
                {profileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute right-0 mt-3 w-[350px] glass-panel rounded-3xl p-3 shadow-[0_25px_70px_rgba(0,0,0,0.85)] border border-purple-500/30 bg-[#090b14]/95 backdrop-blur-2xl z-50 overflow-hidden ring-1 ring-purple-500/20"
                  >
                    {/* VIP Collegiate Creator Pass Header */}
                    <div className="relative overflow-hidden rounded-2xl p-3.5 bg-gradient-to-br from-purple-900/40 via-[#131627] to-[#0a0c16] border border-purple-500/30 mb-2.5 shadow-lg">
                      {/* Ambient light glow */}
                      <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-pink-500/30 to-purple-600/30 rounded-full blur-2xl pointer-events-none" />

                      {/* Header top row */}
                      <div className="relative z-10 flex items-start gap-3">
                        <div className="relative flex-shrink-0">
                          <div className="p-[2.5px] rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-amber-300 shadow-[0_0_16px_rgba(168,85,247,0.5)]">
                            <img 
                              src={currentUser?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80'} 
                              alt={currentUser?.name || 'Aanya Sharma'} 
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          </div>
                          <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 bg-gradient-to-r from-amber-500 to-orange-500 text-[8px] font-black text-black rounded-full uppercase tracking-tighter shadow">
                            PRO
                          </span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="text-sm font-extrabold text-white tracking-tight truncate">
                              {currentUser?.name || 'Aanya Sharma'}
                            </h4>
                            <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/35 flex-shrink-0 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              Verified
                            </span>
                          </div>

                          {/* Student ID badge with copy action */}
                          <div className="flex items-center gap-2 mt-1.5">
                            <button
                              onClick={handleCopyId}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-500/20 hover:bg-purple-500/35 border border-purple-500/35 text-[10px] font-mono font-bold text-purple-200 transition cursor-pointer whitespace-nowrap flex-shrink-0"
                              title="Click to copy Student ID"
                            >
                              <span>{currentUser?.student_id || 'CB-2026-00001'}</span>
                              {copiedId ? (
                                <Check className="w-2.5 h-2.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-2.5 h-2.5 text-purple-400" />
                              )}
                            </button>
                            <span className="text-[10px] text-slate-400 truncate max-w-[130px]">
                              {currentUser?.email || 'aanya@campus.edu'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* College & Department */}
                      <div className="relative z-10 mt-3 pt-2.5 border-t border-white/[0.08] flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-1.5 text-slate-300 truncate">
                          <GraduationCap className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                          <span className="truncate">{currentUser?.college || 'Delhi University'}</span>
                        </div>
                        <span className="text-purple-300 font-mono text-[9px] font-bold bg-purple-500/20 px-2 py-0.5 rounded border border-purple-500/30 flex-shrink-0">
                          {currentUser?.role === 'admin' ? 'Campus Admin' : 'Collegiate Creator'}
                        </span>
                      </div>

                      {/* Quick Creator Metrics Bar */}
                      <div className="relative z-10 mt-2.5 grid grid-cols-3 gap-1.5 p-2 rounded-xl bg-black/40 border border-white/[0.06] text-center">
                        <div>
                          <p className="text-[9px] text-slate-400 font-medium">Followers</p>
                          <p className="text-xs font-bold text-white font-mono">18.4K</p>
                        </div>
                        <div className="border-x border-white/[0.06]">
                          <p className="text-[9px] text-slate-400 font-medium">Campus Rank</p>
                          <p className="text-xs font-bold text-purple-300 font-mono">#12</p>
                        </div>
                        <div>
                          <p className="text-[9px] text-slate-400 font-medium">Rating</p>
                          <p className="text-xs font-bold text-amber-300 font-mono flex items-center justify-center gap-0.5">
                            ★ 4.9
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Quick Action: Edit Profile Details Modal Trigger */}
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        setEditProfileModalOpen(true);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-purple-300 hover:text-white bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/25 rounded-xl transition cursor-pointer mb-2 group shadow-sm"
                    >
                      <div className="flex items-center gap-2">
                        <Edit3 className="w-3.5 h-3.5 text-purple-400 group-hover:scale-110 transition-transform" />
                        <span>Edit Profile & Creator Info</span>
                      </div>
                      <span className="text-[10px] text-purple-400/80 font-mono font-medium">Customize →</span>
                    </button>

                    <div className="space-y-0.5">
                      <button
                        onClick={() => {
                          handleNavClick('dashboard', 'overview');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.06] rounded-xl transition text-left cursor-pointer group"
                      >
                        <Zap className="w-3.5 h-3.5 text-purple-400 group-hover:scale-110 transition-transform" />
                        <span>Home Overview</span>
                      </button>

                      <button
                        onClick={() => {
                          handleNavClick('dashboard', 'feed');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.06] rounded-xl transition text-left cursor-pointer group"
                      >
                        <FileText className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
                        <span>Campus Social Feed</span>
                      </button>

                      <button
                        onClick={() => {
                          handleNavClick('dashboard', 'profile');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.06] rounded-xl transition text-left cursor-pointer group"
                      >
                        <User className="w-3.5 h-3.5 text-pink-400 group-hover:scale-110 transition-transform" />
                        <span>My Profile & Stats</span>
                      </button>

                      <button
                        onClick={() => {
                          handleNavClick('dashboard', 'notifications');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.06] rounded-xl transition text-left cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5">
                          <Bell className="w-3.5 h-3.5 text-pink-400 group-hover:scale-110 transition-transform" />
                          <span>Notifications</span>
                        </div>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
                          3 new
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          handleNavClick('dashboard', 'settings');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.06] rounded-xl transition text-left cursor-pointer group"
                      >
                        <Settings className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
                        <span>Platform Settings</span>
                      </button>

                      <button
                        onClick={() => {
                          handleNavClick('landing');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-white/[0.06] rounded-xl transition text-left cursor-pointer group"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                        <span>Landing Page Preview</span>
                      </button>
                    </div>

                    <div className="my-1.5 border-t border-white/10" />

                    <button
                      onClick={() => {
                        logoutUser();
                        setProfileDropdownOpen(false);
                        setCurrentView('login');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition text-left cursor-pointer group"
                    >
                      <LogOut className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                      <span>Sign Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={() => {
                setCurrentView('login');
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-[0_0_15px_rgba(168,85,247,0.4)] transition cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" /> Sign In
            </button>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-[#12141c] border border-white/5 text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>

      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-panel border-t border-white/10 px-4 py-4 space-y-3"
          >
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => {
                const isActive = link.view === 'landing'
                  ? currentView === 'landing'
                  : (currentView === 'dashboard' && dashboardTab === link.id);
                return (
                  <button
                    key={link.id}
                    onClick={() => {
                      handleNavClick(link.view, link.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold text-center transition ${
                      isActive
                        ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                        : 'bg-[#151824] text-slate-300 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={editProfileModalOpen}
        onClose={() => setEditProfileModalOpen(false)}
      />
    </header>
  );
}
