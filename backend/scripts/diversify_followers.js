const path = require('path');
const mysql = require(path.join(__dirname, '../node_modules/mysql2/promise'));

async function diversifyFollowers() {
  const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'campusbuzz_db',
    port: 3306
  });

  console.log('Connecting to database...');

  const [students] = await pool.query('SELECT id, full_name, college_name, creator_category FROM students ORDER BY id ASC');
  console.log(`Fetched ${students.length} students.`);

  // Explicit star creators (for main profiles with id <= 5)
  const starFollowers = {
    1: 128400, // Aanya Sharma
    2: 96800,  // Arjun Mehta
    3: 74200,  // Riya Patel
    4: 62000,  // Admin Karan
    5: 184500  // Shivani Negi
  };

  const otherStudents = students.filter(s => !starFollowers[s.id]);
  
  // Seeded pseudo-random deterministic shuffle
  for (let i = otherStudents.length - 1; i > 0; i--) {
    const j = Math.floor((Math.sin(i * 997 + 13) * 0.5 + 0.5) * (i + 1));
    [otherStudents[i], otherStudents[j]] = [otherStudents[j], otherStudents[i]];
  }

  const updates = [];

  // Add explicit stars first
  for (const s of students) {
    if (starFollowers[s.id]) {
      const followers = starFollowers[s.id];
      const eng = (4.2 + (s.id * 0.3) % 2).toFixed(2);
      updates.push({ id: s.id, followers, engagement_rate: eng, role: 'creator' });
    }
  }

  const totalOthers = otherStudents.length;
  for (let rank = 0; rank < totalOthers; rank++) {
    const s = otherStudents[rank];
    let followers;
    let eng;

    // Add unique jitter based on ID so no two students have the exact same number
    const jitter = (s.id * 73) % 987;

    if (rank < 60) {
      // 105k to 248k
      followers = Math.floor(105000 + Math.random() * 140000) + jitter;
      eng = (3.8 + Math.random() * 2.8).toFixed(2);
    } else if (rank < 300) {
      // 45k to 99k
      followers = Math.floor(45000 + Math.random() * 52000) + jitter;
      eng = (3.5 + Math.random() * 2.5).toFixed(2);
    } else if (rank < 900) {
      // 18k to 44k
      followers = Math.floor(18000 + Math.random() * 26000) + (jitter % 500);
      eng = (3.2 + Math.random() * 2.6).toFixed(2);
    } else if (rank < 2800) {
      // 6k to 17.9k
      followers = Math.floor(6000 + Math.random() * 11500) + (jitter % 300);
      eng = (2.8 + Math.random() * 3.0).toFixed(2);
    } else if (rank < 6500) {
      // 1.8k to 5.9k
      followers = Math.floor(1800 + Math.random() * 4100) + (jitter % 100);
      eng = (2.2 + Math.random() * 3.2).toFixed(2);
    } else {
      // 350 to 1.7k
      followers = Math.floor(350 + Math.random() * 1400) + (jitter % 50);
      eng = (1.8 + Math.random() * 3.5).toFixed(2);
    }

    const role = followers >= 5000 ? 'creator' : 'student';
    updates.push({ id: s.id, followers, engagement_rate: eng, role });
  }

  console.log(`Prepared ${updates.length} updates. Executing in chunks...`);

  const chunkSize = 500;
  for (let i = 0; i < updates.length; i += chunkSize) {
    const chunk = updates.slice(i, i + chunkSize);
    const ids = chunk.map(u => u.id).join(',');
    
    let followersCase = chunk.map(u => `WHEN ${u.id} THEN ${u.followers}`).join(' ');
    let engCase = chunk.map(u => `WHEN ${u.id} THEN ${u.engagement_rate}`).join(' ');
    let roleCase = chunk.map(u => `WHEN ${u.id} THEN '${u.role}'`).join(' ');

    const sql = `
      UPDATE students 
      SET 
        followers_count = CASE id ${followersCase} END,
        engagement_rate = CASE id ${engCase} END,
        role = CASE id ${roleCase} END
      WHERE id IN (${ids})
    `;

    await pool.query(sql);
  }

  const [sample] = await pool.query('SELECT id, full_name, college_name, followers_count, engagement_rate FROM students ORDER BY followers_count DESC LIMIT 15');
  console.log('\nTop 15 Creators (Diversified):');
  console.table(sample);

  await pool.end();
  console.log('Followers successfully diversified and unique per student!');
}

diversifyFollowers().catch(err => {
  console.error('Error diversifying followers:', err);
  process.exit(1);
});
