import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import { isAdmin } from '@/lib/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
    if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    try {
        // 1. Debug Logs (Safe)
        const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
        const apiKey = process.env.CLOUDINARY_API_KEY;
        const apiSecret = process.env.CLOUDINARY_API_SECRET;

        console.log("Cloudinary Config Check:", {
            cloudNameExists: !!cloudName,
            apiKeyExists: !!apiKey,
            apiSecretExists: !!apiSecret,
            nodeEnv: process.env.NODE_ENV
        });

        // 2. Strict Validation
        if (!cloudName || !apiKey || !apiSecret) {
            console.error("CRITICAL: Cloudinary environment variables are missing in this environment.");
            return NextResponse.json({
                error: 'Server Configuration Error: Missing Cloudinary Credentials. Please check Vercel Project Settings > Environment Variables.'
            }, { status: 500 });
        }

        // 3. Configure INSIDE the handler to ensure env vars are ready
        cloudinary.config({
            cloud_name: cloudName,
            api_key: apiKey,
            api_secret: apiSecret,
            secure: true,
        });

        const formData = await req.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
        }

        // Validate File Size
        const isVideo = file.type.startsWith('video/') || file.type.startsWith('audio/')
        // Limits: 90MB for video/audio (safe margin for Vercel/Cloudinary free timeouts), 10MB for images
        const limit = isVideo ? 90 * 1024 * 1024 : 10 * 1024 * 1024

        if (file.size > limit) {
            return NextResponse.json({ error: `File too large. Max ${isVideo ? '90MB' : '10MB'}` }, { status: 400 })
        }

        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // Convert to Base64 to avoid stream issues
        const base64Data = buffer.toString('base64')
        const fileUri = `data:${file.type};base64,${base64Data}`

        console.log("Starting Upload to Cloudinary...");

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(fileUri, {
            resource_type: isVideo ? 'video' : 'image', // Audio implies video resource_type in Cloudinary
            folder: 'birthday_assets',
            public_id: `file_${Date.now()}`
        })

        console.log("Upload Success:", result.secure_url);

        return NextResponse.json({ file_path: result.secure_url })

    } catch (e) {
        console.error('Cloudinary Upload Fatal Error:', e)
        return NextResponse.json({ error: 'Upload failed: ' + (e as Error).message }, { status: 500 })
    }
}
