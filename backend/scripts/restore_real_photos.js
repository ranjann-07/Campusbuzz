const mysql = require('mysql2/promise');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

// Curated high-resolution studio photographs of female college students / creators
const femaleStudioPhotos = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80', // Aanya Sharma
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80', // Shivani Negi
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=80', // Riya Patel
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=80', // Bhavna Sharma
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&q=80', // Sneha Saxena
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=500&q=80', // Neha Mukherjee
  'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=500&q=80', // Sanya Patel
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=80', // Pooja Mukherjee
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=500&q=80', // Tara Gokhale
  'https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=500&q=80', // Pooja Gupta
  'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=500&q=80', // Kavya Pillai
  'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=500&q=80', // Ritu Nair
  'https://images.unsplash.com/photo-1528892952291-009c663ce843?auto=format&fit=crop&w=500&q=80', // Meera Deshmukh
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=500&q=80', // Riya Sharma
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=500&q=80', // Sneha Joshi
  'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=500&q=80', // Simran Bhat
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=500&q=80', // Tanya Menon
  'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=500&q=80', // Diya Roy
  'https://images.unsplash.com/photo-1546961329-78bef0414d7c?auto=format&fit=crop&w=500&q=80', // Kriti Bhatt
  'https://images.unsplash.com/photo-1546961329-78bef0414d7c?auto=format&fit=crop&w=500&q=80', // Kriti Bhat
  'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?auto=format&fit=crop&w=500&q=80', // Meera Sengupta
  'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=500&q=80', // Priyanka Saxena
  'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=500&q=80', // Riya Pandey
  'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?auto=format&fit=crop&w=500&q=80', // Tara Kulkarni
  'https://images.unsplash.com/photo-1514315384763-ba401779410f?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1525130413817-d45c1d127c42?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1541823709867-1b206113eafd?auto=format&fit=crop&w=500&q=80',
  ...Array.from({ length: 100 }, (_, i) => `https://randomuser.me/api/portraits/women/${i}.jpg`)
];

// Curated high-resolution studio photographs of male college students / creators
const maleStudioPhotos = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80', // Arjun Mehta
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80', // Admin Karan
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=500&q=80', // Harsh Bhat
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&q=80', // Yash Rao
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=500&q=80', // Kabir Joshi
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=500&q=80', // Aarav Kapoor
  'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?auto=format&fit=crop&w=500&q=80', // Yash Kulkarni
  'https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=500&q=80', // Rahul Deshmukh
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=500&q=80', // Aditya Verma
  'https://images.unsplash.com/photo-1519764622345-23439dd774f7?auto=format&fit=crop&w=500&q=80', // Aryan Roy
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=500&q=80', // Siddharth Menon
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=500&q=80', // Yash Bansal
  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=500&q=80', // Varun Mishra
  'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=500&q=80', // Arjun Agarwal
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=500&q=80', // Tanmay Kapoor
  'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=500&q=80', // Aarav Mehta
  'https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1507152832244-10d45c7eda57?auto=format&fit=crop&w=500&q=80',
  ...Array.from({ length: 100 }, (_, i) => `https://randomuser.me/api/portraits/men/${i}.jpg`)
];

const femaleNames = new Set([
  'aanya', 'shivani', 'riya', 'bhavna', 'sneha', 'neha', 'sanya', 'pooja',
  'tara', 'kavya', 'ritu', 'meera', 'simran', 'tanya', 'diya', 'kriti',
  'priyanka', 'ananya', 'isha', 'shreya', 'aditi', 'swati', 'nandini', 'rashmi'
]);

function isFemale(name) {
  const first = name.toLowerCase().split(' ')[0].replace(/[^a-z]/g, '');
  return femaleNames.has(first) || first.endsWith('a') || first.endsWith('i') || first.endsWith('e');
}

async function run() {
  console.log('📸 Restoring Authentic High-Resolution Real Photographs for ALL Creators...');

  const db = await mysql.createConnection({
    host: process.env.MYSQL_HOST || '127.0.0.1',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'campusbuzz_db'
  });

  // Specifically ensure Top Creators have hand-picked distinct studio photos:
  const explicitTopCreators = [
    { name: 'Shivani Negi', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80' },
    { name: 'Aanya Sharma', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80' },
    { name: 'Sneha Saxena', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&q=80' },
    { name: 'Riya Deshmukh', photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=500&q=80' },
    { name: 'Siddharth Menon', photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&q=80' },
    { name: 'Kriti Bhatt', photo: 'https://images.unsplash.com/photo-1546961329-78bef0414d7c?auto=format&fit=crop&w=500&q=80' },
    { name: 'Yash Bansal', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80' },
    { name: 'Meera Sengupta', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=80' },
    { name: 'Priyanka Saxena', photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=80' },
    { name: 'Riya Pandey', photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=80' },
    { name: 'Aarav Mehta', photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=500&q=80' },
    { name: 'Tara Kulkarni', photo: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=500&q=80' },
    { name: 'Arjun Mehta', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80' },
    { name: 'Riya Patel', photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=500&q=80' },
    { name: 'Harsh Bhat', photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=500&q=80' },
    { name: 'Yash Rao', photo: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?auto=format&fit=crop&w=500&q=80' },
    { name: 'Kabir Joshi', photo: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=500&q=80' }
  ];

  for (const item of explicitTopCreators) {
    await db.query('UPDATE students SET profile_photo = ? WHERE full_name = ?', [item.photo, item.name]);
  }

  // Now update all other students using real human photos
  const [students] = await db.query('SELECT id, full_name, username, profile_photo FROM students ORDER BY id ASC');
  console.log(`Processing ${students.length} students...`);

  let femaleIdx = 0;
  let maleIdx = 0;
  const updates = [];

  for (const s of students) {
    // If it's one of the top explicit ones, leave intact
    const isExplicit = explicitTopCreators.some(e => e.name === s.full_name);
    if (isExplicit) continue;

    let photo = '';
    if (isFemale(s.full_name)) {
      photo = femaleStudioPhotos[femaleIdx % femaleStudioPhotos.length];
      femaleIdx++;
    } else {
      photo = maleStudioPhotos[maleIdx % maleStudioPhotos.length];
      maleIdx++;
    }

    updates.push({ id: s.id, photo });
  }

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

  console.log('✅ Real human photos applied to all 10,200 accounts!');

  // Check top trending creators
  const [topRows] = await db.query('SELECT id, full_name, username, profile_photo FROM students ORDER BY followers_count DESC LIMIT 10');
  console.log('🌟 Top 10 Creators in DB:');
  topRows.forEach((r, i) => console.log(` #${i+1} ${r.full_name}: ${r.profile_photo.slice(0, 65)}...`));

  await db.end();
}

run().catch(console.error);
