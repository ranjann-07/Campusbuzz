# 🎓 CampusBuzz — Collegiate Creator & Influencer Management Platform

<div align="center">

![CampusBuzz Logo](frontend/public/campusbuzz-logo-dark.png#gh-dark-mode-only)
![CampusBuzz Logo](frontend/public/campusbuzz-logo-light.png#gh-light-mode-only)

**CONNECT · CREATE · COLLABORATE**

*India's Premier Collegiate Creator Network, Brand Sponsorship Escrow & Campus Community Hub*

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.11-FF0055?logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Node.js](https://img.shields.io/badge/Node.js-Express_4-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)

[Explore Dashboard](http://localhost:3000/) • [API Endpoints](#-api-endpoints-reference) • [Quick Setup](#-quick-start-guide) • [Network Sharing](#-opening-on-another-laptop--mobile-device)

</div>

---

## 📌 Table of Contents
1. [Overview](#-overview)
2. [Key Features](#-key-features)
3. [System Architecture & Folder Structure](#-system-architecture--folder-structure)
4. [Tech Stack](#-tech-stack)
5. [Quick Start Guide](#-quick-start-guide)
6. [Opening on Another Laptop / Mobile Device](#-opening-on-another-laptop--mobile-device)
7. [Demo Accounts](#-demo-accounts)
8. [API Endpoints Reference](#-api-endpoints-reference)
9. [Database Schema Overview](#-database-schema-overview)

---

## 🌟 Overview

**CampusBuzz** is a full-stack, enterprise-grade creator management and university community ecosystem built specifically for collegiate creators, student society leaders, and industry brands.

The platform unifies creator discovery, sponsorship matching, real-time social engagement, and verified event registration across premier Indian universities (including **Shoolini University, Delhi University, IIT Bombay, NIFT Delhi, BITS Pilani, Christ University, Ashoka University**, and more).

---

## ✨ Key Features

### 1. 🤖 Interactive Robot Mascot on Login & Auth
- **Physics-driven eye-tracking**: The mascot's pupils actively follow your cursor and blink naturally.
- **Interactive expression states**: Tracks input length, reacts with happy expressions on password completion, and exhibits charming idle curiosity.
- **Role switcher**: Quick tab transition between Collegiate Student and Brand / Campus Admin roles.

### 2. 👥 Student Creator Directory (10,200+ Verified Profiles)
- **Searchable Database**: Instant search by Student ID (e.g. `CB-2026-00001`), full name, username, or department.
- **Multi-University Filters**: Easily filter by university chapters including **Shoolini University (781 verified creators)**, Delhi University, IIT Bombay, etc.
- **Authentic Photographic Profiles**: High-resolution studio portraits for top creators (e.g. *Shivani Negi, Kriti Bhatt, Sneha Saxena, Arjun Mehta*).
- **Direct `[ 👁️ View ]` Drawer**: Instant slide-out detail drawer showcasing creator bio, analytics, verified badges, and live feeds.

### 3. 🧠 AI Influencer Match Engine
- **Algorithmic Alignment Score (0–100)**: Evaluates engagement rate, collegiate reach, category synergy, and verified brand safety.
- **Instant Pitch Alignment**: Actionable insights into follower tiers, reach metrics, and top-matching creators.

### 4. 📅 Upcoming Campus Events (Post-Dec 10, 2026)
- **20+ Scheduled Collegiate Events**: Fests, hackathons, robotics expos, and esports tournaments.
- **Dual View Modes**: Switch between immersive Card Grid and an Interactive Timeline Calendar.
- **Real-Time Seat RSVP**: Instant registration toggles with celebratory particle animations.

### 5. 📢 Live Collegiate Social Feed (5,200+ Posts)
- **Interactive Feed**: Student creators share media, video reels, announcements, and festival coverage.
- **Engagement Interactions**: Real-time post likes, threaded comments, shares, and hashtag filters.
- **Direct Publishing**: Post creator updates directly to your university chapter.

### 6. 💼 Brand Sponsorships & Escrow Campaigns
- **Active Brand Campaigns**: Sponsored creator briefs from Red Bull, Spotify, OnePlus, Notion, Canon, etc.
- **Clear Stipends & Escrow Tracking**: Transparent rewards (₹15,000 - ₹40,000 stipends + gear grants) and deliverables checklists.

### 7. 🌗 Universal Light Mode & Dark Mode System
- **WCAG AA/AAA Contrast**: High-contrast, crystal-clear typography across all tables, banners, cards, and modal dialogs.
- **Adaptive Brand Logos**: Clean transparent logos dynamically swapped for Dark and Light backgrounds.
- **Global Theme Persistence**: Preserved in `localStorage` across page reloads.

### 8. 🧭 Seamless Navigation & Scroll-to-Top
- **Global Sidebar Drawer**: Accessible from any view via the `[ ☰ Sidebar ]` button.
- **Zero-Disruption Navigation**: Clicking any tab or button automatically scrolls smoothly to the top (`window.scrollTo(0, 0)`).

---

## 🏗️ System Architecture & Folder Structure

```
campussbuzz/
├── .gitignore                     # Git ignore rules for node_modules, build & env
├── package.json                   # Root workspace management script
├── README.md                      # Comprehensive project documentation
├── IMPORT_INSTRUCTIONS.md         # Database seeding and CSV import documentation
│
├── backend/                       # Express.js REST API & MySQL Server
│   ├── .env                       # Local environment variables
│   ├── .env.example               # Environment template for deployment
│   ├── package.json               # Backend dependencies
│   ├── server.js                  # Main Express server and REST endpoints
│   ├── schema.sql                 # Base MySQL database schema
│   ├── schema_v2.sql              # Production schema (students, posts, events, campaigns)
│   ├── config/
│   │   ├── db.js                  # MySQL connection pool configuration
│   │   └── seedData.js            # Initial dataset definitions
│   ├── data/
│   │   ├── local_db.json          # File-based database fallback
│   │   └── csv/                   # Exported relational CSV datasets
│   │       ├── students.csv       # 10,200 student records
│   │       ├── posts.csv          # 5,200 social posts
│   │       ├── events.csv         # 20 upcoming events
│   │       └── campaigns.csv      # 15 active brand campaigns
│   └── scripts/
│       ├── generate_large_dataset.js  # Seeder for 10K+ students & 5K+ posts
│       ├── restore_real_photos.js     # Real photography mapper for creators
│       ├── diversify_followers.js     # Engagement distribution script
│       └── export_csvs.js             # CSV dataset generator
│
└── frontend/                      # React 18 + Vite 6 Single Page Application
    ├── index.html                 # HTML entry point with Plus Jakarta Sans fonts
    ├── vite.config.js             # Vite configuration with 0.0.0.0 host & API proxy
    ├── tailwind.config.js         # Tailwind theme & custom colors
    ├── postcss.config.js          # PostCSS configuration
    ├── package.json               # Frontend dependencies
    ├── public/                    # Static assets & brand logos
    │   ├── campusbuzz-logo-dark.png   # Crisp white logo for Dark Mode
    │   └── campusbuzz-logo-light.png  # Dark typography logo for Light Mode
    └── src/
        ├── main.jsx               # React DOM entry point
        ├── App.jsx                # Global router and toast provider
        ├── index.css              # Glassmorphism, animations & Light/Dark mode CSS
        ├── context/
        │   └── AppContext.jsx     # Global theme, auth & database state store
        ├── components/
        │   ├── Navbar.jsx                 # Top navigation with theme switch & user menu
        │   ├── GlobalSidebarDrawer.jsx    # Universal collapsible sidebar
        │   ├── InteractiveRobotMascot.jsx # Eye-tracking animated 3D robot
        │   ├── DetailDrawer.jsx           # Slide-out creator profile & live feed
        │   ├── EngagementChart.jsx        # Interactive SVG analytics curve
        │   ├── InteractiveCalendar.jsx    # Event calendar with date dots
        │   ├── MatchScoreModal.jsx        # AI Influencer match breakdown modal
        │   ├── AddCreatorModal.jsx        # Student creator registration form
        │   ├── CreateEventModal.jsx       # Event organizer creation modal
        │   └── CreateCampaignModal.jsx    # Brand campaign brief modal
        └── views/
            ├── DashboardOverview.jsx      # Main creator & analytics command centre
            ├── DashboardLayout.jsx        # Sidebar + Header frame wrapper
            ├── CreatorsModule.jsx         # 10,200+ student creator directory
            ├── EventsModule.jsx           # Upcoming campus events & RSVP
            ├── CampaignsModule.jsx        # Brand sponsorships & creator rewards
            ├── SocialFeed.jsx             # Collegiate social feed with comments
            ├── LeaderboardModule.jsx      # Top network creator rankings
            ├── ClubsModule.jsx            # University societies & club directory
            ├── LoginPage.jsx              # Robot mascot authentication page
            └── LandingPage.jsx            # Public promotional landing page
```

---

## 💻 Tech Stack

| Domain | Technology | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18 | Declarative component architecture |
| **Build Tool** | Vite 6 | Lightning-fast HMR and bundle compilation |
| **Styling** | Tailwind CSS 3 | Utility-first responsive design with custom glassmorphism |
| **Animations** | Framer Motion 11 | Fluid gestures, spring transitions & micro-interactions |
| **Icons** | Lucide React | Modern, clean vector icon collection |
| **Backend Framework** | Node.js / Express 4 | High-performance RESTful API service |
| **Database** | MySQL 8.0+ | Relational storage for 10K+ students, posts, events & campaigns |
| **Driver** | `mysql2/promise` | Connection pooling with async/await query execution |

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.0 or higher)
- [MySQL Server](https://www.mysql.com/) (version 8.0 or higher, running on port 3306)

---

### Step 1: Database Setup
1. Start your local MySQL service.
2. Create the database:
   ```sql
   CREATE DATABASE IF NOT EXISTS campusbuzz_db;
   ```
3. Initialize the schema and generate the dataset:
   ```bash
   cd backend
   node scripts/generate_large_dataset.js
   ```
   *(Populates 10,200+ student creators, 5,200+ posts, 20+ events, and 15 campaigns in ~30 seconds).*

---

### Step 2: Start the Backend Server
1. From the `backend` folder:
   ```bash
   npm install
   npm start
   ```
2. The server will launch on **`http://localhost:5001/`**.
3. Verify server health:
   ```bash
   curl http://localhost:5001/api/health
   ```

---

### Step 3: Start the Frontend Application
1. In a new terminal window, navigate to the `frontend` folder:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
2. The application will start at **`http://localhost:3000/`**.
3. Open your browser and navigate to **[http://localhost:3000/](http://localhost:3000/)**.

---

## 📡 Opening on Another Laptop / Mobile Device

You can easily open and test CampusBuzz on another laptop, tablet, or phone without deploying to the cloud:

### Method 1: Same Wi-Fi Network (Local Area Network)
1. Make sure both devices are connected to the **same Wi-Fi router or phone mobile hotspot**.
2. Find your host laptop's local IP address (e.g. `192.168.1.41`).
3. Open the browser on the other laptop and enter:
   ```
   http://192.168.1.41:3000/
   ```
4. *Vite is pre-configured with `host: '0.0.0.0'` and proxies all `/api` requests automatically.*

### Method 2: Over the Internet (Remote Tunneling)
If the other device is in a different location or on a different internet network:
```bash
npx localtunnel --port 3000
```
This generates a live public URL (e.g. `https://cool-buzz-99.loca.lt`) that anyone can open anywhere.

---

## 🔑 Demo Accounts

Use any of these pre-configured university accounts to test different roles and permissions:

| Name | Role | Email | Password | Student ID | University |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Aanya Sharma** | Collegiate Creator | `aanya@campus.edu` | `password123` | `CB-2026-00001` | Delhi University |
| **Arjun Mehta** | Tech Creator | `arjun@iitb.ac.in` | `password123` | `CB-2026-00002` | IIT Bombay |
| **Riya Patel** | Fashion Creator | `riya@nift.ac.in` | `password123` | `CB-2026-00003` | NIFT Delhi |
| **Admin Karan** | Superadmin | `admin@campusbuzz.com` | `adminpassword` | `CB-2026-00004` | Central HQ |

---

## 🔌 API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health status and uptime |
| `GET` | `/api/dashboard/stats` | Top-level counts, trending creators, events, campaigns & spotlight |
| `GET` | `/api/students` | Paginated creators (supports `search`, `college`, `category`, `sort`, `page`) |
| `POST` | `/api/students` | Register a new student creator |
| `GET` | `/api/posts` | Paginated social feed posts |
| `POST` | `/api/posts` | Publish a new creator post |
| `POST` | `/api/posts/:id/like` | Toggle like on a post |
| `POST` | `/api/posts/:id/comments` | Post a comment on a post |
| `GET` | `/api/events` | List all upcoming events (filter by `category`, `status`) |
| `POST` | `/api/events/:id/register` | RSVP / Register seat for an event |
| `POST` | `/api/events/:id/unregister` | Cancel event registration |
| `GET` | `/api/campaigns` | List active brand campaigns |
| `POST` | `/api/campaigns` | Submit new brand campaign |
| `GET` | `/api/clubs` | List university societies & clubs |
| `POST` | `/api/clubs/:id/join` | Join a student club |

---

## 🗃️ Database Schema Overview

```sql
students       -- 10,200+ Collegiate creator profiles, universities, follower counts & photos
posts          -- 5,200+ Campus feed updates, media attachments, likes & comment counters
post_comments  -- Threaded student comments on social posts
events         -- Upcoming campus events scheduled after Dec 10, 2026 with capacity limits
event_rsvps    -- Student registrations and ticket badges for events
campaigns      -- Brand sponsorship escrow briefs, deliverables, stipends & applications
clubs          -- Campus societies (cultural, technical, sports, dance, robotics)
users          -- Authentication credentials and RBAC roles (creator, admin, sponsor)
```

---

<div align="center">

**Built with ❤️ for collegiate creators and student communities.**  
*© 2026 CampusBuzz Inc. All rights reserved.*

</div>
