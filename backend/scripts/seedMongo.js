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

async function batchInsert(Model, items, chunkSize = 1000) {
  if (!items || items.length === 0) return 0;
  let inserted = 0;
  for (let i = 0; i < items.length; i += chunkSize) {
    const slice = items.slice(i, i + chunkSize);
    await Model.insertMany(slice, { ordered: false }).catch((err) => {
      // Ignore duplicate key errors during idempotent seeding
      if (err.code !== 11000 && !err.writeErrors) throw err;
    });
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
  const existingStudents = await Student.countDocuments();
  if (existingStudents > 0 && !force) {
    // Ensure counters exist even if collections were populated out of band
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
    return { seeded: false, existingStudents };
  }

  const seedGzPath = path.join(__dirname, '../data/mongo_seed.json.gz');
  if (!fs.existsSync(seedGzPath)) {
    throw new Error(`Seed file not found at ${seedGzPath}`);
  }

  console.log('🌱 Seeding MongoDB Atlas from compressed CampusBuzz snapshot...');
  const rawBuf = zlib.gunzipSync(fs.readFileSync(seedGzPath));
  const payload = JSON.parse(rawBuf.toString('utf8'));

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

  await batchInsert(Student, payload.students, 1000);
  await batchInsert(Post, payload.posts, 1000);
  await batchInsert(Event, payload.events, 200);
  await batchInsert(Campaign, payload.campaigns, 200);
  await batchInsert(Club, payload.clubs, 200);
  await batchInsert(PostComment, payload.post_comments, 500);
  await batchInsert(PostLike, payload.post_likes, 500);
  await batchInsert(EventRegistration, payload.event_registrations, 500);
  await batchInsert(CampaignApplication, payload.campaign_applications, 500);
  await batchInsert(ClubMember, payload.club_members, 500);
  await batchInsert(Collaboration, payload.collaborations, 200);
  await batchInsert(Message, payload.messages, 200);
  await batchInsert(ActivityLog, payload.activities, 200);

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

  const finalStudents = await Student.countDocuments();
  const finalPosts = await Post.countDocuments();
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
      maxPoolSize: 20,
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
