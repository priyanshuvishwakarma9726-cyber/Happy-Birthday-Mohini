import { NextResponse } from 'next/server'
import cloudinary from '@/lib/cloudinary'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
    try {
        const formData = await req.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
        }

        // Validate File Size
        const isVideo = file.type.startsWith('video/')
        const limit = isVideo ? 100 * 1024 * 1024 : 10 * 1024 * 1024 // 100MB for video, 10MB for others
        if (file.size > limit) {
            return NextResponse.json({ error: `File too large. Max ${isVideo ? '100MB' : '10MB'}` }, { status: 400 })
        }

        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // Convert to Base64 to avoid any stream/temp-file issues
        const base64Data = buffer.toString('base64')
        const fileUri = `data:${file.type};base64,${base64Data}`

        // Upload to Cloudinary using Base64 URI (Purely in-memory)
        const result = await cloudinary.uploader.upload(fileUri, {
            resource_type: isVideo ? 'video' : file.type.startsWith('audio/') ? 'video' : 'image',
            folder: 'birthday_assets',
            public_id: `file_${Date.now()}`
        })

        return NextResponse.json({ file_path: result.secure_url })
    } catch (e) {
        console.error('Cloudinary Upload error:', e)
        return NextResponse.json({ error: 'Upload failed: ' + (e as Error).message }, { status: 500 })
    }
}
