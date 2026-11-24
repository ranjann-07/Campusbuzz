import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { apiUrl, getAuthHeaders } from '../config/api';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Navigation: 'login' (default on link click), 'landing' (explore campus), or 'dashboard'
  const [currentView, setCurrentView] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      const search = window.location.search;
      if (hash === '#dashboard' || search.includes('view=dashboard')) return 'dashboard';
      if (hash === '#landing' || search.includes('view=landing') || search.includes('view=explore')) return 'landing';
      if (hash === '#login' || search.includes('view=login')) return 'login';
    }
    return 'login'; // Defaults directly to Login Page when opening link
  });
  const [dashboardTab, setDashboardTab] = useState('overview');

  // Auth state
  const [currentUser, setCurrentUser] = useState({
    id: 1,
    name: "Aanya Sharma",
    email: "aanya@campus.edu",
    role: "creator",
    college: "Delhi University",
    department: "Media & Journalism",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80"
  });
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('student'); // 'student', 'admin', 'signup'

  // Data from backend
  const [creators, setCreators] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [collaborations, setCollaborations] = useState([]);
  const [events, setEvents] = useState([]);
  const [overviewStats, setOverviewStats] = useState({
    totalCreators: 248,
    totalReach: "588.6K",
    engagementRate: "3.32%",
    activeCampaigns: 24,
    socialEngagements: "50,000+",
    colleges: 100
  });
  const [chartData, setChartData] = useState([]);
  const [activities, setActivities] = useState([]);
  const [dbStatus, setDbStatus] = useState({ mode: 'memory', active: true });
  const [loading, setLoading] = useState(true);

  // Modals & Notifications
  const [toast, setToast] = useState(null);
  const [createCampaignModalOpen, setCreateCampaignModalOpen] = useState(false);
  const [addCreatorModalOpen, setAddCreatorModalOpen] = useState(false);
  const [createEventModalOpen, setCreateEventModalOpen] = useState(false);
  const [matchScoreModalOpen, setMatchScoreModalOpen] = useState(false);
  const [selectedCreatorForModal, setSelectedCreatorForModal] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Theme Mode: 'dark' | 'light'
  const [theme, setTheme] = useState(() => {
    try {
      const stored = localStorage.getItem('campusbuzz_theme');
      return stored === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('campusbuzz_theme', theme);
    } catch (e) {
      console.error(e);
    }
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      showToast(`Switched to ${next === 'dark' ? 'Dark 🌙' : 'Light ☀️'} Mode`, 'info');
      return next;
    });
  };

  // Detail Drawer state (Sliding from right: 'event' | 'campaign' | 'creator' | 'student')
  const [detailDrawer, setDetailDrawer] = useState({ isOpen: false, type: null, data: null });

  const openDetailDrawer = (type, data) => {
    setDetailDrawer({ isOpen: true, type, data });
  };

  const closeDetailDrawer = () => {
    setDetailDrawer({ isOpen: false, type: null, data: null });
  };

  // Saved Posts state (persisted in localStorage)
  const [savedPostIds, setSavedPostIds] = useState(() => {
    try {
      const stored = localStorage.getItem('cb_saved_post_ids');
      return stored ? JSON.parse(stored) : [1, 2];
    } catch {
      return [1, 2];
    }
  });

  const toggleSavePost = (postId) => {
    setSavedPostIds(prev => {
      let next;
      if (prev.includes(postId)) {
        next = prev.filter(id => id !== postId);
        showToast('Post removed from saved collection', 'info');
      } else {
        next = [...prev, postId];
        showToast('Post bookmarked in Saved Posts!', 'success');
        triggerConfetti();
      }
      try {
        localStorage.setItem('cb_saved_post_ids', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#a855f7', '#ff7a00', '#00f0ff', '#ec4899']
    });
  };

  // Fetch initial data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [creatorsRes, campaignsRes, collabsRes, eventsRes, analyticsRes, dbRes] = await Promise.all([
        fetch(apiUrl('/api/creators')).then(r => r.json()).catch(() => ({ data: [] })),
        fetch(apiUrl('/api/campaigns')).then(r => r.json()).catch(() => ({ data: [] })),
        fetch(apiUrl('/api/collaborations')).then(r => r.json()).catch(() => ({ data: [] })),
        fetch(apiUrl('/api/events')).then(r => r.json()).catch(() => ({ data: [] })),
        fetch(apiUrl('/api/analytics')).then(r => r.json()).catch(() => ({})),
        fetch(apiUrl('/api/db-status')).then(r => r.json()).catch(() => ({}))
      ]);

      if (creatorsRes.data) setCreators(creatorsRes.data);
      if (campaignsRes.data) setCampaigns(campaignsRes.data);
      if (collabsRes.data) setCollaborations(collabsRes.data);
      if (eventsRes.data) setEvents(eventsRes.data);
      if (analyticsRes.overview) setOverviewStats(analyticsRes.overview);
      if (analyticsRes.chartData) setChartData(analyticsRes.chartData);
      if (analyticsRes.recentActivities) setActivities(analyticsRes.recentActivities);
      if (dbRes.mode) setDbStatus(dbRes);
    } catch (err) {
      console.error('Error fetching data from API:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // CRUD Actions
  const createCampaign = async (campaignData) => {
    try {
      const res = await fetch(apiUrl('/api/campaigns'), {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(campaignData)
      });
      const data = await res.json();
      if (data.success) {
        setCampaigns(prev => [data.data, ...prev]);
        setOverviewStats(prev => ({ ...prev, activeCampaigns: prev.activeCampaigns + 1 }));
        showToast('Campaign launched successfully!', 'success');
        triggerConfetti();
        return true;
      } else {
        showToast(data.message || 'Error creating campaign', 'error');
        return false;
      }
    } catch (err) {
      showToast('Network error creating campaign', 'error');
      return false;
    }
  };

  const createCreator = async (creatorData) => {
    try {
      const res = await fetch(apiUrl('/api/creators'), {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(creatorData)
      });
      const data = await res.json();
      if (data.success) {
        setCreators(prev => [data.data, ...prev]);
        setOverviewStats(prev => ({ ...prev, totalCreators: prev.totalCreators + 1 }));
        showToast('Creator profile added to network!', 'success');
        triggerConfetti();
        return true;
      } else {
        showToast(data.message || 'Error creating creator', 'error');
        return false;
      }
    } catch (err) {
      showToast('Network error adding creator', 'error');
      return false;
    }
  };

  const registerForEvent = async (eventId) => {
    try {
      const res = await fetch(apiUrl(`/api/events/${eventId}/register`), {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ student_id: currentUser?.id || 1 })
      });
      const data = await res.json();
      if (data.success) {
        setEvents(prev => prev.map(ev => ev.id === eventId ? { ...ev, registered_count: (ev.registered_count || 0) + 1 } : ev));
        showToast(`Registration confirmed for event!`, 'success');
        triggerConfetti();
      }
    } catch (err) {
      showToast('Registration error', 'error');
    }
  };

  const updateCollaborationStatus = async (collabId, project_status) => {
    try {
      const res = await fetch(apiUrl(`/api/collaborations/${collabId}`), {
        method: 'PUT',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ project_status })
      });
      const data = await res.json();
      if (data.success) {
        setCollaborations(prev => prev.map(c => c.id === collabId ? { ...c, project_status } : c));
        showToast(`Collaboration updated to "${project_status}"`, 'success');
      }
    } catch (err) {
      showToast('Error updating collaboration', 'error');
    }
  };

  const verifyCreatorAdmin = async (creatorId, status) => {
    try {
      const res = await fetch(apiUrl(`/api/admin/verify-creator/${creatorId}`), {
        method: 'PUT',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        setCreators(prev => prev.map(c => c.id === creatorId ? { ...c, verification_status: status } : c));
        showToast(`Creator status set to ${status}`, 'success');
      }
    } catch (err) {
      showToast('Verification update error', 'error');
    }
  };

  const loginUser = (userObj, token) => {
    setCurrentUser(userObj);
    try {
      if (token) localStorage.setItem('campusbuzz_token', token);
      localStorage.setItem('campusbuzz_user', JSON.stringify(userObj));
    } catch {}
    setIsAuthOpen(false);
    showToast(`Welcome back, ${userObj.name}!`, 'success');
  };

  const logoutUser = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('campusbuzz_token');
      localStorage.removeItem('campusbuzz_user');
    } catch {}
    showToast('Logged out successfully', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        dashboardTab,
        setDashboardTab,
        currentUser,
        setCurrentUser,
        loginUser,
        logoutUser,
        isAuthOpen,
        setIsAuthOpen,
        authMode,
        setAuthMode,
        creators,
        campaigns,
        collaborations,
        events,
        overviewStats,
        chartData,
        activities,
        dbStatus,
        loading,
        fetchData,
        createCampaign,
        createCreator,
        registerForEvent,
        updateCollaborationStatus,
        verifyCreatorAdmin,
        toast,
        showToast,
        triggerConfetti,
        createCampaignModalOpen,
        setCreateCampaignModalOpen,
        addCreatorModalOpen,
        setAddCreatorModalOpen,
        createEventModalOpen,
        setCreateEventModalOpen,
        matchScoreModalOpen,
        setMatchScoreModalOpen,
        selectedCreatorForModal,
        setSelectedCreatorForModal,
        mobileDrawerOpen,
        setMobileDrawerOpen,
        sidebarCollapsed,
        setSidebarCollapsed,
        detailDrawer,
        setDetailDrawer,
        openDetailDrawer,
        closeDetailDrawer,
        savedPostIds,
        setSavedPostIds,
        toggleSavePost,
        theme,
        setTheme,
        toggleTheme
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
