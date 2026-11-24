const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});
const Counter = mongoose.models.Counter || mongoose.model('Counter', counterSchema);

const studentSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true, index: true },
  student_id: { type: String, required: true, unique: true, index: true },
  full_name: { type: String, required: true, index: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  username: { type: String, required: true, unique: true, trim: true },
  password_hash: { type: String, required: true },
  profile_photo: { type: String, default: '' },
  college_name: { type: String, default: 'Delhi University', index: true },
  department_name: { type: String, default: 'Computer Science & Engineering' },
  course: { type: String, default: 'B.Tech' },
  semester: { type: Number, default: 1 },
  year: { type: Number, default: 1 },
  bio: { type: String, default: '' },
  instagram: { type: String, default: '' },
  youtube: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  creator_category: { type: String, default: 'Lifestyle', index: true },
  followers_count: { type: Number, default: 0, index: true },
  engagement_rate: { type: Number, default: 0 },
  account_status: { type: String, enum: ['active', 'pending', 'suspended'], default: 'active', index: true },
  verification_status: { type: String, enum: ['verified', 'pending', 'rejected'], default: 'verified' },
  is_creator: { type: Boolean, default: true },
  role: { type: String, enum: ['student', 'creator', 'admin'], default: 'student' },
  created_at: { type: Date, default: Date.now, index: true }
});
studentSchema.index({ followers_count: -1 });

const postSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true, index: true },
  author_id: { type: Number, required: true, index: true },
  post_type: { type: String, default: 'image', index: true },
  content: { type: String, required: true },
  media_url: { type: String, default: null },
  hashtags: { type: String, default: '#CampusBuzz #StudentCreator' },
  likes_count: { type: Number, default: 0, index: true },
  comments_count: { type: Number, default: 0 },
  shares_count: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now, index: true }
});

const postLikeSchema = new mongoose.Schema({
  id: { type: Number },
  post_id: { type: Number, required: true, index: true },
  student_id: { type: Number, required: true, index: true },
  created_at: { type: Date, default: Date.now }
});
postLikeSchema.index({ post_id: 1, student_id: 1 }, { unique: true });

const postCommentSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true, index: true },
  post_id: { type: Number, required: true, index: true },
  student_id: { type: Number, required: true, index: true },
  comment_text: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

const eventSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true, index: true },
  event_code: { type: String, unique: true, sparse: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  banner_image: { type: String, default: '' },
  event_date: { type: String, required: true, index: true },
  start_time: { type: String, default: '10:00 AM' },
  end_time: { type: String, default: '05:00 PM' },
  venue: { type: String, required: true },
  organizer: { type: String, default: 'CampusBuzz Organizer' },
  category: { type: String, default: 'Technology', index: true },
  registration_deadline: { type: String, default: '2026-12-10' },
  max_attendees: { type: Number, default: 500 },
  registered_attendees: { type: Number, default: 0 },
  status: { type: String, enum: ['upcoming', 'live', 'completed'], default: 'upcoming', index: true },
  created_at: { type: Date, default: Date.now }
});

const eventRegistrationSchema = new mongoose.Schema({
  id: { type: Number },
  event_id: { type: Number, required: true, index: true },
  student_id: { type: Number, required: true, index: true },
  registered_at: { type: Date, default: Date.now }
});
eventRegistrationSchema.index({ event_id: 1, student_id: 1 }, { unique: true });

const campaignSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true, index: true },
  campaign_code: { type: String, unique: true, sparse: true },
  name: { type: String, required: true },
  brand_name: { type: String, required: true },
  description: { type: String, required: true },
  image_url: { type: String, default: '' },
  budget: { type: Number, default: 0 },
  rewards: { type: String, default: '₹15,000 Stipend + Swag Kit' },
  target_audience: { type: String, default: 'All Campus Creators' },
  required_category: { type: String, default: 'Lifestyle', index: true },
  application_deadline: { type: String, default: '2026-12-30' },
  start_date: { type: String, default: '2027-01-05' },
  end_date: { type: String, default: '2027-03-30' },
  status: { type: String, enum: ['active', 'upcoming', 'completed', 'paused'], default: 'active', index: true },
  applicants_count: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now }
});

const campaignApplicationSchema = new mongoose.Schema({
  id: { type: Number },
  campaign_id: { type: Number, required: true, index: true },
  student_id: { type: Number, required: true, index: true },
  portfolio_link: { type: String, default: '' },
  pitch_note: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  applied_at: { type: Date, default: Date.now }
});
campaignApplicationSchema.index({ campaign_id: 1, student_id: 1 }, { unique: true });

const clubSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true, index: true },
  name: { type: String, required: true },
  category: { type: String, default: 'Technology' },
  description: { type: String, default: '' },
  banner_url: { type: String, default: '' },
  logo_url: { type: String, default: '' },
  leads_name: { type: String, default: 'Student Lead' },
  members_count: { type: Number, default: 0 },
  meeting_schedule: { type: String, default: 'Fridays 5:00 PM' },
  created_at: { type: Date, default: Date.now }
});

const clubMemberSchema = new mongoose.Schema({
  id: { type: Number },
  club_id: { type: Number, required: true, index: true },
  student_id: { type: Number, required: true, index: true },
  joined_at: { type: Date, default: Date.now }
});
clubMemberSchema.index({ club_id: 1, student_id: 1 }, { unique: true });

const collaborationSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true, index: true },
  campaign_id: { type: Number },
  creator_id: { type: Number },
  campaign_name: { type: String, required: true },
  creator_name: { type: String, required: true },
  project_status: { type: String, default: 'Requested' },
  compensation: { type: Number, default: 0 },
  deliverables_summary: { type: String, default: '' },
  updated_at: { type: Date, default: Date.now },
  created_at: { type: Date, default: Date.now }
});

const messageSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true, index: true },
  collaboration_id: { type: Number, required: true, index: true },
  sender_name: { type: String, required: true },
  sender_role: { type: String, default: 'creator' },
  text: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

const activityLogSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true, index: true },
  user_name: { type: String, required: true },
  action: { type: String, required: true },
  target: { type: String, required: true },
  type: { type: String, default: 'general' },
  time: { type: String, default: 'Just now' },
  created_at: { type: Date, default: Date.now }
});

module.exports = {
  Counter,
  Student: mongoose.models.Student || mongoose.model('Student', studentSchema),
  Post: mongoose.models.Post || mongoose.model('Post', postSchema),
  PostLike: mongoose.models.PostLike || mongoose.model('PostLike', postLikeSchema),
  PostComment: mongoose.models.PostComment || mongoose.model('PostComment', postCommentSchema),
  Event: mongoose.models.Event || mongoose.model('Event', eventSchema),
  EventRegistration: mongoose.models.EventRegistration || mongoose.model('EventRegistration', eventRegistrationSchema),
  Campaign: mongoose.models.Campaign || mongoose.model('Campaign', campaignSchema),
  CampaignApplication: mongoose.models.CampaignApplication || mongoose.model('CampaignApplication', campaignApplicationSchema),
  Club: mongoose.models.Club || mongoose.model('Club', clubSchema),
  ClubMember: mongoose.models.ClubMember || mongoose.model('ClubMember', clubMemberSchema),
  Collaboration: mongoose.models.Collaboration || mongoose.model('Collaboration', collaborationSchema),
  Message: mongoose.models.Message || mongoose.model('Message', messageSchema),
  ActivityLog: mongoose.models.ActivityLog || mongoose.model('ActivityLog', activityLogSchema)
};
