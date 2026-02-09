'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'

const MESSAGES = [
    "You're the best! 💖",
    "Keep collecting love! 🥰",
    "Heart Attack! 💘",
    "Love Overload! 📈",
    "Maximum Cuteness! ✨"
]

export default function HeartCollector() {
    const [hearts, setHearts] = useState<{ id: number, x: number, y: number, color: string }[]>([])
    const [score, setScore] = useState(0)
    const [message, setMessage] = useState("Catch the Hearts! 💖")
    const [playing, setPlaying] = useState(false)

    // Game loop
    useEffect(() => {
        if (!playing) return

        const spawner = setInterval(() => {
            const id = Date.now()
            const x = Math.random() * 80 + 10 // 10-90% width
            const y = Math.random() * 80 + 10 // 10-90% height
            const color = `hsl(${Math.random() * 60 + 320}, 100%, 70%)` // Pinks/Reds

            setHearts(prev => [...prev, { id, x, y, color }])

            // Auto-remove heart after 2s if not clicked
            setTimeout(() => {
                setHearts(prev => prev.filter(h => h.id !== id))
            }, 2000)

        }, 800) // Fast spawn

        return () => clearInterval(spawner)
    }, [playing])

    const collectHeart = (id: number) => {
        setHearts(prev => prev.filter(h => h.id !== id))
        setScore(prev => {
            const newScore = prev + 1
            if (newScore % 5 === 0) {
                setMessage(MESSAGES[Math.floor(Math.random() * MESSAGES.length)])
            }
            return newScore
        })

        // Mini burst
        confetti({
            particleCount: 10,
            spread: 30,
            origin: { x: Math.random(), y: Math.random() }, // roughly center for now
            colors: ['#ec4899']
        })
    }

    const startGame = () => {
        setScore(0)
        setHearts([])
        setMessage("Let's go! 🚀")
        setPlaying(true)
        // Auto stop after 30s
        setTimeout(() => {
            setPlaying(false)
            setMessage("Time's Up! You collected " + score + " hearts! 🎉")
            confetti({ particleCount: 100, spread: 70 })
        }, 30000)
    }

    return (
        <div className="relative w-full max-w-md mx-auto aspect-[3/4] bg-zinc-900 rounded-3xl overflow-hidden border-4 border-pink-500/50 shadow-2xl">
            {/* HUD */}
            <div className="absolute top-4 w-full text-center z-20">
                <span className="bg-pink-600 px-4 py-1 rounded-full text-white font-bold shadow-lg text-sm">
                    Score: {score} ❤️
                </span>
                <p className="text-pink-300 text-xs mt-2 font-bold animate-pulse">{message}</p>
            </div>

            {/* Start Screen */}
            {!playing && (
                <div className="absolute inset-0 z-30 bg-black/60 flex flex-col items-center justify-center text-center p-6">
                    <h2 className="text-3xl font-black text-white mb-4">Heart Collector 💘</h2>
                    <p className="text-pink-200 mb-6 text-sm">Tap the floating hearts before they disappear!</p>
                    <button onClick={startGame} className="bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-2 rounded-lg font-bold text-white shadow-xl hover:scale-105 transition-transform">
                        Start Collecting ▶️
                    </button>
                </div>
            )}

            {/* Game Area */}
            <div className="absolute inset-0">
                <AnimatePresence>
                    {hearts.map(heart => (
                        <motion.button
                            key={heart.id}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="absolute text-4xl cursor-pointer w-12 h-12 flex items-center justify-center"
                            style={{ left: `${heart.x}%`, top: `${heart.y}%`, color: heart.color }}
                            onClick={() => collectHeart(heart.id)}
                            onMouseDown={(e) => { e.preventDefault(); collectHeart(heart.id) }} // Better touch response
                            whileTap={{ scale: 1.5 }}
                        >
                            ❤️
                        </motion.button>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    )
}
