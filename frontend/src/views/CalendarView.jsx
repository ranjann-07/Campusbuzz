import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import InteractiveCalendar from '../components/InteractiveCalendar';
import { 
  Calendar as CalendarIcon, 
  CalendarDays, 
  MapPin, 
  Clock, 
  Users, 
  Plus, 
  Sparkles, 
  Tag, 
  Search,
  Filter,
  CheckCircle,
  ArrowUpRight
} from 'lucide-react';

export default function CalendarView() {
  const { setCreateEventModalOpen, currentUser, showToast, triggerConfetti } = useApp();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Technology', 'Music', 'Startup', 'Sports', 'Photography', 'Gaming', 'Cultural'];

  useEffect(() => {
    setLoading(true);
    fetch('/api/events?category=' + encodeURIComponent(selectedCategory))
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setEvents(data.data || []);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  const filteredEvents = events.filter(e => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      e.name?.toLowerCase().includes(q) ||
      e.venue?.toLowerCase().includes(q) ||
      e.category?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_#a855f7]" />
            <span className="text-[10px] font-mono tracking-widest uppercase text-purple-400 font-bold">
              CAMPUS SCHEDULE 2026–2027
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight flex items-center gap-2.5">
            <CalendarDays className="w-7 h-7 text-purple-400" />
            <span>Campus Event Calendar</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse and register for 20+ verified collegiate fests, hackathons, music summits, and competitions.
          </p>
        </div>

        <button
          onClick={() => setCreateEventModalOpen(true)}
          className="self-start sm:self-center flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-[0_0_20px_rgba(168,85,247,0.35)] transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Event to Calendar</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Quick Search in Calendar */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events in calendar…"
            className="w-full bg-[#12141c] border border-white/[0.08] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50"
          />
        </div>
      </div>

      {/* Full Interactive Month Calendar */}
      <InteractiveCalendar events={filteredEvents} />

    </div>
  );
}
