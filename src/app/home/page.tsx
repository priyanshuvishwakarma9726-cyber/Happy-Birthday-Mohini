import { query } from '@/lib/db'
import HomeClient from '@/components/HomeClient'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

async function getData() {
    try {
        // Parallel fetching
        const contentPromise = query('SELECT key_name, value FROM site_content');
        const memoriesPromise = query('SELECT * FROM memories ORDER BY order_index ASC, created_at DESC');
        const playlistPromise = query('SELECT * FROM playlist ORDER BY display_order ASC, created_at DESC');

        const [contentRows, memoriesRows, playlistRows] = await Promise.all([
            contentPromise,
            memoriesPromise,
            playlistPromise
        ]);

        const content: Record<string, string> = {}
        if (Array.isArray(contentRows)) {
            contentRows.forEach((r: any) => content[r.key_name] = r.value)
        }

        return {
            content,
            gallery: Array.isArray(memoriesRows)
                ? memoriesRows.map((m: any) => ({
                    id: m.id,
                    url: m.file_path,
                    type: m.type,
                    caption: m.description || m.title || ""
                }))
                : [],
            playlist: Array.isArray(playlistRows) ? playlistRows : []
        }
    } catch (e) {
        console.error("Failed to fetch data", e)
        return { content: {}, gallery: [], playlist: [] }
    }
}

export default async function CelebrationPage() {
    const { content, gallery, playlist } = await getData()
    // We'll pass a prop to HomeClient to tell it to skip the intro
    return <HomeClient content={content} gallery={gallery} playlist={playlist} skipIntro={true} />
}
