'use client'
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { RotateCcw, Timer, CheckCircle, Trophy, Sparkles, Play } from 'lucide-react'
import confetti from 'canvas-confetti'

interface PuzzleGameProps {
    imageUrl: string;
    difficulty?: 3 | 4 | 5;
    onComplete?: () => void;
}

export default function PuzzleGame({ imageUrl, difficulty = 4, onComplete }: PuzzleGameProps) {
    const SIZE = difficulty
    const [tiles, setTiles] = useState<number[]>([]) // Array of Piece IDs
    const [won, setWon] = useState(false)
    const [timer, setTimer] = useState(0)
    const [isActive, setIsActive] = useState(false)
    const [moves, setMoves] = useState(0)

    const TOTAL_TIECES = SIZE * SIZE

    // Random Walk Shuffle (guarantees solvability)
    const shuffle = () => {
        const arr = Array.from({ length: TOTAL_TIECES }, (_, i) => i)
        let current = [...arr]
        let emptyIdx = TOTAL_TIECES - 1 // Last piece is empty

        for (let i = 0; i < 200; i++) {
            const moves = []
            const row = Math.floor(emptyIdx / SIZE)
            const col = emptyIdx % SIZE

            if (row > 0) moves.push(emptyIdx - SIZE) // Up
            if (row < SIZE - 1) moves.push(emptyIdx + SIZE) // Down
            if (col > 0) moves.push(emptyIdx - 1) // Left
            if (col < SIZE - 1) moves.push(emptyIdx + 1) // Right

            const randomMove = moves[Math.floor(Math.random() * moves.length)]
            // Swap
            const temp = current[emptyIdx]
            current[emptyIdx] = current[randomMove]
            current[randomMove] = temp

            emptyIdx = randomMove
        }

        setTiles(current)
        setWon(false)
        setTimer(0)
        setMoves(0)
        setIsActive(true)
    }

    useEffect(() => {
        shuffle()
    }, [difficulty, imageUrl])

    useEffect(() => {
        let itv: any
        if (isActive && !won) {
            itv = setInterval(() => setTimer(t => t + 1), 1000)
        }
        return () => clearInterval(itv)
    }, [isActive, won])

    const handleTileClick = (index: number) => {
        if (won) return

        const emptyIndex = tiles.indexOf(TOTAL_TIECES - 1)
        const row = Math.floor(index / SIZE)
        const col = index % SIZE
        const emptyRow = Math.floor(emptyIndex / SIZE)
        const emptyCol = emptyIndex % SIZE

        const isAdjacent = Math.abs(row - emptyRow) + Math.abs(col - emptyCol) === 1

        if (isAdjacent) {
            const newTiles = [...tiles]
            newTiles[emptyIndex] = tiles[index]
            newTiles[index] = tiles[emptyIndex]
            setTiles(newTiles)
            setMoves(m => m + 1)

            // Check Win
            if (newTiles.every((val, idx) => val === idx)) {
                handleWin()
            }
        }
    }

    const handleWin = () => {
        setWon(true)
        setIsActive(false)
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ec4899', '#8b5cf6', '#ffffff']
        })
        onComplete?.()
    }

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60)
        const sec = s % 60
        return `${m}:${sec.toString().padStart(2, '0')}`
    }

    return (
        <div className="flex flex-col items-center gap-8 p-4 sm:p-10 bg-zinc-900/60 backdrop-blur-3xl rounded-[2.5rem] sm:rounded-[3rem] border border-white/10 shadow-3xl w-full max-w-[400px] mx-auto select-none">

            {/* Header Stats */}
            <div className="flex justify-between w-full items-center mb-2">
                <div className="text-center">
                    <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-1">Time</p>
                    <div className="flex items-center gap-2 text-pink-400 font-mono font-bold text-xl">
                        <Timer className="w-4 h-4" /> {formatTime(timer)}
                    </div>
                </div>
                <div className="text-center">
                    <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-1">Moves</p>
                    <div className="flex items-center gap-2 text-indigo-400 font-bold text-xl">
                        <Play className="w-4 h-4" /> {moves}
                    </div>
                </div>
            </div>

            {/* Puzzle Board */}
            <div className="relative bg-black/40 p-2 rounded-2xl border-2 border-white/5 shadow-inner aspect-square w-full">
                <div
                    className="grid w-full h-full gap-1.5"
                    style={{
                        gridTemplateColumns: `repeat(${SIZE}, 1fr)`,
                        gridTemplateRows: `repeat(${SIZE}, 1fr)`
                    }}
                >
                    {tiles.map((tileId, visualIndex) => {
                        const isEmpty = tileId === TOTAL_TIECES - 1

                        if (isEmpty) return <div key="empty" className="bg-transparent" />

                        // Background Position Calcs
                        const r = Math.floor(tileId / SIZE)
                        const c = tileId % SIZE
                        const posX = (c / (SIZE - 1)) * 100
                        const posY = (r / (SIZE - 1)) * 100

                        return (
                            <motion.div
                                key={tileId}
                                layout
                                onClick={() => handleTileClick(visualIndex)}
                                whileHover={{ scale: 0.98, filter: "brightness(1.1)" }}
                                whileTap={{ scale: 0.95 }}
                                className="relative cursor-pointer rounded-lg overflow-hidden border border-white/10 shadow-lg group"
                                style={{
                                    backgroundImage: `url(${imageUrl})`,
                                    backgroundSize: `${SIZE * 100}% ${SIZE * 100}%`,
                                    backgroundPosition: `${posX}% ${posY}%`,
                                }}
                                transition={{ type: "spring", stiffness: 350, damping: 28 }}
                            >
                                {/* Hint Overlay */}
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors flex items-center justify-center">
                                    <span className="text-white/20 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                        {tileId + 1}
                                    </span>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>

                {/* Win Modal Overlay */}
                <AnimatePresence>
                    {won && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md p-6 text-center rounded-xl"
                        >
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="w-20 h-20 bg-gradient-to-tr from-pink-500 to-purple-500 rounded-full flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(236,72,153,0.5)]"
                            >
                                <Trophy className="w-10 h-10 text-white" />
                            </motion.div>
                            <h3 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">Perfect! 💖</h3>
                            <p className="text-pink-200 italic mb-8 font-serif text-sm leading-relaxed px-4">
                                "Solving puzzles with you is my favorite thing to do. You complete me!"
                            </p>
                            <button
                                onClick={shuffle}
                                className="bg-white text-black px-8 py-3 rounded-full font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-xl"
                            >
                                Play Again
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Footer Tip */}
            <div className="text-center space-y-3">
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                    Tip: Tap tiles adjacent to the gap!
                </p>
                <button
                    onClick={shuffle}
                    className="flex items-center gap-2 mx-auto text-zinc-400 hover:text-white transition-colors text-xs font-bold bg-white/5 px-4 py-2 rounded-full border border-white/5"
                >
                    <RotateCcw className="w-3 h-3" /> Reshuffle Game
                </button>
            </div>
        </div>
    )
}
