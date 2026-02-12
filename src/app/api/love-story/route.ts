import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { isAdmin } from '@/lib/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const DEFAULT_STORY = [
    {
        title: "The First Spark",
        subtitle: "START",
        description: "Jab pehli baar nazrein mili thi, duniya ruk si gayi thi. Us pal me bas tum thi… aur ek ajeeb sa connection.",
        icon: "sparkles",
        order_index: 0
    },
    {
        title: "Growing Closer",
        subtitle: "THEN",
        description: "Chhote chhote messages se shuru hua safar, ab har din tumhare bina adhoora lagta hai.",
        icon: "heart",
        order_index: 1
    },
    {
        title: "Unbreakable Bond",
        subtitle: "NOW",
        description: "Ab jo rishta hai, wo sirf pyaar nahi, ek zimmedari hai, ek wada hai, ek forever wala promise.",
        icon: "ring",
        order_index: 2
    }
]

export async function GET() {
    try {
        let rows = await query('SELECT * FROM love_story ORDER BY order_index ASC') as any[];

        if (rows.length === 0) {
            // Auto-insert default story if empty
            for (const item of DEFAULT_STORY) {
                await query('INSERT INTO love_story (title, subtitle, description, icon, order_index) VALUES (?, ?, ?, ?, ?)',
                    [item.title, item.subtitle, item.description, item.icon, item.order_index]
                );
            }
            rows = await query('SELECT * FROM love_story ORDER BY order_index ASC') as any[];
        }

        return NextResponse.json(rows);
    } catch (e: any) {
        console.error("Story Fetch Error:", e);
        return NextResponse.json({ error: 'Failed to fetch story' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    try {
        const body = await req.json();
        const { title, subtitle, description, icon, order_index } = body;

        await query('INSERT INTO love_story (title, subtitle, description, icon, order_index) VALUES (?, ?, ?, ?, ?)',
            [title, subtitle, description, icon || 'heart', order_index || 0]
        );

        return NextResponse.json({ success: true });
    } catch (e: any) {
        console.error("Story Create Error:", e);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    try {
        const body = await req.json();
        const { id, title, subtitle, description, icon, order_index } = body;

        await query('UPDATE love_story SET title=?, subtitle=?, description=?, icon=?, order_index=? WHERE id=?',
            [title, subtitle, description, icon, order_index, id]
        );

        return NextResponse.json({ success: true });
    } catch (e: any) {
        console.error("Story Update Error:", e);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    try {
        const { id } = await req.json();
        await query('DELETE FROM love_story WHERE id=?', [id]);
        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
