'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles, Heart } from 'lucide-react'
import confetti from 'canvas-confetti'

interface WishData {
    message: string;
    autoReply: string;
    createdAt: string;
}

// Typing Animation Component
const TypingText = ({ text, delay = 500 }: { text: string, delay?: number }) => {
    const [displayedText, setDisplayedText] = useState('')
    const [started, setStarted] = useState(false)

    useEffect(() => {
        const timeout = setTimeout(() => {
            setStarted(true)
        }, delay)
        return () => clearTimeout(timeout)
    }, [delay])

    useEffect(() => {
        if (!started) return

        let i = 0
        const interval = setInterval(() => {
            setDisplayedText(text.slice(0, i + 1))
            i++
            if (i >= text.length) clearInterval(interval)
        }, 50) // Typing speed

        return () => clearInterval(interval)
    }, [text, started])

    return (
        <span className="inline-block">
            {displayedText}
            {displayedText.length < text.length && (
                <span className="inline-block w-0.5 h-6 ml-1 bg-pink-500 animate-pulse align-middle" />
            )}
        </span>
    )
}

// Sophisticated Client-Side 'Universe AI' Engine (Free & API-less)
const WISH_ENGINE = {
    responses: [
        "The stars have aligned for this. Your wish is not just a dream, it's a future reality being woven right now. ✨",
        "The universe hears you, Mohini. This beautiful intention of yours has been etched into the cosmic fabric. It shall be. ❤️",
        "A wish made with such a pure heart never goes unheard. Watch as the magic unfolds in the coming days... 🌟",
        "Your magic is growing. This wish is the seed of something truly breathtaking. Believe in the impossible. 🦋",
        "The cosmos whispers: 'Yes'. Your vibration today is matching the life you've always dreamed of. 💫",
        "Something even better than what you asked for is on its way. Trust the timing of your life. 🪐",
        "You are the architect of your own magic. This wish is your blueprint. Every atom is working to make it happen for you! 🌈"
    ],
    generateReply: (message: string) => {
        // Simple logic to select a response based on message length or random
        const index = Math.abs(message.length + Math.floor(Math.random() * 10)) % WISH_ENGINE.responses.length;
        return WISH_ENGINE.responses[index];
    }
};

import { useContent } from '@/context/ContentContext'

export default function WishBox() {
    const { content } = useContent()
    const [wish, setWish] = useState('')
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<WishData | null>(null)
    const resultRef = useRef<HTMLDivElement>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!wish.trim()) return

        setLoading(true)
        // Simulate 'AI' Processing
        setTimeout(() => {
            const autoReply = WISH_ENGINE.generateReply(wish);
            setResult({
                message: wish,
                autoReply: autoReply,
                createdAt: new Date().toLocaleTimeString()
            })
            setWish('')
            setLoading(false)

            // 1. Confetti Burst
            const duration = 3000;
            const end = Date.now() + duration;

            const frame = () => {
                confetti({
                    particleCount: 2,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0, y: 0.5 },
                    colors: ['#ec4899', '#ffffff'],
                    shapes: ['heart'] as any,
                    scalar: 2
                });
                confetti({
                    particleCount: 2,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1, y: 0.5 },
                    colors: ['#ec4899', '#ffffff'],
                    shapes: ['heart'] as any,
                    scalar: 2
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            };
            frame();

            // Smooth scroll to result
            setTimeout(() => {
                resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }, 100)
        }, 2000)
    }

    return (
        <section className="py-20 px-4 relative overflow-hidden bg-zinc-950">
            {/* 3. Soft Heartbeat Background Effect */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
                <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.1, 0.05] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="w-[800px] h-[800px] bg-pink-600/10 rounded-full blur-[100px]"
                />
            </div>

            {/* Background Sparkles */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-pink-900 via-zinc-950 to-zinc-950 z-0" />

            <div className="max-w-3xl mx-auto relative z-10" ref={resultRef}>
                <div className="text-center mb-12 space-y-4">
                    <span className="inline-block px-4 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-sm font-bold tracking-widest uppercase">
                        {content.wishbox_title || "Make a Wish ✨"}
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
                        {content.wishbox_heading || "What's Your Biggest Dream?"}
                    </h2>
                    <p className="text-zinc-400 max-w-lg mx-auto text-lg">
                        {content.wishbox_subheading || "Likh do jo bhi dil me hai. Aaj sab kuch sach ho sakta hai if you believe! 💖"}
                    </p>
                </div>

                <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">

                    <AnimatePresence mode="wait">
                        {!result ? (
                            <motion.form
                                key="form"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, y: -20 }}
                                onSubmit={handleSubmit}
                                className="space-y-6"
                            >
                                <div className="space-y-2">
                                    <label className="text-zinc-300 font-bold ml-2">{content.wishbox_input_label || "Your Wish 🌠"}</label>
                                    <textarea
                                        value={wish}
                                        onChange={(e) => setWish(e.target.value)}
                                        placeholder={content.wishbox_placeholder || "I wish for..."}
                                        className="w-full bg-black/40 border-2 border-white/5 rounded-3xl p-6 text-white placeholder:text-zinc-600 focus:outline-none focus:border-pink-500/50 focus:ring-4 focus:ring-pink-500/10 transition-all text-lg min-h-[180px] resize-none"
                                        disabled={loading}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading || !wish.trim()}
                                    className="w-full py-5 bg-white text-black rounded-2xl font-black text-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_50px_rgba(255,255,255,0.5)]"
                                >
                                    {loading ? (
                                        <div className="w-6 h-6 border-4 border-black border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <>{content.wishbox_btn_text || "Make It Happen"} <Send className="w-5 h-5" /></>
                                    )}
                                </button>
                            </motion.form>
                        ) : (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center space-y-8 py-4"
                            >
                                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-green-500/10 animate-bounce">
                                    <Sparkles className="w-10 h-10 text-green-400" />
                                </div>

                                <div className="bg-white/5 p-6 rounded-3xl border border-white/5 text-left relative">
                                    <div className="absolute -top-3 left-6 px-3 bg-zinc-900 border border-white/10 rounded-full text-xs text-zinc-500 font-bold uppercase tracking-wider">
                                        {content.wishbox_success_title || "You Wished"}
                                    </div>
                                    <p className="text-zinc-300 italic text-lg leading-relaxed">"{result.message}"</p>
                                </div>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                        <div className="w-full border-t border-zinc-800"></div>
                                    </div>
                                    <div className="relative flex justify-center">
                                        <span className="px-4 bg-zinc-900 text-sm text-pink-500 font-bold flex items-center gap-2">
                                            <Heart className="w-4 h-4 fill-pink-500 animate-pulse" /> {content.wishbox_success_sender || "From Universe (Me)"}
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 p-8 rounded-[2rem] border border-pink-500/20 shadow-inner min-h-[150px] flex items-center justify-center">
                                    <p className="text-2xl md:text-3xl font-serif text-white leading-relaxed">
                                        {/* 2. Typing Animation */}
                                        <TypingText text={result.autoReply} delay={500} />
                                    </p>
                                </div>

                                <button
                                    onClick={() => setResult(null)}
                                    className="text-zinc-500 font-bold text-sm hover:text-white transition-colors underline decoration-zinc-700 hover:decoration-white underline-offset-4"
                                >
                                    {content.wishbox_again_btn || "Make another wish?"}
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    )
}
