const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

const CSV_DIR = path.join(__dirname, '../data/csv');
if (!fs.existsSync(CSV_DIR)) {
  fs.mkdirSync(CSV_DIR, { recursive: true });
}

// --------------------------------------------------------------------------
// DIVERSE REALISTIC DATA GENERATORS
// --------------------------------------------------------------------------
const firstNames = [
  'Aanya', 'Arjun', 'Riya', 'Kabir', 'Tanya', 'Rohan', 'Ananya', 'Devansh',
  'Diya', 'Ishaan', 'Kavya', 'Vihaan', 'Sneha', 'Aryan', 'Pooja', 'Aditya',
  'Meera', 'Rahul', 'Sanya', 'Vikram', 'Neha', 'Tanmay', 'Shruti', 'Siddharth',
  'Varun', 'Ritu', 'Manav', 'Isha', 'Dhruv', 'Kriti', 'Harsh', 'Simran',
  'Nikhil', 'Priyanka', 'Aarav', 'Avani', 'Yash', 'Bhavna', 'Gaurav', 'Tara'
];

const lastNames = [
  'Sharma', 'Mehta', 'Patel', 'Singh', 'Verma', 'Das', 'Joshi', 'Roy',
  'Nair', 'Iyer', 'Gupta', 'Reddy', 'Kapoor', 'Malhotra', 'Chatterjee', 'Bhat',
  'Mukherjee', 'Deshmukh', 'Saxena', 'Choudhury', 'Bansal', 'Agarwal', 'Menon',
  'Pillai', 'Rao', 'Kulkarni', 'Sengupta', 'Gokhale', 'Mishra', 'Pandey'
];

const colleges = [
  { name: 'Delhi University', code: 'DU', city: 'New Delhi', state: 'Delhi' },
  { name: 'IIT Bombay', code: 'IITB', city: 'Mumbai', state: 'Maharashtra' },
  { name: 'NIFT Delhi', code: 'NIFT', city: 'New Delhi', state: 'Delhi' },
  { name: 'St. Xavier\'s College Mumbai', code: 'SXC', city: 'Mumbai', state: 'Maharashtra' },
  { name: 'Christ University', code: 'CU', city: 'Bangalore', state: 'Karnataka' },
  { name: 'BITS Pilani', code: 'BITS', city: 'Pilani', state: 'Rajasthan' },
  { name: 'Ashoka University', code: 'ASHOKA', city: 'Sonipat', state: 'Haryana' },
  { name: 'SRM Institute of Science and Technology', code: 'SRM', city: 'Chennai', state: 'Tamil Nadu' },
  { name: 'Manipal Academy of Higher Education', code: 'MAHE', city: 'Manipal', state: 'Karnataka' },
  { name: 'IIT Delhi', code: 'IITD', city: 'New Delhi', state: 'Delhi' },
  { name: 'Jadavpur University', code: 'JU', city: 'Kolkata', state: 'West Bengal' },
  { name: 'Symbiosis International', code: 'SIU', city: 'Pune', state: 'Maharashtra' }
];

const departmentCourseMap = {
  'Computer Science & Engineering': ['B.Tech CSE', 'M.Tech AI & Data Science', 'B.Sc Computer Science'],
  'Media & Mass Communication': ['BA Journalism', 'MA Media Studies', 'BA Film & Television Production'],
  'Fashion & Apparel Design': ['B.Des Fashion Design', 'M.Des Sustainable Fashion', 'B.Des Textile Art'],
  'Business Administration': ['BBA Marketing', 'MBA Tech Management', 'B.Com Honours'],
  'Performing Arts & Music': ['BA Performing Arts', 'MA Hindustani & Western Classical', 'BA Sound Design'],
  'Visual Arts & Photography': ['BFA Commercial Photography', 'B.Des Visual Communications'],
  'Robotics & Electronics': ['B.Tech Robotics & Automation', 'B.Tech Electrical & Electronics'],
  'Psychology & Human Sciences': ['B.Sc Psychology', 'MA Organizational Behavior', 'B.Sc Cognitive Science']
};

const departments = Object.keys(departmentCourseMap);

const categories = [
  'Technology', 'Lifestyle', 'Fashion', 'Photography', 'Music',
  'Gaming', 'Fitness', 'Comedy & Satire', 'Literature & Debating', 'Art & Animation'
];

const avatars = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&q=80'
];

const postMedia = [
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'
];

const postContentTemplates = [
  "Just wrapped up day one of our collegiate AI hackathon! Built a vision model for real-time campus shuttle tracking. What tech stack are you building with this semester?",
  "Sunset on the central amphitheatre quad. College evenings like this remind me why storytelling through the camera lens is so special. 📸✨",
  "Huge milestone: Just signed our second brand collaboration for the upcoming winter tech festival! Excited to share behind-the-scenes content with you all.",
  "New vlog dropping tonight: '24 Hours in the Life of a Computer Science Major during Finals Week'. Link in bio!",
  "Collaborating with campus musicians for an acoustic sunset jam session. The acoustic reverb in the student union is unmatched. 🎶🎸",
  "Sustainable campus fits on a student budget! Re-styled 3 thrifted vintage jackets for winter classes. Which fit is your favorite: 1, 2, or 3?",
  "Robotics team testing our new autonomous rover for the university tech expo. The obstacle avoidance PID loop finally converged! 🤖🚀",
  "Excited to announce my official partnership with Red Bull India for the 2026 Campus Energy Fest! Let's bring the energy high.",
  "Quick study tip that saved my GPA: timeboxing with Notion AI templates and 45-minute focus sprints. Template link shared in our creator hub.",
  "Behind the scenes at our campus cultural festival fashion runway rehearsals. Lighting and music synchronization are looking next-level."
];

