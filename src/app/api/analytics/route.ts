import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
    try {
        const { event } = await request.json();
        if (!event) return NextResponse.json({ error: 'Event required' }, { status: 400 });

        const db = getPool();
        const key = `stats_${event}`;

        // Atomic increment using ON DUPLICATE KEY UPDATE
        // value is TEXT, so we cast it for update
        await db.execute(`
            INSERT INTO site_content (key_name, value) VALUES (?, '1')
            ON DUPLICATE KEY UPDATE value = CAST(value AS UNSIGNED) + 1
        `, [key]);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Analytics Error:', error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const db = getPool();
        // Fetch all keys starting with stats_
        const [rows] = await db.execute("SELECT key_name, value FROM site_content WHERE key_name LIKE 'stats_%'");

        const stats: Record<string, number> = {};
        (rows as any[]).forEach(row => {
            stats[row.key_name.replace('stats_', '')] = parseInt(row.value, 10) || 0;
        });

        // Also get wish reaction counts (aggregated)
        const [wishes] = await db.execute("SELECT reactions FROM wishes WHERE is_approved = TRUE");
        let totalReactions = 0;
        (wishes as any[]).forEach(w => {
            if (w.reactions) {
                const r = typeof w.reactions === 'string' ? JSON.parse(w.reactions) : w.reactions;
                Object.values(r).forEach((count: any) => totalReactions += (count || 0));
            }
        });
        stats['wish_reactions'] = totalReactions;

        return NextResponse.json(stats);
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
