import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { apiUrl } from '../config/api';
import { X, Calendar, MapPin, Sparkles, Plus } from 'lucide-react';

export default function CreateEventModal() {
  const { createEventModalOpen, setCreateEventModalOpen, showToast, triggerConfetti, fetchData } = useApp();

  const [formData, setFormData] = useState({
    title: '',
    date: 'Dec 12, 2026 • 5:00 PM',
    location: '',
    description: '',
    category: 'Creative Meetup',
    max_capacity: '250',
    banner_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80'
  });
  const [submitting, setSubmitting] = useState(false);

  if (!createEventModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch(apiUrl('/api/events'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        showToast('Campus event scheduled successfully!', 'success');
        triggerConfetti();
        setCreateEventModalOpen(false);
        fetchData();
      } else {
        showToast(data.message || 'Error creating event', 'error');
      }
    } catch (e) {
      showToast('Network error creating event', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl glass-panel border border-pink-500/30 p-6 sm:p-8 shadow-2xl">
        
        <button
          onClick={() => setCreateEventModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-pink-500/10 border border-pink-500/30 text-pink-400">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-display text-white">Create Campus Event</h2>
            <p className="text-xs text-slate-400">Host a creator summit, festival or tech activation.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Event Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. AI Film & Creator Fest"
              className="w-full bg-[#12141c] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Date & Time *</label>
              <input
                type="text"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-[#12141c] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500 font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Location *</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Main Auditorium"
                className="w-full bg-[#12141c] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Description</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief overview of event itinerary and guest creators..."
              className="w-full bg-[#12141c] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-[#12141c] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Max Capacity</label>
              <input
                type="number"
                value={formData.max_capacity}
                onChange={(e) => setFormData({ ...formData, max_capacity: e.target.value })}
                className="w-full bg-[#12141c] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500 font-mono"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-95 text-white font-bold text-xs tracking-wide shadow-lg transition"
            >
              {submitting ? 'Publishing Event...' : 'Schedule Campus Event'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
