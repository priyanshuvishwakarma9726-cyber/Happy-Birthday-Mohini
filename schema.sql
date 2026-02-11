CREATE TABLE IF NOT EXISTS site_content (
    key_name VARCHAR(255) PRIMARY KEY,
    value TEXT
);

CREATE TABLE IF NOT EXISTS wishes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    message TEXT,
    is_approved BOOLEAN DEFAULT FALSE,
    reactions JSON DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS gallery (
    id INT AUTO_INCREMENT PRIMARY KEY,
    url TEXT NOT NULL,
    caption TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS playlist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    url TEXT NOT NULL,
    artist VARCHAR(255),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quiz_scores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    score INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert defaults if needed (ON DUPLICATE KEY UPDATE avoids errors)
INSERT IGNORE INTO site_content (key_name, value) VALUES 
('hero_title', 'Happy Birthday Mohini ❤️'),
('hero_subtitle', 'Ye website sirf tumhare liye ❤️'),
('message_body', 'Happy Birthday! Have a great year ahead.'),
('video_url', ''),     
('voice_url', ''),
('favorite_song_url', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'),
('intro_audio_url', '');
CREATE TABLE IF NOT EXISTS memories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('photo', 'video') NOT NULL,
    file_path TEXT NOT NULL,
    title VARCHAR(255),
    description TEXT,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS wishbox (
    id INT AUTO_INCREMENT PRIMARY KEY,
    message TEXT NOT NULL,
    auto_reply TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS love_story (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    subtitle VARCHAR(255),
    description TEXT,
    icon VARCHAR(255),
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
