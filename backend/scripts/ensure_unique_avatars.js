const mysql = require('mysql2/promise');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

const curatedTopPhotos = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80', // 1 Aanya Sharma (signed-in collegiate)
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80', // 2 Arjun Mehta
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=80', // 3 Riya Patel
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80', // 4 Admin Karan
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80', // 5 Shivani Negi (Top Creator of the Month)
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=500&q=80', // 6 Harsh Bhat
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&q=80', // 7 Yash Rao
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=500&q=80', // 8 Kabir Joshi
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=80', // 9 Bhavna Sharma
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=500&q=80', // 10 Aarav Kapoor
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&q=80', // 11 Sneha Saxena
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=500&q=80', // 12 Neha Mukherjee
  'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=500&q=80', // 13 Sanya Patel
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=80', // 14 Pooja Mukherjee
  'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?auto=format&fit=crop&w=500&q=80', // 15 Yash Kulkarni
  'https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=500&q=80', // 16 Rahul Deshmukh
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=500&q=80', // 17 Tara Gokhale
  'https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=500&q=80', // 18 Pooja Gupta
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=500&q=80', // 19 Aditya Verma
  'https://images.unsplash.com/photo-1519764622345-23439dd774f7?auto=format&fit=crop&w=500&q=80', // 20 Aryan Roy
  'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=500&q=80', // 21 Kavya Pillai
  'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=500&q=80', // 22 Siddharth Sengupta
  'https://images.unsplash.com/photo-1528892952291-009c663ce843?auto=format&fit=crop&w=500&q=80', // 23 Ritu Nair
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=500&q=80', // 24 Meera Deshmukh
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=500&q=80', // 25 Riya Sharma
  'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=500&q=80', // 26 Yash Pandey
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=500&q=80', // 27 Vikram Kapoor
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=500&q=80', // 28 Sneha Joshi
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=500&q=80', // 29 Simran Bhat
  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=500&q=80', // 30 Varun Mishra
  'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=500&q=80', // 31 Tanya Menon
  'https://images.unsplash.com/photo-1534751516642-a1714f5a5b00?auto=format&fit=crop&w=500&q=80', // 32 Arjun Agarwal
  'https://images.unsplash.com/photo-1546961329-78bef0414d7c?auto=format&fit=crop&w=500&q=80', // 33 Diya Roy
  'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?auto=format&fit=crop&w=500&q=80', // 34 Meera Iyer
  'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=500&q=80', // 35 Tanmay Kapoor
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=500&q=80', // 36
  'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=500&q=80', // 37
  'https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=500&q=80', // 38
  'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=500&q=80', // 39
  'https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?auto=format&fit=crop&w=500&q=80', // 40
  'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=500&q=80', // 41
  'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=500&q=80', // 42
  'https://images.unsplash.com/photo-1534751516642-a1714f5a5b00?auto=format&fit=crop&w=500&q=80', // 43
  'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?auto=format&fit=crop&w=500&q=80', // 44
  'https://images.unsplash.com/photo-1514315384763-ba401779410f?auto=format&fit=crop&w=500&q=80', // 45
  'https://images.unsplash.com/photo-1525130413817-d45c1d127c42?auto=format&fit=crop&w=500&q=80', // 46
  'https://images.unsplash.com/photo-1541823709867-1b206113eafd?auto=format&fit=crop&w=500&q=80', // 47
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=500&q=80', // 48
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=500&q=80', // 49
  'https://images.unsplash.com/photo-1507152832244-10d45c7eda57?auto=format&fit=crop&w=500&q=80'  // 50
];

async function main() {
  console.log('✨ Starting 100% Unique Profile Picture Migration for ALL Accounts...');

  const db = await mysql.createConnection({
    host: process.env.MYSQL_HOST || '127.0.0.1',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'campusbuzz_db'
  });

  const [students] = await db.query('SELECT id, username, full_name FROM students ORDER BY id ASC');
  console.log(`Found ${students.length} students in database.`);

  const usedUrls = new Set();
  const updates = [];

  // Deduplicate curated top list
  const cleanTop = [...new Set(curatedTopPhotos)];

  for (let i = 0; i < students.length; i++) {
    const s = students[i];
    let photo = '';

    if (i < cleanTop.length) {
      photo = cleanTop[i];
    } else if (i < cleanTop.length + 100) {
      const idx = i - cleanTop.length;
      photo = `https://randomuser.me/api/portraits/women/${idx}.jpg`;
    } else if (i < cleanTop.length + 200) {
      const idx = i - (cleanTop.length + 100);
      photo = `https://randomuser.me/api/portraits/men/${idx}.jpg`;
    } else if (i < cleanTop.length + 270) {
      const idx = (i - (cleanTop.length + 200)) + 1;
      photo = `https://i.pravatar.cc/300?img=${idx}`;
    } else {
      // Deterministic, beautiful Dicebear lorelei avatar based on username
      photo = `https://api.dicebear.com/7.x/lorelei/svg?seed=${encodeURIComponent(s.username)}`;
    }

    // Absolutely ensure no collisions anywhere in the entire 10,200 dataset
    if (usedUrls.has(photo)) {
      photo = `https://api.dicebear.com/7.x/lorelei/svg?seed=${encodeURIComponent(s.username + '_' + s.id)}`;
    }

    usedUrls.add(photo);
    updates.push({ id: s.id, photo });
  }

  console.log(`Generated ${usedUrls.size} distinct avatars for ${students.length} students.`);

  // Update in chunks of 400 with CASE WHEN for maximum speed
  const chunkSize = 400;
  for (let i = 0; i < updates.length; i += chunkSize) {
    const chunk = updates.slice(i, i + chunkSize);
    let cases = '';
    const ids = [];
    for (const item of chunk) {
      cases += ` WHEN id = ${item.id} THEN ${db.escape(item.photo)}`;
      ids.push(item.id);
    }
    const sql = `UPDATE students SET profile_photo = CASE ${cases} END WHERE id IN (${ids.join(',')})`;
    await db.query(sql);
  }

  console.log('✅ Successfully updated all students!');

  // Check stats
  const [stats] = await db.query('SELECT count(*) as total_students, count(DISTINCT profile_photo) as distinct_photos FROM students');
  console.log('📊 Verification:', stats[0]);

  // Also check top 10 creators
  const [top] = await db.query('SELECT id, full_name, username, profile_photo FROM students ORDER BY followers_count DESC LIMIT 10');
  console.log('🌟 Top 10 Creators:');
  top.forEach((c, idx) => {
    console.log(` #${idx + 1}: ${c.full_name} (${c.username}) -> ${c.profile_photo.slice(0, 60)}...`);
  });

  await db.end();
}

main().catch(err => {
  console.error('Error running migration:', err);
  process.exit(1);
});
