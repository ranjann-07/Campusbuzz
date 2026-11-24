import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { apiUrl } from '../config/api';
import TiltCard from '../components/TiltCard';
import { 
  Megaphone, 
  Plus, 
  Search, 
  Clock, 
  Users, 
  DollarSign, 
  CheckCircle, 
  Sparkles, 
  ArrowRight,
  Gift,
  Target,
  Send,
  X,
  Trophy,
  Award,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';

const completedCampaignsFallback = [
  {
    id: 101,
    campaign_code: 'CAMP-2026-CMP01',
    name: 'Red Bull Dance Your Style Campus Qualifiers',
    brand_name: 'Red Bull India',
    description: 'Collegiate street dance battle & creator documentary series. Completed with 45 student creator reels, 3.8M campus impressions, and full stipend disbursement.',
    image_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
    budget: 150000.00,
    rewards: '₹25,000 Stipend + Red Bull Creator Gear Kit + VIP Finals Pass (Disbursed)',
    target_audience: 'Dance societies, lifestyle creators, videographers',
    required_category: 'Lifestyle',
    application_deadline: '2026-11-10',
    status: 'completed',
    applicants_count: 38,
    top_creators: 'Aanya Sharma & Rohan Das',
    metrics: '3.8M Views • 45 Reels • 100% Payout Disbursed'
  },
  {
    id: 102,
    campaign_code: 'CAMP-2026-CMP02',
    name: 'Spotify Campus Beats Season 1 Fellowship',
    brand_name: 'Spotify India',
    description: 'Curated official student playlists and hosted acoustic dorm jam sessions. Top performing collegiate tracks streamed over 450,000 times.',
    image_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    budget: 220000.00,
    rewards: '₹35,000 Stipend + Studio Recording Grants + Spotify Pro (Disbursed)',
    target_audience: 'Student musicians, indie podcasters, audio reviewers',
    required_category: 'Music',
    application_deadline: '2026-10-25',
    status: 'completed',
    applicants_count: 52,
    top_creators: 'Tanya Verma (Christ Univ)',
    metrics: '450K Streams • 120K Playlist Saves • Full Grants Distributed'
  },
  {
    id: 103,
    campaign_code: 'CAMP-2026-CMP03',
    name: 'Myntra Campus Glam Autumn Lookbook',
    brand_name: 'Myntra Campus Squad',
    description: 'Curated campus-ready thrifted and trending collegiate fashion fits. Reached 2.1M views with student style lookbooks.',
    image_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    budget: 140000.00,
    rewards: '₹18,000 Cash + ₹25,000 Fashion Shopping Wardrobe (Disbursed)',
    target_audience: 'Fashion creators, NIFT students, style influencers',
    required_category: 'Fashion',
    application_deadline: '2026-10-30',
    status: 'completed',
    applicants_count: 41,
    top_creators: 'Riya Patel (NIFT)',
    metrics: '2.1M Impressions • 85K Engagements • Wardrobes Shipped'
  },
  {
    id: 104,
    campaign_code: 'CAMP-2026-CMP04',
    name: 'Notion AI Campus Fellowship Fall Cohort',
    brand_name: 'Notion',
    description: 'Created high-utility study workflow templates and Notion AI demos for midterm exam prep. Over 35,000 student template duplicates.',
    image_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
    budget: 180000.00,
    rewards: '₹20,000 + Notion Certified Ambassador Badge + Tech Swag (Disbursed)',
    target_audience: 'Productivity vloggers, engineering students, academic leaders',
    required_category: 'Technology',
    application_deadline: '2026-11-05',
    status: 'completed',
    applicants_count: 29,
    top_creators: 'Arjun Mehta (IIT Delhi)',
    metrics: '35K Template Duplicates • 92 Net Promoter Score'
  },
  {
    id: 105,
    campaign_code: 'CAMP-2026-CMP05',
    name: 'OnePlus Shot on OnePlus Campus Showcase',
    brand_name: 'OnePlus India',
    description: 'Collegiate night-mode and architectural mobile photography contest. Over 1,200 submissions reviewed by jury.',
    image_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
    budget: 250000.00,
    rewards: '₹35,000 + OnePlus 12 Device + National Showcase (Disbursed)',
    target_audience: 'Mobile photographers, visual storytellers, filmmakers',
    required_category: 'Photography',
    application_deadline: '2026-11-15',
    status: 'completed',
    applicants_count: 64,
    top_creators: 'Kabir Singh (St. Xavier\'s)',
    metrics: '1,200+ Submissions • 12 Winners Awarded'
  }
];

export default function CampaignsModule() {
  const { campaigns, setCreateCampaignModalOpen, currentUser, showToast, triggerConfetti, openDetailDrawer } = useApp();

  const [activeTab, setActiveTab] = useState('all'); // 'all', 'active', 'completed'
  const [searchQuery, setSearchQuery] = useState('');

  // Apply modal
  const [selectedCampaignForApply, setSelectedCampaignForApply] = useState(null);
  const [selectedCampaignForRecap, setSelectedCampaignForRecap] = useState(null);
  const [portfolioLink, setPortfolioLink] = useState('');
  const [pitchNote, setPitchNote] = useState('');
  const [applying, setApplying] = useState(false);
  const [appliedIds, setAppliedIds] = useState([1]); // Default seed applied

  // Combine campaigns from context with fallback completed ones to ensure both sets are always present
  const allCampaignsList = React.useMemo(() => {
    const list = [...campaigns];
    for (const fb of completedCampaignsFallback) {
      if (!list.some(c => c.name === fb.name || c.id === fb.id || c.campaign_code === fb.campaign_code)) {
        list.push(fb);
      }
    }
    return list;
  }, [campaigns]);

  const activeCount = allCampaignsList.filter(c => c.status === 'active').length;
  const completedCount = allCampaignsList.filter(c => c.status === 'completed').length;

  const filteredCampaigns = allCampaignsList.filter(c => {
    const matchesTab = activeTab === 'all' || (c.status && c.status.toLowerCase() === activeTab.toLowerCase());
    const q = searchQuery.toLowerCase();
    const name = c.name || '';
    const brand = c.brand_name || c.brand || '';
    const desc = c.description || '';
    const matchesSearch = name.toLowerCase().includes(q) || brand.toLowerCase().includes(q) || desc.toLowerCase().includes(q);
    return matchesTab && matchesSearch;
  });

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!selectedCampaignForApply) return;

    setApplying(true);
    try {
      const res = await fetch(apiUrl(`/api/campaigns/${selectedCampaignForApply.id}/apply`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: currentUser?.id || 1,
          portfolio_link: portfolioLink,
          pitch_note: pitchNote
        })
      });
      const data = await res.json();
      if (data.success) {
        setAppliedIds(prev => [...prev, selectedCampaignForApply.id]);
        showToast(`Application submitted for ${selectedCampaignForApply.name}!`, 'success');
        triggerConfetti();
        setSelectedCampaignForApply(null);
        setPortfolioLink('');
        setPitchNote('');
      } else {
        showToast(data.message || 'Application already submitted', 'info');
        setSelectedCampaignForApply(null);
      }
    } catch (err) {
      showToast('Error applying for campaign', 'error');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_#ff7a00]" />
            <span className="text-[10px] font-mono tracking-widest uppercase text-orange-400 font-semibold">
              BRAND SPONSORSHIPS & AMBASSADORS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight">
            Campus Campaigns & Fellowships
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            15 paid collegiate creator campaigns with verified sponsor escrows and student rewards.
          </p>
        </div>

        <button
          onClick={() => setCreateCampaignModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-pink-600 hover:opacity-95 text-white font-semibold text-xs shadow-[0_0_20px_rgba(255,103,0,0.35)] transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Campaign</span>
        </button>
      </div>

      {/* Filter and Tabs */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        <div className="flex items-center gap-2">
          {['all', 'active', 'upcoming', 'completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition cursor-pointer ${
                activeTab === tab
                  ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                  : 'bg-white/[0.03] text-slate-400 hover:text-white'
              }`}
            >
              {tab === 'active' ? 'Active (15)' : tab === 'completed' ? 'Completed (5)' : tab}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search campaigns or brand sponsors..."
            className="w-full bg-[#12141c] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition"
          />
        </div>

      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCampaigns.map((camp) => {
          const brand = camp.brand_name || camp.brand || 'Campus Partner';
          const budget = typeof camp.budget === 'number' ? camp.budget : parseFloat(camp.budget || '0');
          const isApplied = appliedIds.includes(camp.id);
          const isCompleted = camp.status === 'completed';

          return (
            <TiltCard
              key={camp.id}
              glowColor={isCompleted ? "purple" : "orange"}
              className="glass-card-interactive rounded-2xl overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Campaign Image */}
                {camp.image_url && (
                  <div className="relative h-44 w-full overflow-hidden bg-[#141724]">
                    <img
                      src={camp.image_url}
                      alt={camp.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c0e16] via-transparent to-transparent opacity-90" />
                    
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase font-bold bg-[#08090D]/85 text-orange-400 border border-orange-500/30 backdrop-blur-md">
                      {camp.required_category || 'All Domains'}
                    </span>

                    <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold backdrop-blur-md ${
                      isCompleted 
                        ? 'bg-purple-600/90 text-white border border-purple-400/40 shadow-[0_0_10px_rgba(168,85,247,0.4)]'
                        : 'bg-emerald-500/80 text-white'
                    }`}>
                      {isCompleted ? '✓ DISBURSED' : `₹${budget.toLocaleString()}`}
                    </span>
                  </div>
                )}

                <div className="p-5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-bold block truncate">
                      {brand}
                    </span>
                    {isCompleted && (
                      <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        COMPLETED
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-base text-white mt-0.5 leading-snug">
                    {camp.name}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed mt-2.5 line-clamp-2">
                    {camp.description}
                  </p>

                  {/* Rewards & Target Info */}
                  <div className="mt-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-2 text-xs">
                    {camp.top_creators && (
                      <div className="flex items-center gap-1.5 text-amber-300 font-semibold text-[11px]">
                        <Trophy className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                        <span className="truncate">Top Creator: {camp.top_creators}</span>
                      </div>
                    )}
                    {camp.rewards && (
                      <div className="flex items-start gap-2 text-emerald-300">
                        <Gift className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-emerald-400" />
                        <span className="text-[11px] leading-tight font-medium">{camp.rewards}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1 border-t border-white/[0.04]">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-cyan-400" />
                        {camp.applicants_count || 15} Student Applicants
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-orange-400" />
                        {isCompleted ? 'Finished' : `Due ${camp.application_deadline}`}
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Action Button */}
              <div className="p-5 pt-0 flex items-center gap-2">
                <button
                  onClick={() => openDetailDrawer && openDetailDrawer('campaign', camp)}
                  className="px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 border border-white/[0.08] transition flex-shrink-0 cursor-pointer"
                >
                  Details
                </button>
                {isCompleted ? (
                  <button
                    onClick={() => setSelectedCampaignForRecap(camp)}
                    className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-purple-600/20 hover:bg-purple-600/30 text-purple-200 border border-purple-500/30 transition flex items-center justify-center gap-1.5 shadow cursor-pointer"
                  >
                    <Trophy className="w-3.5 h-3.5 text-purple-400" />
                    <span>View Recap & Winners</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (!isApplied) setSelectedCampaignForApply(camp);
                    }}
                    disabled={isApplied}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 shadow ${
                      isApplied
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                        : 'bg-gradient-to-r from-orange-600 to-pink-600 hover:opacity-95 text-white cursor-pointer'
                    }`}
                  >
                    {isApplied ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        <span>Submitted</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Apply</span>
                      </>
                    )}
                  </button>
                )}
              </div>

            </TiltCard>
          );
        })}
      </div>

      {/* Campaign Recap & Winners Modal */}
      {selectedCampaignForRecap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl glass-panel border border-purple-500/40 p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setSelectedCampaignForRecap(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                OFFICIALLY CONCLUDED
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {selectedCampaignForRecap.brand_name || selectedCampaignForRecap.brand}
              </span>
            </div>

            <h3 className="text-xl font-bold text-white font-display">
              {selectedCampaignForRecap.name}
            </h3>

            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {selectedCampaignForRecap.description}
            </p>

            <div className="grid grid-cols-2 gap-3 mt-5">
              <div className="p-3.5 rounded-2xl bg-[#141724] border border-white/[0.08]">
                <p className="text-[10px] font-mono uppercase text-slate-400">Total Escrow Disbursed</p>
                <p className="text-lg font-bold text-emerald-400 font-mono mt-0.5">
                  ₹{Number(selectedCampaignForRecap.budget).toLocaleString()}
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#141724] border border-white/[0.08]">
                <p className="text-[10px] font-mono uppercase text-slate-400">Creator Applicants</p>
                <p className="text-lg font-bold text-cyan-400 font-mono mt-0.5">
                  {selectedCampaignForRecap.applicants_count || 45} Verified
                </p>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-200">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Featured Winning Creators</span>
              </div>
              <p className="text-xs text-slate-200 font-medium">
                {selectedCampaignForRecap.top_creators || 'Aanya Sharma (Delhi Univ) & Rohan Das (BITS Pilani)'}
              </p>
              <p className="text-[11px] text-slate-400 font-mono">
                {selectedCampaignForRecap.metrics || '3.8M campus impressions • Verified payout deposited directly to student UPI escrows'}
              </p>
            </div>

            <button
              onClick={() => setSelectedCampaignForRecap(null)}
              className="mt-6 w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition cursor-pointer"
            >
              Close Campaign Recap
            </button>
          </div>
        </div>
      )}

      {/* Apply Campaign Modal */}
      {selectedCampaignForApply && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl glass-panel border border-orange-500/40 p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setSelectedCampaignForApply(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white font-display">
              Apply to {selectedCampaignForApply.name}
            </h3>
            <p className="text-xs text-purple-300 font-mono mt-1">
              Sponsor: {selectedCampaignForApply.brand_name || selectedCampaignForApply.brand}
            </p>

            <form onSubmit={handleApplySubmit} className="space-y-4 mt-5">
              <div>
                <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Portfolio / Social Profile Link</label>
                <input
                  type="url"
                  required
                  value={portfolioLink}
                  onChange={(e) => setPortfolioLink(e.target.value)}
                  placeholder="https://instagram.com/yourhandle"
                  className="w-full bg-[#12141c] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Pitch & Past Collabs</label>
                <textarea
                  rows={3}
                  required
                  value={pitchNote}
                  onChange={(e) => setPitchNote(e.target.value)}
                  placeholder="Why are you a great fit for this campus activation?"
                  className="w-full bg-[#12141c] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={applying}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-600 to-pink-600 hover:opacity-95 text-white font-bold text-xs tracking-wide shadow-lg transition"
              >
                {applying ? 'Submitting Application...' : 'Send Campaign Pitch'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
