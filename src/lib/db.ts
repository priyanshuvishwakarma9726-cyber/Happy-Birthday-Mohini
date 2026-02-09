import mysql from 'mysql2/promise';

let pool: mysql.Pool;

export function getPool() {
    if (!pool) {
        pool = mysql.createPool({
            host: process.env.TIDB_HOST,
            port: Number(process.env.TIDB_PORT) || 4000,
            user: process.env.TIDB_USER,
            password: process.env.TIDB_PASSWORD,
            database: process.env.TIDB_DATABASE,
            ssl: {
                minVersion: 'TLSv1.2',
                rejectUnauthorized: false // Sometimes needed for self-signed or TiDB serverless nuances
            },
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
    }
    return pool;
}

export async function query(sql: string, params: any[] = []) {
    if (!process.env.TIDB_HOST) {
        console.warn("TiDB environment variables missing. Returning null/empty.");
        return [];
    }

    try {
        const db = getPool();
        const [results] = await db.execute(sql, params);
        return results;
    } catch (error) {
        console.error('Database Query Error:', error);
        throw error;
    }
}