const hashtagsList = [
  '#CampusBuzz #StudentCreator #CollegeLife',
  '#TechFest2026 #AIHacks #DeveloperLife',
  '#CampusFashion #ThriftedStyle #CollegeFits',
  '#CampusMusic #AcousticJam #IndiePop',
  '#StudentFounder #StartupLife #CampusAmbassador',
  '#CampusVlog #DayInTheLife #UniversityVibes',
  '#RoboticsClub #EngineeringLife #Makers'
];

// --------------------------------------------------------------------------
// 15 REALISTIC CAMPAIGNS
// --------------------------------------------------------------------------
const campaignsData = [
  {
    campaign_code: 'CAMP-2026-001',
    name: 'Campus Brand Ambassador Program',
    brand_name: 'Red Bull India',
    description: 'High-octane campus activation looking for 15 student ambassadors to document campus extreme sports, gaming showdowns, and energy hype reels.',
    image_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
    budget: 150000.00,
    rewards: '₹25,000 Stipend + Red Bull Creator Gear Kit + VIP Passes',
    target_audience: 'College students across Sports, Gaming, and Lifestyle',
    required_category: 'Lifestyle',
    application_deadline: '2026-12-28',
    start_date: '2027-01-05',
    end_date: '2027-03-31',
    status: 'active'
  },
  {
    campaign_code: 'CAMP-2026-002',
    name: 'Tech Fest Promotion & Hackathon Ambassadors',
    brand_name: 'Google Developer Student Clubs',
    description: 'Promote university developer conferences, generative AI coding workshops, and community hackathons across college tech societies.',
    image_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    budget: 180000.00,
    rewards: '₹20,000 + Google Cloud Credits ($500) + Swag Bags',
    target_audience: 'Engineering & CS students, Hackers, Tech enthusiasts',
    required_category: 'Technology',
    application_deadline: '2026-12-30',
    start_date: '2027-01-10',
    end_date: '2027-02-28',
    status: 'active'
  },
  {
    campaign_code: 'CAMP-2026-003',
    name: 'Food Festival & Late-Night Canteen Marketing',
    brand_name: 'Zomato Campus Squad',
    description: 'Showcase top late-night dorm cravings, budget-friendly college cafes, and live campus food stalls via appetizing short-form video reels.',
    image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    budget: 95000.00,
    rewards: '₹12,000 + 1 Year Zomato Gold + Weekly Food Vouchers',
    target_audience: 'Foodies, Hostel residents, College vloggers',
    required_category: 'Lifestyle',
    application_deadline: '2027-01-15',
    start_date: '2027-01-20',
    end_date: '2027-03-15',
    status: 'active'
  },
  {
    campaign_code: 'CAMP-2026-004',
    name: 'Fashion & Lifestyle Spring Lookbook',
    brand_name: 'Myntra Campus Glam',
    description: 'Curate college-ready OOTD aesthetic fits for spring/summer campus wardrobe styling vintage pieces and trending collegiate streetwear.',
    image_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    budget: 140000.00,
    rewards: '₹18,000 Cash + ₹25,000 Fashion Shopping Wardrobe',
    target_audience: 'Fashion creators, NIFT students, Style influencers',
    required_category: 'Fashion',
    application_deadline: '2027-01-20',
    start_date: '2027-02-01',
    end_date: '2027-04-15',
    status: 'active'
  },
  {
    campaign_code: 'CAMP-2026-005',
    name: 'University Cultural Fest Digital Blast',
    brand_name: 'Vh1 Supersonic Campus',
    description: 'Create viral TikToks, Instagram reels, and YouTube shorts documenting band rehearsals, DJ lineups, and campus festival tickets.',
    image_url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
    budget: 200000.00,
    rewards: '₹30,000 Stipend + All-Access Artist Lounge Passes',
    target_audience: 'Music enthusiasts, Dancers, Event promoters',
    required_category: 'Music',
    application_deadline: '2026-12-25',
    start_date: '2027-01-08',
    end_date: '2027-02-28',
    status: 'active'
  },
  {
    campaign_code: 'CAMP-2026-006',
    name: 'Gaming Tournament & Esports Casters Program',
    brand_name: 'Asus ROG Campus League',
    description: 'Stream inter-college Valorant, BGMI, and EA FC showdowns with commentary, hardware reviews, and tournament highlight clips.',
    image_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    budget: 250000.00,
    rewards: '₹35,000 + ROG Strix Gaming Gear + Tournament Sponsorship',
    target_audience: 'Campus gamers, Twitch/YouTube streamers, Esports teams',
    required_category: 'Gaming',
    application_deadline: '2027-01-10',
    start_date: '2027-01-18',
    end_date: '2027-03-30',
    status: 'active'
  },
  {
    campaign_code: 'CAMP-2026-007',
    name: 'Student Startup Pitch & Founder Stories',
    brand_name: 'Y Combinator Collegiate Tour',
    description: 'Spotlight student-run startups, collegiate incubators, and young founders solving problems in AI, climate, and edtech.',
    image_url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
    budget: 120000.00,
    rewards: '₹20,000 + 1-on-1 VC Pitch Mentorship + Demo Day Access',
    target_audience: 'Student entrepreneurs, Tech founders, Business clubs',
    required_category: 'Technology',
    application_deadline: '2027-01-12',
    start_date: '2027-01-25',
    end_date: '2027-03-20',
    status: 'active'
  },
  {
    campaign_code: 'CAMP-2026-008',
    name: 'Inter-College Sports Championship Promo',
    brand_name: 'Nike Campus Run',
    description: 'Document early morning collegiate athletic training, cross-country track meets, and intramural basketball leagues.',
    image_url: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80',
    budget: 175000.00,
    rewards: '₹22,000 + Nike Running Performance Kit + Marathon Entry',
    target_audience: 'Collegiate athletes, Fitness creators, Sports societies',
    required_category: 'Fitness',
    application_deadline: '2027-02-01',
    start_date: '2027-02-15',
    end_date: '2027-04-10',
    status: 'active'
  },
  {
    campaign_code: 'CAMP-2026-009',
    name: 'Spotify Campus Beats Ambassador Fellowship',
    brand_name: 'Spotify',
    description: 'Curate official university playlists, interview local collegiate indie musicians, and promote student subscription tiers.',
    image_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    budget: 220000.00,
    rewards: '₹32,000 Stipend + Studio Recording Grants + Spotify Pro',
    target_audience: 'Student musicians, Podcasters, Music reviewers',
    required_category: 'Music',
    application_deadline: '2026-12-29',
    start_date: '2027-01-15',
    end_date: '2027-04-30',
    status: 'active'
  },
  {
    campaign_code: 'CAMP-2026-010',
    name: 'Notion AI Campus Fellowship 2027',
    brand_name: 'Notion',
    description: 'Produce high-utility study workflow tutorials showing how Notion AI supercharges study systems, exam notes, and project collaboration.',
    image_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
    budget: 160000.00,
    rewards: '₹20,000 + Notion Certified Badge + Exclusive Fellowship Swag',
    target_audience: 'Productivity vloggers, Students, Academic clubs',
    required_category: 'Technology',
    application_deadline: '2026-12-28',
    start_date: '2027-01-08',
    end_date: '2027-03-30',
    status: 'active'
  },
  {
    campaign_code: 'CAMP-2026-011',
    name: 'Eco-Campus Sustainability & Zero-Waste Drive',
    brand_name: 'Tata Sustainability Fellowship',
    description: 'Promote campus solar initiatives, zero-waste canteen packaging, and collegiate tree plantation drives.',
    image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    budget: 110000.00,
    rewards: '₹15,000 + Eco-Innovator Trophy + National Showcase',
    target_audience: 'Environmental activists, Science students, NSS volunteers',
    required_category: 'Lifestyle',
    application_deadline: '2027-02-10',
    start_date: '2027-02-20',
    end_date: '2027-04-30',
    status: 'active'
  },
  {
    campaign_code: 'CAMP-2026-012',
    name: 'Campus Streets & Architecture Photo Challenge',
    brand_name: 'Canon Future Creators',
    description: 'Capture architectural heritage, candid collegiate emotions, and sunset quad photography with Canon EOS R mirrorless cameras.',
    image_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
    budget: 135000.00,
    rewards: '₹18,000 Cash + Canon RF 50mm Prime Lens Prize',
    target_audience: 'Student photographers, Visual storytellers, Film society',
    required_category: 'Photography',
    application_deadline: '2026-12-31',
    start_date: '2027-01-12',
    end_date: '2027-03-15',
    status: 'active'
  },
  {
    campaign_code: 'CAMP-2026-013',
    name: 'OnePlus Student Pioneer Launch Tour',
    brand_name: 'OnePlus',
    description: 'Showcase mobile photography under low-light campus night festivals, ultra-fast charging, and gaming performance testing.',
    image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
    budget: 300000.00,
    rewards: '₹40,000 + OnePlus Flagship Device + Global Community Feature',
    target_audience: 'Mobile photographers, Tech creators, Campus leaders',
    required_category: 'Technology',
    application_deadline: '2026-12-27',
    start_date: '2027-01-05',
    end_date: '2027-03-25',
    status: 'active'
  },
  {
    campaign_code: 'CAMP-2026-014',
    name: 'Campus Cafe & Creative Hangout Perks',
    brand_name: 'Blue Tokai Coffee Roasters',
    description: 'Review dorm study cafes, artisanal cold brews, and remote workspace study corners for student creators.',
    image_url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    budget: 85000.00,
    rewards: '₹12,000 + Monthly Coffee Subscription + Merch',
    target_audience: 'Study vloggers, Writers, Student creators',
    required_category: 'Lifestyle',
    application_deadline: '2027-01-25',
    start_date: '2027-02-05',
    end_date: '2027-04-15',
    status: 'active'
  },
  {
    campaign_code: 'CAMP-2026-015',
    name: 'Central University Club Recruitment Drive',
    brand_name: 'Central Student Union',
    description: 'Produce high-energy recruitment reels for university dance, drama, debate, coding, and entrepreneurship clubs.',
    image_url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
    budget: 60000.00,
    rewards: '₹10,000 + Club Leadership Award + Official Letter of Merit',
    target_audience: 'All student creators, Club executives, Freshers',
    required_category: 'Comedy & Satire',
    application_deadline: '2026-12-30',
    start_date: '2027-01-08',
    end_date: '2027-02-28',
    status: 'active'
  }
];

