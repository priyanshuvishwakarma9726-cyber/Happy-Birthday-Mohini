// File Upload API - Re-synchronized to resolve build cache issue
import { NextResponse } from 'next/server'
import { writeFile, mkdir, unlink } from 'fs/promises'
import path from 'path'
import crypto from 'crypto'

export async function POST(req: Request) {
    console.log("Upload POST received")
    try {
        const formData = await req.formData()
        const file = formData.get('file') as File

        if (!file) {
            console.log("No file found in form data")
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
        }

        console.log(`Processing file: ${file.name}, Type: ${file.type}, Size: ${file.size}`)

        // Validate File Size (Images 100MB, Videos 500MB)
        const isVideo = file.type.startsWith('video/')
        const limit = isVideo ? 500 * 1024 * 1024 : 100 * 1024 * 1024

        if (file.size > limit) {
            console.log("File size exceeds limit")
            return NextResponse.json({ error: `File too large. Max ${isVideo ? '500MB' : '100MB'}` }, { status: 400 })
        }

        // Validate File Type
        const allowedTypes = [
            'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml',
            'video/mp4', 'video/webm',
            'application/octet-stream',
            'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/x-m4a'
        ]

        if (!allowedTypes.includes(file.type)) {
            console.log(`Invalid file type: ${file.type}`)
            return NextResponse.json({ error: `Invalid file type: ${file.type}. Allowed: Images, Videos, Audio` }, { status: 400 })
        }

        const sanitizedBuffer = Buffer.from(await file.arrayBuffer())
        // Sanitize filename: remove special chars, emojis, etc.
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
        const filename = `${crypto.randomUUID()}-${safeName}`
        const uploadDir = path.join(process.cwd(), 'public', 'uploads')

        // Ensure directory exists
        await mkdir(uploadDir, { recursive: true }).catch(err => console.error("Mkdir error:", err))

        const filePath = path.join(uploadDir, filename)
        await writeFile(filePath, sanitizedBuffer)
        console.log(`File saved to: ${filePath}`)

        const publicPath = `/uploads/${filename}`
        return NextResponse.json({ file_path: publicPath })
    } catch (e) {
        console.error('Upload error:', e)
        return NextResponse.json({ error: 'Upload failed: ' + (e as Error).message }, { status: 500 })
    }
}

// Utility to delete file when memory is deleted
export async function DELETE_FILE(publicPath: string) {
    try {
        if (!publicPath || !publicPath.startsWith('/uploads/')) return
        const filePath = path.join(process.cwd(), 'public', publicPath)
        await unlink(filePath).catch(e => console.error('File delete error:', e))
    } catch (e) {
        console.error(e)
    }
}
