'use client'
import { motion } from 'framer-motion'
import { Play, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useMusic } from '@/context/MusicContext'

export default function IntroClient({ introAudioUrl, recipientName }: { introAudioUrl?: string, recipientName?: string }) {
    const router = useRouter()
    const { setUnlocked, setIsPlaying } = useMusic()
    const [loading, setLoading] = useState(false)

    const handleStart = () => {
        setLoading(true)
        setIsPlaying(true)
        setUnlocked(true)
        router.push('/home')
    }

    return (
        <main className="min-h-screen bg-black flex flex-col items-center justify-center text-white relative overflow-hidden">
            {introAudioUrl && <audio src={introAudioUrl} autoPlay loop />}
            {/* Background Decor */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-pink-900/20 via-transparent to-transparent opacity-50" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center z-10 space-y-12 px-6"
            >
                <div className="space-y-4">
                    <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 4 }}
                        className="w-24 h-24 bg-gradient-to-tr from-pink-500 to-purple-600 rounded-[2rem] mx-auto flex items-center justify-center shadow-[0_0_50px_rgba(236,72,153,0.3)]"
                    >
                        <Sparkles className="w-12 h-12 text-white" />
                    </motion.div>
                    <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter">
                        A Special Gift <br />
                        <span className="text-pink-500">For {recipientName || "Mohini"} ❤️</span>
                    </h1>
                </div>

                <button
                    onClick={handleStart}
                    disabled={loading}
                    className="group relative px-12 py-6 bg-white text-black font-black text-2xl rounded-full shadow-[0_20px_60px_rgba(255,255,255,0.2)] transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
                    <span className="relative z-10 flex items-center gap-3 group-hover:text-white transition-all">
                        {loading ? "Opening... 🎁" : "Open Your Gift 🎁"}
                    </span>
                </button>

                <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs animate-pulse">
                    Listen closely... it's magical ✨
                </p>
            </motion.div>

            {/* Floating Hearts Decor */}
            <div className="absolute bottom-10 left-10 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute top-10 right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        </main>
    )
}