// --------------------------------------------------------------------------
// 20 UPCOMING EVENTS (ALL SCHEDULED STRICTLY AFTER DECEMBER 10, 2026)
// --------------------------------------------------------------------------
const eventsData = [
  {
    event_code: 'EVT-2026-001',
    name: 'Winter Tech Fest 2026',
    description: 'Flagship inter-collegiate robotics exhibition, drone obstacle racing, and automated AI hack stages.',
    banner_image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    event_date: '2026-12-12',
    start_time: '09:30 AM',
    end_time: '06:00 PM',
    venue: 'Main Technology Quad & Engineering Hall A',
    organizer: 'Robotics & IEEE Student Chapter',
    category: 'Technology',
    registration_deadline: '2026-12-11',
    max_attendees: 650,
    registered_attendees: 480,
    status: 'upcoming'
  },
  {
    event_code: 'EVT-2026-002',
    name: 'AI Innovation Summit',
    description: 'Deep dive into large multimodal models, interactive world simulators, and generative media production.',
    banner_image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    event_date: '2026-12-15',
    start_time: '10:00 AM',
    end_time: '05:00 PM',
    venue: 'Auditorium complex, Tech Block 2',
    organizer: 'AI Research Society',
    category: 'Technology',
    registration_deadline: '2026-12-14',
    max_attendees: 500,
    registered_attendees: 395,
    status: 'upcoming'
  },
  {
    event_code: 'EVT-2026-003',
    name: 'Campus Music Night',
    description: 'Collegiate indie pop singers, rock bands, and acoustic live sessions under the winter stars.',
    banner_image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    event_date: '2026-12-18',
    start_time: '06:30 PM',
    end_time: '11:00 PM',
    venue: 'Central Amphitheatre Open Stage',
    organizer: 'University Cultural Council',
    category: 'Music',
    registration_deadline: '2026-12-17',
    max_attendees: 1200,
    registered_attendees: 920,
    status: 'upcoming'
  },
  {
    event_code: 'EVT-2026-004',
    name: 'Startup Pitch Competition',
    description: '15 student-led ventures pitch in front of prominent angel investors and alumni venture partners for seed grants.',
    banner_image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
    event_date: '2026-12-21',
    start_time: '11:00 AM',
    end_time: '04:30 PM',
    venue: 'Management Innovation Studio',
    organizer: 'Entrepreneurship Cell (E-Cell)',
    category: 'Startup',
    registration_deadline: '2026-12-20',
    max_attendees: 350,
    registered_attendees: 290,
    status: 'upcoming'
  },
  {
    event_code: 'EVT-2026-005',
    name: 'Winter Photography Competition',
    description: 'Live photowalk across historic campus arches, portrait challenge, and night long-exposure masterclass.',
    banner_image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
    event_date: '2026-12-24',
    start_time: '02:00 PM',
    end_time: '07:30 PM',
    venue: 'Media Center & North Quad',
    organizer: 'Visual Arts Society',
    category: 'Photography',
    registration_deadline: '2026-12-23',
    max_attendees: 200,
    registered_attendees: 165,
    status: 'upcoming'
  },
  {
    event_code: 'EVT-2026-006',
    name: 'Winter Sports Tournament',
    description: 'Annual inter-department basketball, football, badminton, and athletics championship.',
    banner_image: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80',
    event_date: '2026-12-27',
    start_time: '08:00 AM',
    end_time: '06:00 PM',
    venue: 'University Sports Stadium & Indoor Arena',
    organizer: 'Department of Physical Education',
    category: 'Sports',
    registration_deadline: '2026-12-25',
    max_attendees: 800,
    registered_attendees: 640,
    status: 'upcoming'
  },
  {
    event_code: 'EVT-2027-007',
    name: 'New Year Creator Meetup 2027',
    description: 'Collaborate with top campus content creators, podcasters, and brand marketing leads for 2027 planning.',
    banner_image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
    event_date: '2027-01-05',
    start_time: '03:00 PM',
    end_time: '07:00 PM',
    venue: 'Student Lounge, Innovation Center',
    organizer: 'CampusBuzz Creator Network',
    category: 'Networking',
    registration_deadline: '2027-01-04',
    max_attendees: 250,
    registered_attendees: 215,
    status: 'upcoming'
  },
  {
    event_code: 'EVT-2027-008',
    name: 'Campus Hackathon 2027',
    description: '36-hour non-stop hackathon building generative AI apps, smart campus utilities, and decentralized protocols.',
    banner_image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
    event_date: '2027-01-10',
    start_time: '09:00 AM',
    end_time: '09:00 PM',
    venue: 'Computer Science Labs, Block 4',
    organizer: 'Coding Society & GDSC',
    category: 'Technology',
    registration_deadline: '2027-01-08',
    max_attendees: 450,
    registered_attendees: 410,
    status: 'upcoming'
  },
  {
    event_code: 'EVT-2027-009',
    name: 'Annual Cultural Festival Gala',
    description: 'The premier collegiate festival featuring 40+ universities, celebrity music acts, and food carnivals.',
    banner_image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
    event_date: '2027-01-15',
    start_time: '10:00 AM',
    end_time: '11:00 PM',
    venue: 'Central Campus Grounds',
    organizer: 'Cultural Board',
    category: 'Cultural',
    registration_deadline: '2027-01-14',
    max_attendees: 3000,
    registered_attendees: 2450,
    status: 'upcoming'
  },
  {
    event_code: 'EVT-2027-010',
    name: 'Inter-College Gaming Championship',
    description: 'Live esports LAN party, Valorant final brackets, and virtual reality motion racing rigs.',
    banner_image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    event_date: '2027-01-20',
    start_time: '11:00 AM',
    end_time: '08:00 PM',
    venue: 'Esports Arena, Recreation Center',
    organizer: 'Gaming & Anime Club',
    category: 'Gaming',
    registration_deadline: '2027-01-19',
    max_attendees: 500,
    registered_attendees: 480,
    status: 'upcoming'
  },
  {
    event_code: 'EVT-2027-011',
    name: 'Collegiate Fashion Runway Show',
    description: 'Avant-garde sustainable student fashion collections presented with live electronic soundscapes.',
    banner_image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    event_date: '2027-01-25',
    start_time: '06:00 PM',
    end_time: '09:30 PM',
    venue: 'Design Center Grand Auditorium',
    organizer: 'Fashion & Textile Design Society',
    category: 'Fashion',
    registration_deadline: '2027-01-24',
    max_attendees: 400,
    registered_attendees: 360,
    status: 'upcoming'
  },
  {
    event_code: 'EVT-2027-012',
    name: 'Entrepreneurship & VC Workshop',
    description: 'Interactive masterclass on term sheets, venture mechanics, customer discovery, and YC application prep.',
    banner_image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80',
    event_date: '2027-02-02',
    start_time: '02:00 PM',
    end_time: '06:00 PM',
    venue: 'Management Seminar Hall 1',
    organizer: 'Venture Incubation Cell',
    category: 'Startup',
    registration_deadline: '2027-02-01',
    max_attendees: 250,
    registered_attendees: 195,
    status: 'upcoming'
  },
  {
    event_code: 'EVT-2027-013',
    name: 'Valentine’s Campus Fest & Open Mic',
    description: 'Poetry slams, comedy roast battles, acoustic love song medleys, and artisan food stalls.',
    banner_image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    event_date: '2027-02-10',
    start_time: '05:00 PM',
    end_time: '10:00 PM',
    venue: 'Rose Garden Amphitheatre',
    organizer: 'Literary & Fine Arts Club',
    category: 'Cultural',
    registration_deadline: '2027-02-09',
    max_attendees: 700,
    registered_attendees: 560,
    status: 'upcoming'
  },
  {
    event_code: 'EVT-2027-014',
    name: 'AI & Robotics National Expo',
    description: 'Robotic bipedal demonstrations, computer vision drone inspections, and keynote talks by industry scientists.',
    banner_image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    event_date: '2027-02-15',
    start_time: '09:00 AM',
    end_time: '06:00 PM',
    venue: 'Exhibition Pavilion, Block C',
    organizer: 'Robotics Engineering Council',
    category: 'Technology',
    registration_deadline: '2027-02-14',
    max_attendees: 1000,
    registered_attendees: 780,
    status: 'upcoming'
  },
  {
    event_code: 'EVT-2027-015',
    name: 'Spring Indie Music Festival',
    description: 'Multi-stage festival celebrating indie rock, lo-fi beats, classical fusion, and campus DJs.',
    banner_image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
    event_date: '2027-02-20',
    start_time: '04:00 PM',
    end_time: '11:00 PM',
    venue: 'Lakeside Lawns',
    organizer: 'Music Society & Radio Club',
    category: 'Music',
    registration_deadline: '2027-02-19',
    max_attendees: 1500,
    registered_attendees: 1120,
    status: 'upcoming'
  },
  {
    event_code: 'EVT-2027-016',
    name: 'National Inter-Varsity Sports Championship',
    description: 'Track and field, swimming, volleyball, and tennis finals between collegiate champions.',
    banner_image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
    event_date: '2027-03-01',
    start_time: '08:30 AM',
    end_time: '06:30 PM',
    venue: 'Olympic Sports Complex',
    organizer: 'Sports Authority & Student Board',
    category: 'Sports',
    registration_deadline: '2027-02-28',
    max_attendees: 1200,
    registered_attendees: 890,
    status: 'upcoming'
  },
  {
    event_code: 'EVT-2027-017',
    name: 'Creator Networking & Brand Deal Day',
    description: 'Speed networking between top campus influencers and talent scouts from major digital agencies.',
    banner_image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
    event_date: '2027-03-10',
    start_time: '10:00 AM',
    end_time: '05:00 PM',
    venue: 'Executive Convention Center',
    organizer: 'CampusBuzz & Brand Partners',
    category: 'Networking',
    registration_deadline: '2027-03-09',
    max_attendees: 300,
    registered_attendees: 270,
    status: 'upcoming'
  },
  {
    event_code: 'EVT-2027-018',
    name: 'Collegiate Startup Demo Day & Exhibition',
    description: '30 student tech startups showcase live hardware prototypes, SaaS products, and mobile apps to 1,000+ visitors.',
    banner_image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
    event_date: '2027-03-20',
    start_time: '10:00 AM',
    end_time: '06:00 PM',
    venue: 'Grand Exhibition Hall',
    organizer: 'Campus Incubator & E-Cell',
    category: 'Startup',
    registration_deadline: '2027-03-19',
    max_attendees: 800,
    registered_attendees: 620,
    status: 'upcoming'
  },
  {
    event_code: 'EVT-2027-019',
    name: 'Campus Sustainability & Climate Action Week',
    description: 'Workshops on carbon footprint reduction, zero-single-use plastics, circular economy, and tree planting.',
    banner_image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    event_date: '2027-04-05',
    start_time: '09:00 AM',
    end_time: '04:00 PM',
    venue: 'Green Botanical Gardens & Quad',
    organizer: 'Eco Warriors Club & NSS',
    category: 'Sustainability',
    registration_deadline: '2027-04-04',
    max_attendees: 600,
    registered_attendees: 440,
    status: 'upcoming'
  },
  {
    event_code: 'EVT-2027-020',
    name: 'Campus Influencer Awards 2027 Gala',
    description: 'Prestigious red-carpet ceremony awarding the Year’s Best Collegiate Creators across Tech, Fashion, Music, and Gaming.',
    banner_image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
    event_date: '2027-04-15',
    start_time: '06:00 PM',
    end_time: '11:00 PM',
    venue: 'Grand University Auditorium',
    organizer: 'CampusBuzz Central Board',
    category: 'Awards',
    registration_deadline: '2027-04-14',
    max_attendees: 1000,
    registered_attendees: 890,
    status: 'upcoming'
  }
];

