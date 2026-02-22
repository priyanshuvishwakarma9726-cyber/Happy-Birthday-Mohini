import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { isAdmin } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
    if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    try {
        const rows = await query('SELECT answer, created_at FROM proposals ORDER BY created_at DESC LIMIT 1') as any[];
        return NextResponse.json(rows[0] || { answer: null });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { answer } = await req.json();
        if (!['Yes', 'No'].includes(answer)) {
            return NextResponse.json({ error: "Invalid answer" }, { status: 400 });
        }
        await query('INSERT INTO proposals (answer) VALUES (?)', [answer]);
        return NextResponse.json({ success: true });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }
}

export async function DELETE() {
    if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    try {
        await query('DELETE FROM proposals');
        return NextResponse.json({ success: true });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
}
