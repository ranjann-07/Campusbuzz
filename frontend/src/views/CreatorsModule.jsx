import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { apiUrl } from '../config/api';
import TiltCard from '../components/TiltCard';
import { 
  Search, 
  Filter, 
  Instagram, 
  Youtube, 
  CheckCircle2, 
  Plus, 
  Star, 
  GraduationCap, 
  Sparkles,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Users,
  Linkedin,
  Eye
} from 'lucide-react';

export default function CreatorsModule() {
  const { setAddCreatorModalOpen, setSelectedCreatorForModal, openDetailDrawer } = useApp();

  const [students, setStudents] = useState([]);
  const [totalStudents, setTotalStudents] = useState(10200);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(425);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCollege, setSelectedCollege] = useState('All');
  const [sortBy, setSortBy] = useState('followers');

  const categories = ['All', 'Technology', 'Lifestyle', 'Fashion', 'Photography', 'Music', 'Gaming', 'Fitness', 'Comedy & Satire', 'Literature & Debating'];
  const colleges = [
    'All', 'Shoolini University', 'Delhi University', 'IIT Bombay', 'NIFT Delhi', 'St. Xavier\'s College Mumbai',
    'Christ University', 'BITS Pilani', 'Ashoka University', 'SRM Institute of Science and Technology',
    'Manipal Academy of Higher Education', 'IIT Delhi', 'Jadavpur University', 'Symbiosis International'
  ];

  const fetchStudents = async (targetPage = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: targetPage,
        limit: 24,
        search: searchQuery,
        category: selectedCategory,
        college: selectedCollege,
        sortBy
      });

      const res = await fetch(apiUrl(`/api/students?${params}`));
      const data = await res.json();
      if (data.success) {
        setStudents(data.data);
        setTotalStudents(data.total);
        setPage(data.page);
        setTotalPages(data.totalPages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents(1);
  }, [selectedCategory, selectedCollege, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchStudents(1);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_#a855f7]" />
            <span className="text-[10px] font-mono tracking-widest uppercase text-purple-400 font-semibold">
              LARGE-SCALE STUDENT DATABASE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight">
            Student Creator Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse through <strong>{totalStudents.toLocaleString()}</strong> verified collegiate student profiles & accounts.
          </p>
        </div>

        <button
          onClick={() => setAddCreatorModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-[0_0_20px_rgba(168,85,247,0.4)] transition self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Student</span>
        </button>
      </div>

      {/* Featured Top Creator of the Month Spotlight Banner */}
      <div className="glass-panel p-5 rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-950/40 via-[#121422] to-slate-900/40 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-5 shadow-[0_8px_30px_rgba(168,85,247,0.15)]">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4 min-w-0 w-full md:w-auto">
          <div className="relative flex-shrink-0">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80"
              alt="Shivani Negi"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-purple-500 shadow-xl"
            />
            <div className="absolute -bottom-1.5 -right-1.5 p-1 bg-[#08090D] rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1 shadow-sm">
                <span>★</span>
                <span>TOP CREATOR OF THE MONTH</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                #1 on Campus
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-black text-white font-display tracking-tight flex items-center gap-2">
              <span>Shivani Negi</span>
              <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
            </h3>

            <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5 truncate">
              <GraduationCap className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
              <span>Shoolini University • Art & Animation & Campus Vlogging</span>
            </p>

            <div className="flex items-center gap-3 mt-2 text-xs font-mono">
              <span className="text-white font-bold bg-white/[0.05] px-2.5 py-0.5 rounded-lg border border-white/10">
                184,500 Followers
              </span>
              <span className="text-pink-400 font-bold bg-pink-500/10 px-2 py-0.5 rounded-lg border border-pink-500/20">
                5.70% Eng. Rate
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-shrink-0 w-full md:w-auto">
          <button
            onClick={() => setSelectedCreatorForModal({
              id: 5,
              student_id: 'CB-2026-00005',
              name: 'Shivani Negi',
              full_name: 'Shivani Negi',
              college: 'Shoolini University',
              college_name: 'Shoolini University',
              category: 'Art & Animation',
              creator_category: 'Art & Animation',
              followers: 184500,
              followers_count: 184500,
              engagement_rate: 5.70,
              avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80',
              profile_photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80',
              bio: 'Top Creator of the Month • Nature lover, campus vlogger & Himalayan storyteller at Shoolini University. ✨🏔️',
              rating: 4.95,
              total_collaborations: 18
            })}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-[0_0_20px_rgba(168,85,247,0.4)] transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>View Top Creator Profile</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="glass-panel p-4 rounded-2xl space-y-4">
        
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, student ID (e.g. CB-2026-00001), username, or department..."
              className="w-full bg-[#12141c] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 transition"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-[#181c28] hover:bg-[#202538] border border-white/10 text-xs font-semibold text-white transition"
          >
            Search Database
          </button>

          {/* College Filter */}
          <div className="w-full md:w-56">
            <select
              value={selectedCollege}
              onChange={(e) => setSelectedCollege(e.target.value)}
              className="w-full bg-[#12141c] border border-white/[0.08] rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500/50 transition"
            >
              {colleges.map((col, idx) => (
                <option key={idx} value={col} className="bg-[#12141c] text-white">
                  {col === 'All' ? 'All Universities' : col}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="w-full md:w-44">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-[#12141c] border border-white/[0.08] rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500/50 transition font-mono"
            >
              <option value="followers">Followers (High to Low)</option>
              <option value="engagement">Engagement Rate</option>
              <option value="newest">Recently Joined</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>

        </form>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3" /> Domains:
          </span>
          {categories.map((cat, idx) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={idx}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                    : 'bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.08]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

      </div>

      {/* Pagination Status Top Indicator */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-mono">
        <span>
          Showing {((page - 1) * 24) + 1}–{Math.min(page * 24, totalStudents)} of {totalStudents.toLocaleString()} Students
        </span>
        <span>Page {page} of {totalPages}</span>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {students.map((creator) => (
          <TiltCard
            key={creator.id}
            glowColor={creator.category === 'Technology' ? 'cyan' : (creator.category === 'Gaming' ? 'orange' : 'purple')}
            className="glass-card-interactive p-5 flex flex-col justify-between"
          >
            <div>
              {/* Creator Card Header */}
              <div className="flex items-start justify-between mb-3.5">
                <div className="relative">
                  <img
                    src={creator.avatar_url}
                    alt={creator.name}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-purple-500/40"
                    loading="lazy"
                  />
                  <div className="absolute -bottom-1 -right-1 p-0.5 bg-[#08090D] rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400/20" />
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/15 text-purple-300 border border-purple-500/25">
                    {creator.category}
                  </span>

                  {/* DIRECT VIEW BUTTON ON THE SIDE */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (openDetailDrawer) {
                        openDetailDrawer('creator', creator);
                      } else {
                        setSelectedCreatorForModal(creator);
                      }
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-600/20 hover:bg-purple-600 text-[11px] font-bold text-purple-200 hover:text-white border border-purple-500/35 transition-all cursor-pointer shadow-sm group"
                    title="View Profile Details"
                  >
                    <Eye className="w-3.5 h-3.5 text-purple-300 group-hover:scale-110" />
                    <span>View</span>
                  </button>
                </div>
              </div>

              {/* Creator Identity */}
              <h3 className="font-extrabold text-base text-white tracking-tight leading-snug">
                {creator.name}
              </h3>
              <p className="text-xs text-purple-300 font-medium flex items-center gap-1 mt-0.5">
                <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
                <span className="truncate">{creator.college}</span>
              </p>
              <p className="text-[11px] text-slate-400 truncate mt-0.5">
                {creator.course} • Sem {creator.semester}
              </p>

              {/* Bio Snippet */}
              <p className="text-xs text-slate-300 line-clamp-2 mt-2.5 leading-relaxed">
                {creator.bio}
              </p>

              {/* Numerical Metrics */}
              <div className="mt-4 pt-3 border-t border-white/[0.06] grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-xl bg-white/[0.02]">
                  <span className="text-[10px] text-slate-400 block uppercase font-mono">Followers</span>
                  <span className="font-bold text-white text-sm font-mono">
                    {creator.followers.toLocaleString()}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-white/[0.02]">
                  <span className="text-[10px] text-slate-400 block uppercase font-mono">Eng. Rate</span>
                  <span className="font-bold text-pink-400 text-sm font-mono">
                    {creator.engagement_rate}%
                  </span>
                </div>
              </div>

              {/* Social Handles */}
              <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1 text-[11px] text-pink-400">
                  <Instagram className="w-3 h-3" /> @{creator.instagram}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  Year {creator.year}
                </span>
              </div>
            </div>

            {/* View Full Profile Action */}
            <button
              onClick={() => {
                if (openDetailDrawer) {
                  openDetailDrawer('creator', creator);
                } else {
                  setSelectedCreatorForModal(creator);
                }
              }}
              className="mt-4 w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-purple-600/20 border border-white/10 hover:border-purple-500/40 text-xs font-semibold text-slate-200 hover:text-purple-300 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>View Profile & Metrics</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </TiltCard>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="glass-panel p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 mt-8">
        <button
          onClick={() => fetchStudents(page - 1)}
          disabled={page <= 1 || loading}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] disabled:opacity-40 text-xs font-semibold text-slate-200 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous 24</span>
        </button>

        <div className="flex items-center gap-1 font-mono text-xs">
          <span className="text-slate-400">Page</span>
          <span className="px-3 py-1 rounded-lg bg-purple-600/20 text-purple-300 font-bold border border-purple-500/30">
            {page}
          </span>
          <span className="text-slate-500">of {totalPages}</span>
        </div>

        <button
          onClick={() => fetchStudents(page + 1)}
          disabled={page >= totalPages || loading}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-xs font-bold text-white shadow transition"
        >
          <span>Next 24</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
