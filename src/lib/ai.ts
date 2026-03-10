export async function getAICompletion(prompt: string, systemPrompt: string = "You are a romantic AI companion on a birthday website for Mohini. Key rules: 1. Keep it romantic, sweet, and poetic. 2. Support Hinglish (Hindi + English) naturally. 3. Be brief but impactful. 4. Never break character.") {
    const apiKey = process.env.OPENROUTER_API_KEY;
    const aiModel = process.env.AI_MODEL || "google/gemini-2.0-flash-lite-preview-02-05:free";
    const baseUrl = process.env.AI_BASE_URL || "https://openrouter.ai/api/v1";

    if (!apiKey) {
        throw new Error("Missing OPENROUTER_API_KEY");
    }

    const response = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://happy-birthday-mohini.vercel.app",
            "X-Title": "Mohini Birthday Site"
        },
        body: JSON.stringify({
            "model": aiModel,
            "messages": [
                { "role": "system", "content": systemPrompt },
                { "role": "user", "content": prompt }
            ],
            "top_p": 1,
            "temperature": 0.7
        })
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error("OpenRouter Error Body:", errorBody);
        throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}
