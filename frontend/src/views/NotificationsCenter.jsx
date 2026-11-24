import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { 
  Bell, 
  Check, 
  CheckCheck, 
  Trash2, 
  Filter, 
  Sparkles, 
  Megaphone, 
  Calendar, 
  Handshake, 
  ShieldCheck, 
  ArrowUpRight, 
  Clock, 
  Volume2, 
  Mail, 
  Smartphone, 
  SlidersHorizontal,
  ChevronRight,
  Zap
} from 'lucide-react';

export default function NotificationsCenter() {
  const { setDashboardTab, showToast, setSelectedCreatorForModal } = useApp();

  const [activeFilter, setActiveFilter] = useState('all'); // all, unread, campaigns, events, collabs, system
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'campaigns',
      title: 'Campaign Pitch Accepted! 🎉',
      message: 'Red Bull Energy Fest approved your collegiate creator proposal. Payout of ₹45,000 reserved.',
      time: '10m ago',
      read: false,
      badge: 'Brand Deal',
      actionLabel: 'View Campaign',
      actionTab: 'campaigns',
      avatar: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=120&q=80',
      urgent: true
    },
    {
      id: 2,
      type: 'events',
      title: 'Winter Tech Fest 2026 Confirmation',
      message: 'Your VIP pass for Winter Tech Fest (Dec 12, 2026) is active. Reserved seat confirmed in Hall A.',
      time: '45m ago',
      read: false,
      badge: 'Upcoming Event',
      actionLabel: 'Check Event Details',
      actionTab: 'events',
      avatar: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=120&q=80',
      urgent: false
    },
    {
      id: 3,
      type: 'collabs',
      title: 'Collaboration Invite from Arjun Mehta',
      message: 'Arjun Mehta (IIT Bombay) invited you to co-host a tech vlog shoot for the upcoming hackathon.',
      time: '2h ago',
      read: false,
      badge: 'Peer Collab',
      actionLabel: 'Open Collaborations',
      actionTab: 'collaborations',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      urgent: true
    },
    {
      id: 4,
      type: 'system',
      title: 'Shivani Negi Ranked #1 Top Creator',
      message: 'Shivani Negi reached 184.5K followers & was awarded Top Creator of the Month on CampusBuzz.',
      time: '4h ago',
      read: true,
      badge: 'Campus Star',
      actionLabel: 'View Leaderboard',
      actionTab: 'leaderboard',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
      urgent: false
    },
    {
      id: 5,
      type: 'campaigns',
      title: 'Spotify Student Podcasts Pool Open',
      message: 'New campus grant pool of ₹1,80,000 launched by Spotify Campus Beats. Deadline in 14 days.',
      time: '1d ago',
      read: true,
      badge: 'Brand Campaign',
      actionLabel: 'Explore Grant',
      actionTab: 'campaigns',
      avatar: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=120&q=80',
      urgent: false
    },
    {
      id: 6,
      type: 'events',
      title: 'Inter-College Esports Championship',
      message: 'Registrations are 80% filled for the Dec 20 Valorant Collegiate Cup. Last 20 slots remaining.',
      time: '2d ago',
      read: true,
      badge: 'Gaming Fest',
      actionLabel: 'Register Now',
      actionTab: 'events',
      avatar: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=120&q=80',
      urgent: false
    }
  ]);

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read! ✓', 'success');
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    showToast('Notification center cleared.', 'info');
  };

  const handleNotificationClick = (notif) => {
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
    if (notif.actionTab) {
      setDashboardTab(notif.actionTab);
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'unread') return !n.read;
    if (activeFilter === 'campaigns') return n.type === 'campaigns';
    if (activeFilter === 'events') return n.type === 'events';
    if (activeFilter === 'collabs') return n.type === 'collabs';
    if (activeFilter === 'system') return n.type === 'system';
    return true;
  });

  const getIconForType = (type) => {
    switch (type) {
      case 'campaigns':
        return <Megaphone className="w-4 h-4 text-amber-400" />;
      case 'events':
        return <Calendar className="w-4 h-4 text-cyan-400" />;
      case 'collabs':
        return <Handshake className="w-4 h-4 text-purple-400" />;
      case 'system':
      default:
        return <Sparkles className="w-4 h-4 text-pink-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-500 shadow-[0_0_8px_#ec4899]" />
            <span className="text-[10px] font-mono tracking-widest uppercase text-pink-400 font-semibold">
              COMMUNICATION HUB
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight flex items-center gap-2.5">
            <span>Notification Center</span>
            {unreadCount > 0 && (
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
                {unreadCount} New
              </span>
            )}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time updates on campaign approvals, event reminders, peer collaborations, and collegiate creator news.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-semibold text-slate-200 hover:text-white transition cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>Mark all read</span>
            </button>
          )}

          {notifications.length > 0 && (
            <button
              onClick={clearAllNotifications}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.03] hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 text-xs font-medium text-slate-400 hover:text-red-300 transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs & Preferences Toggle */}
      <div className="glass-panel p-3 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'All Alerts', count: notifications.length },
            { id: 'unread', label: 'Unread', count: unreadCount },
            { id: 'campaigns', label: 'Brand Campaigns', count: notifications.filter(n => n.type === 'campaigns').length },
            { id: 'events', label: 'Events', count: notifications.filter(n => n.type === 'events').length },
            { id: 'collabs', label: 'Collaborations', count: notifications.filter(n => n.type === 'collabs').length },
            { id: 'system', label: 'Campus Buzz', count: notifications.filter(n => n.type === 'system').length }
          ].map((tab) => {
            const isSelected = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-white/[0.06] text-slate-400'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Quick Preferences Indicator */}
        <div className="hidden lg:flex items-center gap-3 text-xs text-slate-400 font-mono pr-2">
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-white transition">
            <input 
              type="checkbox" 
              checked={emailAlerts} 
              onChange={(e) => {
                setEmailAlerts(e.target.checked);
                showToast(`Email notifications ${e.target.checked ? 'enabled' : 'muted'}`, 'info');
              }}
              className="rounded bg-white/5 border-white/20 text-purple-600 focus:ring-0" 
            />
            <span>Email</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-white transition">
            <input 
              type="checkbox" 
              checked={pushAlerts} 
              onChange={(e) => {
                setPushAlerts(e.target.checked);
                showToast(`Push notifications ${e.target.checked ? 'enabled' : 'muted'}`, 'info');
              }}
              className="rounded bg-white/5 border-white/20 text-purple-600 focus:ring-0" 
            />
            <span>Push</span>
          </label>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notif, index) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: index * 0.04 }}
                onClick={() => handleNotificationClick(notif)}
                className={`glass-panel p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group ${
                  notif.read 
                    ? 'border-white/[0.06] bg-white/[0.015] hover:bg-white/[0.04]' 
                    : 'border-purple-500/30 bg-purple-950/20 hover:bg-purple-950/30 shadow-[0_0_25px_rgba(168,85,247,0.1)]'
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="relative flex-shrink-0 mt-0.5">
                    <img
                      src={notif.avatar}
                      alt={notif.title}
                      className="w-11 h-11 rounded-xl object-cover ring-1 ring-white/10 group-hover:ring-purple-400 transition"
                    />
                    <div className="absolute -bottom-1 -right-1 p-1 bg-[#08090D] rounded-full ring-1 ring-white/10">
                      {getIconForType(notif.type)}
                    </div>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse flex-shrink-0" />
                      )}
                      <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-md bg-white/[0.05] text-purple-300 border border-white/10">
                        {notif.badge}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{notif.time}</span>
                      </span>
                    </div>

                    <h3 className={`text-sm font-bold tracking-tight transition ${
                      notif.read ? 'text-slate-200 group-hover:text-white' : 'text-white group-hover:text-purple-300'
                    }`}>
                      {notif.title}
                    </h3>

                    <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                      {notif.message}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center w-full sm:w-auto justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNotificationClick(notif);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600 border border-purple-500/30 text-xs font-semibold text-purple-300 hover:text-white transition cursor-pointer"
                  >
                    <span>{notif.actionLabel}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="glass-panel p-12 rounded-2xl text-center border border-white/[0.06]">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto mb-3">
                <Bell className="w-6 h-6 text-slate-500" />
              </div>
              <h3 className="text-base font-bold text-white">No notifications here</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                {activeFilter === 'unread' 
                  ? "You are all caught up! No unread notifications right now."
                  : "No notifications found in this category."}
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
