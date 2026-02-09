import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
    try {
        const rows = await query('SELECT * FROM gallery ORDER BY display_order ASC, created_at DESC');
        return NextResponse.json(rows);
    } catch (e) {
        console.error(e);
        return NextResponse.json([]);
    }
}

export async function POST(req: Request) {
    try {
        const { url, caption } = await req.json();
        if (!url) return NextResponse.json({ error: 'URL required' }, { status: 400 });

        await query('INSERT INTO gallery (url, caption) VALUES (?, ?)', [url, caption || '']);
        return NextResponse.json({ success: true });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to add" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { id } = await req.json();
        await query('DELETE FROM gallery WHERE id = ?', [id]);
        return NextResponse.json({ success: true });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
}
