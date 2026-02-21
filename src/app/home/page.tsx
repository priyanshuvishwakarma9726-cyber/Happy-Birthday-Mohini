import { query } from '@/lib/db'
import HomeClient from '@/components/HomeClient'
import { RowDataPacket } from 'mysql2'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Define strict types
export interface Song extends RowDataPacket {
    id: number;
    title: string;
    artist: string;
    url: string;
}

export interface GalleryItem {
    id: number;
    url: string;
    type: 'image' | 'video';
    caption: string;
}

export type Content = Record<string, string>;

export type HomeData = {
    content: Content;
    gallery: GalleryItem[];
    playlist: Song[];
}

async function getData(): Promise<HomeData> {
    try {
        // Parallel fetching
        const contentPromise = query('SELECT key_name, value FROM site_content');
        const memoriesPromise = query('SELECT * FROM memories ORDER BY order_index ASC, created_at DESC');
        const playlistPromise = query('SELECT id, title, artist, url FROM playlist ORDER BY display_order ASC, created_at DESC');

        const [contentRows, memoriesRows, playlistRows] = await Promise.all([
            contentPromise,
            memoriesPromise,
            playlistPromise
        ]) as [any[], any[], Song[]];

        const content: Content = {}
        if (Array.isArray(contentRows)) {
            contentRows.forEach((r: any) => content[r.key_name] = r.value)
        }

        const gallery: GalleryItem[] = Array.isArray(memoriesRows)
            ? memoriesRows.map((m: any) => ({
                id: m.id,
                url: m.file_path,
                type: (m.type === 'photo' || m.type === 'image') ? 'image' : 'video',
                caption: m.description || m.title || ""
            }))
            : []

        if (gallery.length === 0) console.warn("No memories found in database");
        else console.log(`Loaded ${gallery.length} memories`);

        const playlist: Song[] = Array.isArray(playlistRows) ? playlistRows : []

        return {
            content,
            gallery,
            playlist
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
