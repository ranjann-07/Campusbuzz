const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const {
  Counter,
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
} = require('../models');

dotenv.config({ path: path.join(__dirname, '../.env') });

function normalizeDates(doc) {
  const copy = { ...doc };
  if (copy.created_at) copy.created_at = new Date(copy.created_at);
  if (copy.updated_at) copy.updated_at = new Date(copy.updated_at);
  if (copy.applied_at) copy.applied_at = new Date(copy.applied_at);
  if (copy.registered_at) copy.registered_at = new Date(copy.registered_at);
  if (copy.joined_at) copy.joined_at = new Date(copy.joined_at);
  return copy;
}

async function batchInsertRaw(Model, items, chunkSize = 250) {
  if (!items || items.length === 0) return 0;
  let inserted = 0;
  for (let i = 0; i < items.length; i += chunkSize) {
    const slice = items.slice(i, i + chunkSize).map(normalizeDates);
    try {
      await Model.collection.insertMany(slice, { ordered: false });
    } catch (err) {
      // Ignore duplicate key (11000) / BulkWriteError for idempotent retries
      if (err.code !== 11000 && err.name !== 'MongoBulkWriteError') {
        throw err;
      }
    }
    inserted += slice.length;
  }
  return inserted;
}

async function syncCounter(seqName, Model) {
  const top = await Model.findOne().sort({ id: -1 }).select('id').lean();
  const maxId = top && typeof top.id === 'number' ? top.id : 0;
  await Counter.findByIdAndUpdate(
    seqName,
    { $max: { seq: maxId } },
    { upsert: true, new: true }
  );
  return maxId;
}

async function seedDatabaseIfNeeded({ force = false } = {}) {
  const [existingStudents, existingPosts, existingEvents, existingCampaigns, existingClubs] =
    await Promise.all([
      Student.countDocuments(),
      Post.countDocuments(),
      Event.countDocuments(),
      Campaign.countDocuments(),
      Club.countDocuments()
    ]);

  const needsSeed =
    force ||
    existingStudents < 10000 ||
    existingPosts < 9000 ||
    existingEvents === 0 ||
    existingCampaigns === 0 ||
    existingClubs === 0;

  if (!needsSeed) {
    await Promise.all([
      syncCounter('students', Student),
      syncCounter('posts', Post),
      syncCounter('post_comments', PostComment),
      syncCounter('events', Event),
      syncCounter('campaigns', Campaign),
      syncCounter('clubs', Club),
      syncCounter('collaborations', Collaboration),
      syncCounter('messages', Message),
      syncCounter('activities', ActivityLog)
    ]);
    return { seeded: false, existingStudents, existingPosts };
  }

  const seedGzPath = path.join(__dirname, '../data/mongo_seed.json.gz');
  if (!fs.existsSync(seedGzPath)) {
    throw new Error(`Seed file not found at ${seedGzPath}`);
  }

  console.log('🌱 Low-memory streaming seed to MongoDB Atlas...');
  let rawStr = zlib.gunzipSync(fs.readFileSync(seedGzPath)).toString('utf8');
  let payload = JSON.parse(rawStr);
  rawStr = null; // Free raw string immediately

  if (force) {
    await Promise.all([
      Student.deleteMany({}),
      Post.deleteMany({}),
      PostLike.deleteMany({}),
      PostComment.deleteMany({}),
      Event.deleteMany({}),
      EventRegistration.deleteMany({}),
      Campaign.deleteMany({}),
      CampaignApplication.deleteMany({}),
      Club.deleteMany({}),
      ClubMember.deleteMany({}),
      Collaboration.deleteMany({}),
      Message.deleteMany({}),
      ActivityLog.deleteMany({})
    ]);
  }

  if (force || existingStudents < 10000) {
    await batchInsertRaw(Student, payload.students, 250);
  }
  payload.students = null;

  if (force || existingPosts < 9000) {
    await batchInsertRaw(Post, payload.posts, 250);
  }
  payload.posts = null;

  if (force || existingEvents === 0) await batchInsertRaw(Event, payload.events, 100);
  payload.events = null;

  if (force || existingCampaigns === 0) await batchInsertRaw(Campaign, payload.campaigns, 100);
  payload.campaigns = null;

  if (force || existingClubs === 0) await batchInsertRaw(Club, payload.clubs, 100);
  payload.clubs = null;

  await batchInsertRaw(PostComment, payload.post_comments, 200);
  payload.post_comments = null;
  await batchInsertRaw(PostLike, payload.post_likes, 200);
  payload.post_likes = null;
  await batchInsertRaw(EventRegistration, payload.event_registrations, 200);
  payload.event_registrations = null;
  await batchInsertRaw(CampaignApplication, payload.campaign_applications, 200);
  payload.campaign_applications = null;
  await batchInsertRaw(ClubMember, payload.club_members, 200);
  payload.club_members = null;
  await batchInsertRaw(Collaboration, payload.collaborations, 100);
  payload.collaborations = null;
  await batchInsertRaw(Message, payload.messages, 100);
  payload.messages = null;
  await batchInsertRaw(ActivityLog, payload.activities, 100);
  payload = null;

  await Promise.all([
    syncCounter('students', Student),
    syncCounter('posts', Post),
    syncCounter('post_comments', PostComment),
    syncCounter('events', Event),
    syncCounter('campaigns', Campaign),
    syncCounter('clubs', Club),
    syncCounter('collaborations', Collaboration),
    syncCounter('messages', Message),
    syncCounter('activities', ActivityLog)
  ]);

  const [finalStudents, finalPosts] = await Promise.all([
    Student.countDocuments(),
    Post.countDocuments()
  ]);
  console.log(`✅ MongoDB Seed Complete: ${finalStudents} students, ${finalPosts} posts.`);
  return { seeded: true, students: finalStudents, posts: finalPosts };
}

if (require.main === module) {
  const force = process.argv.includes('--force');
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI is not set in environment.');
    process.exit(1);
  }
  mongoose
    .connect(uri, {
      dbName: process.env.MONGODB_DB_NAME || 'campusbuzz_db',
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000
    })
    .then(async () => {
      console.log('✅ Connected to MongoDB for seeding.');
      await seedDatabaseIfNeeded({ force });
      await mongoose.disconnect();
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ MongoDB seed error:', err.message);
      process.exit(1);
    });
}

module.exports = { seedDatabaseIfNeeded, syncCounter };