// --------------------------------------------------------------------------
// MAIN GENERATOR ROUTINE
// --------------------------------------------------------------------------
async function generateData() {
  console.log('🚀 Starting Large-scale CampusBuzz Dataset Generation...');

  const host = process.env.MYSQL_HOST || 'localhost';
  const user = process.env.MYSQL_USER || 'root';
  const password = process.env.MYSQL_PASSWORD || '';
  const database = process.env.MYSQL_DATABASE || 'campusbuzz_db';
  const port = parseInt(process.env.MYSQL_PORT || '3306', 10);

  const conn = await mysql.createConnection({ host, user, password, database, port });
  console.log('Connected to MySQL database:', database);

  // Clear previous runs
  await conn.query('SET FOREIGN_KEY_CHECKS = 0');
  await conn.query('TRUNCATE TABLE students');
  await conn.query('TRUNCATE TABLE posts');
  await conn.query('TRUNCATE TABLE campaigns');
  await conn.query('TRUNCATE TABLE events');
  await conn.query('TRUNCATE TABLE post_comments');
  await conn.query('TRUNCATE TABLE event_registrations');
  await conn.query('TRUNCATE TABLE campaign_applications');
  await conn.query('SET FOREIGN_KEY_CHECKS = 1');

  // Seed Colleges & Departments
  console.log('Inserting Colleges & Departments...');
  for (const c of colleges) {
    await conn.query(
      `INSERT IGNORE INTO colleges (name, code, city, state) VALUES (?, ?, ?, ?)`,
      [c.name, c.code, c.city, c.state]
    );
  }

  for (const dept of departments) {
    await conn.query(
      `INSERT IGNORE INTO departments (name, code) VALUES (?, ?)`,
      [dept, dept.substring(0, 4).toUpperCase()]
    );
  }

  // 1. Generate 10,200 Students
  const TOTAL_STUDENTS = 10200;
  console.log(`Generating ${TOTAL_STUDENTS} unique student records...`);

  // Shared salt hash for ultra-fast creation
  const defaultHash = bcrypt.hashSync('password123', 6);

  // We write CSV for export
  const studentsCsvStream = fs.createWriteStream(path.join(CSV_DIR, 'students.csv'), { encoding: 'utf8' });
  studentsCsvStream.write('id,student_id,full_name,email,username,college_name,department_name,course,semester,year,creator_category,followers_count,engagement_rate\n');

  const studentBatchSize = 500;
  let studentRows = [];

  // Seed demo hero accounts as the first records
  const heroStudents = [
    {
      student_id: 'CB-2026-00001',
      full_name: 'Aanya Sharma',
      email: 'aanya@campus.edu',
      username: 'aanya.sharma',
      college_name: 'Delhi University',
      department_name: 'Media & Mass Communication',
      course: 'BA Journalism',
      semester: 5,
      year: 3,
      bio: 'Lifestyle, aesthetic campus fashion, and creative storytelling across college campuses in Delhi NCR.',
      instagram: 'aanya.sharmaa',
      youtube: 'AanyaSharmaVlogs',
      linkedin: 'aanya-sharma-media',
      creator_category: 'Lifestyle',
      followers_count: 24800,
      engagement_rate: 4.80,
      profile_photo: avatars[0],
      role: 'creator'
    },
    {
      student_id: 'CB-2026-00002',
      full_name: 'Arjun Mehta',
      email: 'arjun@iitb.ac.in',
      username: 'arjun.tech',
      college_name: 'IIT Bombay',
      department_name: 'Computer Science & Engineering',
      course: 'B.Tech CSE',
      semester: 7,
      year: 4,
      bio: 'Hardware hacks, AI experiments, developer life, and tech teardowns for future engineers.',
      instagram: 'arjun.tech',
      youtube: 'ArjunMehtaTech',
      linkedin: 'arjun-mehta-iitb',
      creator_category: 'Technology',
      followers_count: 21300,
      engagement_rate: 4.10,
      profile_photo: avatars[1],
      role: 'creator'
    },
    {
      student_id: 'CB-2026-00003',
      full_name: 'Riya Patel',
      email: 'riya@nift.ac.in',
      username: 'riya.stylez',
      college_name: 'NIFT Delhi',
      department_name: 'Fashion & Apparel Design',
      course: 'B.Des Fashion Design',
      semester: 4,
      year: 2,
      bio: 'Sustainable campus fits, styling thrifted vintage gear, and fashion runway vlogs.',
      instagram: 'riya.stylez',
      youtube: 'RiyaPatelFashion',
      linkedin: 'riya-patel-design',
      creator_category: 'Fashion',
      followers_count: 18900,
      engagement_rate: 3.80,
      profile_photo: avatars[2],
      role: 'creator'
    },
    {
      student_id: 'CB-2026-00004',
      full_name: 'Admin Karan',
      email: 'admin@campusbuzz.com',
      username: 'admin.karan',
      college_name: 'Delhi University',
      department_name: 'Computer Science & Engineering',
      course: 'M.Tech AI & Data Science',
      semester: 3,
      year: 2,
      bio: 'CampusBuzz platform administrator and collegiate network manager.',
      instagram: 'campusbuzz.hq',
      youtube: 'CampusBuzzOfficial',
      linkedin: 'karan-campusbuzz',
      creator_category: 'Technology',
      followers_count: 15000,
      engagement_rate: 5.00,
      profile_photo: avatars[9],
      role: 'admin'
    }
  ];

  for (let i = 1; i <= TOTAL_STUDENTS; i++) {
    let student;
    if (i <= heroStudents.length) {
      student = heroStudents[i - 1];
    } else {
      const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
      const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
      const fullName = `${fn} ${ln}`;
      const codeNum = String(i).padStart(5, '0');
      const studentId = `CB-2026-${codeNum}`;
      const username = `${fn.toLowerCase()}.${ln.toLowerCase()}_${codeNum}`;
      const email = `${fn.toLowerCase()}.${ln.toLowerCase()}.${codeNum}@campus.edu`;
      const college = colleges[Math.floor(Math.random() * colleges.length)].name;
      const dept = departments[Math.floor(Math.random() * departments.length)];
      const courses = departmentCourseMap[dept];
      const course = courses[Math.floor(Math.random() * courses.length)];
      const semester = Math.floor(Math.random() * 8) + 1;
      const year = Math.ceil(semester / 2);
      const category = categories[Math.floor(Math.random() * categories.length)];
      const followers = Math.floor(Math.random() * 25000) + 400;
      const engRate = (Math.random() * 4 + 2.1).toFixed(2);
      const photo = avatars[i % avatars.length];

      student = {
        student_id: studentId,
        full_name: fullName,
        email: email,
        username: username,
        college_name: college,
        department_name: dept,
        course: course,
        semester: semester,
        year: year,
        bio: `${category} enthusiast & ${course} student at ${college}. Documenting collegiate journeys on CampusBuzz.`,
        instagram: `${username}_official`,
        youtube: `${fn}${ln}Vlogs`,
        linkedin: `${fn.toLowerCase()}-${ln.toLowerCase()}-${i}`,
        creator_category: category,
        followers_count: followers,
        engagement_rate: parseFloat(engRate),
        profile_photo: photo,
        role: followers > 5000 ? 'creator' : 'student'
      };
    }

    studentsCsvStream.write(`"${i}","${student.student_id}","${student.full_name}","${student.email}","${student.username}","${student.college_name}","${student.department_name}","${student.course}","${student.semester}","${student.year}","${student.creator_category}","${student.followers_count}","${student.engagement_rate}"\n`);

    studentRows.push([
      student.student_id,
      student.full_name,
      student.email,
      student.username,
      defaultHash,
      student.profile_photo,
      student.college_name,
      student.department_name,
      student.course,
      student.semester,
      student.year,
      student.bio,
      student.instagram,
      student.youtube,
      student.linkedin,
      student.creator_category,
      student.followers_count,
      student.engagement_rate,
      'active',
      true,
      student.role
    ]);

    if (studentRows.length >= studentBatchSize || i === TOTAL_STUDENTS) {
      await conn.query(
        `INSERT IGNORE INTO students 
         (student_id, full_name, email, username, password_hash, profile_photo, college_name, department_name, course, semester, year, bio, instagram, youtube, linkedin, creator_category, followers_count, engagement_rate, account_status, is_creator, role) 
         VALUES ?`,
        [studentRows]
      );
      process.stdout.write(`\rInserted students: ${i} / ${TOTAL_STUDENTS}`);
      studentRows = [];
    }
  }

  studentsCsvStream.end();
  console.log('\n✅ 10,200 Students inserted & CSV generated.');

  // 2. Insert 15 Campaigns
  console.log('\nInserting 15 Campaigns...');
  for (const camp of campaignsData) {
    await conn.query(
      `INSERT IGNORE INTO campaigns 
       (campaign_code, name, brand_name, description, image_url, budget, rewards, target_audience, required_category, application_deadline, start_date, end_date, status, applicants_count)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        camp.campaign_code, camp.name, camp.brand_name, camp.description, camp.image_url,
        camp.budget, camp.rewards, camp.target_audience, camp.required_category,
        camp.application_deadline, camp.start_date, camp.end_date, camp.status,
        Math.floor(Math.random() * 45) + 12
      ]
    );
  }
  console.log('✅ 15 Campaigns inserted.');

  // 3. Insert 20 Upcoming Events (All after Dec 10, 2026)
  console.log('\nInserting 20 Upcoming Events (All scheduled after Dec 10, 2026)...');
  for (const ev of eventsData) {
    await conn.query(
      `INSERT IGNORE INTO events
       (event_code, name, description, banner_image, event_date, start_time, end_time, venue, organizer, category, registration_deadline, max_attendees, registered_attendees, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        ev.event_code, ev.name, ev.description, ev.banner_image, ev.event_date,
        ev.start_time, ev.end_time, ev.venue, ev.organizer, ev.category,
        ev.registration_deadline, ev.max_attendees, ev.registered_attendees, ev.status
      ]
    );
  }
  console.log('✅ 20 Events inserted.');

  // 4. Generate 5,200 Realistic Social Posts
  const TOTAL_POSTS = 5200;
  console.log(`\nGenerating ${TOTAL_POSTS} Social Posts...`);

  const postsCsvStream = fs.createWriteStream(path.join(CSV_DIR, 'posts.csv'), { encoding: 'utf8' });
  postsCsvStream.write('id,author_id,post_type,content,media_url,hashtags,likes_count,comments_count\n');

  const postTypes = ['image', 'text', 'reel', 'campus_activity', 'event_announcement', 'campaign_promo', 'achievement', 'collaboration'];
  let postRows = [];
  const postBatchSize = 500;

  for (let p = 1; p <= TOTAL_POSTS; p++) {
    // Pick author from the first 500 active creators/students
    const authorId = Math.floor(Math.random() * 450) + 1;
    const postType = postTypes[Math.floor(Math.random() * postTypes.length)];
    const content = postContentTemplates[Math.floor(Math.random() * postContentTemplates.length)];
    const media = postType === 'text' ? null : postMedia[p % postMedia.length];
    const tags = hashtagsList[p % hashtagsList.length];
    const likes = Math.floor(Math.random() * 450) + 15;
    const comments = Math.floor(Math.random() * 65) + 3;
    const shares = Math.floor(Math.random() * 25) + 1;

    // Random date over past 30 days
    const daysAgo = Math.floor(Math.random() * 30);
    const postDate = new Date(Date.now() - daysAgo * 86400000).toISOString().slice(0, 19).replace('T', ' ');

    postsCsvStream.write(`"${p}","${authorId}","${postType}","${content.replace(/"/g, '""')}","${media || ''}","${tags}","${likes}","${comments}"\n`);

    postRows.push([
      authorId,
      postType,
      content,
      media,
      tags,
      likes,
      comments,
      shares,
      postDate
    ]);

    if (postRows.length >= postBatchSize || p === TOTAL_POSTS) {
      await conn.query(
        `INSERT IGNORE INTO posts 
         (author_id, post_type, content, media_url, hashtags, likes_count, comments_count, shares_count, created_at)
         VALUES ?`,
        [postRows]
      );
      process.stdout.write(`\rInserted posts: ${p} / ${TOTAL_POSTS}`);
      postRows = [];
    }
  }

  postsCsvStream.end();
  console.log('\n✅ 5,200 Posts inserted & CSV generated.');

  // 5. Generate Interactions (Comments, Likes, Applications, Registrations)
  console.log('\nGenerating initial post comments and event registrations...');

  // Sample comments
  const sampleComments = [
    'Incredible work! The production quality on this is unreal 🔥',
    'Loved the insight on campus timeboxing, super helpful for exams.',
    'So proud of our college creators! Keep dominating the feed 🚀',
    'Are registration seats still open for this meetup?',
    'Vibe is immaculate. Can’t wait for the winter tech fest!',
    'Great camera framing here, what lens did you shoot this on?',
    'Just applied for the campus ambassador cohort!'
  ];

  for (let c = 1; c <= 30; c++) {
    const postId = (c % 20) + 1;
    const studentId = (c % 15) + 1;
    const text = sampleComments[c % sampleComments.length];
    await conn.query(
      `INSERT IGNORE INTO post_comments (post_id, student_id, comment_text) VALUES (?, ?, ?)`,
      [postId, studentId, text]
    );
  }

  // Pre-seed some event registrations
  for (let r = 1; r <= 40; r++) {
    const eventId = (r % 15) + 1;
    const studentId = (r % 30) + 1;
    await conn.query(
      `INSERT IGNORE INTO event_registrations (event_id, student_id) VALUES (?, ?)`,
      [eventId, studentId]
    );
  }

  // Pre-seed some campaign applications
  for (let a = 1; a <= 25; a++) {
    const campId = (a % 12) + 1;
    const studentId = (a % 20) + 1;
    await conn.query(
      `INSERT IGNORE INTO campaign_applications (campaign_id, student_id, portfolio_link, pitch_note, status) VALUES (?, ?, ?, ?, ?)`,
      [
        campId,
        studentId,
        'https://instagram.com/creator',
        'Experienced student creator with high engagement in campus lifestyle & tech.',
        a % 3 === 0 ? 'approved' : 'pending'
      ]
    );
  }

  // Activity logs
  for (let act = 1; act <= 15; act++) {
    const sId = (act % 10) + 1;
    await conn.query(
      `INSERT IGNORE INTO student_activities (student_id, action_type, description, target_url) VALUES (?, ?, ?, ?)`,
      [sId, 'post_created', 'Published a new media update on campus feed', '/feed']
    );
  }

  console.log('✅ Interactions, comments, and applications seeded.');

  // Verification counts
  const [[studentCount]] = await conn.query('SELECT COUNT(*) as c FROM students');
  const [[postsCount]] = await conn.query('SELECT COUNT(*) as c FROM posts');
  const [[campaignsCount]] = await conn.query('SELECT COUNT(*) as c FROM campaigns');
  const [[eventsCount]] = await conn.query('SELECT COUNT(*) as c FROM events');

  console.log('\n=============================================');
  console.log('🎉 DATASET GENERATION SUMMARY:');
  console.log(`- Total Students in Database: ${studentCount.c.toLocaleString()}`);
  console.log(`- Total Posts in Database:    ${postsCount.c.toLocaleString()}`);
  console.log(`- Total Campaigns:            ${campaignsCount.c}`);
  console.log(`- Total Events:               ${eventsCount.c}`);
  console.log('=============================================\n');

  await conn.end();
}

generateData().catch(err => {
  console.error('Fatal error during data generation:', err);
  process.exit(1);
});
