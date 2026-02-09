const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
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

    console.log('Connecting to TiDB...');
    const connection = await mysql.createConnection(config);

    try {
        const schemaPath = path.join(__dirname, '../schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        // Split by semicolons to get individual statements, filtering empty ones
        const statements = schemaSql.split(';').filter((s: string) => s.trim());

        for (const statement of statements) {
            if (statement.trim()) {
                console.log(`Executing: ${statement.substring(0, 50)}...`);
                await connection.execute(statement);
            }
        }
        console.log('Database initialized successfully! 🚀');
    } catch (error) {
        console.error('Error initializing database:', error);
    } finally {
        await connection.end();
    }
}

main();
