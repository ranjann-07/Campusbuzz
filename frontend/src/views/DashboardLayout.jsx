import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import EditProfileModal from '../components/EditProfileModal';
import Navbar from '../components/Navbar';
import { 
  Home, 
  Compass, 
  Calendar, 
  Megaphone, 
  Users2, 
  Users,
  Trophy, 
  MessageSquare,
  BarChart2, 
  User, 
  Bell, 
  Settings, 
  Bookmark,
  LogOut, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown,
  Sparkles, 
  PlusCircle, 
  ArrowUpRight, 
  ShieldCheck,
  Menu,
  X,
  ExternalLink
} from 'lucide-react';

export default function DashboardLayout({ children }) {
  const { 
    currentView,
    setCurrentView,
    dashboardTab, 
    setDashboardTab, 
    currentUser, 
    logoutUser, 
    setCreateCampaignModalOpen,
    showToast,
    mobileDrawerOpen,
    setMobileDrawerOpen,
    sidebarCollapsed: isCollapsed,
    setSidebarCollapsed: setIsCollapsed,
    savedPostIds,
    theme
  } = useApp();

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Ensure every tab change scrolls to the absolute top
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  }, [dashboardTab]);

  // Organized into the 4 requested sections
  const navigationSections = [
    {
      title: "DISCOVER",
      items: [
        { id: 'landing', label: 'Explore Campus', icon: Sparkles, badge: 'Portal', badgeColor: 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30', isLanding: true },
        { id: 'overview', label: 'Home', icon: Home },
        { id: 'feed', label: 'Explore Content', icon: Compass, badge: '5.2K', badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
        { id: 'events', label: 'Upcoming Events', icon: Calendar, badge: '20+', badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' },
        { id: 'campaigns', label: 'Campaigns', icon: Megaphone, badge: '15', badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
        { id: 'clubs', label: 'Clubs', icon: Users2 },
      ]
    },
    {
      title: "COMMUNITY",
      items: [
        { id: 'creators', label: '10K+ Students', icon: Users, badge: '10.2K', badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
        { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
        { id: 'collaborations', label: 'Collaborations', icon: MessageSquare, badge: 'Live', badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
      ]
    },
    {
      title: "MY SPACE",
      items: [
        { id: 'profile', label: 'My Profile', icon: User },
        { id: 'saved', label: 'Saved Posts', icon: Bookmark, badge: savedPostIds?.length > 0 ? String(savedPostIds.length) : null, badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
        { id: 'notifications', label: 'Notifications', icon: Bell, badge: '3', badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-500/30 animate-pulse' },
        { id: 'analytics', label: 'Analytics', icon: BarChart2 },
      ]
    },
    {
      title: "ADMIN",
      items: [
        { id: 'admin', label: 'Admin Governance', icon: ShieldCheck },
        { id: 'settings', label: 'Settings', icon: Settings },
      ]
    }
  ];

  const handleItemClick = (item) => {
    if (item.isLanding) {
      setCurrentView('landing');
    } else {
      setDashboardTab(item.id);
    }
    setMobileDrawerOpen(false);
  };

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full overflow-hidden">
      
      {/* 1. TOP BRANDING AREA: Official Logo + Desktop Collapse Button */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.08] flex-shrink-0">
        <div 
          onClick={() => setCurrentView('landing')}
          className="flex items-center gap-2.5 cursor-pointer group min-w-0"
          title="CampusBuzz Landing Page"
        >
          <img 
            src={theme === 'light' ? "/campusbuzz-logo-light.png" : "/campusbuzz-logo-dark.png"} 
            alt="CampusBuzz" 
            className={`object-contain transition-all duration-300 ${
              isCollapsed ? 'h-7 w-7' : 'h-8 sm:h-9 w-auto max-w-[155px]'
            }`}
          />
        </div>

        {/* Desktop Collapse / Expand Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex p-1.5 rounded-xl text-slate-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] transition cursor-pointer"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* 2. USER PROFILE SECTION AT TOP (Directly under branding) */}
      <div ref={profileRef} className="pb-3 mb-2 border-b border-white/[0.08] relative flex-shrink-0">
        <button
          onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
          className={`w-full p-2 rounded-2xl bg-[#131622] hover:bg-[#181c2c] border border-white/[0.08] hover:border-purple-500/40 flex items-center ${
            isCollapsed ? 'justify-center' : 'justify-between'
          } cursor-pointer transition group`}
          title={currentUser?.name || "User Profile"}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Avatar with live status dot */}
            <div className="relative flex-shrink-0">
              <img
                src={currentUser?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80'}
                alt={currentUser?.name || 'User'}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-purple-500/40 group-hover:ring-purple-400 transition"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0c0e17] shadow-[0_0_6px_#34d399]" />
            </div>

            {!isCollapsed && (
              <div className="min-w-0 text-left">
                <p className="text-xs font-bold text-white truncate leading-tight group-hover:text-purple-300 transition">
                  {currentUser?.name || 'Aanya Sharma'}
                </p>
                <p className="text-[10px] text-purple-400 font-mono truncate mt-0.5">
                  Verified Creator
                </p>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition" />
          )}
        </button>

        {/* User Profile Dropdown Menu */}
        <AnimatePresence>
          {profileDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className={`absolute top-full mt-2 ${
                isCollapsed ? 'left-full ml-2 w-60' : 'left-0 right-0 w-full'
              } glass-panel rounded-2xl p-2.5 shadow-2xl border border-white/10 z-50`}
            >
              <div className="p-2 border-b border-white/[0.08] mb-1.5">
                <p className="text-xs font-bold text-white">{currentUser?.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{currentUser?.email}</p>
                <p className="text-[10px] text-purple-400 font-mono mt-0.5">{currentUser?.college || "Delhi University"}</p>
              </div>

              <button
                onClick={() => {
                  setDashboardTab('profile');
                  setProfileDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-white/[0.06] rounded-xl transition text-left cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-purple-400" /> My Profile
              </button>

              <button
                onClick={() => {
                  setIsEditProfileOpen(true);
                  setProfileDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-white/[0.06] rounded-xl transition text-left cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5 text-slate-400" /> Settings
              </button>

              <div className="my-1 border-t border-white/[0.06]" />

              <button
                onClick={() => {
                  logoutUser();
                  setProfileDropdownOpen(false);
                  setCurrentView('login');
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition text-left cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. NAVIGATION SECTIONS (DISCOVER, COMMUNITY, MY SPACE, ADMIN) - SCROLLABLE AT TOP */}
      <div className="overflow-y-auto overflow-x-hidden flex-1 scrollbar-none pr-1 space-y-4">
        {navigationSections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-1">
            
            {/* Subtle Section Label with muted text */}
            {!isCollapsed ? (
              <div className="px-3 pt-1 pb-1.5 flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase">
                  {section.title}
                </span>
              </div>
            ) : (
              <div className="w-full h-px bg-white/[0.06] my-2" />
            )}

            {/* Section Items */}
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = dashboardTab === item.id;

                return (
                  <motion.button
                    key={item.id}
                    whileHover={{ x: isCollapsed ? 0 : 3 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 450, damping: 25 }}
                    onClick={() => handleItemClick(item)}
                    className={`relative w-full flex items-center ${
                      isCollapsed ? 'justify-center px-0' : 'justify-between px-3'
                    } py-2 rounded-xl text-xs font-medium transition-all group cursor-pointer ${
                      isActive
                        ? 'text-white font-bold bg-gradient-to-r from-purple-600/30 via-indigo-600/20 to-transparent border border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.25)]'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                    }`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    {/* Left Accent Glow Indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeSidebarPill"
                        className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-gradient-to-b from-purple-400 via-pink-400 to-indigo-500 rounded-r-full shadow-[0_0_10px_#a855f7]"
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      />
                    )}

                    <div className="flex items-center gap-3 min-w-0">
                      <Icon className={`w-4 h-4 flex-shrink-0 transition-all ${
                        isActive 
                          ? 'text-purple-400 scale-110 drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]' 
                          : 'text-slate-400 group-hover:text-purple-300 group-hover:scale-105'
                      }`} />
                      
                      {!isCollapsed && (
                        <span className="truncate">{item.label}</span>
                      )}
                    </div>

                    {/* Compact Modern Badge */}
                    {!isCollapsed && item.badge && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border transition ${
                        item.badgeColor || 'bg-white/[0.05] text-slate-400 border-white/10'
                      }`}>
                        {item.badge}
                      </span>
                    )}

                    {/* Collapsed Mode Tooltip on Hover */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-[#141724] border border-white/10 rounded-xl text-xs font-semibold text-white whitespace-nowrap shadow-2xl z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                        <span>{item.label}</span>
                        {item.badge && (
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-purple-500/30 text-purple-200 border border-purple-500/40">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>

          </div>
        ))}

        {/* Compact Creator Network Banner (Only when expanded) */}
        {!isCollapsed && (
          <div className="pt-2">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-900/30 via-indigo-950/20 to-[#12141c] border border-purple-500/25 shadow-lg relative overflow-hidden group">
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-purple-600/20 rounded-full blur-xl pointer-events-none" />
              <div className="relative z-10">
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-400" /> CREATOR NETWORK
                </span>
                <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                  Scale your campus reach & sponsorship deals.
                </p>
                <button
                  onClick={() => setCreateCampaignModalOpen(true)}
                  className="mt-2 w-full py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px] shadow transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Launch Campaign</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#08090D] text-slate-100">
      
      {/* 1. DESKTOP FIXED SIDEBAR - EXTENDS ALL THE WAY TO THE TOP (top-0) */}
      <aside 
        className={`hidden lg:flex fixed top-0 bottom-0 left-0 z-40 transition-all duration-300 ease-in-out border-r border-white/[0.08] bg-[#0c0e17]/95 backdrop-blur-2xl flex-col p-4 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {renderSidebarContent()}
      </aside>

      {/* Global Sidebar Drawer is mounted at App level */}

      {/* 2. MAIN CONTAINER WITH TOP NAVBAR & CONTENT */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'lg:pl-20' : 'lg:pl-64'
      }`}>
        {/* Top Navbar */}
        <Navbar />

        {/* Content Body */}
        <main className="relative flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* Ambient Cyber Grid & Glow Mesh */}
          <div className="absolute inset-0 cyber-grid pointer-events-none opacity-25 z-0" />
          <div className="absolute top-10 left-1/3 w-[600px] h-[450px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none z-0" />
          <div className="absolute top-2/3 right-10 w-[500px] h-[400px] bg-pink-600/10 rounded-full blur-[130px] pointer-events-none z-0" />
          <div className="relative z-10">
            {children}
          </div>
        </main>
      </div>

      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <EditProfileModal isOpen={isEditProfileOpen} onClose={() => setIsEditProfileOpen(false)} />
      )}
    </div>
  );
}
