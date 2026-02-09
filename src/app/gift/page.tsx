import { query } from '@/lib/db'
import GiftClient from '@/components/GiftClient'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

async function getGiftData() {
    try {
        const rows: any = await query('SELECT key_name, value FROM site_content WHERE key_name IN ("intro_audio_url", "recipient_name", "birthday_date")');
        const data: Record<string, string> = {};
        if (Array.isArray(rows)) {
            rows.forEach(r => data[r.key_name] = r.value);
        }
        return data;
    } catch (e) {
        return {};
    }
}

export default async function GiftPage() {
    const data = await getGiftData()
    return (
        <GiftClient
            introAudioUrl={data.intro_audio_url}
            recipientName={data.recipient_name || "Mohini"}
            targetDate={data.birthday_date || "2025-10-18T00:00"}
        />
    )
}
