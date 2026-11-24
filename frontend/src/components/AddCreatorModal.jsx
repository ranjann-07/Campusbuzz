import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Users, Sparkles, Instagram, Youtube, GraduationCap } from 'lucide-react';

export default function AddCreatorModal() {
  const { addCreatorModalOpen, setAddCreatorModalOpen, createCreator } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    college: 'Delhi University',
    department: 'Computer Science',
    instagram: '',
    youtube: '',
    followers: '15000',
    engagement_rate: '4.2',
    category: 'Technology',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
    bio: 'Passionate student creator making college content and tech tutorials.'
  });
  const [submitting, setSubmitting] = useState(false);

  if (!addCreatorModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const success = await createCreator(formData);
    setSubmitting(false);
    if (success) {
      setAddCreatorModalOpen(false);
    }
  };

  const categories = ['Lifestyle', 'Technology', 'Fashion', 'Photography', 'Music', 'Fitness', 'Gaming'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl glass-panel border border-purple-500/30 p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={() => setAddCreatorModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-display text-white">Register Student Creator</h2>
            <p className="text-xs text-slate-400">Onboard new verified university influencer profile.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Creator Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Tanya Verma"
              className="w-full bg-[#12141c] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">College / University *</label>
              <input
                type="text"
                required
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                placeholder="e.g. IIT Bombay"
                className="w-full bg-[#12141c] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Department *</label>
              <input
                type="text"
                required
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="e.g. Media & Journalism"
                className="w-full bg-[#12141c] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Instagram Username *</label>
              <input
                type="text"
                required
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value.replace('@', '') })}
                placeholder="e.g. tanya.beats"
                className="w-full bg-[#12141c] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">YouTube Channel</label>
              <input
                type="text"
                value={formData.youtube}
                onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                placeholder="e.g. TanyaVermaVlogs"
                className="w-full bg-[#12141c] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-[#12141c] border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              >
                {categories.map((c, i) => (
                  <option key={i} value={c} className="bg-[#12141c]">
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Followers *</label>
              <input
                type="number"
                required
                value={formData.followers}
                onChange={(e) => setFormData({ ...formData, followers: e.target.value })}
                className="w-full bg-[#12141c] border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Eng. Rate (%) *</label>
              <input
                type="number"
                step="0.1"
                required
                value={formData.engagement_rate}
                onChange={(e) => setFormData({ ...formData, engagement_rate: e.target.value })}
                className="w-full bg-[#12141c] border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Profile Avatar URL</label>
            <input
              type="url"
              value={formData.avatar_url}
              onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
              className="w-full bg-[#12141c] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Short Bio</label>
            <textarea
              rows={2}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full bg-[#12141c] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white font-bold text-xs tracking-wide shadow-lg transition"
            >
              {submitting ? 'Registering...' : 'Add Creator to Directory'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
