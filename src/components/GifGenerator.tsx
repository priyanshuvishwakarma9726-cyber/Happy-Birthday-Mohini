'use client'

import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Download, Play, Video, Share2 } from 'lucide-react'

// Simple helper to generate video from image sequence
async function makeVideo(images: string[], format: 'webm' | 'gif'): Promise<string> {
    if (images.length === 0) return Promise.reject('No images')

    const canvas = document.createElement('canvas')
    canvas.width = 1080
    canvas.height = 1080 // Square for Insta
    const ctx = canvas.getContext('2d')!
    const stream = canvas.captureStream(5) // 5 FPS
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' }) // Chrome mostly

    const chunks: Blob[] = []
    recorder.ondataavailable = (e) => chunks.push(e.data)

    recorder.start()

    // Loop draw
    let count = 0
    const draw = async () => {
        if (count >= images.length * 3) { // Loop 3 times
            recorder.stop()
            return
        }
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.src = images[count % images.length]
        await new Promise(r => img.onload = r)

        // Draw & Center
        ctx.fillStyle = '#18181b'
        ctx.fillRect(0, 0, 1080, 1080)

        const scale = Math.min(1080 / img.width, 1080 / img.height)
        const w = img.width * scale
        const h = img.height * scale
        const x = (1080 - w) / 2
        const y = (1080 - h) / 2

        ctx.drawImage(img, x, y, w, h)

        // Overlay (Happy Birthday)
        ctx.font = 'bold 80px sans-serif'
        ctx.fillStyle = 'rgba(236, 72, 153, 0.8)' // pink-500
        ctx.textAlign = 'center'
        ctx.fillText('Happy Birthday Mohini! 🎂', 540, 1000)

        count++
        setTimeout(draw, 500) // 2 FPS visual
    }

    draw()

    return new Promise((resolve) => {
        recorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'video/webm' })
            resolve(URL.createObjectURL(blob))
        }
    })
}

export default function GifGenerator({ gallery }: { gallery: { url: string }[] }) {
    const [generating, setGenerating] = useState(false)
    const [videoUrl, setVideoUrl] = useState<string | null>(null)

    const handleCreate = async () => {
        if (gallery.length === 0) return;
        setGenerating(true)
        try {
            // Take first 5 images
            const subset = gallery.slice(0, 5).map(g => g.url)
            const url = await makeVideo(subset, 'webm')
            setVideoUrl(url)
        } catch (e) {
            console.error(e)
            alert('Sorry, could not generate video. Try again later!')
        }
        setGenerating(false)
    }

    return (
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col items-center text-center shadow-lg">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mb-4 text-white animate-pulse">
                <Video className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-white mb-2">Auto-Generate "Birthday Reel" 🎞️</h3>
            <p className="text-zinc-400 text-sm mb-6 max-w-xs">
                Combine the gallery photos into a cute looping video instantly!
            </p>

            {videoUrl ? (
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="space-y-4"
                >
                    <video src={videoUrl} controls autoPlay loop className="w-full max-w-xs rounded-lg border-2 border-pink-500/50 shadow-lg mx-auto" />
                    <a
                        href={videoUrl}
                        download="mohini-reel.webm"
                        className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold px-6 py-2 rounded-full transition-colors"
                    >
                        <Download className="w-4 h-4" /> Download Video
                    </a>
                    <button
                        onClick={() => setVideoUrl(null)}
                        className="block w-full text-zinc-500 text-xs hover:text-white mt-2"
                    >
                        Create Another
                    </button>
                </motion.div>
            ) : (
                <button
                    onClick={handleCreate}
                    disabled={generating || gallery.length === 0}
                    className="bg-white text-black font-bold px-8 py-3 rounded-full hover:bg-zinc-200 disabled:opacity-50 flex items-center gap-2 transition-transform active:scale-95"
                >
                    {generating ? (
                        <>Generating... <span className="animate-spin">⏳</span></>
                    ) : (
                        <>Create Magic Video ✨</>
                    )}
                </button>
            )}

            {gallery.length === 0 && (
                <p className="text-red-400 text-xs mt-4">Add photos to Gallery first!</p>
            )}
        </div>
    )
}
