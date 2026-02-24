'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Trophy } from 'lucide-react'

const MID_MESSAGES = [
    "You're the best! 💖",
    "Keep collecting love! 🥰",
    "Heart Attack! 💘",
    "Love Overload! 📈",
    "Maximum Cuteness! ✨"
]

interface HeartCollectorProps {
    victoryMessage?: string;
}

export default function HeartCollector({ victoryMessage }: HeartCollectorProps) {
    const [hearts, setHearts] = useState<{ id: number, x: number, y: number, color: string }[]>([])
    const [score, setScore] = useState(0)
    const [message, setMessage] = useState("Catch the Hearts! 💖")
    const [playing, setPlaying] = useState(false)
    const [gameOver, setGameOver] = useState(false)
    const finalScore = useRef(0)

    // Game loop
    useEffect(() => {
        if (!playing) return

        const spawner = setInterval(() => {
            const id = Date.now()
            const x = Math.random() * 80 + 10
            const y = Math.random() * 80 + 10
            const color = `hsl(${Math.random() * 60 + 320}, 100%, 70%)`

            setHearts(prev => [...prev, { id, x, y, color }])

            setTimeout(() => {
                setHearts(prev => prev.filter(h => h.id !== id))
            }, 2000)

        }, 800)

        return () => clearInterval(spawner)
    }, [playing])

    const collectHeart = (id: number) => {
        setHearts(prev => prev.filter(h => h.id !== id))
        setScore(prev => {
            const newScore = prev + 1
            finalScore.current = newScore
            if (newScore % 5 === 0) {
                setMessage(MID_MESSAGES[Math.floor(Math.random() * MID_MESSAGES.length)])
            }
            return newScore
        })

        confetti({
            particleCount: 10,
            spread: 30,
            origin: { x: Math.random(), y: Math.random() },
            colors: ['#ec4899']
        })
    }

    const startGame = () => {
        setScore(0)
        finalScore.current = 0
        setHearts([])
        setMessage("Let's go! 🚀")
        setPlaying(true)
        setGameOver(false)

        setTimeout(() => {
            setPlaying(false)
            setGameOver(true)
            setHearts([])
            confetti({
                particleCount: 150,
                spread: 80,
                origin: { y: 0.6 },
                colors: ['#ec4899', '#8b5cf6', '#ffffff']
            })
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
            <AnimatePresence>
                {!playing && !gameOver && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-30 bg-black/60 flex flex-col items-center justify-center text-center p-6"
                    >
                        <h2 className="text-3xl font-black text-white mb-4">Heart Collector 💘</h2>
                        <p className="text-pink-200 mb-6 text-sm">Tap the floating hearts before they disappear!</p>
                        <button
                            onClick={startGame}
                            className="bg-gradient-to-r from-pink-500 to-purple-500 px-8 py-3 rounded-full font-black text-white shadow-xl hover:scale-105 transition-transform text-sm"
                        >
                            Start Collecting ▶️
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Game Over Screen */}
            <AnimatePresence>
                {gameOver && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-30 bg-black/95 flex flex-col items-center justify-center text-center p-6"
                    >
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="w-20 h-20 bg-gradient-to-tr from-pink-500 to-purple-500 rounded-full flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(236,72,153,0.5)]"
                        >
                            <Trophy className="w-10 h-10 text-white" />
                        </motion.div>

                        <h3 className="text-2xl font-black text-white mb-1 uppercase tracking-tighter">
                            Time's Up! 🎉
                        </h3>
                        <p className="text-pink-400 font-bold text-lg mb-3">
                            You collected <span className="text-white text-2xl">{finalScore.current}</span> hearts! 💖
                        </p>
                        <p className="text-pink-200 italic text-sm leading-relaxed px-4 mb-6">
                            {victoryMessage || "Har ek dil tumhare liye dhadakta hai, Mohini! 🌸"}
                        </p>
                        <button
                            onClick={startGame}
                            className="bg-white text-black px-8 py-3 rounded-full font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-xl"
                        >
                            Play Again
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

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
                            onMouseDown={(e) => { e.preventDefault(); collectHeart(heart.id) }}
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
