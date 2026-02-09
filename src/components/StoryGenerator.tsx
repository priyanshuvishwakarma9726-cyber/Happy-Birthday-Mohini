'use client'

import React, { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Download, Camera, Share2, Instagram } from 'lucide-react'

export default function StoryGenerator({ gallery }: { gallery: { url: string }[] }) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [selectedImg, setSelectedImg] = useState<string | null>(null)
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
    const [template, setTemplate] = useState(0) // 0: Romantic, 1: Fun

    const generateStory = () => {
        if (!selectedImg || !canvasRef.current) return

        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Setup 1080x1920 (Instagram Story)
        canvas.width = 1080
        canvas.height = 1920

        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.src = selectedImg
        img.onload = () => {
            // Background
            if (template === 0) {
                // Gradient Pink
                const grad = ctx.createLinearGradient(0, 0, 0, 1920)
                grad.addColorStop(0, '#fce7f3')
                grad.addColorStop(1, '#db2777')
                ctx.fillStyle = grad
            } else {
                // Fun Confetti dark
                ctx.fillStyle = '#18181b'
            }
            ctx.fillRect(0, 0, 1080, 1920)

            // Draw Image (Centered Card)
            // Calculate aspect ratio fit but cover a central area
            const padding = 100
            const cardW = 1080 - (padding * 2)
            const cardH = 1200
            const cardY = 300

            // Draw Card Shadow
            ctx.shadowColor = 'rgba(0,0,0,0.3)'
            ctx.shadowBlur = 50
            ctx.fillStyle = 'white'
            ctx.fillRect(padding, cardY, cardW, cardH)
            ctx.shadowBlur = 0

            // Draw Image inside card (Cover)
            ctx.save()
            ctx.beginPath()
            ctx.rect(padding + 20, cardY + 20, cardW - 40, cardH - 200) // Space for caption
            ctx.clip()

            // Scale logic
            const scale = Math.max((cardW - 40) / img.width, (cardH - 200) / img.height)
            const x = (cardW - 40 - img.width * scale) / 2 + padding + 20
            const y = (cardH - 200 - img.height * scale) / 2 + cardY + 20
            ctx.drawImage(img, x, y, img.width * scale, img.height * scale)
            ctx.restore()

            // Text
            ctx.fillStyle = template === 0 ? '#db2777' : '#facc15'
            ctx.font = 'bold 80px cursive'
            ctx.textAlign = 'center'
            ctx.fillText('Happy Birthday Mohini!', 540, 200)

            // Bottom Caption
            ctx.fillStyle = '#333'
            ctx.font = 'italic 50px sans-serif'
            ctx.fillText('Best Day Ever! 🎂', 540, cardY + cardH - 80)

            // Sticker
            ctx.font = '150px Arial'
            ctx.fillText('🎁', 900, 1700)
            ctx.fillText('❤️', 180, 1600)

            // Link in Bio
            ctx.fillStyle = 'white'
            ctx.fillRect(340, 1750, 400, 100)
            ctx.fillStyle = 'black'
            ctx.font = 'bold 40px sans-serif'
            ctx.fillText('LINK IN BIO 🔗', 540, 1815)

            setDownloadUrl(canvas.toDataURL('image/png'))
        }
    }

    return (
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col items-center text-center shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Instagram className="w-40 h-40 text-pink-500" />
            </div>

            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-6 flex items-center gap-2 z-10">
                <Instagram className="text-pink-500 w-6 h-6" /> Insta Story Maker 🎨
            </h3>

            {/* Image Selector */}
            <div className="flex gap-2 mb-6 overflow-x-auto w-full pb-2 px-1 snap-x">
                {gallery.map(img => (
                    <button
                        key={img.url}
                        onClick={() => setSelectedImg(img.url)}
                        className={`min-w-[80px] h-[80px] rounded-lg overflow-hidden border-2 transition-all snap-center ${selectedImg === img.url ? 'border-pink-500 scale-105 shadow-xl' : 'border-zinc-700 opacity-60'}`}
                    >
                        <img src={img.url} className="w-full h-full object-cover" />
                    </button>
                ))}
                {gallery.length === 0 && <p className="text-zinc-500 text-sm">No photos available.</p>}
            </div>

            <div className="flex gap-4 mb-6 z-10">
                <button onClick={() => setTemplate(0)} className={`px-4 py-1 rounded-full text-xs font-bold ${template === 0 ? 'bg-pink-500 text-white' : 'bg-zinc-800 text-zinc-400'}`}>Romantic 💖</button>
                <button onClick={() => setTemplate(1)} className={`px-4 py-1 rounded-full text-xs font-bold ${template === 1 ? 'bg-yellow-500 text-black' : 'bg-zinc-800 text-zinc-400'}`}>Fun 🎉</button>
            </div>

            <button
                onClick={generateStory}
                disabled={!selectedImg}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 rounded-xl hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 transition-transform active:scale-95 mb-6 z-10"
            >
                Generate Story 🪄
            </button>

            {downloadUrl && (
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="w-full space-y-4 border-t border-zinc-800 pt-6 z-10"
                >
                    <p className="text-xs uppercase text-green-400 font-bold tracking-widest">Ready to Post!</p>
                    <img src={downloadUrl} className="w-1/2 mx-auto rounded-lg shadow-2xl border border-white/10" />
                    <a
                        href={downloadUrl}
                        download="mohini-story.png"
                        className="inline-flex items-center gap-2 bg-white text-black font-bold px-6 py-2 rounded-full hover:bg-zinc-200 transition-colors w-full justify-center"
                    >
                        <Download className="w-4 h-4" /> Download Image
                    </a>
                </motion.div>
            )}

            <canvas ref={canvasRef} className="hidden" />
        </div>
    )
}
