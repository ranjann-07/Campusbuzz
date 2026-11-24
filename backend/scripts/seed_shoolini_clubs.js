const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

async function seedClubsAndShivani() {
  const host = process.env.MYSQL_HOST || 'localhost';
  const user = process.env.MYSQL_USER || 'root';
  const password = process.env.MYSQL_PASSWORD || '';
  const database = process.env.MYSQL_DATABASE || 'campusbuzz_db';
  const port = parseInt(process.env.MYSQL_PORT || '3306', 10);

  const conn = await mysql.createConnection({ host, user, password, database, port });
  console.log('Connected to MySQL...');

  // 1. Create clubs and club_members tables
  await conn.query(`
    CREATE TABLE IF NOT EXISTS clubs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      category VARCHAR(100) NOT NULL,
      description TEXT NOT NULL,
      banner_url VARCHAR(500) NOT NULL,
      logo_url VARCHAR(500) NOT NULL,
      leads_name VARCHAR(150) NOT NULL,
      members_count INT DEFAULT 0,
      meeting_schedule VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS club_members (
      id INT AUTO_INCREMENT PRIMARY KEY,
      club_id INT NOT NULL,
      student_id INT NOT NULL,
      joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY uk_club_student (club_id, student_id),
      FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE,
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
    )
  `);

  // 2. Insert or Update Shivani Negi
  const passHash = bcrypt.hashSync('password123', 6);
  await conn.query(`
    INSERT INTO students 
    (student_id, full_name, email, username, password_hash, profile_photo, college_name, department_name, course, semester, year, bio, instagram, youtube, linkedin, creator_category, followers_count, engagement_rate, account_status, is_creator, role)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE 
      full_name = VALUES(full_name),
      followers_count = VALUES(followers_count),
      engagement_rate = VALUES(engagement_rate),
      bio = VALUES(bio),
      college_name = VALUES(college_name),
      profile_photo = VALUES(profile_photo)
  `, [
    'CB-2026-00005',
    'Shivani Negi',
    'shivani.negi@shoolini.edu',
    'shivani.negi',
    passHash,
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
    'Shoolini University',
    'Biotechnology & Media',
    'B.Tech Biotechnology',
    5,
    3,
    'Top Creator of the Month • Nature lover, campus vlogger & Himalayan storyteller at Shoolini University. ✨🏔️',
    'shivani_negi',
    'ShivaniNegiVlogs',
    'shivani-negi-shoolini',
    'Lifestyle',
    18400,
    4.92,
    'active',
    true,
    'creator'
  ]);
  console.log('✅ Shivani Negi seeded as Top Creator of the Month.');

  // Get Shivani ID
  const [[shivaniRow]] = await conn.query('SELECT id FROM students WHERE email = "shivani.negi@shoolini.edu" OR student_id = "CB-2026-00005"');
  const shivaniId = shivaniRow ? shivaniRow.id : 1;

  // 3. Insert Trending Posts mentioned in requirements
  const trendingPostsToInsert = [
    {
      author_id: shivaniId,
      post_type: 'image',
      content: 'Campus Fest vibes! 💜 The energy across the pine amphitheatre tonight was surreal. Music, lights, and endless memories with the crew.',
      media_url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
      hashtags: '#Fest #Shoolini #CampusLife #Vibes',
      likes_count: 842,
      comments_count: 128,
      shares_count: 45
    },
    {
      author_id: shivaniId,
      post_type: 'image',
      content: 'Nature hits different 🏔️ Early morning walk along the misty mountain ridge trail behind campus. Breathing in pure Himalayan pine air before lectures.',
      media_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      hashtags: '#Travel #CampusLife #Mountains #NatureHitsDifferent',
      likes_count: 1250,
      comments_count: 194,
      shares_count: 88
    },
    {
      author_id: 1, // Aanya Sharma
      post_type: 'image',
      content: 'Campus life at Shoolini ✨ Balancing research labs, creator shoots, and canteen chai breaks with the best collegiate community.',
      media_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
      hashtags: '#College #Life #CampusBuzz #StudentCreator',
      likes_count: 730,
      comments_count: 86,
      shares_count: 32
    },
    {
      author_id: 2, // Arjun Mehta
      post_type: 'image',
      content: 'Autonomous drone flight tests over the university valley! Tracking elevation differentials with lidar mapping. Future of collegiate tech is here. 🚀🤖',
      media_url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
      hashtags: '#TechFest #Robotics #Innovation #CampusAI',
      likes_count: 915,
      comments_count: 110,
      shares_count: 54
    }
  ];

  for (const p of trendingPostsToInsert) {
    await conn.query(`
      INSERT INTO posts (author_id, post_type, content, media_url, hashtags, likes_count, comments_count, shares_count)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [p.author_id, p.post_type, p.content, p.media_url, p.hashtags, p.likes_count, p.comments_count, p.shares_count]);
  }
  console.log('✅ Specific trending posts inserted.');

  // 4. Seed Clubs
  const clubsData = [
    {
      name: 'Robotics & AI Innovation Society',
      category: 'Technology',
      description: 'Building autonomous rovers, generative AI apps, and competing in national collegiate hackathons.',
      banner_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
      logo_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=robotics',
      leads_name: 'Arjun Mehta',
      members_count: 248,
      meeting_schedule: 'Wednesdays & Fridays 5:00 PM'
    },
    {
      name: 'Himalayan Eco & Nature Explorers',
      category: 'Sustainability',
      description: 'Mountain trail cleanups, biodiversity documentation, zero-waste initiatives, and pine reforestation.',
      banner_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
      logo_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=eco',
      leads_name: 'Shivani Negi',
      members_count: 312,
      meeting_schedule: 'Saturdays 8:00 AM'
    },
    {
      name: 'Acoustic Jam & Indie Music Society',
      category: 'Music',
      description: 'Live acoustic quad performances, original indie tracks, sound mastering, and festival jam sessions.',
      banner_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
      logo_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=music',
      leads_name: 'Tanya Verma',
      members_count: 195,
      meeting_schedule: 'Tuesdays & Thursdays 6:00 PM'
    },
    {
      name: 'Cinematography & Visual Arts Guild',
      category: 'Photography',
      description: 'Landscape photography, campus reels production, film editing masterclasses, and color grading.',
      banner_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
      logo_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=photo',
      leads_name: 'Kabir Singh',
      members_count: 178,
      meeting_schedule: 'Mondays 4:30 PM'
    },
    {
      name: 'Fashion Runway & Sustainable Aesthetics Guild',
      category: 'Fashion',
      description: 'Curating campus thrift lookbooks, sustainable streetwear showcases, and annual gala fashion design.',
      banner_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
      logo_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=fashion',
      leads_name: 'Riya Patel',
      members_count: 164,
      meeting_schedule: 'Thursdays 5:00 PM'
    },
    {
      name: 'Student Entrepreneurship & Venture Cell',
      category: 'Startup',
      description: 'Incubating collegiate startups, pitch deck workshops, angel investor sessions, and venture competitions.',
      banner_url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
      logo_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=ecell',
      leads_name: 'Rohan Das',
      members_count: 220,
      meeting_schedule: 'Tuesdays 5:30 PM'
    }
  ];

  for (const cl of clubsData) {
    await conn.query(`
      INSERT INTO clubs (name, category, description, banner_url, logo_url, leads_name, members_count, meeting_schedule)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE description = VALUES(description)
    `, [cl.name, cl.category, cl.description, cl.banner_url, cl.logo_url, cl.leads_name, cl.members_count, cl.meeting_schedule]);
  }
  console.log('✅ 6 Collegiate Clubs seeded.');

  await conn.end();
}

seedClubsAndShivani().catch(console.error);
