# CampusBuzz — Large-Scale Dataset Import & Setup Guide

This project includes a production-grade, relational dataset containing **10,200+ Students**, **5,200+ Social Posts**, **15 Campaigns**, and **20+ Events (all scheduled AFTER December 10, 2026)**.

---

## 📁 Dataset Files Location
* **MySQL Schema**: [`backend/schema_v2.sql`](file:///Users/ranjankumar/Downloads/campussbuzz%202/backend/schema_v2.sql)
* **Automated Generator Script**: [`backend/scripts/generate_large_dataset.js`](file:///Users/ranjankumar/Downloads/campussbuzz%202/backend/scripts/generate_large_dataset.js)
* **CSV Files Directory**: `backend/data/csv/`
  * `students.csv` (10,200 records with Student IDs, Emails, Courses, Semesters, Social handles)
  * `posts.csv` (5,200 records with media URLs, hashtags, likes, comments, author IDs)
  * `campaigns.csv` (15 brand campaigns)
  * `events.csv` (20 upcoming events scheduled Dec 11, 2026 through April 2027)

---

## ⚡ Option 1: Automated Node.js Seeder (Recommended & Fastest)

Ensure MySQL is running, then run:
```bash
cd backend
node scripts/generate_large_dataset.js
node scripts/export_csvs.js
```
* Execution time: **~35 seconds** for all 10,200+ students and 5,200+ posts.

---

## 🗄️ Option 2: MySQL CLI Direct Import via SQL / CSV

1. **Initialize the Schema**:
```bash
mysql -u root campusbuzz_db < backend/schema_v2.sql
```

2. **Import via LOAD DATA INFILE**:
```sql
USE campusbuzz_db;

-- Import Students
LOAD DATA LOCAL INFILE 'backend/data/csv/students.csv'
INTO TABLE students
FIELDS TERMINATED BY ',' ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES;

-- Import Posts
LOAD DATA LOCAL INFILE 'backend/data/csv/posts.csv'
INTO TABLE posts
FIELDS TERMINATED BY ',' ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES;
```

---

## 🔑 Demo Accounts for University Testing

| Name | Role | Email | Password | Student ID | College |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Aanya Sharma** | Student Creator | `aanya@campus.edu` | `password123` | `CB-2026-00001` | Delhi University |
| **Arjun Mehta** | Tech Creator | `arjun@iitb.ac.in` | `password123` | `CB-2026-00002` | IIT Bombay |
| **Riya Patel** | Fashion Creator | `riya@nift.ac.in` | `password123` | `CB-2026-00003` | NIFT Delhi |
| **Admin Karan** | Superadmin | `admin@campusbuzz.com` | `adminpassword` | `CB-2026-00004` | Central HQ |
