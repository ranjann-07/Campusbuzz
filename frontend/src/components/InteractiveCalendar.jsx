import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  MapPin, 
  Clock, 
  Users, 
  CheckCircle, 
  Check, 
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function InteractiveCalendar({ 
  events = [], 
  onSelectEvent, 
  isCompact = false,
  className = "" 
}) {
  const { registerForEvent, showToast, triggerConfetti } = useApp();

  // Default to December 2026 where collegiate events begin
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(11); // 0-indexed: 11 = December
  const [selectedDate, setSelectedDate] = useState('2026-12-12');

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Helper: Get days in month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Helper: Get day of week for 1st day of month (0 = Sun, 1 = Mon...)
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const daysInCurrentMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  // Group events by date string (YYYY-MM-DD)
  const eventsByDate = events.reduce((acc, ev) => {
    if (!ev.event_date) return acc;
    // Format YYYY-MM-DD
    const d = new Date(ev.event_date);
    const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(ev);
    return acc;
  }, {});

  // Events on currently selected date
  const selectedDateEvents = eventsByDate[selectedDate] || [];

  const handleQuickRegister = (ev) => {
    registerForEvent(ev.id);
    showToast(`Registered for ${ev.name}! 🎟️`, 'success');
    triggerConfetti();
  };

  return (
    <div className={`glass-panel rounded-2xl p-4 sm:p-6 ${className}`}>
      
      {/* Calendar Header with Month Navigation */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <CalendarIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base sm:text-lg font-display">
              {monthNames[currentMonth]} {currentYear}
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">
              Campus Events & Festival Calendar
            </p>
          </div>
        </div>

        {/* Navigation arrows */}
        <div className="flex items-center gap-1.5 bg-[#12141c] border border-white/[0.08] rounded-xl p-1">
          <button
            onClick={handlePrevMonth}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition cursor-pointer"
            title="Previous month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setCurrentYear(2026);
              setCurrentMonth(11);
              setSelectedDate('2026-12-12');
            }}
            className="px-2 py-1 text-[10px] font-mono font-bold text-purple-300 hover:text-white rounded transition"
          >
            Dec '26
          </button>
          <button
            onClick={handleNextMonth}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition cursor-pointer"
            title="Next month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {daysOfWeek.map((day, idx) => (
          <div key={idx} className="text-[10px] font-mono uppercase text-slate-500 font-bold py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid Days */}
      <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
        {/* Empty slots for days before 1st of month */}
        {Array.from({ length: firstDay }).map((_, idx) => (
          <div key={`empty-${idx}`} className="h-10 sm:h-12 rounded-xl opacity-20 pointer-events-none" />
        ))}

        {/* Days of current month */}
        {Array.from({ length: daysInCurrentMonth }).map((_, idx) => {
          const dayNum = idx + 1;
          const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
          const dayEvents = eventsByDate[dateKey] || [];
          const hasEvents = dayEvents.length > 0;
          const isSelected = selectedDate === dateKey;

          return (
            <motion.button
              key={dateKey}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedDate(dateKey)}
              className={`relative h-11 sm:h-13 rounded-xl p-1 flex flex-col items-center justify-between transition cursor-pointer border ${
                isSelected
                  ? 'bg-purple-600/30 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.35)] ring-1 ring-purple-400'
                  : hasEvents
                  ? 'bg-white/[0.04] border-white/10 hover:border-purple-500/50 text-slate-200'
                  : 'bg-transparent border-transparent text-slate-500 hover:bg-white/[0.02]'
              }`}
            >
              <span className={`text-xs font-semibold ${isSelected ? 'text-purple-200 font-bold' : hasEvents ? 'text-white' : 'text-slate-400'}`}>
                {dayNum}
              </span>

              {/* Event indicators */}
              {hasEvents && (
                <div className="flex items-center gap-1 justify-center pb-0.5">
                  {dayEvents.slice(0, 3).map((ev, i) => (
                    <span
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full ${
                        ev.category === 'Technology' ? 'bg-cyan-400 shadow-[0_0_6px_#00f0ff]' :
                        ev.category === 'Music' ? 'bg-pink-400 shadow-[0_0_6px_#ec4899]' :
                        ev.category === 'Gaming' ? 'bg-amber-400 shadow-[0_0_6px_#f59e0b]' :
                        'bg-purple-400 shadow-[0_0_6px_#a855f7]'
                      }`}
                      title={ev.name}
                    />
                  ))}
                  {dayEvents.length > 3 && (
                    <span className="text-[8px] font-mono text-purple-300">+{dayEvents.length - 3}</span>
                  )}
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Selected Date Detail View */}
      <div className="mt-5 pt-4 border-t border-white/[0.06]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_#a855f7]" />
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
              Events on {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </h4>
          </div>
          <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
            {selectedDateEvents.length} {selectedDateEvents.length === 1 ? 'Event' : 'Events'}
          </span>
        </div>

        {selectedDateEvents.length > 0 ? (
          <div className="space-y-2.5">
            {selectedDateEvents.map((ev) => (
              <motion.div
                key={ev.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 sm:p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-purple-950/50 border border-purple-500/30 flex flex-col items-center justify-center flex-shrink-0 text-center">
                    <span className="text-[9px] font-mono text-purple-400 uppercase leading-none font-bold">
                      {new Date(ev.event_date).toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                    <span className="text-sm font-black text-white font-mono leading-none mt-0.5">
                      {new Date(ev.event_date).getDate()}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h5 className="text-xs font-bold text-white truncate group-hover:text-purple-300 transition">
                        {ev.name}
                      </h5>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {ev.category}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-400 mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-pink-400" />
                        {ev.venue}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-mono text-purple-300">
                        <Clock className="w-3 h-3 text-purple-400" />
                        {ev.start_time || '10:00 AM'} - {ev.end_time || '05:00 PM'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center flex-shrink-0">
                  <div className="text-right text-[10px] font-mono hidden sm:block">
                    <span className="text-white font-bold">{ev.registered_attendees || 0}</span>
                    <span className="text-slate-500"> / {ev.max_attendees || 500}</span>
                  </div>

                  <button
                    onClick={() => handleQuickRegister(ev)}
                    className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white text-xs font-bold shadow-[0_0_12px_rgba(168,85,247,0.3)] transition flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Register</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-white/[0.02] border border-dashed border-white/10 text-center text-xs text-slate-400">
            <p>No campus events scheduled on this day.</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Click any date with a glowing dot (e.g. Dec 12, 15, 18, 21, 28) to view events!</p>
          </div>
        )}
      </div>

    </div>
  );
}
