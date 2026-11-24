import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { apiUrl } from '../config/api';
import { 
  Bookmark, 
  Heart, 
  MessageSquare, 
  Share2, 
  Compass, 
  Trash2, 
  CheckCircle2, 
  Sparkles, 
  Search,
  ExternalLink
} from 'lucide-react';

export default function SavedPostsView() {
  const { savedPostIds, toggleSavePost, currentUser, showToast, setDashboardTab } = useApp();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Fallback posts if API returns empty
  const fallbackSavedPosts = [
    {
      id: 1,
      author_name: "Shivani Negi",
      author_username: "shivaninegi",
      author_college: "Delhi University",
      author_avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80",
      content: "Just wrapped our collegiate photography masterclass! 📸 Over 120 students attended and tested Sony mirrorless setups across campus.",
      hashtags: "#CampusBuzz #Photography #DelhiUniversity",
      media_url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
      post_type: "image",
      likes_count: 342,
      comments_count: 28,
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      author_name: "Arjun Mehta",
      author_username: "arjun_tech",
      author_college: "IIT Delhi",
      author_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80",
      content: "Launched our open-source campus AI study planner today. Built with React & Vite. Grab the free template on GitHub! 🚀",
      hashtags: "#TechFest #StudentDeveloper #OpenSource",
      media_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
      post_type: "campus_activity",
      likes_count: 512,
      comments_count: 45,
      created_at: new Date().toISOString()
    }
  ];

  useEffect(() => {
    const fetchSavedPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch(apiUrl('/api/posts?limit=50'));
        const data = await res.json();
        if (data.success && data.posts && data.posts.length > 0) {
          const matched = data.posts.filter(p => savedPostIds.includes(p.id));
          if (matched.length > 0) {
            setPosts(matched);
          } else {
            setPosts(fallbackSavedPosts.filter(p => savedPostIds.includes(p.id)));
          }
        } else {
          setPosts(fallbackSavedPosts.filter(p => savedPostIds.includes(p.id)));
        }
      } catch (e) {
        setPosts(fallbackSavedPosts.filter(p => savedPostIds.includes(p.id)));
      } finally {
        setLoading(false);
      }
    };

    fetchSavedPosts();
  }, [savedPostIds]);

  const handleShare = (post) => {
    navigator.clipboard?.writeText(window.location.origin + `/feed#post-${post.id}`);
    showToast('Post link copied to clipboard!', 'info');
  };

  const filteredPosts = posts.filter(p => {
    const q = searchQuery.toLowerCase();
    const content = p.content || '';
    const author = p.author_name || '';
    const tag = p.hashtags || '';
    return content.toLowerCase().includes(q) || author.toLowerCase().includes(q) || tag.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500 shadow-[0_0_8px_#8b5cf6]" />
            <span className="text-[10px] font-mono tracking-widest uppercase text-violet-400 font-semibold">
              MY CURATED COLLECTION
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight flex items-center gap-2.5">
            <Bookmark className="w-6 h-6 text-purple-400 fill-purple-400/20" />
            Saved Posts
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Bookmarks, inspirational content, student campaigns, and campus reels you have saved.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-purple-300 bg-purple-500/10 border border-purple-500/20 px-3.5 py-2 rounded-xl">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>{filteredPosts.length} Bookmarked</span>
        </div>
      </div>

      {/* Search Bar */}
      {posts.length > 0 && (
        <div className="glass-panel p-3 rounded-2xl flex items-center gap-3">
          <Search className="w-4 h-4 text-slate-400 ml-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search within your saved posts..."
            className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
          />
        </div>
      )}

      {/* Posts Grid / List */}
      {loading ? (
        <div className="py-20 text-center text-slate-500 font-mono text-xs">
          Loading saved posts...
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="py-20 text-center glass-panel rounded-3xl p-8 border border-white/[0.06] space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mx-auto shadow-[0_0_20px_rgba(168,85,247,0.2)]">
            <Bookmark className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">No saved posts yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Browse the campus social feed and click the bookmark icon on any post to save it for quick reference later.
          </p>
          <button
            onClick={() => setDashboardTab('feed')}
            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-lg transition inline-flex items-center gap-2 cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            <span>Explore Campus Feed</span>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="glass-panel p-5 rounded-2xl border border-white/[0.06] hover:border-purple-500/30 transition-all duration-300"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-3">
                  <img
                    src={post.author_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80'}
                    alt={post.author_name}
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-purple-500/40"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-white leading-tight">
                        {post.author_name}
                      </h4>
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400/20" />
                    </div>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1">
                      <span>@{post.author_username}</span>
                      <span>•</span>
                      <span className="text-purple-300">{post.author_college}</span>
                    </p>
                  </div>
                </div>

                {/* Unsave action button */}
                <button
                  onClick={() => toggleSavePost(post.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/40 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/40 transition cursor-pointer"
                  title="Remove from saved"
                >
                  <Bookmark className="w-3.5 h-3.5 fill-purple-400 text-purple-400" />
                  <span>Saved</span>
                </button>
              </div>

              {/* Post Text */}
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-3">
                {post.content}
              </p>

              {/* Hashtags */}
              {post.hashtags && (
                <p className="text-xs font-mono text-purple-400 font-medium mb-3">
                  {post.hashtags}
                </p>
              )}

              {/* Media Preview */}
              {post.media_url && (
                <div className="rounded-2xl overflow-hidden mb-4 border border-white/[0.06] aspect-[16/9] max-h-96 w-full bg-[#12141c]">
                  <img
                    src={post.media_url}
                    alt="Post media"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              )}

              {/* Footer Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-white/[0.06] text-xs text-slate-400">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Heart className="w-4 h-4 text-pink-400" />
                    <span className="font-mono">{post.likes_count || 120}</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-slate-400">
                    <MessageSquare className="w-4 h-4 text-purple-400" />
                    <span className="font-mono">{post.comments_count || 12}</span>
                  </span>
                  <button
                    onClick={() => handleShare(post)}
                    className="flex items-center gap-1.5 hover:text-white transition"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </button>
                </div>

                <span className="text-[10px] text-slate-500 font-mono">
                  {post.created_at ? new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Saved'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
