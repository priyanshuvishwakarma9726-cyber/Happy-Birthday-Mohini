
const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function main() {
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
        const [rows] = await connection.query('SELECT * FROM memories');
        rows.forEach(r => {
            console.log(`ID: ${r.id} | TYPE: ${r.type} | URL: ${r.file_path} | CAPTION: ${r.title || r.description}`);
        });
        await connection.end();
    } catch (e) {
        console.error('Error:', e);
    }
}

main();
