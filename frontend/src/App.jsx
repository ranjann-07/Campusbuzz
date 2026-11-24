import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import LandingPage from './views/LandingPage';
import DashboardLayout from './views/DashboardLayout';
import DashboardOverview from './views/DashboardOverview';
import SocialFeed from './views/SocialFeed';
import CreatorsModule from './views/CreatorsModule';
import CampaignsModule from './views/CampaignsModule';
import CollaborationModule from './views/CollaborationModule';
import EventsModule from './views/EventsModule';
import CalendarView from './views/CalendarView';
import AnalyticsModule from './views/AnalyticsModule';
import LeaderboardModule from './views/LeaderboardModule';
import AdminPanel from './views/AdminPanel';
import ClubsModule from './views/ClubsModule';
import MyProfileView from './views/MyProfileView';
import NotificationsCenter from './views/NotificationsCenter';
import SettingsView from './views/SettingsView';
import SavedPostsView from './views/SavedPostsView';
import LoginPage from './views/LoginPage';
import AuthModal from './components/AuthModal';
import CreateCampaignModal from './components/CreateCampaignModal';
import AddCreatorModal from './components/AddCreatorModal';
import CreateEventModal from './components/CreateEventModal';
import CreatorDetailModal from './components/CreatorDetailModal';
import MatchScoreModal from './components/MatchScoreModal';
import DetailDrawer from './components/DetailDrawer';
import GlobalSidebarDrawer from './components/GlobalSidebarDrawer';
import ToastNotification from './components/ToastNotification';

export default function App() {
  const { currentView, dashboardTab, matchScoreModalOpen, setMatchScoreModalOpen } = useApp();

  // Scroll to absolute top (0,0) whenever view or dashboard tab changes
  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  }, [currentView, dashboardTab]);

  const renderDashboardContent = () => {
    switch (dashboardTab) {
      case 'feed':
        return <SocialFeed />;
      case 'creators':
        return <CreatorsModule />;
      case 'campaigns':
        return <CampaignsModule />;
      case 'collaborations':
        return <CollaborationModule />;
      case 'events':
        return <EventsModule />;
      case 'calendar':
        return <CalendarView />;
      case 'clubs':
        return <ClubsModule />;
      case 'profile':
        return <MyProfileView />;
      case 'notifications':
        return <NotificationsCenter />;
      case 'analytics':
        return <AnalyticsModule />;
      case 'leaderboard':
        return <LeaderboardModule />;
      case 'admin':
        return <AdminPanel />;
      case 'settings':
        return <SettingsView />;
      case 'saved':
        return <SavedPostsView />;
      case 'overview':
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-[#08090D] flex flex-col selection:bg-purple-600 selection:text-white">
      {/* Main View Router */}
      {currentView === 'login' ? (
        <LoginPage />
      ) : currentView === 'landing' ? (
        <>
          <Navbar />
          <LandingPage />
        </>
      ) : (
        <DashboardLayout>
          <AnimatePresence mode="wait">
            <motion.div
              key={dashboardTab}
              initial={{ opacity: 0, x: 18, y: 6 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: -18, y: -6 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              {renderDashboardContent()}
            </motion.div>
          </AnimatePresence>
        </DashboardLayout>
      )}

      {/* Global Modals & Notifications */}
      <AuthModal />
      <CreateCampaignModal />
      <AddCreatorModal />
      <CreateEventModal />
      <CreatorDetailModal />
      <MatchScoreModal isOpen={matchScoreModalOpen} onClose={() => setMatchScoreModalOpen(false)} />
      <DetailDrawer />
      <GlobalSidebarDrawer />
      <ToastNotification />
    </div>
  );
}
