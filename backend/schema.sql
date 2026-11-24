-- CampusBuzz Database Schema
-- MySQL 8.0+ Compatible

CREATE DATABASE IF NOT EXISTS campusbuzz_db;
USE campusbuzz_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('student', 'creator', 'brand', 'admin') DEFAULT 'student',
    college VARCHAR(255),
    department VARCHAR(255),
    avatar_url VARCHAR(500),
    status ENUM('active', 'pending', 'suspended') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Student Creators Table
CREATE TABLE IF NOT EXISTS creators (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    name VARCHAR(255) NOT NULL,
    college VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    instagram VARCHAR(255) NOT NULL,
    youtube VARCHAR(255),
    followers INT NOT NULL DEFAULT 0,
    engagement_rate DECIMAL(4,2) NOT NULL DEFAULT 0.00,
    category VARCHAR(100) NOT NULL,
    avatar_url VARCHAR(500) NOT NULL,
    bio TEXT,
    verification_status ENUM('verified', 'pending', 'rejected') DEFAULT 'verified',
    total_collaborations INT DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 4.80,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 3. Campaigns Table
CREATE TABLE IF NOT EXISTS campaigns (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    brand VARCHAR(255) NOT NULL,
    budget DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    deadline DATE NOT NULL,
    target_creators INT NOT NULL DEFAULT 5,
    status ENUM('active', 'upcoming', 'completed', 'pending_approval') DEFAULT 'active',
    category VARCHAR(100) NOT NULL,
    deliverables TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Collaborations Table
CREATE TABLE IF NOT EXISTS collaborations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    campaign_id INT NOT NULL,
    creator_id INT NOT NULL,
    project_status ENUM('Requested', 'Negotiating', 'In Progress', 'In Review', 'Completed') DEFAULT 'In Progress',
    compensation DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    deliverables_summary VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
    FOREIGN KEY (creator_id) REFERENCES creators(id) ON DELETE CASCADE
);

-- 5. Collaboration Messages
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    collaboration_id INT NOT NULL,
    sender_name VARCHAR(255) NOT NULL,
    sender_role ENUM('creator', 'brand', 'admin') NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (collaboration_id) REFERENCES collaborations(id) ON DELETE CASCADE
);

-- 6. Events Table
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    date VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    banner_url VARCHAR(500),
    registered_count INT DEFAULT 0,
    max_capacity INT DEFAULT 500,
    status ENUM('upcoming', 'live', 'completed') DEFAULT 'upcoming',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Event Influencers Assignment
CREATE TABLE IF NOT EXISTS event_influencers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    creator_id INT NOT NULL,
    role_description VARCHAR(255),
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (creator_id) REFERENCES creators(id) ON DELETE CASCADE
);

-- 8. Activity Log
CREATE TABLE IF NOT EXISTS activity_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL,
    action VARCHAR(255) NOT NULL,
    target VARCHAR(255) NOT NULL,
    type VARCHAR(50) DEFAULT 'system',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
