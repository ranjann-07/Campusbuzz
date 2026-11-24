const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const seedData = require('./config/seedData');

dotenv.config();

async function seed() {
  const host = process.env.MYSQL_HOST || 'localhost';
  const user = process.env.MYSQL_USER || 'root';
  const password = process.env.MYSQL_PASSWORD || '';
  const database = process.env.MYSQL_DATABASE || 'campusbuzz_db';
  const port = parseInt(process.env.MYSQL_PORT || '3306', 10);

  try {
    const conn = await mysql.createConnection({ host, user, password, database, port });
    console.log('🌱 Seeding MySQL Database...');

    // Users
    for (const u of seedData.users) {
      await conn.query(
        `INSERT IGNORE INTO users (id, name, email, password_hash, role, college, department, avatar_url, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [u.id, u.name, u.email, u.password, u.role, u.college, u.department, u.avatar_url, u.status]
      );
    }

    // Creators
    for (const c of seedData.creators) {
      await conn.query(
        `INSERT IGNORE INTO creators (id, user_id, name, college, department, instagram, youtube, followers, engagement_rate, category, avatar_url, bio, verification_status, total_collaborations, rating)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [c.id, c.user_id, c.name, c.college, c.department, c.instagram, c.youtube, c.followers, c.engagement_rate, c.category, c.avatar_url, c.bio, c.verification_status, c.total_collaborations, c.rating]
      );
    }

    // Campaigns
    for (const camp of seedData.campaigns) {
      await conn.query(
        `INSERT IGNORE INTO campaigns (id, name, description, brand, budget, deadline, target_creators, status, category, deliverables)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [camp.id, camp.name, camp.description, camp.brand, camp.budget, camp.deadline, camp.target_creators, camp.status, camp.category, camp.deliverables]
      );
    }

    // Collaborations
    for (const col of seedData.collaborations) {
      await conn.query(
        `INSERT IGNORE INTO collaborations (id, campaign_id, creator_id, project_status, compensation, deliverables_summary)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [col.id, col.campaign_id, col.creator_id, col.project_status, col.compensation, col.deliverables_summary]
      );
    }

    // Messages
    for (const m of seedData.messages) {
      await conn.query(
        `INSERT IGNORE INTO messages (id, collaboration_id, sender_name, sender_role, text)
         VALUES (?, ?, ?, ?, ?)`,
        [m.id, m.collaboration_id, m.sender_name, m.sender_role, m.text]
      );
    }

    // Events
    for (const ev of seedData.events) {
      await conn.query(
        `INSERT IGNORE INTO events (id, title, date, location, description, category, banner_url, registered_count, max_capacity, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [ev.id, ev.title, ev.date, ev.location, ev.description, ev.category, ev.banner_url, ev.registered_count, ev.max_capacity, ev.status]
      );
    }

    // Activity Log
    for (const act of seedData.activities) {
      await conn.query(
        `INSERT IGNORE INTO activity_log (id, user_name, action, target, type)
         VALUES (?, ?, ?, ?, ?)`,
        [act.id, act.user_name, act.action, act.target, act.type]
      );
    }

    console.log('✅ MySQL Database seeded successfully with realistic campus data!');
    await conn.end();
  } catch (err) {
    console.error('Seed error:', err.message);
  }
}

seed();
