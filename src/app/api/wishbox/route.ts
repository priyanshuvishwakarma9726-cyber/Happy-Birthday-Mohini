import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
    try {
        const { message } = await req.json();

        if (!message || !message.trim()) {
            return NextResponse.json({ error: 'Message cannot be empty' }, { status: 400 });
        }

        // --- Auto-Reply Logic ---
        let autoReply = "My love, whatever you wish for today, I promise to stand beside you and make it real. Your dreams are my mission. 💖";

        const lowerMsg = message.toLowerCase();

        if (lowerMsg.includes('travel') || lowerMsg.includes('trip') || lowerMsg.includes('ghumna') || lowerMsg.includes('vacation')) {
            autoReply = "Duniya ka har kona, har safar sirf tumhare saath. Pack your bags, princess—humesha ke liye! ✈️🌍💕";
        } else if (lowerMsg.includes('law') || lowerMsg.includes('judge') || lowerMsg.includes('advocate') || lowerMsg.includes('court') || lowerMsg.includes('exam')) {
            autoReply = "Meri future Judge Sahiba! ⚖️ Tumhari success meri sabse badi khushi hai. You're going to rule the world! 😎🔥";
        } else if (lowerMsg.includes('love') || lowerMsg.includes('pyaar') || lowerMsg.includes('shaadi') || lowerMsg.includes('humesha')) {
            autoReply = "Aur main wish karta hoon ki tumhari har subah meri smile se shuru ho. I love you beyond words, Mohini! ❤️💍";
        } else if (lowerMsg.includes('happy') || lowerMsg.includes('khush')) {
            autoReply = "Tumhari khushi meri lifeline hai. Hamesha aise hi muskurati raho, meri jaan! 😊✨";
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
