import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { apiUrl } from '../config/api';
import { X, User, Camera, Sparkles, Save, GraduationCap, Instagram, Youtube, Linkedin } from 'lucide-react';

export default function EditProfileModal({ isOpen, onClose }) {
  const { currentUser, setCurrentUser, showToast, triggerConfetti } = useApp();

  const [formData, setFormData] = useState({
    full_name: currentUser?.name || 'Aanya Sharma',
    bio: currentUser?.bio || 'Lifestyle, aesthetic campus fashion, and creative storytelling across college campuses in Delhi NCR.',
    department_name: currentUser?.department || 'Media & Mass Communication',
    course: currentUser?.course || 'BA Journalism',
    creator_category: currentUser?.creator_category || 'Lifestyle',
    instagram: currentUser?.instagram || 'aanya.sharmaa',
    youtube: currentUser?.youtube || 'AanyaSharmaVlogs',
    linkedin: currentUser?.linkedin || 'aanya-sharma-media',
    profile_photo: currentUser?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80'
  });
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const studentId = currentUser?.id || 1;
      const res = await fetch(apiUrl(`/api/students/${studentId}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setCurrentUser(prev => ({
          ...prev,
          name: formData.full_name,
          bio: formData.bio,
          department: formData.department_name,
          course: formData.course,
          creator_category: formData.creator_category,
          instagram: formData.instagram,
          youtube: formData.youtube,
          linkedin: formData.linkedin,
          avatar_url: formData.profile_photo
        }));
        showToast('Student profile updated successfully!', 'success');
        triggerConfetti();
        onClose();
      } else {
        showToast(data.message || 'Update failed', 'error');
      }
    } catch (err) {
      showToast('Error updating profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const categories = ['Technology', 'Lifestyle', 'Fashion', 'Photography', 'Music', 'Gaming', 'Fitness', 'Comedy & Satire', 'Art & Animation'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl glass-panel border border-purple-500/40 p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-display text-white">Edit Student Profile</h2>
            <p className="text-xs text-slate-400">Update your student identity, bio, and social channels.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Avatar Preview & URL */}
          <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
            <img
              src={formData.profile_photo}
              alt="Avatar preview"
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-purple-500/40"
            />
            <div className="flex-1">
              <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Profile Photo URL</label>
              <input
                type="url"
                value={formData.profile_photo}
                onChange={(e) => setFormData({ ...formData, profile_photo: e.target.value })}
                className="w-full bg-[#12141c] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Full Name</label>
            <input
              type="text"
              required
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="w-full bg-[#12141c] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Department</label>
              <input
                type="text"
                value={formData.department_name}
                onChange={(e) => setFormData({ ...formData, department_name: e.target.value })}
                className="w-full bg-[#12141c] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Course</label>
              <input
                type="text"
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                className="w-full bg-[#12141c] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Creator Category</label>
            <select
              value={formData.creator_category}
              onChange={(e) => setFormData({ ...formData, creator_category: e.target.value })}
              className="w-full bg-[#12141c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
            >
              {categories.map((c, i) => (
                <option key={i} value={c} className="bg-[#12141c]">
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Bio</label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full bg-[#12141c] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Instagram</label>
              <input
                type="text"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                placeholder="handle"
                className="w-full bg-[#12141c] border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">YouTube</label>
              <input
                type="text"
                value={formData.youtube}
                onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                placeholder="Channel"
                className="w-full bg-[#12141c] border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">LinkedIn</label>
              <input
                type="text"
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                placeholder="id"
                className="w-full bg-[#12141c] border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs tracking-wide shadow-lg transition flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
