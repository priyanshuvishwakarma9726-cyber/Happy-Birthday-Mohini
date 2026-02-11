import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const rows = await query('SELECT key_name, value FROM site_content') as any[];
        const content: Record<string, string> = {};
        if (Array.isArray(rows)) {
            rows.forEach(r => content[r.key_name] = r.value);
        }
        return NextResponse.json(content);
    } catch (e) {
        console.warn("DB Error (Table likely missing), returning defaults.");
        // Defaults
        return NextResponse.json({
            hero_title: "Happy Birthday Mohini ❤️",
            hero_subtitle: "Ye website sirf tumhare liye ❤️",
            message_body: "Happy Birthday! Have a great year ahead my dear."
        });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        for (const [k, v] of Object.entries(body)) {
            if (typeof v === 'string') {
                await query(
                    `INSERT INTO site_content (key_name, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = ?`,
                    [k, v, v]
                );
            }
        }
        return NextResponse.json({ success: true });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }
}
