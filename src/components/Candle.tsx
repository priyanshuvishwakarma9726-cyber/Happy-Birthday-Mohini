'use client'
import { motion } from 'framer-motion'
import { useState } from 'react'

export default function DigitalCandle() {
    const [lit, setLit] = useState(false)

    const lightMe = () => {
        if (lit) return
        setLit(true)
    }

    return (
        <div className="flex flex-col items-center justify-center p-8 bg-zinc-900/50 rounded-2xl border border-zinc-800 hover:border-pink-500/30 transition-colors group">
            <h3 className="text-xl font-bold text-white mb-8">Make a Wish & Light the Candle 🕯️</h3>

            <div
                onClick={lightMe}
                className="relative cursor-pointer w-8 bg-zinc-700 h-32 rounded-lg shadow-lg"
            >
                {/* Candle Body */}
                <div className="absolute inset-x-0 top-0 h-4 bg-zinc-600 rounded-t-lg" />

                {/* Wick */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-1 h-3 bg-zinc-800" />

                {/* Flame */}
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={lit ? { scale: [1, 1.2, 0.9, 1.1, 1], opacity: 1 } : { scale: 0, opacity: 0 }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut"
                    }}
                    className="absolute -top-10 left-1/2 -translate-x-1/2 w-6 h-10 bg-gradient-to-t from-orange-500 via-yellow-400 to-white rounded-full blur-[1px] shadow-[0_0_20px_rgba(251,191,36,0.8)] filter drop-shadow-lg"
                >
                    {/* Inner Flame Core */}
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-2 h-4 bg-blue-400 rounded-full opacity-60 blur-[1px]" />
                </motion.div>

                {/* Glow Effect when lit */}
                {lit && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0.2, 0.4, 0.2] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute -top-20 -left-20 -right-20 -bottom-10 bg-yellow-500/10 rounded-full blur-[50px] pointer-events-none"
                    />
                )}
            </div>

            <p className="mt-8 text-sm text-zinc-500 font-medium group-hover:text-pink-400 transition-colors">
                {lit ? "May all your wishes come true! ✨" : "Click the wick to light it!"}
            </p>
        </div>
    )
}
