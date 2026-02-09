'use client'
import { motion } from 'framer-motion'
import { Play, Sparkles, Gift } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useMusic } from '@/context/MusicContext'

import PremiumLoader from './PremiumLoader'

export default function GiftClient({ introAudioUrl, targetDate, recipientName }: { introAudioUrl?: string, targetDate: string, recipientName: string }) {
    const router = useRouter()
    const { setUnlocked, setIsPlaying, restartMusic } = useMusic()
    const [loading, setLoading] = useState(false)
    const [verifying, setVerifying] = useState(true)

    useEffect(() => {
        // PRELOAD HOME for instant switch
        router.prefetch('/home')

        // STRICT RULE: If we are on Gift Page, Music MUST STOP.
        setIsPlaying(false)
        sessionStorage.setItem('music_playing', 'false')

        const checkFlow = () => {
            // ... existing checks
            // 1. If gift already opened... code is commented out.

            setVerifying(false)
        }
        checkFlow()
    }, [targetDate, router, setIsPlaying])

    const handleOpenGift = () => {
        setLoading(true)
        localStorage.setItem('giftOpened', 'true')

        // RESTART MUSIC FROM SCRATCH
        restartMusic()
        setIsPlaying(true)
        setUnlocked(true)

        // Add a slight delay for effect
        setTimeout(() => {
            router.push('/home')
        }, 1200) // Slightly faster transition
    }

    if (verifying || loading) return <PremiumLoader />

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
                <div className="space-y-6">
                    <motion.div
                        animate={{ y: [0, -20, 0] }}
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        className="w-32 h-32 bg-gradient-to-tr from-pink-500 to-purple-600 rounded-[2rem] mx-auto flex items-center justify-center shadow-[0_0_80px_rgba(236,72,153,0.4)] relative"
                    >
                        <Gift className="w-16 h-16 text-white" />
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full animate-ping opacity-75" />
                    </motion.div>

                    <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter">
                        Sab Ready Hai... <br />
                        <span className="text-pink-500">Bas Ek Click Baaki Hai 💖</span>
                    </h1>
                </div>

                <button
                    onClick={handleOpenGift}
                    disabled={loading}
                    className="group relative px-12 py-6 bg-white text-black font-black text-2xl rounded-full shadow-[0_20px_60px_rgba(255,255,255,0.2)] transition-all hover:scale-105 active:scale-95 disabled:opacity-50 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="relative z-10 flex items-center gap-3 group-hover:text-white transition-all">
                        {loading ? "Dil Tham Ke Baitho... 💖" : "Open Your Gift 🎁"}
                    </span>
                </button>

                <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs animate-pulse">
                    Are you ready for the magic? ✨
                </p>
            </motion.div>
        </main>
    )
}
