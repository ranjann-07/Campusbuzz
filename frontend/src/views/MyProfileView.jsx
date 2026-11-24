import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import EditProfileModal from '../components/EditProfileModal';
import { 
  User, 
  GraduationCap, 
  Instagram, 
  Youtube, 
  Linkedin, 
  Edit3, 
  CheckCircle2, 
  Calendar, 
  Megaphone, 
  FileText, 
  Clock, 
  Sparkles, 
  Star,
  Activity
} from 'lucide-react';

export default function MyProfileView() {
  const { currentUser } = useApp();

  const [studentDetails, setStudentDetails] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState('posts');
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const studentId = currentUser?.id || 1;

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/students/${studentId}`);
      const data = await res.json();
      if (data.success) {
        setStudentDetails(data.student);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [currentUser]);

  const student = studentDetails || {
    full_name: currentUser?.name || 'Aanya Sharma',
    student_id: currentUser?.student_id || 'CB-2026-00001',
    email: currentUser?.email || 'aanya@campus.edu',
    college_name: currentUser?.college || 'Delhi University',
    department_name: currentUser?.department || 'Media & Mass Communication',
    course: currentUser?.course || 'BA Journalism',
    semester: currentUser?.semester || 5,
    year: currentUser?.year || 3,
    creator_category: currentUser?.creator_category || 'Lifestyle',
    followers_count: currentUser?.followers_count || 24800,
    engagement_rate: currentUser?.engagement_rate || 4.80,
    profile_photo: currentUser?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
    bio: currentUser?.bio || 'Lifestyle, aesthetic campus fashion, and creative storytelling across college campuses in Delhi NCR.',
    instagram: currentUser?.instagram || 'aanya.sharmaa',
    youtube: currentUser?.youtube || 'AanyaSharmaVlogs',
    linkedin: currentUser?.linkedin || 'aanya-sharma-media',
    registered_events: [],
    applied_campaigns: []
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300">
      
      {/* Profile Header Banner */}
      <div className="relative rounded-3xl glass-panel p-6 sm:p-8 border border-purple-500/30 overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <div className="relative">
              <img
                src={student.profile_photo}
                alt={student.full_name}
                className="w-28 h-28 rounded-3xl object-cover ring-4 ring-purple-500/50 shadow-2xl"
              />
              <div className="absolute -bottom-2 -right-2 p-1 bg-[#08090D] rounded-full">
                <CheckCircle2 className="w-6 h-6 text-cyan-400 fill-cyan-400/20" />
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-black font-display text-white">
                  {student.full_name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {student.creator_category}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {student.student_id}
                </span>
              </div>

              <p className="text-xs text-purple-300 font-medium flex items-center justify-center sm:justify-start gap-1.5 mt-1">
                <GraduationCap className="w-4 h-4 text-purple-400" />
                <span>{student.college_name} • {student.department_name}</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {student.course} • Semester {student.semester} (Year {student.year})
              </p>

              <div className="flex items-center justify-center sm:justify-start gap-4 mt-3 text-xs">
                {student.instagram && (
                  <a href={`https://instagram.com/${student.instagram}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-pink-400 hover:underline">
                    <Instagram className="w-3.5 h-3.5" /> @{student.instagram}
                  </a>
                )}
                {student.youtube && (
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <Youtube className="w-3.5 h-3.5 text-red-500" /> {student.youtube}
                  </span>
                )}
                {student.linkedin && (
                  <span className="flex items-center gap-1.5 text-cyan-400">
                    <Linkedin className="w-3.5 h-3.5" /> {student.linkedin}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEditOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-[0_0_15px_rgba(168,85,247,0.4)] transition"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        </div>

        {/* Bio */}
        <p className="relative z-10 mt-6 pt-5 border-t border-white/[0.08] text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
          {student.bio}
        </p>

        {/* Numerical Metrics Bar */}
        <div className="relative z-10 mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
            <span className="text-[10px] text-slate-400 uppercase block font-sans">Followers</span>
            <span className="text-xl font-black text-white font-display">{(student.followers_count || 24800).toLocaleString()}</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
            <span className="text-[10px] text-slate-400 uppercase block font-sans">Eng. Rate</span>
            <span className="text-xl font-black text-pink-400 font-display">{student.engagement_rate}%</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
            <span className="text-[10px] text-slate-400 uppercase block font-sans">Total Reach</span>
            <span className="text-xl font-black text-purple-300 font-display">12.5K+</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
            <span className="text-[10px] text-slate-400 uppercase block font-sans">Campus Rank</span>
            <span className="text-xl font-black text-amber-400 font-display">#01 MVP</span>
          </div>
        </div>

      </div>

      {/* Profile Sub-tabs */}
      <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3 text-xs font-semibold">
        <button
          onClick={() => setActiveSubTab('posts')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
            activeSubTab === 'posts' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>My Activity Posts ({student.posts_count || 12})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('events')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
            activeSubTab === 'events' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Registered Events ({student.registered_events?.length || 3})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('campaigns')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
            activeSubTab === 'campaigns' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          <span>Applied Campaigns ({student.applied_campaigns?.length || 2})</span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeSubTab === 'events' && (
        <div className="space-y-3">
          {(student.registered_events || []).length === 0 ? (
            <div className="glass-panel p-8 text-center rounded-2xl text-slate-400 text-xs">
              <Calendar className="w-8 h-8 text-purple-400 mx-auto mb-2 opacity-60" />
              <p>You haven't registered for any events yet. Check out upcoming campus events!</p>
            </div>
          ) : (
            student.registered_events.map(ev => (
              <div key={ev.id} className="p-4 rounded-2xl glass-panel flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">{ev.name}</h4>
                  <p className="text-xs text-purple-300 font-mono mt-0.5">{ev.event_date} • {ev.venue}</p>
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                  Confirmed Seat ✓
                </span>
              </div>
            ))
          )}
        </div>
      )}

      {activeSubTab === 'campaigns' && (
        <div className="space-y-3">
          {(student.applied_campaigns || []).length === 0 ? (
            <div className="glass-panel p-8 text-center rounded-2xl text-slate-400 text-xs">
              <Megaphone className="w-8 h-8 text-orange-400 mx-auto mb-2 opacity-60" />
              <p>You haven't applied for brand campaigns yet. Explore active sponsorships!</p>
            </div>
          ) : (
            student.applied_campaigns.map(camp => (
              <div key={camp.id} className="p-4 rounded-2xl glass-panel flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">{camp.name}</h4>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{camp.brand_name} • ₹{camp.budget?.toLocaleString()}</p>
                </div>
                <span className="text-xs font-mono text-purple-300 bg-purple-500/15 border border-purple-500/30 px-3 py-1 rounded-full capitalize">
                  Status: {camp.app_status || 'Pending Review'}
                </span>
              </div>
            ))
          )}
        </div>
      )}

      {activeSubTab === 'posts' && (
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <h3 className="font-bold text-white font-display text-sm">Recent Publications</h3>
            <span className="text-xs font-mono text-purple-400">Live on Campus Feed</span>
          </div>
          <div className="space-y-3">
            {[
              { text: "Campus Fest vibes! 💜 The energy across the pine amphitheatre tonight was surreal.", likes: 842, comments: 128 },
              { text: "Nature hits different 🏔️ Early morning walk along the misty mountain ridge trail behind campus.", likes: 1250, comments: 194 },
              { text: "Sustainable campus fits on a student budget! Re-styled 3 thrifted vintage jackets.", likes: 450, comments: 52 }
            ].map((p, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <p className="text-xs text-slate-200 leading-relaxed">{p.text}</p>
                <div className="mt-2 text-[10px] font-mono text-slate-400 flex items-center gap-3">
                  <span>❤️ {p.likes} likes</span>
                  <span>💬 {p.comments} comments</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      <EditProfileModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} />

    </div>
  );
}
