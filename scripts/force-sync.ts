import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function main() {
    console.log('🔌 Connecting to TiDB...');
    const conn = await mysql.createConnection({
        host: process.env.TIDB_HOST,
        port: Number(process.env.TIDB_PORT),
        user: process.env.TIDB_USER,
        password: process.env.TIDB_PASSWORD,
        database: process.env.TIDB_DATABASE,
        ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true }
    });

    console.log('🗑️ Dropping OLD tables...');
    try {
        await conn.execute('DROP TABLE IF EXISTS wishes');
        await conn.execute('DROP TABLE IF EXISTS comments'); // Clean up any potential legacy
    } catch (e) { console.warn(e); }

    console.log('✨ Creating NEW Schema...');

    // Wishes Table
    await conn.execute(`
        CREATE TABLE wishes (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255),
            message TEXT,
            is_approved BOOLEAN DEFAULT FALSE,
            reactions JSON DEFAULT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Ensure other tables exist (idempotent)
    await conn.execute(`
        CREATE TABLE IF NOT EXISTS site_content (
            key_name VARCHAR(255) PRIMARY KEY,
            value TEXT
        )
    `);

    console.log('✅ Database Synced & Repaired!');
    conn.end();
}
main().catch(err => {
    console.error('❌ Failed:', err);
    process.exit(1);
});
