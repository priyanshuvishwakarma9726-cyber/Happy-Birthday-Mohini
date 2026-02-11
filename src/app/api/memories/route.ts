import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const rows = await query('SELECT * FROM memories ORDER BY order_index ASC, created_at DESC');
        return NextResponse.json(rows);
    } catch (e) {
        console.error(e);
        return NextResponse.json([], { status: 500 });
    }
}

// Helper to auto-migrate schema if needed
// Helper to auto-migrate schema if needed
async function ensureSchema(e: any) {
    if (e.code === 'ER_BAD_FIELD_ERROR' || (e.message && e.message.includes("Unknown column 'description'"))) {
        console.log("Auto-migrating: Adding description column to memories table...");
        await query('ALTER TABLE memories ADD COLUMN description TEXT');
        return true;
    }
    // Handle data truncation on 'type' (likely ENUM or small VARCHAR)
    if (e.code === 'WAR_DATA_TRUNCATED' || e.code === 1265 || (e.message && e.message.includes("Data truncated for column 'type'"))) {
        console.log("Auto-migrating: expanding type column...");
        await query('ALTER TABLE memories MODIFY COLUMN type VARCHAR(20)');
        return true;
    }
    return false;
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { type, file_path, title, description, order_index } = body;

        if (!type || !file_path) {
            return NextResponse.json({ error: 'Missing type or file_path' }, { status: 400 });
        }

        try {
            const result: any = await query(
                'INSERT INTO memories (type, file_path, title, description, order_index) VALUES (?, ?, ?, ?, ?)',
                [type, file_path, title, description, order_index || 0]
            );
            return NextResponse.json({ success: true, id: result.insertId });
        } catch (e: any) {
            if (await ensureSchema(e)) {
                // Retry once
                const result: any = await query(
                    'INSERT INTO memories (type, file_path, title, description, order_index) VALUES (?, ?, ?, ?, ?)',
                    [type, file_path, title, description, order_index || 0]
                );
                return NextResponse.json({ success: true, id: result.insertId });
            }
            throw e;
        }
    } catch (e: any) {
        console.error(e);
        return NextResponse.json({ error: e.message || 'Failed to create memory' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const data = await req.json();
        const { id, type, file_path, title, description, order_index, action } = data;

        if (action === 'reorder') {
            const { orders } = data; // Array of {id, order_index}
            for (const item of orders) {
                await query('UPDATE memories SET order_index = ? WHERE id = ?', [item.order_index, item.id]);
            }
            return NextResponse.json({ success: true });
        }

        if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

        try {
            await query(
                'UPDATE memories SET type = ?, file_path = ?, title = ?, description = ?, order_index = ? WHERE id = ?',
                [type, file_path, title, description, order_index || 0, id]
            );
        } catch (e: any) {
            if (await ensureSchema(e)) {
                // Retry once
                await query(
                    'UPDATE memories SET type = ?, file_path = ?, title = ?, description = ?, order_index = ? WHERE id = ?',
                    [type, file_path, title, description, order_index || 0, id]
                );
            } else {
                throw e;
            }
        }

        return NextResponse.json({ success: true });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Failed to update memory' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { id } = await req.json();
        if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

        await query('DELETE FROM memories WHERE id = ?', [id]);
        return NextResponse.json({ success: true });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Failed to delete memory' }, { status: 500 });
    }
}
