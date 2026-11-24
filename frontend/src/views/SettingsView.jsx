import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { 
  User, 
  Lock, 
  Bell, 
  ShieldCheck, 
  Palette, 
  Instagram, 
  Youtube, 
  Linkedin, 
  Globe, 
  Save, 
  CheckCircle2, 
  GraduationCap, 
  Building, 
  BookOpen, 
  Mail, 
  Smartphone, 
  KeyRound, 
  Sparkles,
  Loader2,
  RefreshCw
} from 'lucide-react';

export default function SettingsView() {
  const { currentUser, setCurrentUser, showToast, triggerConfetti } = useApp();

  const [activeTab, setActiveTab] = useState('profile'); // profile, socials, notifications, security, appearance
  const [saving, setSaving] = useState(false);

  // Form states initialized with currentUser
  const [name, setName] = useState(currentUser?.name || 'Aanya Sharma');
  const [email, setEmail] = useState(currentUser?.email || 'aanya@campus.edu');
  const [username, setUsername] = useState(currentUser?.username || 'aanya.sharma');
  const [college, setCollege] = useState(currentUser?.college || 'Delhi University');
  const [department, setDepartment] = useState(currentUser?.department || 'Media & Journalism');
  const [course, setCourse] = useState(currentUser?.course || 'BA Journalism & Mass Comm');
  const [bio, setBio] = useState(currentUser?.bio || 'Collegiate lifestyle creator, campus host & media student documenting Delhi University stories ✨');
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80');

  // Social handles
  const [instagram, setInstagram] = useState('aanya.sharma_official');
  const [youtube, setYoutube] = useState('AanyaSharmaVlogs');
  const [linkedin, setLinkedin] = useState('aanya-sharma-du');
  const [website, setWebsite] = useState('https://campusbuzz.in/u/aanya');

  // Notification preferences
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [campaignAlerts, setCampaignAlerts] = useState(true);
  const [eventReminders, setEventReminders] = useState(true);
  const [collabInvites, setCollabInvites] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  // Security
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  // Appearance
  const [themeAccent, setThemeAccent] = useState('purple'); // purple, cyan, rose, emerald

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Simulate backend patch or execute real API update
      const updated = {
        ...currentUser,
        name,
        full_name: name,
        email,
        username,
        college,
        department,
        course,
        bio,
        avatar_url: avatarUrl
      };

      setCurrentUser(updated);
      triggerConfetti();
      showToast('Settings saved successfully! ✓', 'success');
    } catch (err) {
      showToast('Error saving settings', 'error');
    } finally {
      setTimeout(() => setSaving(false), 400);
    }
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) {
      showToast('New passwords do not match!', 'error');
      return;
    }
    showToast('Password updated successfully! 🔒', 'success');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="pb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_#a855f7]" />
          <span className="text-[10px] font-mono tracking-widest uppercase text-purple-400 font-semibold">
            PREFERENCES & ACCOUNT
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight">
          Platform Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage your collegiate creator profile, connected handles, notification channels, and security settings.
        </p>
      </div>

      {/* Main Grid: Tabs Sidebar (Left) + Settings Forms (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Navigation Tabs */}
        <div className="glass-panel p-2.5 rounded-2xl space-y-1 h-fit">
          {[
            { id: 'profile', label: 'Profile & Identity', icon: User, desc: 'Name, avatar & university' },
            { id: 'socials', label: 'Creator Channels', icon: Globe, desc: 'Instagram, YouTube, links' },
            { id: 'notifications', label: 'Alert Preferences', icon: Bell, desc: 'Email & push channels' },
            { id: 'security', label: 'Security & Access', icon: Lock, desc: 'Password & 2FA' },
            { id: 'appearance', label: 'Appearance & Theme', icon: Palette, desc: 'Accent colors & UI' },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full p-3 rounded-xl text-left transition-all flex items-center gap-3 cursor-pointer ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.35)]'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <div className={`p-2 rounded-lg ${isSelected ? 'bg-white/20' : 'bg-white/[0.04]'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold leading-tight">{tab.label}</p>
                  <p className={`text-[10px] truncate ${isSelected ? 'text-purple-100' : 'text-slate-500'}`}>
                    {tab.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Tab Content (3 Cols) */}
        <div className="lg:col-span-3">
          
          {/* TAB 1: Profile & Identity */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="glass-panel p-6 rounded-2xl space-y-6">
              <div>
                <h3 className="text-base font-bold text-white">Student Creator Profile</h3>
                <p className="text-xs text-slate-400 mt-0.5">This information is visible across CampusBuzz directory and campaign rosters.</p>
              </div>

              {/* Avatar Photo Section */}
              <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <img
                  src={avatarUrl}
                  alt={name}
                  className="w-20 h-20 rounded-2xl object-cover ring-2 ring-purple-500/50 shadow-xl"
                />
                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <span className="text-xs font-bold text-white block">Profile Photo URL</span>
                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-[#12141c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50"
                  />
                  <p className="text-[10px] text-slate-500 font-mono">Use any square portrait image link.</p>
                </div>
              </div>

              {/* Personal Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#12141c] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500/50"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Campus Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#12141c] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500/50"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">College / University</label>
                  <input
                    type="text"
                    required
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    className="w-full bg-[#12141c] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500/50"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Department</label>
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-[#12141c] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500/50"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Bio / Creator Statement</label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full bg-[#12141c] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500/50 leading-relaxed"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-white/[0.06]">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-[0_0_20px_rgba(168,85,247,0.4)] transition cursor-pointer"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: Creator Channels */}
          {activeTab === 'socials' && (
            <div className="glass-panel p-6 rounded-2xl space-y-6">
              <div>
                <h3 className="text-base font-bold text-white">Connected Creator Channels</h3>
                <p className="text-xs text-slate-400 mt-0.5">Used by campus brand sponsors to verify reach and engagement rates.</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="p-2.5 rounded-xl bg-pink-500/10 text-pink-400">
                    <Instagram className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] font-mono text-slate-400 uppercase block">Instagram Handle</span>
                    <input
                      type="text"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      placeholder="@handle"
                      className="w-full bg-transparent text-xs text-white font-semibold focus:outline-none border-b border-white/10 focus:border-pink-500/50 py-1"
                    />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Connected
                  </span>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="p-2.5 rounded-xl bg-red-500/10 text-red-400">
                    <Youtube className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] font-mono text-slate-400 uppercase block">YouTube Channel</span>
                    <input
                      type="text"
                      value={youtube}
                      onChange={(e) => setYoutube(e.target.value)}
                      placeholder="Channel Name"
                      className="w-full bg-transparent text-xs text-white font-semibold focus:outline-none border-b border-white/10 focus:border-red-500/50 py-1"
                    />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Verified
                  </span>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
                    <Linkedin className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] font-mono text-slate-400 uppercase block">LinkedIn Profile</span>
                    <input
                      type="text"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      placeholder="username"
                      className="w-full bg-transparent text-xs text-white font-semibold focus:outline-none border-b border-white/10 focus:border-cyan-500/50 py-1"
                    />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Synced
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => showToast('Creator channels updated! 🌐', 'success')}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-[0_0_20px_rgba(168,85,247,0.4)] transition cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Update Channels</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Notification Alerts */}
          {activeTab === 'notifications' && (
            <div className="glass-panel p-6 rounded-2xl space-y-6">
              <div>
                <h3 className="text-base font-bold text-white">Alert Preferences</h3>
                <p className="text-xs text-slate-400 mt-0.5">Control how and when you receive collegiate updates.</p>
              </div>

              <div className="space-y-4">
                {[
                  { label: 'Brand Campaign Approvals', desc: 'Instant alerts when your pitch is accepted by brand sponsors', state: campaignAlerts, setter: setCampaignAlerts },
                  { label: 'Campus Event VIP Passes', desc: 'Reminders 24 hours before registered hackathons and fests', state: eventReminders, setter: setEventReminders },
                  { label: 'Peer Collaboration Requests', desc: 'Direct requests from other creators on campus', state: collabInvites, setter: setCollabInvites },
                  { label: 'Weekly Creator Digest', desc: 'Weekly ranking leaderboard recap and stats report', state: weeklyDigest, setter: setWeeklyDigest },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <div>
                      <p className="text-xs font-bold text-white">{item.label}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={item.state} 
                        onChange={(e) => {
                          item.setter(e.target.checked);
                          showToast(`${item.label} ${e.target.checked ? 'enabled' : 'disabled'}`, 'info');
                        }}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Security & Access */}
          {activeTab === 'security' && (
            <form onSubmit={handlePasswordChange} className="glass-panel p-6 rounded-2xl space-y-6">
              <div>
                <h3 className="text-base font-bold text-white">Password & Authentication</h3>
                <p className="text-xs text-slate-400 mt-0.5">Ensure your account is protected with strong credentials.</p>
              </div>

              <div className="space-y-4 text-xs max-w-md">
                <div>
                  <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Current Password</label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#12141c] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500/50"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#12141c] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500/50"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#12141c] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500/50"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">Two-Factor Authentication (2FA)</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Require an OTP code from your authenticator app on login.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setTwoFactorAuth(!twoFactorAuth);
                    showToast(`2FA ${!twoFactorAuth ? 'Activated' : 'Deactivated'}`, 'info');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    twoFactorAuth ? 'bg-emerald-600 text-white' : 'bg-white/10 text-slate-300 hover:text-white'
                  }`}
                >
                  {twoFactorAuth ? 'Active' : 'Enable 2FA'}
                </button>
              </div>

              <div className="flex justify-end pt-3 border-t border-white/[0.06]">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-[0_0_20px_rgba(168,85,247,0.4)] transition cursor-pointer"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Update Password</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 5: Appearance & Theme */}
          {activeTab === 'appearance' && (
            <div className="glass-panel p-6 rounded-2xl space-y-6">
              <div>
                <h3 className="text-base font-bold text-white">Appearance & Branding</h3>
                <p className="text-xs text-slate-400 mt-0.5">Customize your personal dashboard aesthetic and accent accents.</p>
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase text-slate-400 block mb-3">Accent Theme</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'purple', label: 'Midnight Purple', bg: 'from-purple-600 to-indigo-600', ring: 'ring-purple-500' },
                    { id: 'cyan', label: 'Cyber Cyan', bg: 'from-cyan-500 to-blue-600', ring: 'ring-cyan-400' },
                    { id: 'rose', label: 'Neon Rose', bg: 'from-pink-500 to-rose-600', ring: 'ring-pink-500' },
                    { id: 'emerald', label: 'Emerald Mint', bg: 'from-emerald-500 to-teal-600', ring: 'ring-emerald-400' },
                  ].map((theme) => (
                    <div
                      key={theme.id}
                      onClick={() => {
                        setThemeAccent(theme.id);
                        showToast(`Theme accent set to ${theme.label}! ✨`, 'info');
                      }}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        themeAccent === theme.id 
                          ? 'border-purple-500 bg-purple-950/20 ring-2 ' + theme.ring
                          : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'
                      }`}
                    >
                      <div className={`w-full h-8 rounded-lg bg-gradient-to-r ${theme.bg} mb-2 shadow-sm`} />
                      <p className="text-xs font-bold text-white text-center">{theme.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <p className="text-xs font-bold text-white">Default Display Mode</p>
                <p className="text-[11px] text-slate-400 mt-0.5">CampusBuzz runs on ultra-efficient GPU dark mode by default for maximum OLED clarity and contrast.</p>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
