import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { isAdmin } from '@/lib/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
    try {
        const { message } = await req.json();

        if (!message || !message.trim()) {
            return NextResponse.json({ error: 'Message cannot be empty' }, { status: 400 });
        }

        // --- Advanced Auto-Reply Logic ---
        const lowerMsg = message.toLowerCase();
        let autoReply = "";

        // Keyword Groups
        const keywords = {
            travel: ['travel', 'trip', 'ghumna', 'vacation', 'world', 'tour', 'paris', 'ladakh', 'goa', 'japan', 'korea'],
            career: ['law', 'judge', 'advocate', 'court', 'exam', 'ballb', 'study', 'top', 'success', 'career', 'job', 'work', 'internship'],
            love: ['love', 'pyaar', 'shaadi', 'marriage', 'wife', 'husband', 'together', 'forever', 'humesha', 'saath', 'baby', 'jaan', 'shona'],
            food: ['food', 'khana', 'pizza', 'momos', 'burger', 'chocolate', 'cake', 'ice cream', 'date'],
            money: ['money', 'rich', 'paisa', 'crore', 'million', 'shopping', 'brand', 'gucci', 'prada'],
            happiness: ['happy', 'khush', 'smile', 'peace', 'joy', 'sukoon'],
            home: ['home', 'house', 'ghar', 'family', 'kids']
        };

        // Determine Category
        let category = 'general';
        for (const [key, words] of Object.entries(keywords)) {
            if (words.some(w => lowerMsg.includes(w))) {
                category = key;
                break; // Prioritize first match
            }
        }

        // Generate Contextual Reply
        switch (category) {
            case 'travel':
                autoReply = `My love, your wish to explore the world is my command! 🌍✈️ Whether it's ${lowerMsg.includes('paris') ? 'Paris' : 'Ladakh'} or just a long drive, har safar sirf tumhare saath. Pack your bags, princess—humesha ke liye! 💕`;
                break;
            case 'career':
                autoReply = "Meri future Judge Sahiba! ⚖️ Your ambition is so sexy to me. Main humesha tumhare saath khada hoon, har exam aur har case mein. You are going to rule the world! 😎🔥";
                break;
            case 'love':
                autoReply = "Bas yehi chahiye mujhe bhi! ❤️ To be with you, forever and always. Tumhari har wish meri command hai. I promise to love you more with every passing second. 💍✨";
                break;
            case 'food':
                autoReply = "Khane ki baat aur main na manuu? 🍕😋 Chalo, aaj hi treat! Tum jo bolo, jahan bolo. Your wish is my delicious command! 🍫";
                break;
            case 'money':
                autoReply = "Bas paise? Are rani bana ke rakhunga tumhe! 👑 Har brand, har luxury sirf tumhare liye. You deserve the world and everything in it! 💸💎";
                break;
            case 'happiness':
                autoReply = "Tumhari khushi meri lifeline hai, Mohini. 😊✨ I promise to do everything verify, bas tum aise hi muskurati raho. Your smile is my biggest achievement! 💖";
                break;
            case 'home':
                autoReply = "Ek chhota sa ghar, tum aur main... aur dher sara pyaar. 🏡❤️ This dream is my favorite too. We will build our perfect paradise together, I promise! 👨‍👩‍👧‍👦";
                break;
            default:
                // Fallback: Emotional & Personalized using the input
                // Try to extract the main noun/verb logic nicely? Hard without NLP.
                // We'll use a heartfelt generic template.
                autoReply = `My love, whatever you wish for today, I promise to stand beside you and make it real. Your dreams are my mission. "${message}"... ye sirf wish nahi, mera goal ban gaya hai ab. 💖✨`;
                break;
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
