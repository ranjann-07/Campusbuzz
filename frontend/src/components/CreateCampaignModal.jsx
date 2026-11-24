import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Megaphone, DollarSign, Calendar, Users, Sparkles } from 'lucide-react';

export default function CreateCampaignModal() {
  const { createCampaignModalOpen, setCreateCampaignModalOpen, createCampaign } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    description: '',
    budget: '',
    deadline: '2026-04-30',
    target_creators: '10',
    category: 'Lifestyle & Tech',
    deliverables: '2 Instagram Reels + 1 Story Showcase'
  });
  const [submitting, setSubmitting] = useState(false);

  if (!createCampaignModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const success = await createCampaign(formData);
    setSubmitting(false);
    if (success) {
      setCreateCampaignModalOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl glass-panel border border-orange-500/30 p-6 sm:p-8 shadow-2xl">
        
        <button
          onClick={() => setCreateCampaignModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-400">
            <Megaphone className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-display text-white">Launch Campus Campaign</h2>
            <p className="text-xs text-slate-400">Create a sponsorship brief for university creators.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Campaign Title *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Campus Spring Sound Ambassador"
              className="w-full bg-[#12141c] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Brand Name *</label>
              <input
                type="text"
                required
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="e.g. Red Bull India"
                className="w-full bg-[#12141c] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Total Budget (₹) *</label>
              <input
                type="number"
                required
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                placeholder="e.g. 150000"
                className="w-full bg-[#12141c] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Description *</label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe campaign goals, student engagement target, and theme..."
              className="w-full bg-[#12141c] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Deadline *</label>
              <input
                type="date"
                required
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full bg-[#12141c] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Target Creators</label>
              <input
                type="number"
                value={formData.target_creators}
                onChange={(e) => setFormData({ ...formData, target_creators: e.target.value })}
                className="w-full bg-[#12141c] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Deliverables</label>
            <input
              type="text"
              value={formData.deliverables}
              onChange={(e) => setFormData({ ...formData, deliverables: e.target.value })}
              placeholder="e.g. 2 Reels + 1 Campus Workshop"
              className="w-full bg-[#12141c] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-600 to-pink-600 hover:opacity-95 text-white font-bold text-xs tracking-wide shadow-lg transition"
            >
              {submitting ? 'Creating Campaign...' : 'Publish Campaign to Network'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
