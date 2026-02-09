'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Gift } from 'lucide-react'
import DayNightBackground from '@/components/DayNightBackground'
import PremiumLoader from './PremiumLoader'
import { useMusic } from '@/context/MusicContext'

export default function UnifiedGiftPage({ introAudioUrl, targetDate, recipientName }: { introAudioUrl?: string, targetDate: string, recipientName: string }) {
    const router = useRouter()
    const { setUnlocked, setIsPlaying, restartMusic } = useMusic()

    // States
    const [isGiftUnlocked, setIsGiftUnlocked] = useState(false)
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
    const [verifying, setVerifying] = useState(true)
    const [loading, setLoading] = useState(false)

    // Admin States
    const [typed, setTyped] = useState('')
    const [showLogin, setShowLogin] = useState(false)
    const [password, setPassword] = useState('')

    useEffect(() => {
        // 1. Initial State Check
        const params = new URLSearchParams(window.location.search)
        const isPreview = params.get('preview') === 'true'

        // Stricter admin check
        const isAdmin = isPreview && (
            localStorage.getItem('admin_auth') === 'true' ||
            document.cookie.split(';').some(c => c.trim() === 'admin_bypass=true')
        )

        const savedUnlock = localStorage.getItem('giftUnlocked') === 'true'

        // giftUnlocked is ONLY true on load if previously saved OR it's an intentional admin preview.
        // Public users MUST see the countdown initially if not already saved.
        if (savedUnlock || isAdmin) {
            setIsGiftUnlocked(true)
        }

        setVerifying(false)
        router.prefetch('/home')
        setIsPlaying(false)
    }, [targetDate, router, setIsPlaying])

    useEffect(() => {
        if (isGiftUnlocked) return;

        const timer = setInterval(() => {
            const now = new Date()
            let baseDate = new Date(targetDate)

            // 1. Fallback / Validation: If invalid date, default to March 30
            if (isNaN(baseDate.getTime())) {
                baseDate = new Date(now.getFullYear(), 2, 30)
            }

            // 2. Logic: Always target the birthday in the CURRENT year.
            // This ensures if it's currently Feb and birthday is March, we show the countdown.
            // If it's currently April and birthday was March, diff will be 0 and it unlocks.
            const tMonth = baseDate.getMonth()
            const tDay = baseDate.getDate()
            const target = new Date(now.getFullYear(), tMonth, tDay)

            const diff = Math.max(0, (target.getTime() - now.getTime()) / 1000)

            if (diff <= 0) {
                // Birthday is today or has passed this year
                setIsGiftUnlocked(true)
                localStorage.setItem('giftUnlocked', 'true')
                // Set cookie for middleware bypass
                document.cookie = "gift_unlocked=true; path=/; max-age=31536000"
                clearInterval(timer)
                return
            }

            setTimeLeft({
                days: Math.floor(diff / (3600 * 24)),
                hours: Math.floor((diff % (3600 * 24)) / 3600),
                minutes: Math.floor((diff % 3600) / 60),
                seconds: Math.floor(diff % 60)
            })
        }, 1000)
        return () => clearInterval(timer)
    }, [isGiftUnlocked, targetDate])

    // Keyboard listener for secret "mohini"
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            setTyped(prev => {
                const newStr = (prev + e.key).slice(-6)
                if (newStr.toLowerCase().includes('mohini')) {
                    setShowLogin(true)
                }
                return newStr
            })
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    const handleLogin = async () => {
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                body: JSON.stringify({ secret: password }),
                headers: { 'Content-Type': 'application/json' }
            })
            if (res.ok) {
                // Force reload to apply cookie and bypass middleware
                window.location.href = '/admin'
            } else {
                alert('Nah, wrong password! 😜')
            }
        } catch (e) { console.error(e) }
    }

    const handleOpenGift = () => {
        // 1. Persist state
        localStorage.setItem('giftOpened', 'true')
        document.cookie = "gift_unlocked=true; path=/; max-age=31536000"

        // 2. Prep music & transition
        setLoading(true)
        restartMusic()
        setIsPlaying(true)
        setUnlocked(true)

        // 3. Navigate with slight delay for transition feel
        setTimeout(() => {
            router.push('/home')
        }, 1200)
    }

    if (verifying || loading) return <PremiumLoader />

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center cursor-default overflow-hidden relative font-sans text-white bg-black">
            <DayNightBackground />

            <AnimatePresence mode="wait">
                {!isGiftUnlocked ? (
                    <motion.div
                        key="countdown"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                        transition={{ duration: 1 }}
                        className="z-10 relative w-full max-w-4xl mx-auto backdrop-blur-md bg-black/60 rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h1 className="text-4xl md:text-7xl font-black mb-6 drop-shadow-lg text-white tracking-tight">
                                Coming Soon... 🤫
                            </h1>
                        </motion.div>

                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-lg md:text-2xl text-white/80 mb-12 font-medium"
                        >
                            Sabar ka phal meetha hota hai, {recipientName}! <br />
                            <span className="text-pink-400 font-bold text-3xl mt-2 inline-block">30th March</span> tak wait karo ❤️
                        </motion.p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-16 justify-items-center">
                            {[
                                { val: timeLeft.days, label: 'Days' },
                                { val: timeLeft.hours, label: 'Hours' },
                                { val: timeLeft.minutes, label: 'Mins' },
                                { val: timeLeft.seconds, label: 'Secs' },
                            ].map((item, i) => (
                                <motion.div
                                    key={item.label}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.5 + (i * 0.1) }}
                                    className="flex flex-col items-center justify-center p-4 bg-black/40 rounded-2xl w-28 h-28 md:w-36 md:h-36 backdrop-blur-md border border-white/10 shadow-xl"
                                >
                                    <span className="text-3xl md:text-5xl font-black text-white tabular-nums">
                                        {String(item.val).padStart(2, '0')}
                                    </span>
                                    <span className="text-xs uppercase tracking-widest text-white/70 mt-2 font-bold">{item.label}</span>
                                </motion.div>
                            ))}
                        </div>

                        {showLogin && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-black/80 backdrop-blur-md p-6 rounded-2xl border border-pink-500/50 shadow-2xl max-w-sm mx-auto"
                            >
                                <h3 className="text-white font-bold mb-4">Admin Access 🕵️‍♀️</h3>
                                <div className="flex gap-2">
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                                        placeholder="Enter Secret..."
                                        className="flex-1 bg-zinc-800 border-zinc-700 border rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    />
                                    <button
                                        onClick={handleLogin}
                                        className="bg-pink-600 hover:bg-pink-500 text-white px-4 py-2 rounded-lg font-bold transition-colors shadow-lg shadow-pink-500/20"
                                    >
                                        Go
                                    </button>
                                </div>
                            </motion.div>
                        )}

                    </motion.div>
                ) : (
                    <motion.div
                        key="gift-unlocked"
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
                            className="group relative px-12 py-6 bg-white text-black font-black text-2xl rounded-full shadow-[0_20px_60px_rgba(255,255,255,0.2)] transition-all hover:scale-105 active:scale-95 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <span className="relative z-10 flex items-center gap-3 group-hover:text-white transition-all">
                                Open Your Gift 🎁
                            </span>
                        </button>

                        <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs animate-pulse">
                            Are you ready for the magic? ✨
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
