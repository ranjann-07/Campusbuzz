import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { apiUrl } from '../config/api';
import { 
  MessageSquare, 
  Send, 
  Clock, 
  CheckCircle2, 
  DollarSign, 
  User, 
  Briefcase, 
  Sparkles,
  Paperclip,
  Check
} from 'lucide-react';

export default function CollaborationModule() {
  const { collaborations, currentUser, updateCollaborationStatus, showToast } = useApp();

  const [selectedCollabId, setSelectedCollabId] = useState(collaborations[0]?.id || 1);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);

  const activeCollab = collaborations.find(c => c.id === selectedCollabId) || collaborations[0] || {};

  // Fetch messages for selected collaboration
  const fetchMessages = async (collabId) => {
    try {
      const res = await fetch(apiUrl(`/api/collaborations/${collabId}/messages`));
      const data = await res.json();
      if (data.data) {
        setMessages(data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (selectedCollabId) {
      fetchMessages(selectedCollabId);
    }
  }, [selectedCollabId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setSending(true);
    const newMsg = {
      sender_name: currentUser ? currentUser.name : "Student Creator",
      sender_role: currentUser ? currentUser.role : "creator",
      text: inputText
    };

    try {
      const res = await fetch(apiUrl(`/api/collaborations/${selectedCollabId}/messages`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMsg)
      });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => [...prev, data.data]);
        setInputText('');
      }
    } catch (err) {
      showToast('Error sending message', 'error');
    } finally {
      setSending(false);
    }
  };

  const statusList = ['Requested', 'In Progress', 'In Review', 'Completed'];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="pb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff]" />
          <span className="text-[10px] font-mono tracking-widest uppercase text-cyan-400 font-semibold">
            COMMUNICATION DESK
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight">
          Collaborations & Messaging
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Direct deal room between university creators, sponsors, and campaign leads.
        </p>
      </div>

      {/* Main Deal Room Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[640px]">
        
        {/* Left Col: Projects List (4 cols) */}
        <div className="lg:col-span-4 glass-panel rounded-2xl p-4 flex flex-col justify-between overflow-hidden">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-3 px-2 flex items-center justify-between">
            <span>Active Collaborations</span>
            <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono text-[10px]">
              {collaborations.length} Deals
            </span>
          </div>

          <div className="space-y-2 overflow-y-auto flex-1 pr-1">
            {collaborations.map((collab) => {
              const isSelected = collab.id === selectedCollabId;
              return (
                <div
                  key={collab.id}
                  onClick={() => setSelectedCollabId(collab.id)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer ${
                    isSelected
                      ? 'bg-purple-600/15 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                      : 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-white leading-tight">
                      {collab.campaign_name}
                    </h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 whitespace-nowrap">
                      {collab.project_status}
                    </span>
                  </div>

                  <p className="text-[11px] text-purple-300 font-medium mt-1">
                    Creator: {collab.creator_name}
                  </p>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/[0.05] text-[11px] font-mono">
                    <span className="text-emerald-400 font-bold">₹{collab.compensation.toLocaleString()}</span>
                    <span className="text-slate-500 text-[10px]">Updated recently</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Live Chat & Deal Details (8 cols) */}
        <div className="lg:col-span-8 glass-panel rounded-2xl flex flex-col justify-between overflow-hidden">
          
          {/* Header of Active Collab */}
          <div className="p-4 border-b border-white/[0.08] bg-[#10131d] flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                {activeCollab.campaign_name || "Select a Collaboration"}
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-300">
                  {activeCollab.creator_name}
                </span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Deliverables: {activeCollab.deliverables_summary} • Budget: ₹{activeCollab.compensation?.toLocaleString()}
              </p>
            </div>

            {/* Status Selector */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase text-slate-400 hidden sm:inline">Status:</span>
              <select
                value={activeCollab.project_status || 'In Progress'}
                onChange={(e) => updateCollaborationStatus(activeCollab.id, e.target.value)}
                className="bg-[#181c28] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
              >
                {statusList.map((st, i) => (
                  <option key={i} value={st} className="bg-[#12141c]">
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#0a0c13]/50">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-500">
                <MessageSquare className="w-8 h-8 mb-2 opacity-40 text-purple-400" />
                <p className="text-xs">No messages yet. Send a greeting to initiate discussion.</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.sender_name === currentUser?.name || msg.sender_role === 'creator';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <span className="text-[10px] text-slate-500 mb-1 px-1">
                      {msg.sender_name} ({msg.sender_role})
                    </span>
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                        isMe
                          ? 'bg-purple-600 text-white rounded-br-none shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                          : 'bg-[#181c29] text-slate-200 border border-white/10 rounded-bl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Message Input Box */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-white/[0.08] bg-[#10131d] flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type message regarding campaign deliverables, timeline..."
              className="flex-1 bg-[#161a26] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition"
            />
            <button
              type="submit"
              disabled={sending || !inputText.trim()}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md transition flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>

        </div>

      </div>

    </div>
  );
}
