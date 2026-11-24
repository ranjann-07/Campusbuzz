import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import TiltCard from '../components/TiltCard';
import InteractiveCalendar from '../components/InteractiveCalendar';
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  Users, 
  Plus, 
  Sparkles, 
  CheckCircle, 
  Clock, 
  Tag, 
  Search,
  Filter,
  Check,
  XCircle,
  LayoutGrid,
  CalendarDays,
  Trophy,
  X,
  Award
} from 'lucide-react';

const completedEventsFallback = [
  {
    id: 901,
    event_code: 'EVT-2026-CMP01',
    name: 'Autumn Youth Cultural Fest 2026',
    description: 'Flagship inter-college cultural fest with 35 college bands, celebrity DJ night, dance face-offs, and street theatre.',
    banner_image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
    event_date: '2026-11-18',
    start_time: '10:00 AM',
    end_time: '11:00 PM',
    venue: 'Central Campus Grounds & Open Air Amphitheatre',
    organizer: 'CampusBuzz Cultural Board',
    category: 'Cultural',
    registration_deadline: '2026-11-16',
    max_attendees: 3000,
    registered_attendees: 2850,
    status: 'completed',
    user_registered: false,
    highlights: 'Celebrity DJ Night, 18-band Battle of the Bands (Won by The Resonance), 45 Food Pop-ups.',
    top_winner: 'The Resonance (Band of the Year) & Aanya Sharma (Host)'
  },
  {
    id: 902,
    event_code: 'EVT-2026-CMP02',
    name: 'Inter-College Esports Fall Championship Finals',
    description: 'Grand finals of Valorant and BGMI collegiate showdown. Live LAN arena broadcasted to 25,000+ online viewers.',
    banner_image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    event_date: '2026-11-12',
    start_time: '11:00 AM',
    end_time: '08:30 PM',
    venue: 'Indoor Sports Complex & LAN Arena',
    organizer: 'Collegiate Gaming League & ROG',
    category: 'Gaming',
    registration_deadline: '2026-11-10',
    max_attendees: 1000,
    registered_attendees: 980,
    status: 'completed',
    user_registered: false,
    highlights: 'Valorant Finals (IIT Delhi vs BITS Pilani 3-2), ₹1,00,000 cash pool awarded.',
    top_winner: 'Team Phoenix (IIT Delhi) - Valorant Champions'
  },
  {
    id: 903,
    event_code: 'EVT-2026-CMP03',
    name: 'Tech Odyssey Hackathon 2026',
    description: '36-hour non-stop collegiate hackathon. 120 teams built generative AI and campus sustainability apps with $15k in prize pool.',
    banner_image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
    event_date: '2026-11-05',
    start_time: '09:00 AM',
    end_time: '09:00 PM',
    venue: 'Computer Science Innovation Lab, Block 4',
    organizer: 'Coding Society & GDSC',
    category: 'Technology',
    registration_deadline: '2026-11-03',
    max_attendees: 500,
    registered_attendees: 490,
    status: 'completed',
    user_registered: false,
    highlights: '85 AI prototypes deployed, 12 tier-1 VC mentors, AWS & Google Cloud credits awarded.',
    top_winner: 'Team NeuroFlow (Campus Mental Wellness AI)'
  },
  {
    id: 904,
    event_code: 'EVT-2026-CMP04',
    name: 'Annual Campus Photography & Short Film Expo',
    description: 'Exhibition of 250 curated collegiate photographs and screening of 14 student-directed indie short films.',
    banner_image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
    event_date: '2026-10-28',
    start_time: '02:00 PM',
    end_time: '08:00 PM',
    venue: 'Fine Arts Gallery & Screening Hall B',
    organizer: 'Aperture Film Society',
    category: 'Photography',
    registration_deadline: '2026-10-26',
    max_attendees: 700,
    registered_attendees: 640,
    status: 'completed',
    user_registered: false,
    highlights: 'Jury panel from FTII, 14 student films screened, Canon RF gear giveaways.',
    top_winner: 'Kabir Singh (Best Cinematography Award)'
  },
  {
    id: 905,
    event_code: 'EVT-2026-CMP05',
    name: 'Collegiate Startup Conclave & Angel Pitch 2026',
    description: '15 student founders pitched live to tier-1 seed investors. ₹25 Lakhs pre-seed investment commitments made on stage.',
    banner_image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
    event_date: '2026-10-18',
    start_time: '10:00 AM',
    end_time: '05:00 PM',
    venue: 'Management Auditorium, Block C',
    organizer: 'Campus Incubator & E-Cell',
    category: 'Startup',
    registration_deadline: '2026-10-16',
    max_attendees: 400,
    registered_attendees: 385,
    status: 'completed',
    user_registered: false,
    highlights: '15 student pitches, 8 term sheets issued, institutional incubator grants announced.',
    top_winner: 'EcoPack Student Ventures (₹10L Pre-Seed Award)'
  }
];

