const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const zlib = require('zlib');
const initialData = require('./seedData');
const { Counter } = require('../models');
const { seedDatabaseIfNeeded } = require('../scripts/seedMongo');

let dbMode = 'disconnected'; // 'mongodb' | 'memory' | 'disconnected'
let dbInitPromise = null;

// Persistent local snapshot only used for non-production fallback when MONGODB_URI is unset
const LOCAL_STORAGE_PATH = path.join(__dirname, '../data/local_db.json');
let memoryDb = { ...initialData };

function ensureDir(filePath) {
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
}

function loadLocalDb() {
  ensureDir(LOCAL_STORAGE_PATH);
  try {
    const seedGzPath = path.join(__dirname, '../data/mongo_seed.json.gz');
    if (fs.existsSync(seedGzPath)) {
      const rawBuf = zlib.gunzipSync(fs.readFileSync(seedGzPath));
      const snap = JSON.parse(rawBuf.toString('utf8'));
      memoryDb = {
        ...initialData,
        ...snap
      };
      return;
    }
  } catch (err) {
    console.warn('⚠️ Could not read compressed seed snapshot:', err.message);
  }

  if (fs.existsSync(LOCAL_STORAGE_PATH)) {
    try {
      const content = fs.readFileSync(LOCAL_STORAGE_PATH, 'utf8');
      memoryDb = JSON.parse(content);
    } catch {
      memoryDb = JSON.parse(JSON.stringify(initialData));
    }
  }
}

function saveLocalDb() {
  try {
    ensureDir(LOCAL_STORAGE_PATH);
    fs.writeFileSync(LOCAL_STORAGE_PATH, JSON.stringify(memoryDb, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving local db snapshot:', err.message);
  }
}

async function getNextId(seqName) {
  if (dbMode === 'mongodb') {
    const doc = await Counter.findByIdAndUpdate(
      seqName,
      { $inc: { seq: 1 } },
      { upsert: true, new: true }
    );
    return doc.seq;
  }
  const list = memoryDb[seqName] || [];
  const max = list.reduce((acc, item) => Math.max(acc, Number(item.id) || 0), 0);
  return max + 1;
}

async function initDB() {
  if (dbInitPromise) return dbInitPromise;

  dbInitPromise = (async () => {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    const isProd = process.env.NODE_ENV === 'production';

    if (!mongoUri) {
      if (isProd) {
        dbMode = 'disconnected';
        console.error('❌ MONGODB_URI is required in production environment.');
        return;
      }
      loadLocalDb();
      dbMode = 'memory';
      console.warn('⚠️ MONGODB_URI not configured. Running in local fallback snapshot mode (dev only).');
      return;
    }

    try {
      console.log('🔌 Connecting to MongoDB Atlas...');
      // Tuned for long-running Express server on Render against Atlas M0/Flex limits
      await mongoose.connect(mongoUri, {
        dbName: process.env.MONGODB_DB_NAME || 'campusbuzz_db',
        maxPoolSize: 20, // Safe headroom for concurrent requests within M0 connection caps
        minPoolSize: 2, // Keep minimal warm connections without starving free-tier limits
        maxIdleTimeMS: 300000, // Recycle idle sockets after 5 minutes
        connectTimeoutMS: 10000,
        socketTimeoutMS: 30000,
        serverSelectionTimeoutMS: 5000
      });

      dbMode = 'mongodb';
      console.log('✅ Connected to MongoDB Atlas successfully!');

      mongoose.connection.on('disconnected', () => {
        console.warn('⚠️ MongoDB Atlas connection lost.');
        dbMode = 'disconnected';
      });
      mongoose.connection.on('reconnected', () => {
        console.log('🔄 MongoDB Atlas reconnected.');
        dbMode = 'mongodb';
      });

      // Run seed asynchronously in background so Render health check succeeds rapidly on boot
      seedDatabaseIfNeeded().catch((seedErr) => {
        console.error('⚠️ Background MongoDB seed warning:', seedErr.message);
      });
    } catch (err) {
      console.error('❌ MongoDB Atlas connection error:', err.message);
      if (isProd) {
        dbMode = 'disconnected';
      } else {
        loadLocalDb();
        dbMode = 'memory';
        console.warn('⚠️ Falling back to local snapshot mode in development.');
      }
    }
  })();

  return dbInitPromise;
}

module.exports = {
  initDB,
  getDbMode: () => dbMode,
  isMongoConnected: () => dbMode === 'mongodb' && mongoose.connection.readyState === 1,
  getMemoryDb: () => memoryDb,
  saveLocalDb,
  getNextId
};
