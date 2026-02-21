
const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function main() {
    const config = {
        host: process.env.TIDB_HOST,
        user: process.env.TIDB_USER,
        password: process.env.TIDB_PASSWORD,
        database: process.env.TIDB_DATABASE,
        ssl: { rejectUnauthorized: false }
    };

    try {
        const connection = await mysql.createConnection(config);
        const [rows] = await connection.query("SELECT * FROM memories WHERE title LIKE '%hacker%' OR description LIKE '%hacker%'");
        console.log('RESULTS:', JSON.stringify(rows));
        await connection.end();
    } catch (e) {
        console.error('Error:', e);
    }
}

main();
