
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function resetDB() {
    const config = {
        host: process.env.TIDB_HOST,
        port: Number(process.env.TIDB_PORT) || 4000,
        user: process.env.TIDB_USER,
        password: process.env.TIDB_PASSWORD,
        database: process.env.TIDB_DATABASE,
        ssl: {
            minVersion: 'TLSv1.2',
            rejectUnauthorized: false
        }
    };

    try {
        const connection = await mysql.createConnection(config);
        console.log("Connected to TiDB!");

        console.log("Dropping and recreating memories table for clean synchronization...");
        await connection.query('DROP TABLE IF EXISTS memories');
        await connection.query(`
            CREATE TABLE memories (
                id INT AUTO_INCREMENT PRIMARY KEY,
                type ENUM('photo', 'video') NOT NULL,
                file_path TEXT NOT NULL,
                title VARCHAR(255),
                description TEXT,
                order_index INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log("Table 'memories' created with 'file_path' column.");

        // Also check site_content for puzzle flags
        const [rows]: any = await connection.query("SELECT * FROM site_content WHERE key_name = 'feature_flags'");
        if (rows.length === 0) {
            console.log("Initializing feature_flags...");
            const defaultFlags = {
                show_games: true,
                show_letter: true,
                show_gallery: true,
                show_wishes: true,
                show_media: true,
                game_hearts: true,
                show_puzzle: true,
                puzzle_difficulty: 4
            };
            await connection.query("INSERT INTO site_content (key_name, value) VALUES ('feature_flags', ?)", [JSON.stringify(defaultFlags)]);
        }

        await connection.end();
        console.log("DB Reset Complete! ✅");
    } catch (e) {
        console.error("Reset Error:", e);
    }
}

resetDB();
