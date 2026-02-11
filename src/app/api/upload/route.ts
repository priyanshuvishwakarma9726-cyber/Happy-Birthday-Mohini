import { NextResponse } from 'next/server'
import cloudinary from '@/lib/cloudinary'

export async function POST(req: Request) {
    try {
        const formData = await req.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
        }

        // Validate File Size
        const isVideo = file.type.startsWith('video/')
        const limit = isVideo ? 500 * 1024 * 1024 : 100 * 1024 * 1024
        if (file.size > limit) {
            return NextResponse.json({ error: `File too large. Max ${isVideo ? '500MB' : '100MB'}` }, { status: 400 })
        }

        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // Upload to Cloudinary using stream
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: isVideo ? 'video' : file.type.startsWith('audio/') ? 'video' : 'image', // Cloudinary treats audio as video resource_type
                    folder: 'birthday_assets',
                    public_id: `file_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9]/g, '_')}`
                },
                (error, result) => {
                    if (error) reject(error)
                    else resolve(result)
                }
            )
            uploadStream.end(buffer)
        }) as any

        return NextResponse.json({ file_path: result.secure_url })
    } catch (e) {
        console.error('Cloudinary Upload error:', e)
        return NextResponse.json({ error: 'Upload failed: ' + (e as Error).message }, { status: 500 })
    }
}

export async function DELETE_FILE(publicUrl: string) {
    try {
        console.log("Cloudinary deletion requested for:", publicUrl)
    } catch (e) {
        console.error(e)
    }
}
