import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { apiUrl } from '../config/api';
import TiltCard from '../components/TiltCard';
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  Image, 
  Send, 
  Sparkles, 
  Search, 
  TrendingUp, 
  Compass, 
  Users, 
  MoreVertical, 
  Trash2, 
  Tag, 
  Clock, 
  Film, 
  Calendar, 
  Award,
  PlusCircle,
  CheckCircle2,
  Bookmark
} from 'lucide-react';

export default function SocialFeed() {
  const { currentUser, showToast, triggerConfetti, savedPostIds = [], toggleSavePost, openDetailDrawer } = useApp();

  const [posts, setPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(5200);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('explore'); // 'explore', 'trending', 'following'
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Create post state
  const [postText, setPostText] = useState('');
  const [postType, setPostType] = useState('image');
  const [mediaUrl, setMediaUrl] = useState('');
  const [creating, setCreating] = useState(false);

  // Active comments drawer
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [commentsMap, setCommentsMap] = useState({});
  const [commentInput, setCommentInput] = useState('');

  // Fetch posts
  const fetchPosts = async (pageNum = 1, append = false) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: pageNum,
        limit: 12,
        feed: activeTab,
        type: selectedType,
        search: searchQuery
      });
      const res = await fetch(apiUrl(`/api/posts?${queryParams}`));
      const data = await res.json();
      if (data.success) {
        setPosts(prev => append ? [...prev, ...data.posts] : data.posts);
        setTotalPosts(data.total);
        setPage(data.page);
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(1, false);
  }, [activeTab, selectedType]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPosts(1, false);
  };

  // Toggle Like
  const handleLike = async (postId) => {
    try {
      const res = await fetch(apiUrl(`/api/posts/${postId}/like`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: currentUser?.id || 1 })
      });
      const data = await res.json();
      if (data.success) {
        setPosts(prev => prev.map(p => {
          if (p.id === postId) {
            return {
              ...p,
              likes_count: data.likes_count,
              user_liked: data.liked
            };
          }
          return p;
        }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Toggle comments view
  const handleToggleComments = async (postId) => {
    if (activeCommentPostId === postId) {
      setActiveCommentPostId(null);
      return;
    }

    setActiveCommentPostId(postId);
    if (!commentsMap[postId]) {
      try {
        const res = await fetch(apiUrl(`/api/posts/${postId}/comments`));
        const data = await res.json();
        if (data.comments) {
          setCommentsMap(prev => ({ ...prev, [postId]: data.comments }));
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Submit comment
  const handleAddComment = async (e, postId) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    try {
      const res = await fetch(apiUrl(`/api/posts/${postId}/comments`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: currentUser?.id || 1,
          comment_text: commentInput
        })
      });
      const data = await res.json();
      if (data.success) {
        setCommentsMap(prev => ({
          ...prev,
          [postId]: [...(prev[postId] || []), data.comment]
        }));
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments_count: p.comments_count + 1 } : p));
        setCommentInput('');
      }
    } catch (err) {
      showToast('Error posting comment', 'error');
    }
  };

  // Create new post
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!postText.trim()) return;

    setCreating(true);
    try {
      const res = await fetch(apiUrl('/api/posts'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author_id: currentUser?.id || 1,
          content: postText,
          post_type: postType,
          media_url: mediaUrl || (postType !== 'text' ? 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80' : null),
          hashtags: '#CampusBuzz #StudentCreator #CollegeVibes'
        })
      });
      const data = await res.json();
      if (data.success) {
        setPosts(prev => [data.post, ...prev]);
        setTotalPosts(prev => prev + 1);
        setPostText('');
        setMediaUrl('');
        showToast('Your post is live on the campus feed!', 'success');
        triggerConfetti();
      }
    } catch (err) {
      showToast('Error publishing post', 'error');
    } finally {
      setCreating(false);
    }
  };

  // Delete own post
  const handleDeletePost = async (postId) => {
    try {
      const res = await fetch(apiUrl(`/api/posts/${postId}`), { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setPosts(prev => prev.filter(p => p.id !== postId));
        showToast('Post deleted', 'info');
      }
    } catch (e) {
      showToast('Error deleting post', 'error');
    }
  };

  const handleShare = (post) => {
    navigator.clipboard?.writeText(window.location.origin + `/feed#post-${post.id}`);
    showToast('Post link copied to clipboard!', 'info');
  };

  const postTypesList = ['all', 'image', 'reel', 'campus_activity', 'event_announcement', 'campaign_promo', 'achievement'];

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_#a855f7]" />
            <span className="text-[10px] font-mono tracking-widest uppercase text-purple-400 font-semibold">
              CAMPUS SOCIAL NETWORK
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight">
            Collegiate Creator Feed
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Live updates, creative reels, achievements, and activations from 10,000+ student accounts.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-purple-300 bg-purple-500/10 border border-purple-500/20 px-3.5 py-2 rounded-xl">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>{totalPosts.toLocaleString()} Live Posts</span>
        </div>
      </div>

      {/* Feed Filter Tabs & Search */}
      <div className="glass-panel p-4 rounded-2xl space-y-4">
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Main Feed Mode Tabs */}
          <div className="flex items-center gap-1.5 bg-[#121520] border border-white/5 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('explore')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'explore'
                  ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Explore</span>
            </button>
            <button
              onClick={() => setActiveTab('trending')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'trending'
                  ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Trending</span>
            </button>
            <button
              onClick={() => setActiveTab('following')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'following'
                  ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Following</span>
            </button>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts or #hashtags..."
              className="w-full bg-[#12141c] border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </form>

        </div>

        {/* Type Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[10px] text-slate-500 font-mono uppercase mr-1">Types:</span>
          {postTypesList.map((t, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedType(t)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono capitalize transition ${
                selectedType === t
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.replace('_', ' ')}
            </button>
          ))}
        </div>

      </div>

      {/* Create Post Input Box */}
      <div className="glass-panel p-5 rounded-2xl border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.1)]">
        <form onSubmit={handleCreatePost} className="space-y-3.5">
          <div className="flex items-start gap-3">
            <img
              src={currentUser?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80'}
              alt={currentUser?.name || 'User'}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-500/40"
            />
            <div className="flex-1">
              <textarea
                rows={3}
                required
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                placeholder="What are you creating or exploring on campus today? Share updates, milestones or questions..."
                className="w-full bg-[#12141c] border border-white/10 rounded-2xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 resize-none leading-relaxed"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/[0.06]">
            <div className="flex items-center gap-3">
              {/* Post Type Selector */}
              <select
                value={postType}
                onChange={(e) => setPostType(e.target.value)}
                className="bg-[#141724] border border-white/10 text-slate-300 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-purple-500 font-mono"
              >
                <option value="image">Image Post</option>
                <option value="reel">Reel / Video</option>
                <option value="campus_activity">Campus Activity</option>
                <option value="achievement">Achievement</option>
                <option value="event_announcement">Event Announcement</option>
                <option value="text">Text Only</option>
              </select>

              {/* Optional Media URL input */}
              {postType !== 'text' && (
                <input
                  type="url"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder="Optional image/media URL..."
                  className="bg-[#141724] border border-white/10 text-slate-300 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-purple-500 w-48 hidden sm:block"
                />
              )}
            </div>

            <button
              type="submit"
              disabled={creating || !postText.trim()}
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs shadow-[0_0_15px_rgba(168,85,247,0.4)] transition flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{creating ? 'Posting...' : 'Publish Post'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Posts Stream */}
      <div className="space-y-6">
        {posts.map((post) => {
          const isMyPost = post.author_id === currentUser?.id;
          const comments = commentsMap[post.id] || [];

          return (
            <div
              key={post.id}
              id={`post-${post.id}`}
              className="glass-panel p-5 rounded-2xl border border-white/[0.06] hover:border-purple-500/30 transition-all duration-300"
            >
              {/* Author Header */}
              <div className="flex items-center justify-between mb-3.5">
                <div 
                  onClick={() => openDetailDrawer && openDetailDrawer('creator', {
                    id: post.author_id,
                    name: post.author_name,
                    avatar_url: post.author_avatar,
                    college: post.author_college,
                    username: post.author_username,
                    category: post.author_category || 'Creator'
                  })}
                  className="flex items-center gap-3 cursor-pointer group"
                  title="Click to view creator profile & posts"
                >
                  <img
                    src={post.author_avatar || `https://randomuser.me/api/portraits/women/${(post.id || 1) % 100}.jpg`}
                    alt={post.author_name}
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-purple-500/40 group-hover:ring-purple-400 group-hover:scale-105 transition"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-white leading-tight group-hover:text-purple-300 transition">
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

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openDetailDrawer && openDetailDrawer('creator', {
                      id: post.author_id,
                      name: post.author_name,
                      avatar_url: post.author_avatar,
                      college: post.author_college,
                      username: post.author_username,
                      category: post.author_category || 'Creator'
                    })}
                    className="text-[10px] font-mono font-medium text-purple-300 hover:text-white bg-purple-500/15 hover:bg-purple-500/30 border border-purple-500/30 px-2.5 py-0.5 rounded-lg transition cursor-pointer"
                  >
                    View Profile
                  </button>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.04] text-slate-400 border border-white/[0.06] capitalize">
                    {post.post_type.replace('_', ' ')}
                  </span>
                  {isMyPost && (
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                      title="Delete post"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Post Text Content */}
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

              {/* Action Bar (Like, Comment, Share) */}
              <div className="flex items-center justify-between pt-3 border-t border-white/[0.06] text-xs text-slate-400">
                <div className="flex items-center gap-4">
                  
                  {/* Like Button */}
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl transition ${
                      post.user_liked
                        ? 'bg-pink-500/15 text-pink-400 font-bold border border-pink-500/30'
                        : 'hover:bg-white/[0.04] hover:text-pink-400'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${post.user_liked ? 'fill-pink-500 text-pink-500' : ''}`} />
                    <span className="font-mono text-xs">{post.likes_count}</span>
                  </button>

                  {/* Comment Button */}
                  <button
                    onClick={() => handleToggleComments(post.id)}
                    className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl hover:bg-white/[0.04] hover:text-purple-400 transition"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span className="font-mono text-xs">{post.comments_count}</span>
                  </button>

                  {/* Share Button */}
                  <button
                    onClick={() => handleShare(post)}
                    className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl hover:bg-white/[0.04] hover:text-cyan-400 transition"
                  >
                    <Share2 className="w-4 h-4" />
                    <span className="text-[11px] hidden sm:inline">Share</span>
                  </button>

                  {/* Bookmark / Save Button */}
                  <button
                    onClick={() => toggleSavePost && toggleSavePost(post.id)}
                    className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl transition ${
                      savedPostIds.includes(post.id)
                        ? 'bg-purple-500/15 text-purple-300 font-semibold border border-purple-500/30'
                        : 'hover:bg-white/[0.04] hover:text-purple-300'
                    }`}
                    title={savedPostIds.includes(post.id) ? 'Saved in collection' : 'Save post'}
                  >
                    <Bookmark className={`w-4 h-4 ${savedPostIds.includes(post.id) ? 'fill-purple-400 text-purple-400' : ''}`} />
                    <span className="text-[11px] hidden sm:inline">{savedPostIds.includes(post.id) ? 'Saved' : 'Save'}</span>
                  </button>

                </div>

                <span className="text-[10px] text-slate-500 font-mono">
                  {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>

              {/* Comments Section Drawer */}
              {activeCommentPostId === post.id && (
                <div className="mt-4 pt-4 border-t border-white/[0.06] space-y-3 animate-in fade-in duration-200">
                  <div className="text-[11px] font-mono uppercase text-slate-400 font-bold">
                    Comments ({comments.length})
                  </div>

                  {/* Comments list */}
                  <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                    {comments.length === 0 ? (
                      <p className="text-xs text-slate-500 italic py-2">No comments yet. Be the first to share your thoughts!</p>
                    ) : (
                      comments.map((c) => (
                        <div key={c.id} className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] text-xs">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-white text-[11px]">{c.author_name}</span>
                            <span className="text-[9px] text-slate-500 font-mono">
                              {new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-slate-300 text-xs leading-relaxed">{c.comment_text}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add comment input */}
                  <form onSubmit={(e) => handleAddComment(e, post.id)} className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      placeholder="Write a supportive collegiate reply..."
                      className="flex-1 bg-[#12141c] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    />
                    <button
                      type="submit"
                      disabled={!commentInput.trim()}
                      className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-semibold shadow transition"
                    >
                      Post
                    </button>
                  </form>
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* Pagination / Load More */}
      <div className="pt-6 pb-12 text-center">
        <button
          onClick={() => fetchPosts(page + 1, true)}
          disabled={loading || posts.length >= totalPosts}
          className="px-6 py-3 rounded-2xl bg-[#141724] hover:bg-[#1d2236] border border-white/10 text-xs font-bold text-slate-200 transition shadow"
        >
          {loading ? 'Loading Posts...' : (posts.length >= totalPosts ? 'All Posts Loaded' : 'Load More Campus Posts')}
        </button>
      </div>

    </div>
  );
}
