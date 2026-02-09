'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, X } from 'lucide-react'
import confetti from 'canvas-confetti'

interface Balloon {
    id: number;
    x: number; // percentage
    speed: number;
    color: string;
    popped: boolean;
}

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899']

export default function BalloonPoppingGame() {
    const [balloons, setBalloons] = useState<Balloon[]>([])
    const [score, setScore] = useState(0)
    const [gameOver, setGameOver] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const requestRef = useRef<number | null>(null)
    const nextId = useRef(0)

    const SPAWN_RATE = 1000 // ms
    const TARGET_SCORE = 20

    useEffect(() => {
        if (gameOver) return

        const spawnInterval = setInterval(() => {
            setBalloons(prev => {
                if (prev.length > 10) return prev // Limit balloons

                const newBalloon: Balloon = {
                    id: nextId.current++,
                    x: Math.random() * 80 + 10,
                    speed: Math.random() * 0.5 + 0.5, // Reduced speed manually for better control
                    color: COLORS[Math.floor(Math.random() * COLORS.length)],
                    popped: false
                }
                return [...prev, newBalloon]
            })
        }, SPAWN_RATE)

        return () => clearInterval(spawnInterval)
    }, [gameOver])

    const popBalloon = (id: number) => {
        if (gameOver) return

        // Sound effect (optional, maybe later)

        setBalloons(prev => prev.map(b => b.id === id ? { ...b, popped: true } : b))
        setScore(s => {
            const newScore = s + 1
            if (newScore >= TARGET_SCORE) {
                handleWin()
            }
            return newScore
        })

        // Remove popped balloon after animation
        setTimeout(() => {
            setBalloons(prev => prev.filter(b => b.id !== id))
        }, 300)
    }

    const handleWin = () => {
        setGameOver(true)
        confetti({
            particleCount: 200,
            spread: 100,
            origin: { y: 0.6 }
        })
    }

    const resetGame = () => {
        setBalloons([])
        setScore(0)
        setGameOver(false)
        nextId.current = 0
    }

    return (
        <div ref={containerRef} className="relative w-full h-[400px] bg-sky-900/50 rounded-3xl overflow-hidden border border-white/10 shadow-inner">
            {/* Score */}
            <div className="absolute top-4 left-4 z-20 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                <span className="text-2xl font-black text-white">{score} / {TARGET_SCORE}</span>
                <span className="text-xs uppercase ml-2 font-bold text-white/60">Popped</span>
            </div>

            {/* Balloons */}
            <AnimatePresence>
                {balloons.map((balloon) => (
                    !balloon.popped && (
                        <motion.div
                            key={balloon.id}
                            initial={{ bottom: '-10%', left: `${balloon.x}%` }}
                            animate={{ bottom: '120%' }}
                            exit={{ scale: [1, 1.5, 0], opacity: 0 }}
                            transition={{ duration: 10 / balloon.speed, ease: "linear" }}
                            onAnimationComplete={() => {
                                // Remove if it floats away
                                setBalloons(prev => prev.filter(b => b.id !== balloon.id))
                            }}
                            className="absolute cursor-pointer z-10"
                            onClick={() => popBalloon(balloon.id)}
                        >
                            <div className="relative group">
                                <div
                                    className="w-16 h-20 rounded-[50%] opacity-90 shadow-lg hover:scale-110 transition-transform"
                                    style={{
                                        backgroundColor: balloon.color,
                                        boxShadow: `inset -10px -10px 20px rgba(0,0,0,0.2), inset 10px 10px 20px rgba(255,255,255,0.4)`
                                    }}
                                >
                                    {/* Reflection */}
                                    <div className="absolute top-3 left-3 w-4 h-8 bg-white/40 rounded-[50%] blur-[2px] rotate-[-45deg]" />
                                    {/* String */}
                                    <div className="absolute bottom-[-20px] left-1/2 w-[2px] h-[20px] bg-white/50 origin-top" />
                                </div>
                            </div>
                        </motion.div>
                    )
                ))}
            </AnimatePresence>

            {/* Win Screen */}
            <AnimatePresence>
                {gameOver && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.5, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-white text-black p-8 rounded-3xl text-center shadow-2xl max-w-sm mx-4"
                        >
                            <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                            <h2 className="text-3xl font-black mb-2">Pop Master! 🎈</h2>
                            <p className="text-zinc-500 mb-6 font-medium">You popped them all! Just like you pop into my thoughts all day. ❤️</p>
                            <button
                                onClick={resetGame}
                                className="w-full bg-black text-white font-bold py-3 rounded-xl hover:bg-zinc-800 transition-colors"
                            >
                                Play Again
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Cloud Decorations (Static) */}
            <div className="absolute top-10 left-10 w-24 h-8 bg-white/10 rounded-full blur-xl" />
            <div className="absolute top-20 right-20 w-32 h-10 bg-white/10 rounded-full blur-xl" />
        </div>
    )
}
