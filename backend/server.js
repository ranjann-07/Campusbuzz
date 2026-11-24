const path = require('path');
const crypto = require('crypto');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

dotenv.config({ path: path.join(__dirname, '.env') });

const {
  initDB,
  getDbMode,
  isMongoConnected,
  getMemoryDb,
  saveLocalDb,
  getNextId
} = require('./config/db');
const {
  Student,
  Post,
  PostLike,
  PostComment,
  Event,
  EventRegistration,
  Campaign,
  CampaignApplication,
  Club,
  ClubMember,
  Collaboration,
  Message,
  ActivityLog
} = require('./models');
const initialData = require('./config/seedData');

const app = express();
const PORT = process.env.PORT || 5001;
const IS_PROD = process.env.NODE_ENV === 'production';

// Never fall back to a known static secret in production
const JWT_SECRET =
  process.env.JWT_SECRET ||
  (IS_PROD ? crypto.randomBytes(32).toString('hex') : 'campusbuzz_dev_secret_key_local_only');

if (IS_PROD && !process.env.JWT_SECRET) {
  console.warn('⚠️ JWT_SECRET not set in production environment; generated ephemeral runtime secret.');
}

// -------------------------------------------------------------
// CORS Configuration
// -------------------------------------------------------------
const configuredOrigins = (process.env.CORS_ORIGIN || process.env.FRONTEND_URL || '')
  .split(',')
  .map((o) => o.trim().replace(/\/$/, ''))
  .filter(Boolean);

const devOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173', 'http://127.0.0.1:5173'];
const allowVercelPreviews = process.env.ALLOW_VERCEL_PREVIEWS === 'true';

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests with no Origin header (curl, health checks, server calls)
      if (!origin) return callback(null, true);

      const normalizedOrigin = origin.replace(/\/$/, '');
      if (configuredOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }
      if (!IS_PROD && (devOrigins.includes(normalizedOrigin) || /^http:\/\/192\.168\.\d+\.\d+:\d+$/.test(normalizedOrigin))) {
        return callback(null, true);
      }
      if (allowVercelPreviews && /^https:\/\/[a-zA-Z0-9-]+\.vercel\.app$/.test(normalizedOrigin)) {
        return callback(null, true);
      }
      if (!IS_PROD && configuredOrigins.length === 0) {
        return callback(null, true);
      }
      return callback(new Error(`CORS policy blocked origin: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json({ limit: '10mb' }));

// Ensure DB initialized before handling API routes
const dbReadyPromise = initDB();
app.use('/api', async (req, res, next) => {
  await dbReadyPromise;
  if (IS_PROD && getDbMode() !== 'mongodb' && req.path !== '/health' && req.path !== '/db-status') {
    return res.status(503).json({
      success: false,
      message: 'Database connection unavailable. Verify MONGODB_URI and Atlas network access.'
    });
  }
  next();
});

// Helpers
function escapeRegex(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getAuthUser(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  try {
    const token = authHeader.split(' ')[1];
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

function mapStudentToCreatorDto(s, extra = {}) {
  return {
    id: s.id,
    student_id: s.student_id,
    name: s.full_name,
    full_name: s.full_name,
    email: s.email,
    username: s.username,
    avatar_url: s.profile_photo,
    profile_photo: s.profile_photo,
    college: s.college_name,
    college_name: s.college_name,
    department: s.department_name,
    department_name: s.department_name,
    course: s.course,
    semester: s.semester,
    year: s.year,
    bio: s.bio,
    instagram: s.instagram,
    youtube: s.youtube,
    linkedin: s.linkedin,
    category: s.creator_category,
    creator_category: s.creator_category,
    followers: s.followers_count,
    followers_count: s.followers_count,
    engagement_rate: s.engagement_rate,
    account_status: s.account_status,
    verification_status: s.verification_status || 'verified',
    role: s.role,
    ...extra
  };
}

// -------------------------------------------------------------
// Root & Health / DB Status
// -------------------------------------------------------------
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'CampusBuzz Enterprise API',
    version: '2.1.0',
    healthEndpoint: '/api/health'
  });
});

app.get('/api/health', async (req, res) => {
  await dbReadyPromise;
  res.json({
    status: 'online',
    appName: 'CampusBuzz Enterprise API',
    version: '2.1.0',
    dbMode: getDbMode(),
    mongoConnected: isMongoConnected(),
    timestamp: new Date().toISOString()
  });
});

app.get('/api/db-status', async (req, res) => {
  try {
    if (getDbMode() === 'mongodb') {
      const [totalStudents, totalPosts, totalCampaigns, totalEvents] = await Promise.all([
        Student.countDocuments(),
        Post.countDocuments(),
        Campaign.countDocuments(),
        Event.countDocuments()
      ]);
      return res.json({
        mode: 'mongodb',
        active: isMongoConnected(),
        database: process.env.MONGODB_DB_NAME || 'campusbuzz_db',
        totalStudents,
        totalPosts,
        totalCampaigns,
        totalEvents
      });
    }

    const mem = getMemoryDb();
    return res.json({
      mode: getDbMode(),
      active: getDbMode() === 'memory',
      totalStudents: (mem.students || []).length || 10200,
      totalPosts: (mem.posts || []).length || 5200,
      totalCampaigns: (mem.campaigns || []).length,
      totalEvents: (mem.events || []).length
    });
  } catch (err) {
    res.status(500).json({ mode: getDbMode(), active: false, error: err.message });
  }
});

// -------------------------------------------------------------
// Universal Search across 6 entities
// -------------------------------------------------------------
app.get('/api/search', async (req, res) => {
  const q = req.query.q ? req.query.q.trim() : '';
  if (!q) {
    return res.json({ success: true, results: [] });
  }

  const rx = new RegExp(escapeRegex(q), 'i');

  try {
    if (getDbMode() === 'mongodb') {
      const [studentsRaw, creatorsRaw, postsRaw, eventsRaw, campaignsRaw, clubsRaw] = await Promise.all([
        Student.find({ $or: [{ full_name: rx }, { username: rx }, { student_id: rx }] })
          .limit(4)
          .lean(),
        Student.find({ followers_count: { $gte: 5000 }, $or: [{ full_name: rx }, { creator_category: rx }] })
          .limit(4)
          .lean(),
        Post.find({ $or: [{ content: rx }, { hashtags: rx }] })
          .limit(4)
          .lean(),
        Event.find({ $or: [{ name: rx }, { category: rx }, { venue: rx }] })
          .limit(4)
          .lean(),
        Campaign.find({ $or: [{ name: rx }, { brand_name: rx }, { required_category: rx }] })
          .limit(4)
          .lean(),
        Club.find({ $or: [{ name: rx }, { category: rx }] })
          .limit(4)
          .lean()
      ]);

      return res.json({
        success: true,
        query: q,
        results: {
          students: studentsRaw.map((s) => ({
            id: s.id,
            student_id: s.student_id,
            title: s.full_name,
            username: s.username,
            subtitle: s.college_name,
            image: s.profile_photo,
            type: 'student'
          })),
          creators: creatorsRaw.map((s) => ({
            id: s.id,
            student_id: s.student_id,
            title: s.full_name,
            subtitle: s.creator_category,
            image: s.profile_photo,
            type: 'creator'
          })),
          posts: postsRaw.map((p) => ({
            id: p.id,
            title: p.content,
            subtitle: p.hashtags,
            image: p.media_url,
            type: 'post'
          })),
          events: eventsRaw.map((e) => ({
            id: e.id,
            title: e.name,
            subtitle: `${e.event_date} • ${e.venue}`,
            image: e.banner_image,
            type: 'event'
          })),
          campaigns: campaignsRaw.map((c) => ({
            id: c.id,
            title: c.name,
            subtitle: `${c.brand_name} • ₹${c.budget}`,
            image: c.image_url,
            type: 'campaign'
          })),
          clubs: clubsRaw.map((c) => ({
            id: c.id,
            title: c.name,
            subtitle: c.category,
            image: c.banner_url,
            type: 'club'
          }))
        }
      });
    }

    const mem = getMemoryDb();
    return res.json({
      success: true,
      query: q,
      results: {
        students: (mem.students || [])
          .filter((s) => rx.test(s.full_name) || rx.test(s.username) || rx.test(s.student_id))
          .slice(0, 4)
          .map((s) => ({
            id: s.id,
            student_id: s.student_id,
            title: s.full_name,
            username: s.username,
            subtitle: s.college_name,
            image: s.profile_photo,
            type: 'student'
          })),
        creators: (mem.students || [])
          .filter((s) => s.followers_count >= 5000 && (rx.test(s.full_name) || rx.test(s.creator_category)))
          .slice(0, 4)
          .map((s) => ({
            id: s.id,
            student_id: s.student_id,
            title: s.full_name,
            subtitle: s.creator_category,
            image: s.profile_photo,
            type: 'creator'
          })),
        posts: (mem.posts || [])
          .filter((p) => rx.test(p.content) || rx.test(p.hashtags || ''))
          .slice(0, 4)
          .map((p) => ({ id: p.id, title: p.content, subtitle: p.hashtags, image: p.media_url, type: 'post' })),
        events: (mem.events || [])
          .filter((e) => rx.test(e.name) || rx.test(e.category) || rx.test(e.venue))
          .slice(0, 4)
          .map((e) => ({
            id: e.id,
            title: e.name,
            subtitle: `${e.event_date} • ${e.venue}`,
            image: e.banner_image,
            type: 'event'
          })),
        campaigns: (mem.campaigns || [])
          .filter((c) => rx.test(c.name) || rx.test(c.brand_name) || rx.test(c.required_category))
          .slice(0, 4)
          .map((c) => ({
            id: c.id,
            title: c.name,
            subtitle: `${c.brand_name} • ₹${c.budget}`,
            image: c.image_url,
            type: 'campaign'
          })),
        clubs: (mem.clubs || [])
          .filter((c) => rx.test(c.name) || rx.test(c.category))
          .slice(0, 4)
          .map((c) => ({ id: c.id, title: c.name, subtitle: c.category, image: c.banner_url, type: 'club' }))
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// Clubs Endpoints
// -------------------------------------------------------------
app.get('/api/clubs', async (req, res) => {
  const studentId = parseInt(req.query.student_id || '1', 10);
  try {
    if (getDbMode() === 'mongodb') {
      const [clubs, memberships] = await Promise.all([
        Club.find().sort({ members_count: -1 }).lean(),
        ClubMember.find({ student_id: studentId }).select('club_id').lean()
      ]);
      const joinedIds = new Set(memberships.map((m) => m.club_id));
      const data = clubs.map((c) => ({ ...c, is_member: joinedIds.has(c.id) ? 1 : 0 }));
      return res.json({ success: true, count: data.length, data });
    }
    const mem = getMemoryDb();
    const joinedIds = new Set(
      (mem.club_members || []).filter((m) => m.student_id === studentId).map((m) => m.club_id)
    );
    const data = [...(mem.clubs || [])]
      .sort((a, b) => (b.members_count || 0) - (a.members_count || 0))
      .map((c) => ({ ...c, is_member: joinedIds.has(c.id) ? 1 : 0 }));
    return res.json({ success: true, count: data.length, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/clubs/:id/join', async (req, res) => {
  const clubId = parseInt(req.params.id, 10);
  const studentId = parseInt(req.body.student_id || '1', 10);
  try {
    if (getDbMode() === 'mongodb') {
      const existing = await ClubMember.findOne({ club_id: clubId, student_id: studentId }).lean();
      if (!existing) {
        await ClubMember.create({ club_id: clubId, student_id: studentId });
        await Club.updateOne({ id: clubId }, { $inc: { members_count: 1 } });
      }
      return res.json({ success: true, message: 'Joined club successfully!' });
    }
    const mem = getMemoryDb();
    if (!mem.club_members) mem.club_members = [];
    if (!mem.club_members.some((m) => m.club_id === clubId && m.student_id === studentId)) {
      mem.club_members.push({ club_id: clubId, student_id: studentId });
      const club = (mem.clubs || []).find((c) => c.id === clubId);
      if (club) club.members_count = (club.members_count || 0) + 1;
      saveLocalDb();
    }
    return res.json({ success: true, message: 'Joined club successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/clubs/:id/leave', async (req, res) => {
  const clubId = parseInt(req.params.id, 10);
  const studentId = parseInt(req.body.student_id || '1', 10);
  try {
    if (getDbMode() === 'mongodb') {
      const deleted = await ClubMember.deleteOne({ club_id: clubId, student_id: studentId });
      if (deleted.deletedCount > 0) {
        const club = await Club.findOne({ id: clubId });
        if (club && club.members_count > 0) {
          club.members_count -= 1;
          await club.save();
        }
      }
      return res.json({ success: true, message: 'Left club' });
    }
    const mem = getMemoryDb();
    const before = (mem.club_members || []).length;
    mem.club_members = (mem.club_members || []).filter(
      (m) => !(m.club_id === clubId && m.student_id === studentId)
    );
    if (mem.club_members.length < before) {
      const club = (mem.clubs || []).find((c) => c.id === clubId);
      if (club && club.members_count > 0) club.members_count -= 1;
      saveLocalDb();
    }
    return res.json({ success: true, message: 'Left club' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// Influencer Match Score & Suggestions
// -------------------------------------------------------------
app.get('/api/match-score', async (req, res) => {
  try {
    let suggestions = [];
    if (getDbMode() === 'mongodb') {
      suggestions = await Student.aggregate([
        { $match: { followers_count: { $gte: 10000 } } },
        {
          $addFields: {
            match_score: {
              $round: [{ $add: [70, { $multiply: ['$engagement_rate', 4] }, { $divide: ['$followers_count', 1500] }] }, 0]
            }
          }
        },
        { $sort: { match_score: -1 } },
        { $limit: 6 },
        {
          $project: {
            _id: 0,
            id: 1,
            student_id: 1,
            full_name: 1,
            username: 1,
            profile_photo: 1,
            college_name: 1,
            creator_category: 1,
            followers_count: 1,
            engagement_rate: 1,
            match_score: 1
          }
        }
      ]);
    } else {
      const mem = getMemoryDb();
      suggestions = (mem.students || [])
        .filter((s) => s.followers_count >= 10000)
        .map((s) => ({
          id: s.id,
          student_id: s.student_id,
          full_name: s.full_name,
          username: s.username,
          profile_photo: s.profile_photo,
          college_name: s.college_name,
          creator_category: s.creator_category,
          followers_count: s.followers_count,
          engagement_rate: s.engagement_rate,
          match_score: Math.round(70 + Number(s.engagement_rate || 0) * 4 + Number(s.followers_count || 0) / 1500)
        }))
        .sort((a, b) => b.match_score - a.match_score)
        .slice(0, 6);
    }

    res.json({
      success: true,
      matchScore: 92,
      maxScore: 100,
      factors: [
        { label: 'High Engagement', value: '4.92% avg (Top 5% on campus)' },
        { label: 'Relevant Category', value: 'Lifestyle, Media & Tech' },
        { label: 'Strong Follower Base', value: '18,400+ authentic collegiate reach' }
      ],
      suggestions
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// Dashboard Stats
// -------------------------------------------------------------
app.get('/api/dashboard/stats', async (req, res) => {
  const defaultTopCreator = {
    id: 5,
    student_id: 'CB-2026-00005',
    full_name: 'Shivani Negi',
    username: 'shivani.negi',
    profile_photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80',
    college_name: 'Shoolini University',
    creator_category: 'Lifestyle',
    followers_count: 184500,
    engagement_rate: '5.70',
    reach_display: '220K Reach',
    ranking_display: '#1 on Campus'
  };

  try {
    if (getDbMode() === 'mongodb') {
      const [
        studentCount,
        creatorCount,
        postsCount,
        campaignsCount,
        eventsCount,
        engAgg,
        topCreatorRow,
        trendingCreators,
        trendingPostsRaw,
        activeCampaignsList,
        upcomingEvents
      ] = await Promise.all([
        Student.countDocuments(),
        Student.countDocuments({ followers_count: { $gte: 5000 } }),
        Post.countDocuments(),
        Campaign.countDocuments({ status: 'active' }),
        Event.countDocuments({ event_date: { $gte: '2026-12-11' } }),
        Post.aggregate([{ $group: { _id: null, total: { $sum: { $add: ['$likes_count', '$comments_count'] } } } }]),
        Student.findOne({ $or: [{ student_id: 'CB-2026-00005' }, { full_name: /Shivani Negi/i }] }).lean(),
        Student.find({ followers_count: { $gte: 5000 } })
          .sort({ followers_count: -1 })
          .limit(10)
          .select('-password_hash -_id -__v')
          .lean(),
        Post.find({
          $or: [
            { content: /Campus Fest vibes/i },
            { content: /Nature hits different/i },
            { content: /Campus life at Shoolini/i },
            { likes_count: { $gt: 500 } }
          ]
        })
          .sort({ likes_count: -1 })
          .limit(4)
          .lean(),
        Campaign.find().sort({ id: 1 }).limit(15).select('-_id -__v').lean(),
        Event.find({ event_date: { $gte: '2026-12-11' } })
          .sort({ event_date: 1 })
          .limit(20)
          .select('-_id -__v')
          .lean()
      ]);

      const authorIds = [...new Set(trendingPostsRaw.map((p) => p.author_id))];
      const authors = await Student.find({ id: { $in: authorIds } }).lean();
      const authorMap = new Map(authors.map((a) => [a.id, a]));

      const trendingPosts = trendingPostsRaw.map((p) => {
        const a = authorMap.get(p.author_id) || {};
        return {
          id: p.id,
          content: p.content,
          media_url: p.media_url,
          post_type: p.post_type,
          hashtags: p.hashtags,
          likes_count: p.likes_count,
          comments_count: p.comments_count,
          shares_count: p.shares_count,
          created_at: p.created_at,
          author_id: p.author_id,
          author_name: a.full_name || 'Campus Creator',
          author_username: a.username || 'creator',
          author_avatar: a.profile_photo || '',
          author_college: a.college_name || 'Shoolini University'
        };
      });

      const engTotal = engAgg[0]?.total || 1413635;
      const topCreatorOfTheMonth = topCreatorRow
        ? {
            id: topCreatorRow.id,
            student_id: topCreatorRow.student_id,
            full_name: topCreatorRow.full_name,
            username: topCreatorRow.username,
            profile_photo: topCreatorRow.profile_photo,
            college_name: topCreatorRow.college_name,
            creator_category: topCreatorRow.creator_category,
            followers_count: topCreatorRow.followers_count,
            engagement_rate: topCreatorRow.engagement_rate,
            reach_display: '220K Reach',
            ranking_display: '#1 on Campus'
          }
        : defaultTopCreator;

      return res.json({
        success: true,
        stats: {
          totalStudents: studentCount,
          totalCreators: creatorCount,
          totalPosts: postsCount,
          activeCampaigns: campaignsCount,
          upcomingEvents: eventsCount,
          totalEngagement: engTotal.toLocaleString(),
          totalReach: '1.24M',
          avgEngagementRate: '4.35%'
        },
        topCreatorOfTheMonth,
        trendingCreators,
        trendingPosts,
        upcomingEvents,
        activeCampaigns: activeCampaignsList
      });
    }

    const mem = getMemoryDb();
    const students = mem.students || [];
    const posts = mem.posts || [];
    const campaigns = mem.campaigns || [];
    const events = mem.events || [];
    const studentMap = new Map(students.map((s) => [s.id, s]));

    const trendingCreators = [...students]
      .filter((s) => s.followers_count >= 5000)
      .sort((a, b) => b.followers_count - a.followers_count)
      .slice(0, 10);

    const trendingPosts = [...posts]
      .filter(
        (p) =>
          /Campus Fest vibes|Nature hits different|Campus life at Shoolini/i.test(p.content) || p.likes_count > 500
      )
      .sort((a, b) => b.likes_count - a.likes_count)
      .slice(0, 4)
      .map((p) => {
        const a = studentMap.get(p.author_id) || {};
        return {
          ...p,
          author_name: a.full_name || 'Campus Creator',
          author_username: a.username || 'creator',
          author_avatar: a.profile_photo || '',
          author_college: a.college_name || 'Shoolini University'
        };
      });

    const shivani = students.find((s) => s.student_id === 'CB-2026-00005' || /Shivani Negi/i.test(s.full_name));

    return res.json({
      success: true,
      stats: {
        totalStudents: students.length,
        totalCreators: students.filter((s) => s.followers_count >= 5000).length,
        totalPosts: posts.length,
        activeCampaigns: campaigns.filter((c) => c.status === 'active').length,
        upcomingEvents: events.filter((e) => e.event_date >= '2026-12-11').length,
        totalEngagement: posts.reduce((sum, p) => sum + (p.likes_count || 0) + (p.comments_count || 0), 0).toLocaleString(),
        totalReach: '1.24M',
        avgEngagementRate: '4.35%'
      },
      topCreatorOfTheMonth: shivani
        ? { ...shivani, reach_display: '220K Reach', ranking_display: '#1 on Campus' }
        : defaultTopCreator,
      trendingCreators,
      trendingPosts,
      upcomingEvents: events.filter((e) => e.event_date >= '2026-12-11').slice(0, 20),
      activeCampaigns: campaigns.slice(0, 15)
    });
  } catch (err) {
    console.error('Error fetching dashboard stats:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// Authentication (Student & Admin)
// -------------------------------------------------------------
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  const normalized = email.trim().toLowerCase();

  try {
    let student = null;
    if (getDbMode() === 'mongodb') {
      student = await Student.findOne({ $or: [{ email: normalized }, { username: email.trim() }] }).lean();
    } else {
      const mem = getMemoryDb();
      student = (mem.students || []).find(
        (s) => s.email?.toLowerCase() === normalized || s.username === email.trim()
      );
    }

    if (!student) {
      return res.status(401).json({ success: false, message: 'Student account not found with this email or username' });
    }

    const isPasswordValid = student.password_hash ? bcrypt.compareSync(password, student.password_hash) : false;
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Please verify your password.' });
    }

    const token = jwt.sign(
      { id: student.id, student_id: student.student_id, name: student.full_name, email: student.email, role: student.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: student.id,
        student_id: student.student_id,
        name: student.full_name,
        email: student.email,
        username: student.username,
        role: student.role,
        college: student.college_name,
        department: student.department_name,
        course: student.course,
        semester: student.semester,
        year: student.year,
        avatar_url: student.profile_photo,
        creator_category: student.creator_category,
        followers_count: student.followers_count,
        engagement_rate: student.engagement_rate,
        bio: student.bio
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  const { full_name, email, username, password, college_name, department_name, course, semester, creator_category, bio } =
    req.body;

  if (!full_name || !email || !username || !password) {
    return res.status(400).json({ success: false, message: 'Name, email, username, and password are required' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedUsername = username.trim();

  try {
    const passwordHash = bcrypt.hashSync(password, 6);
    const avatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(normalizedUsername)}`;
    const sem = Number(semester) || 1;

    if (getDbMode() === 'mongodb') {
      const existing = await Student.findOne({
        $or: [{ email: normalizedEmail }, { username: normalizedUsername }]
      }).lean();
      if (existing) {
        return res.status(400).json({ success: false, message: 'A student account with this email or username already exists' });
      }

      const nextId = await getNextId('students');
      const newStudentId = `CB-2026-${String(nextId).padStart(5, '0')}`;
      const doc = await Student.create({
        id: nextId,
        student_id: newStudentId,
        full_name: full_name.trim(),
        email: normalizedEmail,
        username: normalizedUsername,
        password_hash: passwordHash,
        profile_photo: avatar,
        college_name: college_name || 'Delhi University',
        department_name: department_name || 'Computer Science & Engineering',
        course: course || 'B.Tech CSE',
        semester: sem,
        year: Math.ceil(sem / 2),
        bio: bio || `Student creator at ${college_name || 'Delhi University'}`,
        instagram: normalizedUsername,
        youtube: `${normalizedUsername}Vlogs`,
        linkedin: normalizedUsername,
        creator_category: creator_category || 'Lifestyle',
        followers_count: 100,
        engagement_rate: 3.5,
        account_status: 'active',
        verification_status: 'verified',
        is_creator: true,
        role: 'student'
      });

      const token = jwt.sign(
        { id: doc.id, student_id: newStudentId, name: doc.full_name, email: normalizedEmail, role: 'student' },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        success: true,
        token,
        user: {
          id: doc.id,
          student_id: newStudentId,
          name: doc.full_name,
          email: doc.email,
          username: doc.username,
          role: 'student',
          college: doc.college_name,
          department: doc.department_name,
          avatar_url: avatar
        }
      });
    }

    const mem = getMemoryDb();
    if ((mem.students || []).some((s) => s.email === normalizedEmail || s.username === normalizedUsername)) {
      return res.status(400).json({ success: false, message: 'A student account with this email or username already exists' });
    }
    const nextId = await getNextId('students');
    const newStudentId = `CB-2026-${String(nextId).padStart(5, '0')}`;
    const newStudent = {
      id: nextId,
      student_id: newStudentId,
      full_name: full_name.trim(),
      email: normalizedEmail,
      username: normalizedUsername,
      password_hash: passwordHash,
      profile_photo: avatar,
      college_name: college_name || 'Delhi University',
      department_name: department_name || 'Computer Science & Engineering',
      course: course || 'B.Tech CSE',
      semester: sem,
      year: Math.ceil(sem / 2),
      bio: bio || `Student creator at ${college_name || 'Delhi University'}`,
      instagram: normalizedUsername,
      youtube: `${normalizedUsername}Vlogs`,
      linkedin: normalizedUsername,
      creator_category: creator_category || 'Lifestyle',
      followers_count: 100,
      engagement_rate: 3.5,
      account_status: 'active',
      verification_status: 'verified',
      is_creator: true,
      role: 'student'
    };
    mem.students.push(newStudent);
    saveLocalDb();

    const token = jwt.sign(
      { id: nextId, student_id: newStudentId, name: newStudent.full_name, email: normalizedEmail, role: 'student' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    return res.status(201).json({
      success: true,
      token,
      user: {
        id: nextId,
        student_id: newStudentId,
        name: newStudent.full_name,
        email: normalizedEmail,
        username: normalizedUsername,
        role: 'student',
        college: newStudent.college_name,
        department: newStudent.department_name,
        avatar_url: avatar
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// Students Directory & Creators
// -------------------------------------------------------------
app.get('/api/students', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || '24', 10)));
    const skip = (page - 1) * limit;
    const { search, category, college, sortBy } = req.query;

    if (getDbMode() === 'mongodb') {
      const filter = {};
      if (search) {
        const rx = new RegExp(escapeRegex(search.trim()), 'i');
        filter.$or = [{ full_name: rx }, { username: rx }, { student_id: rx }, { department_name: rx }];
      }
      if (category && category !== 'All') {
        filter.creator_category = category;
      }
      if (college && college !== 'All') {
        filter.college_name = new RegExp(escapeRegex(college.trim()), 'i');
      }

      let sort = { followers_count: -1 };
      if (sortBy === 'engagement') sort = { engagement_rate: -1 };
      if (sortBy === 'newest') sort = { id: -1 };
      if (sortBy === 'name') sort = { full_name: 1 };

      const [total, rows] = await Promise.all([
        Student.countDocuments(filter),
        Student.find(filter).sort(sort).skip(skip).limit(limit).select('-password_hash -_id -__v').lean()
      ]);

      return res.json({
        success: true,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        data: rows.map((s) => mapStudentToCreatorDto(s))
      });
    }

    const mem = getMemoryDb();
    let list = [...(mem.students || [])];
    if (search) {
      const rx = new RegExp(escapeRegex(search.trim()), 'i');
      list = list.filter((s) => rx.test(s.full_name) || rx.test(s.username) || rx.test(s.student_id) || rx.test(s.department_name));
    }
    if (category && category !== 'All') list = list.filter((s) => s.creator_category === category);
    if (college && college !== 'All') {
      const rxC = new RegExp(escapeRegex(college.trim()), 'i');
      list = list.filter((s) => rxC.test(s.college_name));
    }
    if (sortBy === 'engagement') list.sort((a, b) => Number(b.engagement_rate) - Number(a.engagement_rate));
    else if (sortBy === 'newest') list.sort((a, b) => b.id - a.id);
    else if (sortBy === 'name') list.sort((a, b) => a.full_name.localeCompare(b.full_name));
    else list.sort((a, b) => b.followers_count - a.followers_count);

    const total = list.length;
    const rows = list.slice(skip, skip + limit).map((s) => mapStudentToCreatorDto(s));
    return res.json({ success: true, total, page, limit, totalPages: Math.ceil(total / limit), data: rows });
  } catch (err) {
    console.error('Students API Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/creators', async (req, res) => {
  try {
    if (getDbMode() === 'mongodb') {
      const rows = await Student.find()
        .sort({ followers_count: -1 })
        .limit(48)
        .select('-password_hash -_id -__v')
        .lean();
      const data = rows.map((s) =>
        mapStudentToCreatorDto(s, {
          is_spotlight: s.id === 1 || s.id === 5,
          rating: 4.85,
          total_collaborations: 12,
          verification_status: s.verification_status || 'verified'
        })
      );
      return res.json({ success: true, count: data.length, data });
    }

    const mem = getMemoryDb();
    const rows = [...(mem.students || [])]
      .sort((a, b) => b.followers_count - a.followers_count)
      .slice(0, 48)
      .map((s) =>
        mapStudentToCreatorDto(s, {
          is_spotlight: s.id === 1 || s.id === 5,
          rating: 4.85,
          total_collaborations: 12,
          verification_status: s.verification_status || 'verified'
        })
      );
    return res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/creators', async (req, res) => {
  const { name, college, department, instagram, youtube, followers, engagement_rate, category, avatar_url, bio } =
    req.body;

  if (!name || !college) {
    return res.status(400).json({ success: false, message: 'Creator name and college are required' });
  }

  try {
    const nextId = await getNextId('students');
    const studentId = `CB-2026-${String(nextId).padStart(5, '0')}`;
    const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '.')}_${nextId}`;
    const docData = {
      id: nextId,
      student_id: studentId,
      full_name: name.trim(),
      email: `${slug}@campus.edu`,
      username: slug,
      password_hash: bcrypt.hashSync('password123', 6),
      profile_photo:
        avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
      college_name: college,
      department_name: department || 'Media & Communication',
      course: 'B.Tech',
      semester: 4,
      year: 2,
      bio: bio || `Student creator at ${college}`,
      instagram: instagram || slug,
      youtube: youtube || `${slug}Official`,
      linkedin: slug,
      creator_category: category || 'Technology',
      followers_count: parseInt(followers || '15000', 10) || 15000,
      engagement_rate: parseFloat(engagement_rate || '4.2') || 4.2,
      account_status: 'active',
      verification_status: 'verified',
      is_creator: true,
      role: 'creator'
    };

    if (getDbMode() === 'mongodb') {
      await Student.create(docData);
    } else {
      const mem = getMemoryDb();
      mem.students.unshift(docData);
      saveLocalDb();
    }

    res.status(201).json({
      success: true,
      data: mapStudentToCreatorDto(docData, {
        is_spotlight: false,
        rating: 4.85,
        total_collaborations: 1
      })
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/students/:id', async (req, res) => {
  const param = req.params.id;
  const numId = /^\d+$/.test(param) ? parseInt(param, 10) : null;

  try {
    if (getDbMode() === 'mongodb') {
      const student = await Student.findOne(numId !== null ? { id: numId } : { username: param })
        .select('-password_hash -_id -__v')
        .lean();
      if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

      const [postsCount, recentPosts, eventRegs, campApps] = await Promise.all([
        Post.countDocuments({ author_id: student.id }),
        Post.find({ author_id: student.id }).sort({ id: -1 }).limit(10).select('-_id -__v').lean(),
        EventRegistration.find({ student_id: student.id }).select('event_id').lean(),
        CampaignApplication.find({ student_id: student.id }).lean()
      ]);

      const [registeredEvents, appliedCampaignDocs] = await Promise.all([
        Event.find({ id: { $in: eventRegs.map((r) => r.event_id) } }).select('-_id -__v').lean(),
        Campaign.find({ id: { $in: campApps.map((a) => a.campaign_id) } }).select('-_id -__v').lean()
      ]);

      const appMap = new Map(campApps.map((a) => [a.campaign_id, a]));
      const appliedCampaigns = appliedCampaignDocs.map((c) => ({
        ...c,
        app_status: appMap.get(c.id)?.status || 'pending',
        applied_at: appMap.get(c.id)?.applied_at
      }));

      return res.json({
        success: true,
        student: {
          ...student,
          posts_count: postsCount,
          posts: recentPosts,
          registered_events: registeredEvents,
          applied_campaigns: appliedCampaigns
        }
      });
    }

    const mem = getMemoryDb();
    const student = (mem.students || []).find((s) => (numId !== null ? s.id === numId : s.username === param));
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    const recentPosts = (mem.posts || []).filter((p) => p.author_id === student.id).slice(0, 10);
    return res.json({
      success: true,
      student: { ...student, posts_count: recentPosts.length, posts: recentPosts, registered_events: [], applied_campaigns: [] }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/students/:id', async (req, res) => {
  const numId = parseInt(req.params.id, 10);
  const { full_name, bio, instagram, youtube, linkedin, profile_photo, creator_category, department_name, course } =
    req.body;

  const updates = {};
  if (full_name !== undefined) updates.full_name = full_name;
  if (bio !== undefined) updates.bio = bio;
  if (instagram !== undefined) updates.instagram = instagram;
  if (youtube !== undefined) updates.youtube = youtube;
  if (linkedin !== undefined) updates.linkedin = linkedin;
  if (profile_photo !== undefined) updates.profile_photo = profile_photo;
  if (creator_category !== undefined) updates.creator_category = creator_category;
  if (department_name !== undefined) updates.department_name = department_name;
  if (course !== undefined) updates.course = course;

  try {
    if (getDbMode() === 'mongodb') {
      await Student.updateOne({ id: numId }, { $set: updates });
    } else {
      const mem = getMemoryDb();
      const s = (mem.students || []).find((x) => x.id === numId);
      if (s) Object.assign(s, updates);
      saveLocalDb();
    }
    res.json({ success: true, message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// Social Feed (Posts, Likes, Comments)
// -------------------------------------------------------------
app.get('/api/posts', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit || '15', 10)));
    const skip = (page - 1) * limit;
    const { feed, type, search, author_id } = req.query;

    if (getDbMode() === 'mongodb') {
      const filter = {};
      if (author_id) filter.author_id = parseInt(author_id, 10);
      if (type && type !== 'all') filter.post_type = type;
      if (search) {
        const rx = new RegExp(escapeRegex(search.trim()), 'i');
        const matchingAuthors = await Student.find({ full_name: rx }).select('id').limit(50).lean();
        const matchingIds = matchingAuthors.map((a) => a.id);
        filter.$or = [{ content: rx }, { hashtags: rx }, ...(matchingIds.length ? [{ author_id: { $in: matchingIds } }] : [])];
      }

      if (feed === 'trending') {
        const [total, postsAgg] = await Promise.all([
          Post.countDocuments(filter),
          Post.aggregate([
            { $match: filter },
            {
              $addFields: {
                engagementScore: {
                  $add: [{ $multiply: ['$likes_count', 2] }, { $multiply: ['$comments_count', 3] }]
                }
              }
            },
            { $sort: { engagementScore: -1, id: -1 } },
            { $skip: skip },
            { $limit: limit }
          ])
        ]);

        const authorIds = [...new Set(postsAgg.map((p) => p.author_id))];
        const authors = await Student.find({ id: { $in: authorIds } }).lean();
        const authorMap = new Map(authors.map((a) => [a.id, a]));
        const posts = postsAgg.map((p) => {
          const a = authorMap.get(p.author_id) || {};
          return {
            id: p.id,
            author_id: p.author_id,
            post_type: p.post_type,
            content: p.content,
            media_url: p.media_url,
            hashtags: p.hashtags,
            likes_count: p.likes_count,
            comments_count: p.comments_count,
            shares_count: p.shares_count,
            created_at: p.created_at,
            author_student_id: a.student_id,
            author_name: a.full_name,
            author_username: a.username,
            author_avatar: a.profile_photo,
            author_college: a.college_name,
            author_category: a.creator_category
          };
        });

        return res.json({ success: true, total, page, limit, totalPages: Math.ceil(total / limit), posts });
      }

      const [total, rows] = await Promise.all([
        Post.countDocuments(filter),
        Post.find(filter).sort({ created_at: -1, id: -1 }).skip(skip).limit(limit).lean()
      ]);
      const authorIds = [...new Set(rows.map((p) => p.author_id))];
      const authors = await Student.find({ id: { $in: authorIds } }).lean();
      const authorMap = new Map(authors.map((a) => [a.id, a]));

      const posts = rows.map((p) => {
        const a = authorMap.get(p.author_id) || {};
        return {
          id: p.id,
          author_id: p.author_id,
          post_type: p.post_type,
          content: p.content,
          media_url: p.media_url,
          hashtags: p.hashtags,
          likes_count: p.likes_count,
          comments_count: p.comments_count,
          shares_count: p.shares_count,
          created_at: p.created_at,
          author_student_id: a.student_id,
          author_name: a.full_name,
          author_username: a.username,
          author_avatar: a.profile_photo,
          author_college: a.college_name,
          author_category: a.creator_category
        };
      });

      return res.json({ success: true, total, page, limit, totalPages: Math.ceil(total / limit), posts });
    }

    const mem = getMemoryDb();
    const studentMap = new Map((mem.students || []).map((s) => [s.id, s]));
    let list = [...(mem.posts || [])];
    if (author_id) list = list.filter((p) => p.author_id === parseInt(author_id, 10));
    if (type && type !== 'all') list = list.filter((p) => p.post_type === type);
    if (search) {
      const rx = new RegExp(escapeRegex(search.trim()), 'i');
      list = list.filter((p) => {
        const a = studentMap.get(p.author_id);
        return rx.test(p.content) || rx.test(p.hashtags || '') || (a && rx.test(a.full_name));
      });
    }
    if (feed === 'trending') {
      list.sort((a, b) => b.likes_count * 2 + b.comments_count * 3 - (a.likes_count * 2 + a.comments_count * 3));
    } else {
      list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    const total = list.length;
    const posts = list.slice(skip, skip + limit).map((p) => {
      const a = studentMap.get(p.author_id) || {};
      return {
        ...p,
        author_student_id: a.student_id,
        author_name: a.full_name,
        author_username: a.username,
        author_avatar: a.profile_photo,
        author_college: a.college_name,
        author_category: a.creator_category
      };
    });
    return res.json({ success: true, total, page, limit, totalPages: Math.ceil(total / limit), posts });
  } catch (err) {
    console.error('Posts API Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/posts', async (req, res) => {
  const { author_id, content, post_type, media_url, hashtags } = req.body;
  if (!content) {
    return res.status(400).json({ success: false, message: 'Post content cannot be empty' });
  }

  const author = parseInt(author_id || '1', 10);

  try {
    const nextId = await getNextId('posts');
    const createdAt = new Date();
    const docData = {
      id: nextId,
      author_id: author,
      post_type: post_type || 'image',
      content,
      media_url: media_url || null,
      hashtags: hashtags || '#CampusBuzz #StudentCreator',
      likes_count: 0,
      comments_count: 0,
      shares_count: 0,
      created_at: createdAt
    };

    let authorRow = null;
    if (getDbMode() === 'mongodb') {
      await Post.create(docData);
      authorRow = await Student.findOne({ id: author }).lean();
    } else {
      const mem = getMemoryDb();
      mem.posts.unshift(docData);
      authorRow = (mem.students || []).find((s) => s.id === author);
      saveLocalDb();
    }

    const newPost = {
      ...docData,
      created_at: createdAt.toISOString(),
      author_student_id: authorRow?.student_id || 'CB-2026-00001',
      author_name: authorRow?.full_name || 'Campus Creator',
      author_username: authorRow?.username || 'creator',
      author_avatar: authorRow?.profile_photo || '',
      author_college: authorRow?.college_name || 'Shoolini University'
    };

    res.status(201).json({ success: true, post: newPost });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/posts/:id', async (req, res) => {
  const postId = parseInt(req.params.id, 10);
  try {
    if (getDbMode() === 'mongodb') {
      await Promise.all([
        Post.deleteOne({ id: postId }),
        PostLike.deleteMany({ post_id: postId }),
        PostComment.deleteMany({ post_id: postId })
      ]);
    } else {
      const mem = getMemoryDb();
      mem.posts = (mem.posts || []).filter((p) => p.id !== postId);
      saveLocalDb();
    }
    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/posts/:id/like', async (req, res) => {
  const postId = parseInt(req.params.id, 10);
  const studentId = parseInt(req.body.student_id || '1', 10);

  try {
    if (getDbMode() === 'mongodb') {
      const existing = await PostLike.findOne({ post_id: postId, student_id: studentId }).lean();
      let liked = false;
      if (existing) {
        await PostLike.deleteOne({ post_id: postId, student_id: studentId });
        const post = await Post.findOne({ id: postId });
        if (post && post.likes_count > 0) {
          post.likes_count -= 1;
          await post.save();
        }
        liked = false;
      } else {
        await PostLike.create({ post_id: postId, student_id: studentId });
        await Post.updateOne({ id: postId }, { $inc: { likes_count: 1 } });
        liked = true;
      }
      const postRow = await Post.findOne({ id: postId }).select('likes_count').lean();
      return res.json({ success: true, liked, likes_count: postRow ? postRow.likes_count : 0 });
    }

    const mem = getMemoryDb();
    if (!mem.post_likes) mem.post_likes = [];
    const idx = mem.post_likes.findIndex((l) => l.post_id === postId && l.student_id === studentId);
    const post = (mem.posts || []).find((p) => p.id === postId);
    let liked = false;
    if (idx !== -1) {
      mem.post_likes.splice(idx, 1);
      if (post && post.likes_count > 0) post.likes_count -= 1;
      liked = false;
    } else {
      mem.post_likes.push({ post_id: postId, student_id: studentId });
      if (post) post.likes_count = (post.likes_count || 0) + 1;
      liked = true;
    }
    saveLocalDb();
    return res.json({ success: true, liked, likes_count: post ? post.likes_count : 0 });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/posts/:id/comments', async (req, res) => {
  const postId = parseInt(req.params.id, 10);
  try {
    if (getDbMode() === 'mongodb') {
      const rows = await PostComment.find({ post_id: postId }).sort({ created_at: 1, id: 1 }).lean();
      const sIds = [...new Set(rows.map((r) => r.student_id))];
      const students = await Student.find({ id: { $in: sIds } }).lean();
      const sMap = new Map(students.map((s) => [s.id, s]));
      const comments = rows.map((c) => {
        const s = sMap.get(c.student_id) || {};
        return {
          id: c.id,
          comment_text: c.comment_text,
          created_at: c.created_at,
          student_id: c.student_id,
          author_name: s.full_name || 'Student',
          author_username: s.username || 'student',
          author_avatar: s.profile_photo || ''
        };
      });
      return res.json({ success: true, comments });
    }
    const mem = getMemoryDb();
    const sMap = new Map((mem.students || []).map((s) => [s.id, s]));
    const comments = (mem.post_comments || [])
      .filter((c) => c.post_id === postId)
      .map((c) => {
        const s = sMap.get(c.student_id) || {};
        return {
          ...c,
          author_name: s.full_name || 'Student',
          author_username: s.username || 'student',
          author_avatar: s.profile_photo || ''
        };
      });
    return res.json({ success: true, comments });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/posts/:id/comments', async (req, res) => {
  const postId = parseInt(req.params.id, 10);
  const { student_id = 1, comment_text } = req.body;
  const sId = parseInt(student_id, 10);

  if (!comment_text) {
    return res.status(400).json({ success: false, message: 'Comment text is required' });
  }

  try {
    const nextId = await getNextId('post_comments');
    const createdAt = new Date();
    let userRow = null;

    if (getDbMode() === 'mongodb') {
      await PostComment.create({ id: nextId, post_id: postId, student_id: sId, comment_text, created_at: createdAt });
      await Post.updateOne({ id: postId }, { $inc: { comments_count: 1 } });
      userRow = await Student.findOne({ id: sId }).lean();
    } else {
      const mem = getMemoryDb();
      if (!mem.post_comments) mem.post_comments = [];
      mem.post_comments.push({ id: nextId, post_id: postId, student_id: sId, comment_text, created_at: createdAt });
      const post = (mem.posts || []).find((p) => p.id === postId);
      if (post) post.comments_count = (post.comments_count || 0) + 1;
      userRow = (mem.students || []).find((s) => s.id === sId);
      saveLocalDb();
    }

    res.status(201).json({
      success: true,
      comment: {
        id: nextId,
        comment_text,
        created_at: createdAt.toISOString(),
        student_id: sId,
        author_name: userRow?.full_name || 'Student',
        author_username: userRow?.username || 'student',
        author_avatar: userRow?.profile_photo || ''
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// Campaigns (GET, POST, Apply, Cancel)
// -------------------------------------------------------------
app.get('/api/campaigns', async (req, res) => {
  try {
    const { status, category, search } = req.query;

    if (getDbMode() === 'mongodb') {
      const filter = {};
      if (status && status !== 'all') filter.status = status;
      if (category && category !== 'All') filter.required_category = category;
      if (search) {
        const rx = new RegExp(escapeRegex(search.trim()), 'i');
        filter.$or = [{ name: rx }, { brand_name: rx }, { description: rx }];
      }
      const rows = await Campaign.find(filter).sort({ id: 1 }).select('-_id -__v').lean();
      return res.json({ success: true, count: rows.length, data: rows });
    }

    const mem = getMemoryDb();
    let rows = [...(mem.campaigns || [])];
    if (status && status !== 'all') rows = rows.filter((c) => c.status === status);
    if (category && category !== 'All') rows = rows.filter((c) => c.required_category === category);
    if (search) {
      const rx = new RegExp(escapeRegex(search.trim()), 'i');
      rows = rows.filter((c) => rx.test(c.name) || rx.test(c.brand_name) || rx.test(c.description));
    }
    return res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/campaigns', async (req, res) => {
  const { name, brand, brand_name, description, budget, deadline, application_deadline, category, rewards, target_audience, image_url } =
    req.body;

  if (!name || !(brand || brand_name)) {
    return res.status(400).json({ success: false, message: 'Campaign title and brand name are required' });
  }

  try {
    const nextId = await getNextId('campaigns');
    const docData = {
      id: nextId,
      campaign_code: `CAMP-2026-${String(nextId).padStart(3, '0')}`,
      name: name.trim(),
      brand_name: (brand || brand_name).trim(),
      description: description || 'Sponsored collegiate creator collaboration.',
      image_url:
        image_url || 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
      budget: parseFloat(budget || '50000') || 50000,
      rewards: rewards || '₹15,000 Stipend + Brand Swag Kit',
      target_audience: target_audience || 'Student Creators & Ambassadors',
      required_category: category || 'Lifestyle',
      application_deadline: application_deadline || deadline || '2026-12-30',
      start_date: '2027-01-10',
      end_date: '2027-04-30',
      status: 'active',
      applicants_count: 0,
      created_at: new Date()
    };

    if (getDbMode() === 'mongodb') {
      await Campaign.create(docData);
    } else {
      const mem = getMemoryDb();
      mem.campaigns.unshift(docData);
      saveLocalDb();
    }

    res.status(201).json({ success: true, data: docData });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/campaigns/:id/apply', async (req, res) => {
  const campaignId = parseInt(req.params.id, 10);
  const { student_id = 1, portfolio_link, pitch_note } = req.body;
  const sId = parseInt(student_id, 10);

  try {
    if (getDbMode() === 'mongodb') {
      const existing = await CampaignApplication.findOne({ campaign_id: campaignId, student_id: sId }).lean();
      if (existing) {
        return res.status(400).json({ success: false, message: 'You have already applied for this campaign' });
      }
      await CampaignApplication.create({
        campaign_id: campaignId,
        student_id: sId,
        portfolio_link: portfolio_link || '',
        pitch_note: pitch_note || 'Interested in campus collaboration',
        status: 'pending'
      });
      await Campaign.updateOne({ id: campaignId }, { $inc: { applicants_count: 1 } });
      return res.json({ success: true, message: 'Campaign application submitted successfully!' });
    }

    const mem = getMemoryDb();
    if (!mem.campaign_applications) mem.campaign_applications = [];
    if (mem.campaign_applications.some((a) => a.campaign_id === campaignId && a.student_id === sId)) {
      return res.status(400).json({ success: false, message: 'You have already applied for this campaign' });
    }
    mem.campaign_applications.push({ campaign_id: campaignId, student_id: sId, portfolio_link, pitch_note, status: 'pending' });
    const camp = (mem.campaigns || []).find((c) => c.id === campaignId);
    if (camp) camp.applicants_count = (camp.applicants_count || 0) + 1;
    saveLocalDb();
    return res.json({ success: true, message: 'Campaign application submitted successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/campaigns/:id/cancel', async (req, res) => {
  const campaignId = parseInt(req.params.id, 10);
  const sId = parseInt(req.body.student_id || '1', 10);

  try {
    if (getDbMode() === 'mongodb') {
      const deleted = await CampaignApplication.deleteOne({ campaign_id: campaignId, student_id: sId });
      if (deleted.deletedCount > 0) {
        const camp = await Campaign.findOne({ id: campaignId });
        if (camp && camp.applicants_count > 0) {
          camp.applicants_count -= 1;
          await camp.save();
        }
      }
      return res.json({ success: true, message: 'Application cancelled successfully.' });
    }
    const mem = getMemoryDb();
    mem.campaign_applications = (mem.campaign_applications || []).filter(
      (a) => !(a.campaign_id === campaignId && a.student_id === sId)
    );
    saveLocalDb();
    return res.json({ success: true, message: 'Application cancelled successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// Campus Events (GET, POST, Register, Unregister)
// -------------------------------------------------------------
app.get('/api/events', async (req, res) => {
  try {
    const { category, search, student_id = 1, status = 'upcoming' } = req.query;
    const sId = parseInt(student_id, 10);

    if (getDbMode() === 'mongodb') {
      const filter = {};
      if (status === 'upcoming') {
        filter.$or = [{ status: 'upcoming' }, { event_date: { $gte: '2026-12-11' } }];
      } else if (status === 'completed') {
        filter.$or = [{ status: 'completed' }, { event_date: { $lt: '2026-12-11' } }];
      }
      if (category && category !== 'All') filter.category = category;
      if (search) {
        const rx = new RegExp(escapeRegex(search.trim()), 'i');
        filter.$and = [
          ...(filter.$and || []),
          { $or: [{ name: rx }, { venue: rx }, { description: rx }] }
        ];
      }

      const [rows, regs] = await Promise.all([
        Event.find(filter)
          .sort({ event_date: status === 'completed' ? -1 : 1 })
          .select('-_id -__v')
          .lean(),
        EventRegistration.find({ student_id: sId }).select('event_id').lean()
      ]);

      const regSet = new Set(regs.map((r) => r.event_id));
      const data = rows.map((e) => ({ ...e, user_registered: regSet.has(e.id) ? 1 : 0 }));
      return res.json({ success: true, count: data.length, data });
    }

    const mem = getMemoryDb();
    let rows = [...(mem.events || [])];
    if (status === 'upcoming') rows = rows.filter((e) => e.status === 'upcoming' || e.event_date >= '2026-12-11');
    else if (status === 'completed') rows = rows.filter((e) => e.status === 'completed' || e.event_date < '2026-12-11');
    if (category && category !== 'All') rows = rows.filter((e) => e.category === category);
    if (search) {
      const rx = new RegExp(escapeRegex(search.trim()), 'i');
      rows = rows.filter((e) => rx.test(e.name) || rx.test(e.venue) || rx.test(e.description));
    }
    const regSet = new Set((mem.event_registrations || []).filter((r) => r.student_id === sId).map((r) => r.event_id));
    const data = rows.map((e) => ({ ...e, user_registered: regSet.has(e.id) ? 1 : 0 }));
    return res.json({ success: true, count: data.length, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/events', async (req, res) => {
  const { title, name, date, event_date, location, venue, description, category, max_capacity, max_attendees, banner_url, banner_image } =
    req.body;
  const eventName = (title || name || '').trim();
  if (!eventName) {
    return res.status(400).json({ success: false, message: 'Event title is required' });
  }

  try {
    const nextId = await getNextId('events');
    // Normalize date to YYYY-MM-DD if possible
    let normalizedDate = event_date || '2026-12-20';
    if (!event_date && date) {
      const parsed = new Date(date.split('•')[0].trim());
      if (!Number.isNaN(parsed.getTime())) {
        normalizedDate = parsed.toISOString().slice(0, 10);
      }
    }

    const docData = {
      id: nextId,
      event_code: `EVT-2026-${String(nextId).padStart(3, '0')}`,
      name: eventName,
      description: description || 'Campus creator festival and networking meetup.',
      banner_image:
        banner_image ||
        banner_url ||
        'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
      event_date: normalizedDate,
      start_time: '05:00 PM',
      end_time: '09:00 PM',
      venue: location || venue || 'Main Campus Auditorium',
      organizer: 'CampusBuzz Organizer Board',
      category: category || 'Technology',
      registration_deadline: normalizedDate,
      max_attendees: parseInt(max_attendees || max_capacity || '250', 10) || 250,
      registered_attendees: 1,
      status: 'upcoming',
      created_at: new Date()
    };

    if (getDbMode() === 'mongodb') {
      await Event.create(docData);
    } else {
      const mem = getMemoryDb();
      mem.events.unshift(docData);
      saveLocalDb();
    }

    res.status(201).json({ success: true, data: docData });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/events/:id/register', async (req, res) => {
  const eventId = parseInt(req.params.id, 10);
  const studentId = parseInt(req.body.student_id || '1', 10);

  try {
    if (getDbMode() === 'mongodb') {
      const existing = await EventRegistration.findOne({ event_id: eventId, student_id: studentId }).lean();
      if (existing) {
        return res.status(400).json({ success: false, message: 'Already registered for this event' });
      }
      await EventRegistration.create({ event_id: eventId, student_id: studentId });
      const eventRow = await Event.findOneAndUpdate(
        { id: eventId },
        { $inc: { registered_attendees: 1 } },
        { new: true }
      ).lean();
      return res.json({
        success: true,
        message: `Registration confirmed for ${eventRow ? eventRow.name : 'event'}!`,
        event: eventRow
      });
    }

    const mem = getMemoryDb();
    if (!mem.event_registrations) mem.event_registrations = [];
    if (mem.event_registrations.some((r) => r.event_id === eventId && r.student_id === studentId)) {
      return res.status(400).json({ success: false, message: 'Already registered for this event' });
    }
    mem.event_registrations.push({ event_id: eventId, student_id: studentId });
    const ev = (mem.events || []).find((e) => e.id === eventId);
    if (ev) ev.registered_attendees = (ev.registered_attendees || 0) + 1;
    saveLocalDb();
    return res.json({ success: true, message: `Registration confirmed for ${ev ? ev.name : 'event'}!`, event: ev });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/events/:id/unregister', async (req, res) => {
  const eventId = parseInt(req.params.id, 10);
  const studentId = parseInt(req.body.student_id || '1', 10);

  try {
    if (getDbMode() === 'mongodb') {
      const deleted = await EventRegistration.deleteOne({ event_id: eventId, student_id: studentId });
      let eventRow = await Event.findOne({ id: eventId });
      if (deleted.deletedCount > 0 && eventRow && eventRow.registered_attendees > 0) {
        eventRow.registered_attendees -= 1;
        await eventRow.save();
      }
      return res.json({
        success: true,
        message: `Registration cancelled for ${eventRow ? eventRow.name : 'event'}.`,
        event: eventRow
      });
    }

    const mem = getMemoryDb();
    mem.event_registrations = (mem.event_registrations || []).filter(
      (r) => !(r.event_id === eventId && r.student_id === studentId)
    );
    const ev = (mem.events || []).find((e) => e.id === eventId);
    if (ev && ev.registered_attendees > 0) ev.registered_attendees -= 1;
    saveLocalDb();
    return res.json({ success: true, message: `Registration cancelled for ${ev ? ev.name : 'event'}.`, event: ev });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// Collaborations & Chat Messaging (MongoDB Persistent)
// -------------------------------------------------------------
app.get('/api/collaborations', async (req, res) => {
  try {
    if (getDbMode() === 'mongodb') {
      const data = await Collaboration.find().sort({ id: 1 }).select('-_id -__v').lean();
      return res.json({ success: true, data });
    }
    const memDb = getMemoryDb();
    res.json({ success: true, data: memDb.collaborations || [] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/collaborations/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { project_status } = req.body;
  if (!project_status) {
    return res.status(400).json({ success: false, message: 'project_status is required' });
  }
  try {
    if (getDbMode() === 'mongodb') {
      const updated = await Collaboration.findOneAndUpdate(
        { id },
        { $set: { project_status, updated_at: new Date() } },
        { new: true }
      )
        .select('-_id -__v')
        .lean();
      if (!updated) return res.status(404).json({ success: false, message: 'Collaboration not found' });
      return res.json({ success: true, data: updated });
    }
    const mem = getMemoryDb();
    const collab = (mem.collaborations || []).find((c) => c.id === id);
    if (!collab) return res.status(404).json({ success: false, message: 'Collaboration not found' });
    collab.project_status = project_status;
    collab.updated_at = new Date().toISOString();
    saveLocalDb();
    return res.json({ success: true, data: collab });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/collaborations/:id/messages', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    if (getDbMode() === 'mongodb') {
      const messages = await Message.find({ collaboration_id: id }).sort({ created_at: 1, id: 1 }).select('-_id -__v').lean();
      return res.json({ success: true, data: messages });
    }
    const memDb = getMemoryDb();
    const messages = (memDb.messages || []).filter((m) => m.collaboration_id === id);
    res.json({ success: true, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/collaborations/:id/messages', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { sender_name, sender_role, text } = req.body;
  if (!text) return res.status(400).json({ success: false, message: 'Message text is required' });

  try {
    const nextId = await getNextId('messages');
    const newMsg = {
      id: nextId,
      collaboration_id: id,
      sender_name: sender_name || 'Student Creator',
      sender_role: sender_role || 'creator',
      text,
      created_at: new Date()
    };

    if (getDbMode() === 'mongodb') {
      await Message.create(newMsg);
    } else {
      const memDb = getMemoryDb();
      if (!memDb.messages) memDb.messages = [];
      memDb.messages.push(newMsg);
      saveLocalDb();
    }
    res.status(201).json({ success: true, data: newMsg });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// Analytics & Admin Governance Endpoints
// -------------------------------------------------------------
app.get('/api/analytics', async (req, res) => {
  try {
    let totalCreators = 1000;
    let activeCampaigns = 15;
    let totalPosts = 9755;
    let recentActivities = initialData.activities || [];

    if (getDbMode() === 'mongodb') {
      const [cCount, campCount, pCount, acts] = await Promise.all([
        Student.countDocuments({ followers_count: { $gte: 5000 } }),
        Campaign.countDocuments({ status: 'active' }),
        Post.countDocuments(),
        ActivityLog.find().sort({ id: -1 }).limit(8).select('-_id -__v').lean()
      ]);
      totalCreators = cCount;
      activeCampaigns = campCount;
      totalPosts = pCount;
      if (acts.length > 0) recentActivities = acts;
    } else {
      const mem = getMemoryDb();
      totalCreators = (mem.students || []).filter((s) => s.followers_count >= 5000).length || 1000;
      activeCampaigns = (mem.campaigns || []).filter((c) => c.status === 'active').length || 15;
      totalPosts = (mem.posts || []).length || 9755;
    }

    res.json({
      success: true,
      overview: {
        totalCreators,
        totalReach: '1.24M',
        engagementRate: '4.35%',
        activeCampaigns,
        socialEngagements: `${totalPosts.toLocaleString()}+`,
        colleges: 100
      },
      chartData: initialData.engagementChartData,
      recentActivities
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/admin/overview', async (req, res) => {
  try {
    if (getDbMode() === 'mongodb') {
      const [totalStudents, verifiedCreators, pendingCreators, totalCampaigns, totalEvents] = await Promise.all([
        Student.countDocuments(),
        Student.countDocuments({ verification_status: 'verified' }),
        Student.countDocuments({ verification_status: 'pending' }),
        Campaign.countDocuments(),
        Event.countDocuments()
      ]);
      return res.json({
        success: true,
        stats: {
          mode: 'mongodb',
          active: true,
          totalStudents,
          verifiedCreators,
          pendingCreators,
          totalCampaigns,
          totalEvents
        }
      });
    }
    const mem = getMemoryDb();
    return res.json({
      success: true,
      stats: {
        mode: getDbMode(),
        active: true,
        totalStudents: (mem.students || []).length,
        verifiedCreators: (mem.students || []).filter((s) => s.verification_status !== 'pending').length,
        pendingCreators: (mem.students || []).filter((s) => s.verification_status === 'pending').length,
        totalCampaigns: (mem.campaigns || []).length,
        totalEvents: (mem.events || []).length
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/admin/verify-creator/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { status } = req.body;
  if (!['verified', 'pending', 'rejected'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid verification status' });
  }
  try {
    if (getDbMode() === 'mongodb') {
      await Student.updateOne({ id }, { $set: { verification_status: status } });
    } else {
      const mem = getMemoryDb();
      const s = (mem.students || []).find((x) => x.id === id);
      if (s) s.verification_status = status;
      saveLocalDb();
    }
    res.json({ success: true, message: `Creator verification status updated to ${status}` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Central error handler (never expose sensitive stack details in production)
app.use((err, req, res, next) => {
  console.error('Unhandled API Error:', err.message);
  res.status(500).json({
    success: false,
    message: IS_PROD ? 'Internal server error' : err.message
  });
});

if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`⚡ CampusBuzz Enterprise API Server running on port ${PORT}`);
    console.log(`🌐 Health Check: http://localhost:${PORT}/api/health`);
  });
}

module.exports = app;
