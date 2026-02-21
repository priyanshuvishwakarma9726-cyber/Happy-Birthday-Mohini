
import { query } from './src/lib/db';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function main() {
    try {
        const res = await query('DESCRIBE gallery');
        console.log('Gallery Schema:', JSON.stringify(res, null, 2));

        const rows = await query('SELECT * FROM gallery LIMIT 5');
        console.log('Gallery Sample Rows:', JSON.stringify(rows, null, 2));
    } catch (e) {
        console.error('Error:', e);
    }
}

main();
