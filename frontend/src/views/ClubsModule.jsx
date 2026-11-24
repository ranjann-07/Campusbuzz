import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { apiUrl } from '../config/api';
import TiltCard from '../components/TiltCard';
import { 
  Users, 
  Sparkles, 
  Calendar, 
  MapPin, 
  Search, 
  CheckCircle, 
  UserCheck, 
  ArrowRight,
  Shield,
  Layers
} from 'lucide-react';

export default function ClubsModule() {
  const { currentUser, showToast, triggerConfetti } = useApp();

  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Technology', 'Sustainability', 'Music', 'Photography', 'Fashion', 'Startup'];

  const fetchClubs = async () => {
    setLoading(true);
    try {
      const studentId = currentUser?.id || 1;
      const res = await fetch(apiUrl(`/api/clubs?student_id=${studentId}`));
      const data = await res.json();
      if (data.success) {
        setClubs(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  const handleJoinToggle = async (club) => {
    const isMember = club.is_member;
    const endpoint = apiUrl(isMember ? `/api/clubs/${club.id}/leave` : `/api/clubs/${club.id}/join`);

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: currentUser?.id || 1 })
      });
      const data = await res.json();
      if (data.success) {
        setClubs(prev => prev.map(c => {
          if (c.id === club.id) {
            return {
              ...c,
              is_member: !isMember,
              members_count: isMember ? c.members_count - 1 : c.members_count + 1
            };
          }
          return c;
        }));

        if (!isMember) {
          showToast(`Joined ${club.name}!`, 'success');
          triggerConfetti();
        } else {
          showToast(`Left ${club.name}`, 'info');
        }
      }
    } catch (e) {
      showToast('Error updating membership', 'error');
    }
  };

  const filteredClubs = clubs.filter(c => {
    const matchesCat = selectedCategory === 'All' || c.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch = c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || c.leads_name.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff]" />
            <span className="text-[10px] font-mono tracking-widest uppercase text-cyan-400 font-semibold">
              COLLEGIATE SOCIETIES & GUILDS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight">
            Campus Clubs & Creator Collectives
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Connect with student-led technical societies, music bands, environmental collectives, and design guilds.
          </p>
        </div>

        <div className="text-xs font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-3.5 py-2 rounded-xl">
          <span>{clubs.length} Official Recognized Clubs</span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="glass-panel p-4 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search club name, domain or student leads..."
              className="w-full bg-[#12141c] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                    : 'bg-white/[0.03] text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Clubs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClubs.map((club) => (
          <TiltCard
            key={club.id}
            glowColor="cyan"
            className="glass-card-interactive rounded-2xl overflow-hidden flex flex-col justify-between"
          >
            <div>
              {/* Banner */}
              <div className="relative h-40 w-full overflow-hidden bg-[#141724]">
                <img
                  src={club.banner_url}
                  alt={club.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0e16] via-transparent to-transparent opacity-90" />
                
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase font-bold bg-[#08090D]/85 text-cyan-300 border border-cyan-500/30 backdrop-blur-md">
                  {club.category}
                </span>

                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-white/10 text-white backdrop-blur-md">
                  {club.members_count} Members
                </span>
              </div>

              {/* Body */}
              <div className="p-5">
                <h3 className="font-extrabold text-base text-white font-display leading-tight">
                  {club.name}
                </h3>
                <p className="text-xs text-purple-300 font-mono mt-1">
                  Lead: {club.leads_name}
                </p>

                <p className="text-xs text-slate-300 leading-relaxed mt-2.5 line-clamp-2">
                  {club.description}
                </p>

                <div className="mt-4 pt-3 border-t border-white/[0.06] text-xs text-slate-400 flex items-center gap-2 font-mono text-[11px]">
                  <Calendar className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
                  <span className="truncate">{club.meeting_schedule}</span>
                </div>
              </div>
            </div>

            {/* Action */}
            <div className="p-5 pt-0">
              <button
                onClick={() => handleJoinToggle(club)}
                className={`w-full py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 shadow ${
                  club.is_member
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-red-500/20 hover:text-red-300'
                    : 'bg-purple-600 hover:bg-purple-500 text-white'
                }`}
              >
                {club.is_member ? (
                  <>
                    <UserCheck className="w-4 h-4" />
                    <span>Member (Click to Leave)</span>
                  </>
                ) : (
                  <>
                    <Users className="w-4 h-4" />
                    <span>Join Club</span>
                  </>
                )}
              </button>
            </div>
          </TiltCard>
        ))}
      </div>

    </div>
  );
}
