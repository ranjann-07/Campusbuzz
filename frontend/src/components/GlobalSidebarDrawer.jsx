import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
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
  Sparkles, 
  ShieldCheck,
  X,
  Sun,
  Moon,
  ChevronRight
} from 'lucide-react';

export default function GlobalSidebarDrawer() {
  const {
    currentView,
    setCurrentView,
    dashboardTab,
    setDashboardTab,
    mobileDrawerOpen,
    setMobileDrawerOpen,
    currentUser,
    logoutUser,
    savedPostIds,
    theme,
    toggleTheme,
    showToast
  } = useApp();

  // Close drawer on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileDrawerOpen) {
        setMobileDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileDrawerOpen, setMobileDrawerOpen]);

  const navigationSections = [
    {
      title: "DISCOVER",
      items: [
        { id: 'landing', label: 'Explore Campus', icon: Sparkles, badge: 'Portal', isLanding: true },
        { id: 'overview', label: 'Dashboard Home', icon: Home },
        { id: 'feed', label: 'Explore Content', icon: Compass, badge: '5.2K' },
        { id: 'events', label: 'Upcoming Events', icon: Calendar, badge: '20+' },
        { id: 'campaigns', label: 'Campaigns', icon: Megaphone, badge: '15' },
        { id: 'clubs', label: 'Campus Clubs', icon: Users2 },
      ]
    },
    {
      title: "COMMUNITY",
      items: [
        { id: 'creators', label: '10K+ Students', icon: Users, badge: '10.2K' },
        { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
        { id: 'collaborations', label: 'Collaborations', icon: MessageSquare, badge: 'Live' },
      ]
    },
    {
      title: "MY SPACE",
      items: [
        { id: 'profile', label: 'My Profile', icon: User },
        { id: 'saved', label: 'Saved Posts', icon: Bookmark, badge: savedPostIds?.length > 0 ? String(savedPostIds.length) : null },
        { id: 'notifications', label: 'Notifications', icon: Bell, badge: '3' },
        { id: 'analytics', label: 'Analytics', icon: BarChart2 },
      ]
    },
    {
      title: "ADMIN & SETTINGS",
      items: [
        { id: 'admin', label: 'Admin Governance', icon: ShieldCheck },
        { id: 'settings', label: 'Account Settings', icon: Settings },
      ]
    }
  ];

  const handleItemClick = (item) => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (item.isLanding) {
      setCurrentView('landing');
    } else {
      setCurrentView('dashboard');
      setDashboardTab(item.id);
    }
    setMobileDrawerOpen(false);
  };

  return (
    <AnimatePresence>
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setMobileDrawerOpen(false)}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
          />

          {/* Slide-out Sidebar Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            className="fixed top-0 bottom-0 left-0 w-80 max-w-[85vw] bg-[#0c0e18] border-r border-white/10 z-50 p-5 shadow-2xl flex flex-col justify-between overflow-hidden"
          >
            {/* 1. TOP HEADER & LOGO */}
            <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08] flex-shrink-0">
              <div 
                onClick={() => {
                  setCurrentView('landing');
                  setMobileDrawerOpen(false);
                }}
                className="flex items-center gap-2 cursor-pointer group"
                title="Go to CampusBuzz Home"
              >
                <img 
                  src={theme === 'light' ? "/campusbuzz-logo-light.png" : "/campusbuzz-logo-dark.png"} 
                  alt="CampusBuzz" 
                  className="h-8 w-auto object-contain drop-shadow-[0_2px_12px_rgba(168,85,247,0.4)]" 
                />
              </div>

              <div className="flex items-center gap-1.5">
                {/* Theme Toggle Button */}
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-xl text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition cursor-pointer"
                  title={theme === 'dark' ? "Switch to Light Mode ☀️" : "Switch to Dark Mode 🌙"}
                >
                  {theme === 'dark' ? (
                    <Sun className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Moon className="w-4 h-4 text-indigo-400" />
                  )}
                </button>

                {/* Close Button */}
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition cursor-pointer"
                  title="Close Sidebar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 2. USER PROFILE MINI BANNER */}
            {currentUser && (
              <div 
                onClick={() => {
                  setCurrentView('dashboard');
                  setDashboardTab('profile');
                  setMobileDrawerOpen(false);
                }}
                className="my-3 p-2.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] flex items-center justify-between cursor-pointer transition group flex-shrink-0"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative flex-shrink-0">
                    <img
                      src={currentUser?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80'}
                      alt={currentUser?.name || 'User'}
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-purple-500/50"
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0c0e18]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate group-hover:text-purple-300 transition">
                      {currentUser?.name || 'Aanya Sharma'}
                    </p>
                    <p className="text-[10px] text-purple-400 font-mono truncate">
                      {currentUser?.college || 'Delhi University'}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition" />
              </div>
            )}

            {/* 3. SCROLLABLE NAVIGATION SECTIONS */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 py-1 scrollbar-none">
              {navigationSections.map((section, sIdx) => (
                <div key={sIdx} className="space-y-1">
                  <div className="px-2 pt-1 pb-1">
                    <span className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase">
                      {section.title}
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = item.isLanding 
                        ? currentView === 'landing'
                        : (currentView === 'dashboard' && dashboardTab === item.id);

                      return (
                        <button
                          key={item.id}
                          onClick={() => handleItemClick(item)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
                            isActive
                              ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                              : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-slate-400'}`} />
                            <span className={isActive ? 'font-bold text-white' : ''}>{item.label}</span>
                          </div>

                          {item.badge && (
                            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                              isActive
                                ? 'bg-purple-500 text-white'
                                : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            }`}>
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* 4. FOOTER: THEME SWITCH & LOGOUT */}
            <div className="pt-3 border-t border-white/[0.08] space-y-2 flex-shrink-0">
              {/* Quick Mode Toggle Pill */}
              <button
                onClick={toggleTheme}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] transition text-xs cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  {theme === 'dark' ? (
                    <Moon className="w-4 h-4 text-purple-400" />
                  ) : (
                    <Sun className="w-4 h-4 text-amber-400" />
                  )}
                  <span className="text-slate-200 font-medium">Display Mode</span>
                </div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                  {theme === 'dark' ? 'Dark Mode 🌙' : 'Light Mode ☀️'}
                </span>
              </button>

              {/* Logout / Switch Account */}
              <button
                onClick={() => {
                  logoutUser();
                  setMobileDrawerOpen(false);
                  setCurrentView('login');
                  showToast('Logged out. Please log in to continue.', 'info');
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Switch Account / Sign In</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
