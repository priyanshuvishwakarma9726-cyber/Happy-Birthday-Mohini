'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { renderEmojiText } from '@/lib/emoji-helper'
import confetti from 'canvas-confetti'

const DEFAULT_CAKE_WISHES = [
    "May all your dreams come true, today and always. You deserve the world! 🌏💖",
    "Wishing you a year full of love, laughter, and everything you've ever wanted! ✨",
    "You are the best thing that ever happened! Happy birthday! 💖",
    "Happy Birthday Mohini! You're a law student now, but you'll always be my favorite princess. 👑",
    "May this birthday be as sweet and amazing as you are. Love you! ❤️"
]

export default function DigitalCake({ content }: { content?: any }) {
    const [currentWish, setCurrentWish] = useState("")
    const [candles, setCandles] = useState([true, true, true, true, true]) // 5 candles, true = lit
    const [wished, setWished] = useState(false)

    // Load custom wishes safely
    const cakeWishes = (function () {
        if (!content?.cake_wishes) return DEFAULT_CAKE_WISHES;
        if (Array.isArray(content.cake_wishes)) return content.cake_wishes;

        try {
            const parsed = JSON.parse(content.cake_wishes);
            return Array.isArray(parsed) && parsed.length > 0 ? parsed : [String(content.cake_wishes)];
        } catch (e) {
            // If it's not valid JSON (like a plain string "Happy Bday"), use it as a single wish
            return [String(content.cake_wishes)];
        }
    })();

    const blowCandle = (index: number) => {
        if (!candles[index]) return
        const newCandles = [...candles]
        newCandles[index] = false
        setCandles(newCandles)
    }

    useEffect(() => {
        if (candles.every(c => !c) && !wished) {
            setWished(true)
            const randomWish = cakeWishes[Math.floor(Math.random() * cakeWishes.length)]
            setCurrentWish(randomWish)

            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#FFD700', '#FFA500', '#FF4500']
            })
        }
    }, [candles, wished, cakeWishes])

    return (
        <div className="relative py-12 flex flex-col items-center justify-center">
            <h3 className="text-2xl font-bold text-pink-400 mb-8">
                {wished ? renderEmojiText("Your Wish is Granted! ✨") : renderEmojiText("Make a Wish & Blow the Candles! 🎂")}
            </h3>

            <div className="relative mt-24 flex flex-col items-center">
                {/* Candles */}
                <div className="flex justify-center flex-wrap gap-4 px-4 mb-4">
                    {candles.map((isLit, i) => (
                        <div key={i} className="relative group cursor-pointer" onClick={() => blowCandle(i)}>
                            {/* Flame */}
                            {isLit && (
                                <motion.div
                                    animate={{ scale: [1, 1.1, 1], rotate: [-2, 2, -2] }}
                                    transition={{ repeat: Infinity, duration: 0.5 }}
                                    className="absolute -top-6 left-1/2 -translate-x-1/2 w-4 h-6 bg-gradient-to-t from-orange-500 via-yellow-400 to-white rounded-full blur-[1px] shadow-[0_0_10px_orange]"
                                />
                            )}
                            {/* Wick */}
                            <div className="w-1 h-3 bg-black/50 mx-auto" />
                            {/* Candle Stick */}
                            <div className="w-3 h-12 bg-white border border-zinc-200 rounded-sm shadow-sm relative">
                                <div className="absolute top-2 left-0 w-full h-1 bg-red-400/30 -rotate-12" />
                                <div className="absolute top-6 left-0 w-full h-1 bg-green-400/30 -rotate-12" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Cake Base */}
                <div className="w-48 sm:w-64 h-24 sm:h-32 bg-pink-300 rounded-t-lg relative shadow-lg">
                    <div className="absolute top-0 left-0 w-full h-6 sm:h-8 bg-pink-400 rounded-t-lg opacity-50" />
                    <div className="absolute top-1/2 left-0 w-full h-3 sm:h-4 bg-white/30 skew-y-1" />

                    {/* Filling */}
                    <div className="absolute bottom-0 w-full h-8 sm:h-12 bg-pink-400/30 rounded-b-lg -z-10 translate-y-2 scale-95 blur-sm" />
                </div>
            </div>

            <AnimatePresence>
                {wished && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-12 text-center max-w-sm bg-white/10 p-6 rounded-xl border border-white/20 backdrop-blur-sm"
                    >
                        <p className="text-lg italic text-pink-200">
                            "{renderEmojiText(currentWish)}"
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