export default function EventsModule() {
  const { setCreateEventModalOpen, currentUser, showToast, triggerConfetti, openDetailDrawer } = useApp();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'calendar'
  const [selectedMonth, setSelectedMonth] = useState('All');
  const [eventStatusTab, setEventStatusTab] = useState('upcoming'); // 'upcoming', 'completed', 'all'
  const [selectedEventForRecap, setSelectedEventForRecap] = useState(null);

  const categories = ['All', 'Technology', 'Music', 'Startup', 'Sports', 'Photography', 'Gaming', 'Fashion', 'Cultural', 'Sustainability', 'Networking', 'Awards'];
  const months = ['All', 'October 2026', 'November 2026', 'December 2026', 'January 2027', 'February 2027', 'March 2027', 'April 2027'];

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const studentId = currentUser?.id || 1;
      const params = new URLSearchParams({
        category: selectedCategory,
        search: searchQuery,
        student_id: studentId,
        status: eventStatusTab
      });
      const res = await fetch(`/api/events?${params}`);
      const data = await res.json();
      if (data.success && data.data && data.data.length > 0) {
        setEvents(data.data);
      } else {
        // Fallback depending on tab
        if (eventStatusTab === 'completed') {
          setEvents(completedEventsFallback);
        } else if (eventStatusTab === 'all') {
          setEvents([...(data.data || []), ...completedEventsFallback]);
        } else {
          setEvents(data.data || []);
        }
      }
    } catch (err) {
      console.error(err);
      if (eventStatusTab === 'completed') {
        setEvents(completedEventsFallback);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [selectedCategory, eventStatusTab]);

  const handleRegisterToggle = async (event) => {
    const isRegistered = event.user_registered;
    const endpoint = isRegistered ? `/api/events/${event.id}/unregister` : `/api/events/${event.id}/register`;

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: currentUser?.id || 1 })
      });
      const data = await res.json();
      if (data.success) {
        setEvents(prev => prev.map(e => {
          if (e.id === event.id) {
            return {
              ...e,
              user_registered: !isRegistered,
              registered_attendees: isRegistered ? e.registered_attendees - 1 : e.registered_attendees + 1
            };
          }
          return e;
        }));

        if (!isRegistered) {
          showToast(`Seat registered for ${event.name}!`, 'success');
          triggerConfetti();
        } else {
          showToast(`Registration cancelled for ${event.name}.`, 'info');
        }
      }
    } catch (err) {
      showToast('Error updating registration', 'error');
    }
  };

  const filteredEvents = events.filter(e => {
    if (selectedMonth === 'All') return true;
    const dateObj = new Date(e.event_date);
    const monthYear = dateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    return monthYear === selectedMonth;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-500 shadow-[0_0_8px_#ec4899]" />
            <span className="text-[10px] font-mono tracking-widest uppercase text-pink-400 font-semibold">
              {eventStatusTab === 'completed' ? 'CONCLUDED CAMPUS FESTIVALS' : 'SCHEDULED AFTER DEC 10, 2026'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight">
            {eventStatusTab === 'completed' ? 'Completed Campus Events & Highlights' : 'Upcoming Campus Events (2026–2027)'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {eventStatusTab === 'completed' 
              ? 'Past collegiate fests, hackathons, and competitions with verified winners.'
              : '20+ major inter-college fests, tech summits, hackathons, and esports finals.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Status Tab Toggle: Upcoming vs Completed */}
          <div className="flex items-center p-1 rounded-xl bg-[#141724] border border-white/10 text-xs font-semibold">
            <button
              onClick={() => setEventStatusTab('upcoming')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                eventStatusTab === 'upcoming' 
                  ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Upcoming Events (20+)
            </button>
            <button
              onClick={() => setEventStatusTab('completed')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                eventStatusTab === 'completed' 
                  ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Completed Events (5)
            </button>
            <button
              onClick={() => setEventStatusTab('all')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                eventStatusTab === 'all' 
                  ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#141724] border border-white/10">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-2 rounded-lg text-xs transition cursor-pointer ${
                viewMode === 'cards' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Card view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`p-2 rounded-lg text-xs transition cursor-pointer ${
                viewMode === 'calendar' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Calendar timeline view"
            >
              <CalendarDays className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setCreateEventModalOpen(true)}
            className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-[0_0_20px_rgba(168,85,247,0.4)] transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Event</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchEvents()}
              placeholder="Search event name, venue, or category..."
              className="w-full bg-[#12141c] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition"
            />
          </div>

          {/* Month Filter */}
          <div className="w-full sm:w-56">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full bg-[#12141c] border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500 font-mono"
            >
              {months.map((m, idx) => (
                <option key={idx} value={m} className="bg-[#12141c]">
                  {m === 'All' ? 'All Months (2026–2027)' : m}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[10px] text-slate-500 font-mono uppercase mr-1">Category:</span>
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition ${
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

      {/* Calendar View */}
      {viewMode === 'calendar' ? (
        <div className="space-y-6">
          <InteractiveCalendar events={events} />

          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <h3 className="font-bold text-white font-display text-base">Campus Calendar Schedule (Dec 2026 – Apr 2027)</h3>
              <span className="text-xs font-mono text-purple-400">{filteredEvents.length} Events on Schedule</span>
            </div>

          <div className="space-y-3">
            {filteredEvents.map((ev) => {
              const dateObj = new Date(ev.event_date);
              const dayStr = dateObj.toLocaleDateString('en-US', { day: '2-digit' });
              const monthStr = dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
              const yearStr = dateObj.toLocaleDateString('en-US', { year: 'numeric' });

              return (
                <div
                  key={ev.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] transition"
                >
                  <div className="flex items-center gap-4">
                    {/* Date Block */}
                    <div className="w-16 h-16 rounded-2xl bg-[#141724] border border-purple-500/30 flex flex-col items-center justify-center flex-shrink-0 text-center shadow">
                      <span className="text-[9px] font-mono text-purple-400 uppercase font-bold">{monthStr}</span>
                      <span className="text-xl font-bold font-display text-white leading-tight">{dayStr}</span>
                      <span className="text-[9px] font-mono text-slate-500">{yearStr}</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{ev.name}</h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                          {ev.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 flex items-center gap-2 mt-1">
                        <span className="text-purple-300 font-mono">{ev.start_time} - {ev.end_time}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-pink-400" /> {ev.venue}</span>
                      </p>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{ev.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <button
                      onClick={() => openDetailDrawer && openDetailDrawer('event', ev)}
                      className="px-3 py-2 rounded-xl text-xs font-semibold bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 border border-white/[0.08] transition cursor-pointer"
                    >
                      Details
                    </button>
                    <div className="text-right text-xs font-mono">
                      <span className="text-white font-bold">{ev.registered_attendees}</span>
                      <span className="text-slate-500"> / {ev.max_attendees}</span>
                    </div>
                    {ev.status === 'completed' ? (
                      <button
                        onClick={() => setSelectedEventForRecap(ev)}
                        className="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-200 border border-purple-500/30 cursor-pointer shadow"
                      >
                        <Trophy className="w-3.5 h-3.5 text-amber-400" />
                        <span>View Recap</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRegisterToggle(ev)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                          ev.user_registered
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-red-500/20 hover:text-red-300'
                            : 'bg-purple-600 hover:bg-purple-500 text-white shadow'
                        }`}
                      >
                        {ev.user_registered ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Registered</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Register Free</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      ) : (
        /* Cards Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((ev) => {
            const registered = ev.registered_attendees || 0;
            const capacity = ev.max_attendees || 500;
            const pct = Math.min(Math.round((registered / capacity) * 100), 100);
            const isCompleted = ev.status === 'completed' || new Date(ev.event_date) < new Date('2026-12-11');

            const dateObj = new Date(ev.event_date);
            const dateDisplay = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

            return (
              <TiltCard
                key={ev.id}
                glowColor={isCompleted ? "purple" : "cyan"}
                className="glass-card-interactive rounded-2xl overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Banner Image */}
                  <div className="relative h-44 w-full overflow-hidden">
                    <img
                      src={ev.banner_image}
                      alt={ev.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c0e16] via-transparent to-transparent opacity-90" />
                    
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-mono uppercase font-bold bg-[#08090D]/80 text-cyan-300 border border-cyan-500/30 backdrop-blur-md">
                      {ev.category}
                    </span>

                    <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold backdrop-blur-md ${
                      isCompleted
                        ? 'bg-purple-600/90 text-white border border-purple-400/40 shadow-[0_0_10px_rgba(168,85,247,0.4)]'
                        : 'bg-purple-500/80 text-white'
                    }`}>
                      {isCompleted ? '✓ COMPLETED' : dateDisplay}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-extrabold text-lg text-white font-display leading-tight truncate">
                        {ev.name}
                      </h3>
                      {isCompleted && (
                        <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex-shrink-0">
                          CONCLUDED
                        </span>
                      )}
                    </div>

                    <div className="mt-3 space-y-1 text-xs text-slate-300">
                      <div className="flex items-center gap-2 text-purple-300 font-mono">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{ev.start_time} – {ev.end_time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <MapPin className="w-3.5 h-3.5 text-pink-400" />
                        <span className="truncate">{ev.venue}</span>
                      </div>
                    </div>

                    <p className="mt-3 text-xs text-slate-400 leading-relaxed line-clamp-2">
                      {ev.description}
                    </p>

                    {/* Capacity / Turnout Bar */}
                    <div className="mt-5 pt-3 border-t border-white/[0.06]">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-slate-400 flex items-center gap-1 font-mono text-[11px]">
                          <Users className="w-3.5 h-3.5 text-cyan-400" /> {isCompleted ? 'Final Turnout:' : 'Attendees:'}
                        </span>
                        <span className="font-bold text-white font-mono text-[11px]">
                          {registered} / {capacity} ({pct}%)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            isCompleted
                              ? 'bg-gradient-to-r from-emerald-400 to-cyan-400'
                              : 'bg-gradient-to-r from-purple-500 to-cyan-400'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                  </div>
                </div>

                {/* Register / Recap Action Button */}
                <div className="p-5 pt-0 flex items-center gap-2">
                  <button
                    onClick={() => openDetailDrawer && openDetailDrawer('event', ev)}
                    className="px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 border border-white/[0.08] transition flex-shrink-0 cursor-pointer"
                  >
                    Details
                  </button>
                  {isCompleted ? (
                    <button
                      onClick={() => setSelectedEventForRecap(ev)}
                      className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-purple-600/20 hover:bg-purple-600/30 text-purple-200 border border-purple-500/30 transition flex items-center justify-center gap-2 shadow cursor-pointer"
                    >
                      <Trophy className="w-4 h-4 text-amber-400" />
                      <span>View Highlights</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRegisterToggle(ev)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow cursor-pointer ${
                        ev.user_registered
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-red-500/20 hover:text-red-300'
                          : 'bg-purple-600 hover:bg-purple-500 text-white'
                      }`}
                    >
                      {ev.user_registered ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Registered</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span>Register Free</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

              </TiltCard>
            );
          })}
        </div>
      )}

      {/* Event Recap & Highlights Modal */}
      {selectedEventForRecap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl glass-panel border border-purple-500/40 p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setSelectedEventForRecap(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                OFFICIALLY CONCLUDED
              </span>
              <span className="text-[10px] font-mono text-cyan-300">
                {selectedEventForRecap.category}
              </span>
            </div>

            <h3 className="text-xl font-bold text-white font-display">
              {selectedEventForRecap.name}
            </h3>

            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {selectedEventForRecap.description}
            </p>

            <div className="grid grid-cols-2 gap-3 mt-5">
              <div className="p-3.5 rounded-2xl bg-[#141724] border border-white/[0.08]">
                <p className="text-[10px] font-mono uppercase text-slate-400">Total Turnout</p>
                <p className="text-lg font-bold text-cyan-400 font-mono mt-0.5">
                  {selectedEventForRecap.registered_attendees || 850}+ Students
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#141724] border border-white/[0.08]">
                <p className="text-[10px] font-mono uppercase text-slate-400">Venue</p>
                <p className="text-xs font-bold text-white truncate mt-1">
                  {selectedEventForRecap.venue}
                </p>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-200">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Event Winners & Highlights</span>
              </div>
              <p className="text-xs text-slate-200 font-medium">
                {selectedEventForRecap.top_winner || 'Top Collegiate Performing Societies & Gold Medalists'}
              </p>
              <p className="text-[11px] text-slate-400 font-mono">
                {selectedEventForRecap.highlights || 'Full campus turnout • Certificates and awards distributed'}
              </p>
            </div>

            <button
              onClick={() => setSelectedEventForRecap(null)}
              className="mt-6 w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition cursor-pointer"
            >
              Close Event Recap
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
