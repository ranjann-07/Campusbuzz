import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Check, 
  X, 
  Database, 
  RefreshCw, 
  Users, 
  Megaphone, 
  Calendar, 
  AlertTriangle, 
  Lock,
  Cpu,
  Layers
} from 'lucide-react';

export default function AdminPanel() {
  const { 
    creators, 
    campaigns, 
    dbStatus, 
    fetchData, 
    verifyCreatorAdmin, 
    showToast,
    triggerConfetti 
  } = useApp();

  const [dbDetails, setDbDetails] = useState(null);
  const [testingDb, setTestingDb] = useState(false);

  useEffect(() => {
    fetch('/api/admin/overview')
      .then(r => r.json())
      .then(data => {
        if (data.stats) setDbDetails(data.stats);
      })
      .catch(() => {});
  }, []);

  const handleTestDb = async () => {
    setTestingDb(true);
    try {
      const res = await fetch('/api/db-status');
      const data = await res.json();
      setDbDetails(prev => ({ ...prev, ...data }));
      showToast(`Database Engine Status: ${data.mode.toUpperCase()} (Online)`, 'success');
      triggerConfetti();
    } catch (e) {
      showToast('Error checking DB status', 'error');
    } finally {
      setTestingDb(false);
    }
  };

  const pendingCreators = creators.filter(c => c.verification_status === 'pending');
  const allVerified = creators.filter(c => c.verification_status === 'verified');

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="pb-4 border-b border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_#ff3366]" />
            <span className="text-[10px] font-mono tracking-widest uppercase text-red-400 font-semibold">
              SUPERADMIN PRIVILEGES
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight">
            CampusBuzz System Governance & Admin
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Student verification, campaign audits, database engine management, and user permissions.
          </p>
        </div>

        <button
          onClick={handleTestDb}
          disabled={testingDb}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#141724] hover:bg-[#1c2236] border border-white/10 text-xs font-semibold text-slate-200 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${testingDb ? 'animate-spin' : ''}`} />
          <span>Sync & Ping DB</span>
        </button>
      </div>

      {/* System & DB Diagnostics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className="glass-panel p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Database Mode</span>
            <Database className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-bold font-mono text-cyan-300 uppercase">
            {dbStatus.mode === 'mysql' ? 'MySQL 8.0' : 'Persistent Engine'}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {dbStatus.mode === 'mysql' ? 'Connected via localhost:3306' : 'Local schema-backed store'}
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Pending Approvals</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400">
            {pendingCreators.length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Requires admin review</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Verified Creators</span>
            <ShieldCheck className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-purple-300">
            {allVerified.length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Active badge holders</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Total Campaigns</span>
            <Megaphone className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-orange-400">
            {campaigns.length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Active & upcoming</p>
        </div>

      </div>

      {/* Pending Creator Verifications */}
      <div className="glass-panel p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/[0.06]">
          <div>
            <h3 className="text-base font-bold text-white font-display">
              Student Verification Queue
            </h3>
            <p className="text-xs text-slate-400">Review student credentials, university IDs, and follower legitimacy.</p>
          </div>
          <span className="text-xs font-mono text-slate-400">{pendingCreators.length} in queue</span>
        </div>

        {pendingCreators.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-60" />
            <p>Verification queue is clear! All student creators are up to date.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingCreators.map((creator) => (
              <div
                key={creator.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]"
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={creator.avatar_url}
                    alt={creator.name}
                    className="w-12 h-12 rounded-xl object-cover ring-1 ring-white/10"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white">{creator.name}</h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        {creator.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-purple-300 font-medium mt-0.5">
                      {creator.college} • {creator.department}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
                      @{creator.instagram} • {creator.followers.toLocaleString()} followers
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => verifyCreatorAdmin(creator.id, 'rejected')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium border border-red-500/20 transition"
                  >
                    <X className="w-3.5 h-3.5" /> Reject
                  </button>
                  <button
                    onClick={() => verifyCreatorAdmin(creator.id, 'verified')}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition"
                  >
                    <Check className="w-3.5 h-3.5" /> Approve Creator
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Database Schema & Integration Details */}
      <div className="glass-panel p-6 rounded-2xl">
        <h3 className="text-base font-bold text-white font-display mb-2">
          MySQL 8.0 Schema Architecture
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Integrated with `schema.sql` supporting tables: <code className="text-purple-300">users</code>, <code className="text-purple-300">creators</code>, <code className="text-purple-300">campaigns</code>, <code className="text-purple-300">collaborations</code>, <code className="text-purple-300">messages</code>, <code className="text-purple-300">events</code>, <code className="text-purple-300">activity_log</code>.
        </p>

        <div className="bg-[#090b10] border border-white/10 rounded-xl p-4 font-mono text-xs text-slate-300 overflow-x-auto space-y-1">
          <p className="text-slate-500">-- Current Database Credentials & Configuration</p>
          <p><span className="text-purple-400">MYSQL_HOST</span>: localhost</p>
          <p><span className="text-purple-400">MYSQL_PORT</span>: 3306</p>
          <p><span className="text-purple-400">MYSQL_DATABASE</span>: campusbuzz_db</p>
          <p><span className="text-purple-400">ENGINE_FALLBACK</span>: Automated zero-downtime local persistence activated</p>
        </div>
      </div>

    </div>
  );
}
