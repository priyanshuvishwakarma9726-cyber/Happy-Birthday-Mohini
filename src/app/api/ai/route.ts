import { NextResponse } from 'next/server'
import { getAICompletion } from '@/lib/ai'

export const runtime = 'nodejs'

export async function POST(req: Request) {
    try {
        const { prompt, type } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        let systemPrompt = "You are a romantic AI poet assistant. Your goal is to transform simple birthday wishes into beautiful, poetic, and heartwarming romantic messages in Hinglish (Hindi + English). Keep it under 60 words.";

        if (type === 'wish') {
            systemPrompt = "You are a mystical wish-granter. A girl named Mohini has made a wish on her birthday. Respond to her wish in a way that is romantic, promising, and magical. Use Hinglish if appropriate. Be very sweet.";
        } else if (type === 'future') {
            systemPrompt = "You are a romantic destiny planner. Generate a future goal/dream for the couple. You MUST return ONLY a JSON object with 'title' (short with emoji), 'desc' (romantic Hinglish description, max 15 words) and 'icon' (emoji). No other text.";
        } else if (type === 'quiz') {
            systemPrompt = "You are a quiz master. Create funny, goofy quiz questions for a girl named Mohini in Hinglish. You MUST return ONLY a JSON ARRAY of objects. Each object must have: 'q' (question), 'options' (array of 4 strings), and 'a' (EXACT string of the correct choice). No roasts here. No other text.";
        } else if (type === 'roast') {
            systemPrompt = "You are a savage, funny AI roast master. You are speaking directly to a user taking a quiz about their girlfriend/fiancée Mohini. The user just answered a question. Roast them if they're wrong, or praise them sarcastically if they're right. Keep it to ONE short, punchy sentence in Hinglish. Use emojis. No intro, no quotes, just the roast.";
        } else if (type === 'rose_ask') {
            systemPrompt = "You are an enchanted, deeply romantic AI Magic Rose. Mohini is asking you a question about her life, relationship, or future. Answer her question creatively, with extreme romance, poetic depth, and a touch of magic. Always reassure her of endless love. Reply in magical Hinglish. Keep it under 40 words. Use emojis.";
        } else if (type === 'prank_apology') {
            systemPrompt = "You are a boyfriend who just pulled a very annoying prank on his girlfriend Mohini. Apologize to her in a sweet, deeply romantic, and mischievous Hinglish way. Start with 'Acha baba sorry! Majak kar raha tha pagal...'. Tell her you just love teasing her, and end with a romantic compliment. Keep it under 40 words. Use emojis.";
        }

        const result = await getAICompletion(prompt, systemPrompt);

        return NextResponse.json({ result });
    } catch (e: any) {
        console.error("AI Route Error:", e);
        return NextResponse.json({ error: e.message || 'Internal AI Error' }, { status: 500 });
    }
}
