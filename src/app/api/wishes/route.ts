import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const admin = searchParams.get('admin') === 'true'

    try {
        // If admin, show all. If public, show only approved.
        const sql = admin
            ? 'SELECT * FROM wishes ORDER BY created_at DESC'
            : 'SELECT * FROM wishes WHERE is_approved = TRUE ORDER BY created_at DESC'

        const rows = await query(sql);
        return NextResponse.json(rows);
    } catch (e) {
        console.error(e);
        return NextResponse.json([]);
    }
}

export async function POST(req: Request) {
    try {
        const { name, message } = await req.json();

        // Basic Anti-Spam
        if (!name || !message) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        if (message.length > 500) return NextResponse.json({ error: 'Too long' }, { status: 400 });
        if (name.length > 50) return NextResponse.json({ error: 'Name too long' }, { status: 400 });

        // Profanity Filter (Simple list)
        const badWords = ['badword', 'spam', 'casino']; // Placeholder
        const content = (name + message).toLowerCase();
        if (badWords.some(w => content.includes(w))) {
            return NextResponse.json({ error: 'Be nice!' }, { status: 400 });
        }

        await query('INSERT INTO wishes (name, message, is_approved) VALUES (?, ?, TRUE)', [name, message]);
        return NextResponse.json({ success: true, message: 'Wish added successfully!' });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to add" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    // Admin Approval or Reaction Update
    try {
        const body = await req.json();

        if (body.action === 'approve') {
            // Admin Only ideally, but simplified for this demo context
            await query('UPDATE wishes SET is_approved = TRUE WHERE id = ?', [body.id]);
            return NextResponse.json({ success: true });
        }

        if (body.action === 'react') {
            // Fetch current reactions
            const rows = await query('SELECT reactions FROM wishes WHERE id = ?', [body.id]) as any[];
            if (!rows.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });

            let current = rows[0].reactions;
            // Handle if stored as string or object or null
            if (typeof current === 'string') {
                try { current = JSON.parse(current) } catch { current = {} }
            }
            if (!current) current = {};

            const emote = body.emote; // e.g. '❤️'
            current[emote] = (current[emote] || 0) + 1;

            await query('UPDATE wishes SET reactions = ? WHERE id = ?', [JSON.stringify(current), body.id]);
            return NextResponse.json({ success: true, reactions: current });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { id } = await req.json();
        await query('DELETE FROM wishes WHERE id = ?', [id]);
        return NextResponse.json({ success: true });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
}
