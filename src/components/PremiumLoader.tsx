'use client'
import { motion } from 'framer-motion'
import { Heart, Sparkles } from 'lucide-react'
import { useState, useEffect } from 'react'

const phrases = [
    "Loading Love... 💖",
    "Wrapping Surprises... 🎁",
    "Sprinkling Magic... ✨",
    "Checking Heartbeat... 💓",
    "Almost There... 🌹"
]

export default function PremiumLoader() {
    const [currentPhrase, setCurrentPhrase] = useState(phrases[0])

    useEffect(() => {
        // Random start
        setCurrentPhrase(phrases[Math.floor(Math.random() * phrases.length)])

        const interval = setInterval(() => {
            setCurrentPhrase(prev => {
                const currentIndex = phrases.indexOf(prev)
                const nextIndex = (currentIndex + 1) % phrases.length
                return phrases[nextIndex]
            })
        }, 2000)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black text-white">
            <div className="relative">
                {/* Pulsing Glow */}
                <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute inset-0 bg-pink-500 rounded-full blur-xl"
                />

                {/* Beating Heart */}
                <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="relative z-10"
                >
                    <Heart className="w-16 h-16 text-pink-500 fill-pink-500 drop-shadow-lg" />
                </motion.div>

                {/* Orbiting Sparkle */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                    className="absolute inset-0 z-20"
                >
                    <div className="w-full h-full relative">
                        <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-4 left-1/2 -translate-x-1/2" />
                    </div>
                </motion.div>
            </div>

            <motion.p
                key={currentPhrase} // Animate text change
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="mt-8 text-lg font-medium text-pink-200 tracking-widest uppercase"
            >
                {currentPhrase}
            </motion.p>
        </div>
    )
}
