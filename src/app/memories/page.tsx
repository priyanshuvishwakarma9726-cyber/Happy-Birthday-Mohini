'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Heart, Sparkles, ArrowLeft, Camera, Video, PlayCircle } from 'lucide-react'
import Link from 'next/link'
import { useMusic } from '@/context/MusicContext'

interface Memory {
    id: number
    type: 'photo' | 'video'
    file_path: string
    title: string
    description: string
    order_index: number
}

export default function MemoryAlbumPage() {
    const { setMusicPaused, setIsPlaying, isUnlocked } = useMusic()
    const router = useRouter()
    const [memories, setMemories] = useState<Memory[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!isUnlocked) {
            router.push('/')
        }
    }, [isUnlocked, router])

    const fetchMemories = async () => {
        try {
            const res = await fetch('/api/memories')
            const data = await res.json()
            if (Array.isArray(data)) {
                setMemories(data)
            }
        } catch (e) {
            console.error('Fetch memories error:', e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMemories()
        // Ensure music is playing when entering this page
        setIsPlaying(true)
    }, [])

    const handleVideoPlay = () => {
        setMusicPaused(true)
    }

    const handleVideoEnd = () => {
        setMusicPaused(false)
    }

    return (
        <main className="min-h-screen bg-black text-white selection:bg-pink-500/30">
            {/* Animated Background Decor */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-600/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" />
            </div>

            {/* Header / Sidebar-like Navigation */}
            <header className="sticky top-0 z-50 w-full bg-black/80 backdrop-blur-xl border-b border-white/5 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link
                        href="/home#surprises"
                        className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group"
                    >
                        <div className="p-2 bg-white/5 rounded-full group-hover:bg-pink-500/10 transition-colors">
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        </div>
                        <span className="font-bold uppercase tracking-widest text-xs">Back to Surprise Box</span>
                    </Link>

                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(236,72,153,0.4)]">
                            <Heart className="w-4 h-4 text-white fill-white" />
                        </div>
                        <h1 className="text-sm font-black uppercase tracking-[0.2em] hidden md:block">Memory Album</h1>
                    </div>

                    <div className="w-24 hidden md:block" /> {/* Spacer */}
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 relative z-10">
                {/* Hero Title */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-20 space-y-4"
                >
                    <h2 className="text-4xl md:text-7xl font-black text-white tracking-tight italic">
                        Our Best Moments Together <span className="text-pink-500 not-italic">💖</span>
                    </h2>
                    <p className="text-zinc-500 text-lg md:text-xl font-medium max-w-2xl mx-auto">
                        Har photo ek kahani hai, har video ek jazbaat. Ye saari yaadein sirf tumhare liye...
                    </p>
                </motion.div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-6">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                            className="w-12 h-12 border-2 border-pink-500 border-t-transparent rounded-full shadow-[0_0_20px_rgba(236,72,153,0.3)]"
                        />
                        <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs animate-pulse">
                            Memories loading... something beautiful is coming 💕
                        </p>
                    </div>
                ) : memories.length === 0 ? (
                    <div className="text-center py-40 border-2 border-dashed border-white/5 rounded-[4rem]">
                        <Sparkles className="w-12 h-12 text-zinc-800 mx-auto mb-6" />
                        <p className="text-zinc-600 italic text-xl">"No memories recorded yet. Let's create some together!"</p>
                    </div>
                ) : (
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                        {memories.map((m, i) => (
                            <motion.div
                                key={m.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                viewport={{ once: true }}
                                className="break-inside-avoid relative group rounded-[2.5rem] overflow-hidden border border-white/5 bg-zinc-900/40 hover:border-pink-500/40 transition-all duration-700 shadow-2xl"
                            >
                                <div className="relative overflow-hidden">
                                    {m.type === 'video' ? (
                                        <div className="relative aspect-video">
                                            <video
                                                src={m.file_path}
                                                className="w-full h-full object-cover"
                                                controls
                                                onPlay={handleVideoPlay}
                                                onPause={handleVideoEnd}
                                                onEnded={handleVideoEnd}
                                            />
                                            <div className="absolute top-4 left-4 p-2 bg-black/40 backdrop-blur-md rounded-full">
                                                <Video className="w-4 h-4 text-pink-400" />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="relative overflow-hidden">
                                            <img
                                                src={m.file_path}
                                                alt={m.title}
                                                className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-105"
                                            />
                                            <div className="absolute top-4 left-4 p-2 bg-black/40 backdrop-blur-md rounded-full">
                                                <Camera className="w-4 h-4 text-blue-400" />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="p-8 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-2xl font-black text-white group-hover:text-pink-400 transition-colors tracking-tight">
                                            {m.title || "Memory"}
                                        </h3>
                                        <span className="text-[10px] font-black text-zinc-600 bg-black/50 px-3 py-1 rounded-full border border-white/5">#{m.order_index}</span>
                                    </div>
                                    <p className="text-zinc-400 font-serif italic text-lg leading-relaxed">
                                        "{m.description || "Beautiful moment captured forever... ❤️"}"
                                    </p>
                                    <div className="pt-4 border-t border-white/5 flex items-center gap-2">
                                        <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
                                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest italic">Eternal Fragment</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer Outro */}
            <footer className="py-20 text-center relative z-10 px-6">
                <div className="max-w-xl mx-auto space-y-8 bg-zinc-900/50 p-12 rounded-[3rem] border border-white/5 backdrop-blur-md">
                    <Heart className="w-12 h-12 text-pink-600 mx-auto fill-pink-600 animate-pulse" />
                    <p className="text-2xl text-zinc-300 font-light italic leading-relaxed">
                        "Ye sirf photos nahi hain, ye hamari zindagi ke sabse haseen lamhe hain. Love you forever!"
                    </p>
                </div>
            </footer>
        </main>
    )
}
