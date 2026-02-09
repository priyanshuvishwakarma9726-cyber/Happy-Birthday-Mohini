'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Compass, MapPin, Heart, Stars, Moon, Gift } from 'lucide-react'
import confetti from 'canvas-confetti'

const DEFAULT_GOALS = [
    { title: "Midnight Ice-Cream 🍦", desc: "Uncountable midnight drives for your favorite ice-cream!", icon: "🚗" },
    { title: "World Tour ✈️", desc: "Exploring the streets of Paris and Japan holding your hand.", icon: "🌍" },
    { title: "A Cute Puppy 🐶", desc: "Adding a little furry member to our small world.", icon: "🏠" },
    { title: "First Rain Date ⛈️", desc: "Getting drenched together and a warm cutting chai.", icon: "☕" },
    { title: "Gazing Stars 🌌", desc: "A quiet night under the sky, just you and me.", icon: "✨" },
    { title: "Growing Old Together 👵👴", desc: "Still annoying you with my jokes when we are 80.", icon: "❤️" },
    { title: "Surprise Dinner 🍝", desc: "I'll cook (or try to) your favorite meal after a long day.", icon: "👨‍🍳" },
    { title: "Endless Laughter 😂", desc: "Every single day filled with your beautiful smile.", icon: "🌟" }
]

export default function OurFutureMagic({ content }: { content?: any }) {
    let goals = DEFAULT_GOALS
    try {
        if (content?.future_goals) {
            const parsed = typeof content.future_goals === 'string' ? JSON.parse(content.future_goals) : content.future_goals
            if (Array.isArray(parsed) && parsed.length > 0) {
                goals = parsed
            }
        }
    } catch (e) {
        console.error("Failed to parse future goals", e)
    }

    const [index, setIndex] = useState<number | null>(null)
    const [isSpinning, setIsSpinning] = useState(false)

    const revealDestiny = () => {
        if (isSpinning) return
        setIsSpinning(true)
        setIndex(null)

        // Simulate spinning
        setTimeout(() => {
            const nextIndex = Math.floor(Math.random() * goals.length)
            setIndex(nextIndex)
            setIsSpinning(false)
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.8 },
                colors: ['#ec4899', '#a855f7', '#fb7185']
            })
        }, 1500)
    }

    return (
        <div className="bg-zinc-950 border border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden group min-h-[450px] flex flex-col items-center justify-center text-center">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-pink-500/10 rounded-full blur-[80px] -mr-20 -mt-20 group-hover:bg-pink-500/20 transition-all duration-700" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500/10 rounded-full blur-[80px] -ml-20 -mb-20 group-hover:bg-purple-500/20 transition-all duration-700" />

            <div className="relative z-10 space-y-8 max-w-sm">
                <div className="space-y-2">
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">Naseeb Ka Pitara 🔮</h3>
                    <p className="text-zinc-500 text-sm font-medium">Click to see a glimpse of our beautiful future together.</p>
                </div>

                {/* The Magic Orb / Crystal Ball */}
                <div className="relative h-48 w-48 mx-auto flex items-center justify-center">
                    <AnimatePresence mode='wait'>
                        {!isSpinning && index === null && (
                            <motion.button
                                key="orb"
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 1.5, opacity: 0 }}
                                onClick={revealDestiny}
                                className="w-40 h-40 rounded-full bg-gradient-to-tr from-pink-600/20 via-purple-600/40 to-indigo-600/20 border border-white/20 shadow-[0_0_50px_rgba(168,85,247,0.3)] hover:shadow-[0_0_80px_rgba(236,72,153,0.5)] transition-all flex flex-col items-center justify-center gap-2 group-active:scale-90"
                            >
                                <Stars className="w-10 h-10 text-white animate-pulse" />
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">TAP TO REVEAL</span>
                            </motion.button>
                        )}

                        {isSpinning && (
                            <motion.div
                                key="spinning"
                                className="relative"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <div className="w-40 h-40 rounded-full border-4 border-dashed border-pink-500/30 animate-spin-slow" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Stars className="w-12 h-12 text-pink-500 animate-bounce" />
                                </div>
                                <p className="absolute -bottom-8 inset-x-0 text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] animate-pulse">Reading Destiny...</p>
                            </motion.div>
                        )}

                        {index !== null && !isSpinning && (
                            <motion.div
                                key="result"
                                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                className="text-center space-y-4"
                            >
                                <div className="text-6xl mb-2">{goals[index].icon}</div>
                                <h4 className="text-2xl font-black text-pink-400 uppercase tracking-tighter leading-none italic">
                                    {goals[index].title}
                                </h4>
                                <p className="text-zinc-400 text-sm leading-relaxed px-4">
                                    "{goals[index].desc}"
                                </p>
                                <button
                                    onClick={revealDestiny}
                                    className="pt-4 text-[10px] font-bold text-zinc-600 hover:text-white transition-colors uppercase tracking-[0.2em] flex items-center gap-2 mx-auto justify-center"
                                >
                                    Try Again? <Compass className="w-3 h-3" />
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer Decor */}
                <div className="flex justify-center gap-4 text-zinc-800">
                    <MapPin className="w-5 h-5" />
                    <Heart className="w-5 h-5 fill-current" />
                    <Moon className="w-5 h-5" />
                </div>
            </div>

            {/* Premium Border Decor */}
            <div className="absolute top-6 left-6 w-3 h-3 border-t-2 border-l-2 border-white/10" />
            <div className="absolute bottom-6 right-6 w-3 h-3 border-b-2 border-r-2 border-white/10" />
        </div>
    )
}
