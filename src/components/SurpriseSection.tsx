'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Sparkles, Wand2, Volume2, Calendar, Coffee, Moon, Sun, Camera, Gift } from 'lucide-react'
import { useRouter } from 'next/navigation'
import confetti from 'canvas-confetti'

interface Props {
    content: any // key-value store
    gallery: any[] // photos
    onThemeChange?: (theme: 'romantic' | 'party' | 'cozy') => void
    onPlayStateChange?: (playing: boolean) => void
}

const DEFAULT_LOVE_MESSAGES = [
    "You are my sunshine ☀️",
    "Thinking of you... 💭",
    "You make my heart smile 😊",
    "Sending virtual hugs 🤗",
    "Remember to smile! ✨"
]

export default function SurpriseSection({ content, gallery, onThemeChange, onPlayStateChange }: Props) {
    const router = useRouter()
    const [theme, setTheme] = useState<'romantic' | 'party' | 'cozy'>('romantic')
    const [showTimeline, setShowTimeline] = useState(false)
    const [showAmplifier, setShowAmplifier] = useState(false)
    const [wishText, setWishText] = useState("")
    const [amplifiedWish, setAmplifiedWish] = useState("")
    const [voicePlaying, setVoicePlaying] = useState(false)
    const voiceRef = useRef<HTMLAudioElement | null>(null)

    // Load custom messages if available
    let loveMessages = DEFAULT_LOVE_MESSAGES
    if (content.love_messages) {
        try {
            const parsed = JSON.parse(content.love_messages)
            if (Array.isArray(parsed)) loveMessages = parsed
        } catch (e) {
            console.error("Love messages parse error:", e)
        }
    }

    // Random Love Popup
    useEffect(() => {
        const interval = setInterval(() => {
            if (Math.random() > 0.7) { // 30% chance every 10s
                const msg = loveMessages[Math.floor(Math.random() * loveMessages.length)]
                // Trigger toast
                const toast = document.createElement('div')
                toast.className = "fixed bottom-10 right-10 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-2xl border border-pink-200 z-50 animate-bounce text-pink-600 font-bold flex items-center gap-2"
                toast.innerHTML = `<span>💌</span> ${msg}`
                document.body.appendChild(toast)
                setTimeout(() => toast.remove(), 4000)
            }
        }, 10000)
        return () => clearInterval(interval)
    }, [loveMessages])

    const handleThemeSwitch = (newTheme: 'romantic' | 'party' | 'cozy') => {
        setTheme(newTheme)
        onThemeChange?.(newTheme)
    }

    const playWhisper = () => {
        if (!content.voice_url) return alert("No whisper recorded yet! 🤫")

        if (!voiceRef.current) {
            voiceRef.current = new Audio(content.voice_url)
            voiceRef.current.onended = () => {
                setVoicePlaying(false)
                onPlayStateChange?.(false)
            }
        }

        if (voicePlaying) {
            voiceRef.current.pause()
            setVoicePlaying(false)
            onPlayStateChange?.(false)
        } else {
            voiceRef.current.play()
            setVoicePlaying(true)
            onPlayStateChange?.(true)
        }
    }

    const amplifyWish = () => {
        if (!wishText.trim()) return

        const magicPrefixes = [
            "✨ In the tapestry of fate, ",
            "🌟 By the power of the stars, ",
            "💖 With infinite love and magic, ",
            "✨ Dearest One, ",
            "🔮 Through the echoes of destiny, "
        ]

        const magicSuffixes = [
            " with all my heart and soul. May the universe conspire to make this true! 💖",
            "... your path is now illuminated with joy and wonder! ✨",
            "... may this wish manifest in the most beautiful way possible! 🌟",
            "... because you deserve every ounce of magic in this world! ❤️",
            "... and so it begins! The stars are aligning just for you. 🌠"
        ]

        const randomPrefix = magicPrefixes[Math.floor(Math.random() * magicPrefixes.length)]
        const randomSuffix = magicSuffixes[Math.floor(Math.random() * magicSuffixes.length)]

        const amplified = `${randomPrefix}${wishText}${randomSuffix}`
        setAmplifiedWish(amplified)

        const count = 200;
        const defaults = { origin: { y: 0.7 } };

        function fire(particleRatio: number, opts: any) {
            confetti({ ...defaults, ...opts, particleCount: Math.floor(count * particleRatio) });
        }

        fire(0.25, { spread: 26, startVelocity: 55 });
        fire(0.2, { spread: 60 });
        fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
        fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
        fire(0.1, { spread: 120, startVelocity: 45 });
    }

    const [isRedirecting, setIsRedirecting] = useState(false)
    const [redirectStep, setRedirectStep] = useState(0) // 0: init, 1: text1, 2: text2, 3: text3

    const triggerFinale = () => {
        setIsRedirecting(true)

        // Step 1: Hold Breath
        setRedirectStep(1)

        // Step 2: Are you ready?
        setTimeout(() => setRedirectStep(2), 1500)

        // Step 3: Here we go...
        setTimeout(() => setRedirectStep(3), 3000)

        // Step 4: EXPLOSION & Redirect
        setTimeout(() => {
            confetti({
                particleCount: 200,
                spread: 100,
                origin: { y: 0.6 },
                colors: ['#ff0000', '#ff69b4', '#ffd700']
            });
            router.push('/memories')
        }, 4500)
    }

    return (
        <section id="surprises" className="py-20 px-4 bg-zinc-900/50 backdrop-blur-sm relative border-t border-zinc-800">
            {/* SUSPENSE OVERLAY */}
            <AnimatePresence>
                {isRedirecting && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center p-8 text-center"
                    >
                        {/* Background Pulse */}
                        <motion.div
                            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                            className="absolute inset-0 bg-pink-900/20 radial-gradient"
                        />

                        {/* Central Heartbeat */}
                        <motion.div
                            animate={{ scale: [1, 1.5, 1], rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
                            className="relative z-10 mb-12"
                        >
                            <Heart className="w-32 h-32 text-pink-600 fill-pink-600 drop-shadow-[0_0_50px_rgba(236,72,153,0.8)]" />
                        </motion.div>

                        {/* Suspense Text Sequence */}
                        <div className="h-24 flex items-center justify-center relative z-10">
                            <AnimatePresence mode='wait'>
                                {redirectStep === 1 && (
                                    <motion.h2
                                        key="step1"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="text-3xl md:text-5xl font-black text-white tracking-widest uppercase"
                                    >
                                        Hold Your Breath... 🤫
                                    </motion.h2>
                                )}
                                {redirectStep === 2 && (
                                    <motion.h2
                                        key="step2"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1.1 }}
                                        exit={{ opacity: 0, scale: 1.5 }}
                                        className="text-4xl md:text-6xl font-black text-pink-500 tracking-tighter"
                                    >
                                        Are You Ready? 🫣
                                    </motion.h2>
                                )}
                                {redirectStep === 3 && (
                                    <motion.h2
                                        key="step3"
                                        initial={{ opacity: 0, filter: 'blur(10px)' }}
                                        animate={{ opacity: 1, filter: 'blur(0px)' }}
                                        exit={{ opacity: 0, scale: 2 }}
                                        className="text-5xl md:text-7xl font-black text-white bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-red-500"
                                    >
                                        IT'S SHOWTIME! 🚀
                                    </motion.h2>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl font-black text-center text-white mb-12 flex items-center justify-center gap-2">
                    <Sparkles className="text-purple-400" /> Surprise Box 🎁
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                    {/* 1. Theme Switcher */}
                    <div className="bg-zinc-800 p-6 rounded-2xl border border-zinc-700 hover:border-pink-500/50 transition-colors">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Moon className="w-5 h-5 text-indigo-400" /> Mood Setter
                        </h3>
                        <div className="flex gap-2">
                            <button onClick={() => handleThemeSwitch('romantic')} className={`flex-1 py-2 rounded-lg text-sm font-bold ${theme === 'romantic' ? 'bg-pink-600 text-white' : 'bg-zinc-700 text-zinc-400'}`}>❤️ Love</button>
                            <button onClick={() => handleThemeSwitch('party')} className={`flex-1 py-2 rounded-lg text-sm font-bold ${theme === 'party' ? 'bg-purple-600 text-white' : 'bg-zinc-700 text-zinc-400'}`}>🎉 Party</button>
                            <button onClick={() => handleThemeSwitch('cozy')} className={`flex-1 py-2 rounded-lg text-sm font-bold ${theme === 'cozy' ? 'bg-orange-600 text-white' : 'bg-zinc-700 text-zinc-400'}`}>☕ Cozy</button>
                        </div>
                    </div>

                    {/* 2. Whisper Mode */}
                    <div className="bg-zinc-800 p-6 rounded-2xl border border-zinc-700 hover:border-pink-500/50 transition-colors">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Volume2 className="w-5 h-5 text-pink-400" /> Whisper Mode
                        </h3>
                        <button
                            onClick={playWhisper}
                            className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${voicePlaying ? 'bg-pink-500/20 text-pink-400 animate-pulse' : 'bg-zinc-700 hover:bg-zinc-600 text-white'}`}
                        >
                            {voicePlaying ? "Listening... 👂" : "Play Secret Message 🔊"}
                        </button>
                    </div>

                    {/* 3. Memory Timeline */}
                    <div className="bg-zinc-800 p-6 rounded-2xl border border-zinc-700 hover:border-pink-500/50 transition-colors">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-blue-400" /> Flashback
                        </h3>
                        <button
                            onClick={() => setShowTimeline(!showTimeline)}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-colors"
                        >
                            {showTimeline ? "Hide Memories" : "View Timeline 📅"}
                        </button>
                    </div>

                    {/* 4. Wish Amplifier */}
                    <div className="bg-zinc-800 p-6 rounded-2xl border border-zinc-700 hover:border-pink-500/50 transition-colors">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Wand2 className="w-5 h-5 text-yellow-400" /> Wish Magic
                        </h3>
                        <button
                            onClick={() => setShowAmplifier(!showAmplifier)}
                            className="w-full py-3 bg-yellow-600 hover:bg-yellow-500 text-white rounded-xl font-bold transition-colors"
                        >
                            {showAmplifier ? "Close Magic" : "Make a Wish ✨"}
                        </button>
                    </div>

                </div>

                {/* EXPANDABLE SECTIONS */}
                <AnimatePresence>
                    {showTimeline && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden mt-8"
                        >
                            <div className="bg-zinc-800/50 rounded-3xl p-8 border border-white/10">
                                <h3 className="text-2xl font-bold text-white mb-6 text-center">Our Journey Together 🛤️</h3>
                                <div className="space-y-8 relative before:absolute before:left-4 md:before:left-1/2 before:top-0 before:bottom-0 before:w-1 before:bg-pink-500/30">
                                    {/* Mock Content - would come from props/JSON */}
                                    {[2021, 2022, 2023, 2024, 2025].map((year, i) => (
                                        <div key={year} className={`relative flex items-center justify-between md:justify-normal md:even:flex-row-reverse group`}>
                                            <div className="hidden md:block w-5/12" />
                                            <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-8 h-8 bg-pink-500 rounded-full border-4 border-zinc-900 z-10 shadow-lg group-hover:scale-125 transition-transform" />
                                            <div className="w-10/12 md:w-5/12 pl-12 md:pl-0 md:group-even:pl-8 md:group-odd:pr-8">
                                                <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-700 hover:border-pink-500 transition-colors shadow-lg">
                                                    <span className="text-pink-500 font-black text-xl mb-2 block">{year}</span>
                                                    <h4 className="text-white font-bold mb-2">Beautiful Memory</h4>
                                                    <p className="text-zinc-400 text-sm">Remember that time we laughed until we cried? Best day ever. ❤️</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {showAmplifier && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden mt-8"
                        >
                            <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-3xl p-8 text-center border border-white/10 shadow-2xl relative overflow-hidden">
                                {/* Decor */}
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl animate-pulse" />
                                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />

                                <h3 className="text-3xl font-bold text-white mb-2 relative z-10">Wish Amplifier 🔮</h3>
                                <p className="text-indigo-200 mb-8 relative z-10">Type a simple wish, and let the magic of the universe amplify it.</p>

                                <div className="max-w-2xl mx-auto space-y-6 relative z-10">
                                    <input
                                        type="text"
                                        placeholder="I wish for happiness..."
                                        className="w-full bg-white/10 border-2 border-white/20 p-6 rounded-2xl text-xl text-white placeholder:text-white/30 focus:border-pink-500 outline-none text-center shadow-inner transition-all focus:bg-white/15"
                                        value={wishText}
                                        onChange={e => setWishText(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && amplifyWish()}
                                        autoFocus
                                    />
                                    <button
                                        onClick={amplifyWish}
                                        disabled={!wishText}
                                        className="px-12 py-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-black text-lg rounded-full shadow-[0_10px_30px_rgba(236,72,153,0.3)] transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
                                    >
                                        Amplify My Wish! ✨
                                    </button>

                                    {amplifiedWish && (
                                        <motion.div
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="bg-white/10 p-8 rounded-2xl border-2 border-pink-500/40 mt-8 shadow-2xl backdrop-blur-md relative"
                                        >
                                            <Sparkles className="absolute -top-4 -left-4 text-yellow-400 w-8 h-8 animate-spin-slow" />
                                            <Sparkles className="absolute -bottom-4 -right-4 text-pink-400 w-8 h-8 animate-spin-slow" />
                                            <p className="text-2xl font-serif text-pink-100 italic leading-relaxed">
                                                "{amplifiedWish}"
                                            </p>
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Final Surprise Button */}
                <div className="text-center mt-12">
                    <button
                        onClick={triggerFinale}
                        className="group relative px-12 py-6 bg-gradient-to-r from-red-500 via-pink-500 to-red-500 bg-[length:200%_auto] hover:bg-right transition-all duration-500 rounded-full font-black text-2xl text-white shadow-[0_0_50px_rgba(236,72,153,0.5)] hover:shadow-[0_0_80px_rgba(236,72,153,0.8)] active:scale-95"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-3">
                            <Gift className="w-8 h-8 animate-bounce" />
                            BIG SURPRISE
                            <Heart className="w-8 h-8 animate-pulse text-white" fill="white" />
                        </span>
                    </button>
                    <p className="mt-4 text-zinc-500 font-medium">Click only if you're ready to be overwhelmed!</p>
                </div>
            </div>
        </section>
    )
}

function XIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
    )
}
function Stars({ className }: { className?: string }) {
    return <StarsIcon className={className} />
}
function StarsIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>
    )
}
