import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { isAdmin } from '@/lib/auth'
import { getAICompletion } from '@/lib/ai'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
    try {
        const { message } = await req.json();

        if (!message || !message.trim()) {
            return NextResponse.json({ error: 'Message cannot be empty' }, { status: 400 });
        }

        // --- Real AI Logic via OpenRouter ---
        let autoReply = "";
        try {
            const systemPrompt = "You are a mystical and deeply romantic wish-granter. A girl named Mohini has made a birthday wish. You MUST respond in a way that is incredibly romantic, heartwarming, and magical. Use Hinglish naturally (Mix of Hindi and English). Your response should feel like the universe is conspiring to make her dreams come true because she is special. Keep it under 45 words.";
            autoReply = await getAICompletion(message, systemPrompt);
        } catch (aiErr) {
            console.warn("AI Fallback triggered:", aiErr);
            autoReply = `My love, whatever you wish for today, I promise to stand beside you and make it real. Your dreams are my mission. "${message}"... ye sirf wish nahi, mera goal ban gaya hai ab. 💖✨`;
        }

        // Save to DB
        await query('INSERT INTO wishbox (message, auto_reply) VALUES (?, ?)', [message, autoReply]);

        return NextResponse.json({
            success: true,
            data: {
                message,
                autoReply,
                createdAt: new Date().toISOString()
            }
        });

    } catch (e: any) {
        console.error("Wishbox Error:", e);
        return NextResponse.json({ error: 'Failed to save wish' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const rows = await query('SELECT * FROM wishbox ORDER BY created_at DESC');
        return NextResponse.json(rows);
    } catch (e) {
        console.error(e);
        return NextResponse.json([]);
    }
}

export async function DELETE(req: Request) {
    if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    try {
        const { id } = await req.json();
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        await query('DELETE FROM wishbox WHERE id = ?', [id]);
        return NextResponse.json({ success: true });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
}
