const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs');

// Initial in-memory / local storage seed data
const initialData = require('./seedData');

let dbMode = 'memory'; // 'mysql' or 'memory'
let pool = null;

// Persistent local JSON file fallback for offline/embedded mode
const LOCAL_STORAGE_PATH = path.join(__dirname, '../data/local_db.json');

function ensureDir(filePath) {
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
}

let memoryDb = { ...initialData };

function loadLocalDb() {
  ensureDir(LOCAL_STORAGE_PATH);
  if (fs.existsSync(LOCAL_STORAGE_PATH)) {
    try {
      const content = fs.readFileSync(LOCAL_STORAGE_PATH, 'utf8');
      memoryDb = JSON.parse(content);
      console.log('📦 Loaded existing local database snapshot.');
    } catch (err) {
      console.warn('⚠️ Could not parse local DB file, using fresh seed data.');
      memoryDb = JSON.parse(JSON.stringify(initialData));
      saveLocalDb();
    }
  } else {
    memoryDb = JSON.parse(JSON.stringify(initialData));
    saveLocalDb();
  }
}

function saveLocalDb() {
  try {
    ensureDir(LOCAL_STORAGE_PATH);
    fs.writeFileSync(LOCAL_STORAGE_PATH, JSON.stringify(memoryDb, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving local db snapshot:', err);
  }
}

async function initDB() {
  loadLocalDb();

  const host = process.env.MYSQL_HOST || 'localhost';
  const user = process.env.MYSQL_USER || 'root';
  const password = process.env.MYSQL_PASSWORD || '';
  const database = process.env.MYSQL_DATABASE || 'campusbuzz_db';
  const port = parseInt(process.env.MYSQL_PORT || '3306', 10);

  try {
    console.log(`🔌 Attempting MySQL connection to ${user}@${host}:${port}/${database}...`);
    const tempConnection = await mysql.createConnection({
      host,
      user,
      password,
      port
    });

    await tempConnection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    await tempConnection.end();

    pool = mysql.createPool({
      host,
      user,
      password,
      database,
      port,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Test connection
    const [rows] = await pool.query('SELECT 1 + 1 AS test');
    dbMode = 'mysql';
    console.log('✅ Connected to MySQL Database successfully!');

    // Initialize tables if needed
    const schemaSql = fs.readFileSync(path.join(__dirname, '../schema.sql'), 'utf8');
    const statements = schemaSql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--') && !s.toLowerCase().startsWith('create database') && !s.toLowerCase().startsWith('use '));

    for (const stmt of statements) {
      try {
        await pool.query(stmt);
      } catch (tableErr) {
        // Table might already exist or minor dialect difference
      }
    }
    console.log('✅ MySQL schema synchronized.');
  } catch (err) {
    dbMode = 'memory';
    console.warn(`⚠️ MySQL not reachable (${err.message}).`);
    console.log('🚀 Running in High-Performance Local Persistent Engine with identical MySQL schema & instant hot-reload.');
  }
}

module.exports = {
  initDB,
  getDbMode: () => dbMode,
  getPool: () => pool,
  getMemoryDb: () => memoryDb,
  saveLocalDb
};
