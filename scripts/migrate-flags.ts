
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function migrate() {
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
        const [rows]: any = await connection.query("SELECT value FROM site_content WHERE key_name = 'feature_flags'");

        if (rows.length > 0) {
            const flags = JSON.parse(rows[0].value);
            console.log("Current Flags:", flags);

            if (flags.show_puzzle === undefined) {
                flags.show_puzzle = true;
                flags.puzzle_difficulty = 4;
                console.log("Migrating flags to include puzzle...");
                await connection.query(
                    "UPDATE site_content SET value = ? WHERE key_name = 'feature_flags'",
                    [JSON.stringify(flags)]
                );
                console.log("Flags migrated!");
            } else {
                console.log("Flags already have puzzle settings.");
            }
        } else {
            console.log("No feature_flags found in DB yet.");
        }
        await connection.end();
    } catch (e) {
        console.error("Migration failed:", e);
    }
}

migrate();
