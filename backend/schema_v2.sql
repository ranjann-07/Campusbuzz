-- CampusBuzz Scalable Relational Database Schema v2
CREATE DATABASE IF NOT EXISTS campusbuzz_db;
USE campusbuzz_db;

SET FOREIGN_KEY_CHECKS = 0;

-- Drop dependent tables to ensure clean v2 schema
DROP TABLE IF EXISTS event_registrations;
DROP TABLE IF EXISTS campaign_applications;
DROP TABLE IF EXISTS post_comments;
DROP TABLE IF EXISTS post_likes;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS campaigns;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS student_activities;

SET FOREIGN_KEY_CHECKS = 1;

-- 1. Colleges
CREATE TABLE IF NOT EXISTS colleges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE,
    code VARCHAR(20) NOT NULL UNIQUE,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Departments
CREATE TABLE IF NOT EXISTS departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    college_id INT NULL,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE SET NULL
);

-- 3. Students / Accounts (10,000+ records)
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(30) NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    username VARCHAR(80) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    profile_photo VARCHAR(500) NOT NULL,
    college_name VARCHAR(150) NOT NULL,
    department_name VARCHAR(150) NOT NULL,
    course VARCHAR(100) NOT NULL,
    semester INT NOT NULL DEFAULT 1,
    year INT NOT NULL DEFAULT 1,
    bio TEXT,
    instagram VARCHAR(100),
    youtube VARCHAR(100),
    linkedin VARCHAR(150),
    creator_category VARCHAR(80) NOT NULL,
    followers_count INT NOT NULL DEFAULT 0,
    engagement_rate DECIMAL(4,2) NOT NULL DEFAULT 0.00,
    account_status ENUM('active', 'pending', 'suspended') DEFAULT 'active',
    is_creator BOOLEAN DEFAULT TRUE,
    role ENUM('student', 'creator', 'admin') DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_student_email (email),
    INDEX idx_student_username (username),
    INDEX idx_student_college (college_name),
    INDEX idx_student_category (creator_category),
    INDEX idx_student_followers (followers_count),
    INDEX idx_student_status (account_status),
    INDEX idx_student_created (created_at)
);

-- 4. Social Posts (5,000+ records)
CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    author_id INT NOT NULL,
    post_type ENUM('image', 'text', 'event_announcement', 'campaign_promo', 'reel', 'campus_activity', 'achievement', 'collaboration') DEFAULT 'image',
    content TEXT NOT NULL,
    media_url VARCHAR(500),
    hashtags VARCHAR(255),
    likes_count INT NOT NULL DEFAULT 0,
    comments_count INT NOT NULL DEFAULT 0,
    shares_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES students(id) ON DELETE CASCADE,
    INDEX idx_posts_author (author_id),
    INDEX idx_posts_type (post_type),
    INDEX idx_posts_created (created_at),
    INDEX idx_posts_likes (likes_count)
);

-- 5. Post Likes
CREATE TABLE IF NOT EXISTS post_likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    student_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_post_student_like (post_id, student_id),
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    INDEX idx_likes_post (post_id),
    INDEX idx_likes_student (student_id)
);

-- 6. Post Comments
CREATE TABLE IF NOT EXISTS post_comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    student_id INT NOT NULL,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    INDEX idx_comments_post (post_id)
);

-- 7. Followers
CREATE TABLE IF NOT EXISTS followers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    follower_id INT NOT NULL,
    following_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_follower_following (follower_id, following_id),
    FOREIGN KEY (follower_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (following_id) REFERENCES students(id) ON DELETE CASCADE,
    INDEX idx_following (following_id),
    INDEX idx_follower (follower_id)
);

-- 8. Campaigns (10–15 records)
CREATE TABLE IF NOT EXISTS campaigns (
    id INT AUTO_INCREMENT PRIMARY KEY,
    campaign_code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    brand_name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    budget DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    rewards VARCHAR(255) NOT NULL,
    target_audience VARCHAR(255) NOT NULL,
    required_category VARCHAR(100) NOT NULL,
    application_deadline DATE NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('active', 'upcoming', 'completed', 'paused') DEFAULT 'active',
    applicants_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_campaign_status (status),
    INDEX idx_campaign_category (required_category)
);

-- 9. Campaign Applications
CREATE TABLE IF NOT EXISTS campaign_applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    campaign_id INT NOT NULL,
    student_id INT NOT NULL,
    portfolio_link VARCHAR(300),
    pitch_note TEXT,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_campaign_student (campaign_id, student_id),
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    INDEX idx_application_campaign (campaign_id),
    INDEX idx_application_student (student_id)
);

-- 10. Upcoming Campus Events (>= 20 records, all scheduled AFTER Dec 10, 2026)
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    banner_image VARCHAR(500) NOT NULL,
    event_date DATE NOT NULL,
    start_time VARCHAR(20) NOT NULL,
    end_time VARCHAR(20) NOT NULL,
    venue VARCHAR(200) NOT NULL,
    organizer VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL,
    registration_deadline DATE NOT NULL,
    max_attendees INT NOT NULL DEFAULT 500,
    registered_attendees INT NOT NULL DEFAULT 0,
    status ENUM('upcoming', 'live', 'completed') DEFAULT 'upcoming',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_event_date (event_date),
    INDEX idx_event_category (category),
    INDEX idx_event_status (status)
);

-- 11. Event Registrations
CREATE TABLE IF NOT EXISTS event_registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    student_id INT NOT NULL,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_event_student (event_id, student_id),
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    INDEX idx_reg_event (event_id),
    INDEX idx_reg_student (student_id)
);

-- 12. Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    link_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    INDEX idx_notif_student (student_id, is_read)
);

-- 13. Student Activities Log
CREATE TABLE IF NOT EXISTS student_activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    description VARCHAR(255) NOT NULL,
    target_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    INDEX idx_act_student (student_id, created_at)
);
