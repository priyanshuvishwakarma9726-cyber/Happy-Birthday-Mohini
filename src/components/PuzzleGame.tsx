'use client'
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect, useRef, useCallback } from "react"
import { RotateCcw, Timer, Trophy, Play, Lightbulb, Wand2 } from 'lucide-react'
import confetti from 'canvas-confetti'

interface PuzzleGameProps {
    imageUrl: string;
    difficulty?: 3 | 4 | 5;
    victoryMessage?: string;
    onComplete?: () => void;
}

// ── Greedy "best neighbour" used by both Hint and AutoSolve ─────────────────
function manhattanDistance(tiles: number[], size: number): number {
    let dist = 0
    const empty = size * size - 1
    for (let i = 0; i < tiles.length; i++) {
        const t = tiles[i]
        if (t === empty) continue
        dist += Math.abs(Math.floor(t / size) - Math.floor(i / size)) +
            Math.abs((t % size) - (i % size))
    }
    return dist
}

function getBestMove(tiles: number[], size: number): number {
    const empty = size * size - 1
    const emptyIdx = tiles.indexOf(empty)
    const row = Math.floor(emptyIdx / size)
    const col = emptyIdx % size
    const neighbours: number[] = []
    if (row > 0) neighbours.push(emptyIdx - size)
    if (row < size - 1) neighbours.push(emptyIdx + size)
    if (col > 0) neighbours.push(emptyIdx - 1)
    if (col < size - 1) neighbours.push(emptyIdx + 1)

    let best = -1, bestDist = Infinity
    for (const n of neighbours) {
        const next = [...tiles]
        next[emptyIdx] = next[n]
        next[n] = empty
        const d = manhattanDistance(next, size)
        if (d < bestDist) { bestDist = d; best = n }
    }
    return best   // index of tile to swap into empty spot
}

function getAdjacentIndices(tiles: number[], size: number): Set<number> {
    const empty = size * size - 1
    const emptyIdx = tiles.indexOf(empty)
    const row = Math.floor(emptyIdx / size)
    const col = emptyIdx % size
    const adj = new Set<number>()
    if (row > 0) adj.add(emptyIdx - size)
    if (row < size - 1) adj.add(emptyIdx + size)
    if (col > 0) adj.add(emptyIdx - 1)
    if (col < size - 1) adj.add(emptyIdx + 1)
    return adj
}

export default function PuzzleGame({ imageUrl, difficulty = 4, victoryMessage, onComplete }: PuzzleGameProps) {
    const SIZE = difficulty
    const TOTAL = SIZE * SIZE
    const [tiles, setTiles] = useState<number[]>([])
    const [won, setWon] = useState(false)
    const [timer, setTimer] = useState(0)
    const [isActive, setIsActive] = useState(false)
    const [moves, setMoves] = useState(0)
    const [hintIdx, setHintIdx] = useState<number | null>(null)         // tile visual index highlighted by hint
    const [showIdleTip, setShowIdleTip] = useState(false)               // "tap tiles next to gap" tip
    const [isSolving, setIsSolving] = useState(false)
    const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
    const solverRef = useRef<ReturnType<typeof setInterval> | null>(null)
    const tilesRef = useRef(tiles)
    tilesRef.current = tiles

    // ── Shuffle ──────────────────────────────────────────────────────────────
    const shuffle = useCallback(() => {
        const arr = Array.from({ length: TOTAL }, (_, i) => i)
        let emptyIdx = TOTAL - 1
        for (let i = 0; i < 300; i++) {
            const row = Math.floor(emptyIdx / SIZE), col = emptyIdx % SIZE
            const moves: number[] = []
            if (row > 0) moves.push(emptyIdx - SIZE)
            if (row < SIZE - 1) moves.push(emptyIdx + SIZE)
            if (col > 0) moves.push(emptyIdx - 1)
            if (col < SIZE - 1) moves.push(emptyIdx + 1)
            const pick = moves[Math.floor(Math.random() * moves.length)]
                ;[arr[emptyIdx], arr[pick]] = [arr[pick], arr[emptyIdx]]
            emptyIdx = pick
        }
        if (solverRef.current) clearInterval(solverRef.current)
        setTiles(arr)
        setWon(false)
        setTimer(0)
        setMoves(0)
        setIsActive(true)
        setHintIdx(null)
        setShowIdleTip(false)
        setIsSolving(false)
        resetIdleTimer()
    }, [SIZE, TOTAL])

    useEffect(() => { shuffle() }, [difficulty, imageUrl])

    // ── Timer ─────────────────────────────────────────────────────────────────
    useEffect(() => {
        let itv: ReturnType<typeof setInterval>
        if (isActive && !won) itv = setInterval(() => setTimer(t => t + 1), 1000)
        return () => clearInterval(itv)
    }, [isActive, won])

    // ── Idle tip ──────────────────────────────────────────────────────────────
    const resetIdleTimer = useCallback(() => {
        if (idleTimer.current) clearTimeout(idleTimer.current)
        setShowIdleTip(false)
        idleTimer.current = setTimeout(() => setShowIdleTip(true), 25000)
    }, [])

    useEffect(() => {
        resetIdleTimer()
        return () => { if (idleTimer.current) clearTimeout(idleTimer.current) }
    }, [tiles])

    // ── Win ───────────────────────────────────────────────────────────────────
    const handleWin = useCallback((currentTiles: number[]) => {
        if (currentTiles.every((v, i) => v === i)) {
            setWon(true)
            setIsActive(false)
            setShowIdleTip(false)
            if (idleTimer.current) clearTimeout(idleTimer.current)
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#ec4899', '#8b5cf6', '#ffffff'] })
            onComplete?.()
            return true
        }
        return false
    }, [onComplete])

    // ── Tile click ────────────────────────────────────────────────────────────
    const handleTileClick = useCallback((visualIndex: number) => {
        if (won || isSolving) return
        const cur = tilesRef.current
        const emptyIdx = cur.indexOf(TOTAL - 1)
        const row = Math.floor(visualIndex / SIZE), col = visualIndex % SIZE
        const eRow = Math.floor(emptyIdx / SIZE), eCol = emptyIdx % SIZE
        if (Math.abs(row - eRow) + Math.abs(col - eCol) !== 1) return

        const next = [...cur]
            ;[next[emptyIdx], next[visualIndex]] = [next[visualIndex], next[emptyIdx]]
        setTiles(next)
        setMoves(m => m + 1)
        setHintIdx(null)
        if (!handleWin(next)) resetIdleTimer()
    }, [won, isSolving, SIZE, TOTAL, handleWin, resetIdleTimer])

    // ── Hint: one best move ───────────────────────────────────────────────────
    const doHint = useCallback(() => {
        if (won || isSolving) return
        const cur = tilesRef.current
        const targetIdx = getBestMove(cur, SIZE)   // visual index of tile to move
        setHintIdx(targetIdx)
        setTimeout(() => setHintIdx(null), 2500)
    }, [won, isSolving, SIZE])

    // ── Auto Solve ─────────────────────────────────────────────────────────────
    const autoSolve = useCallback(() => {
        if (won || isSolving) return
        setIsSolving(true)
        setHintIdx(null)
        setShowIdleTip(false)

        let stepTiles = [...tilesRef.current]
        solverRef.current = setInterval(() => {
            if (stepTiles.every((v, i) => v === i)) {
                if (solverRef.current) clearInterval(solverRef.current)
                setIsSolving(false)
                handleWin(stepTiles)
                return
            }
            const targetIdx = getBestMove(stepTiles, SIZE)
            const emptyIdx = stepTiles.indexOf(SIZE * SIZE - 1)
                ;[stepTiles[emptyIdx], stepTiles[targetIdx]] = [stepTiles[targetIdx], stepTiles[emptyIdx]]
            const snap = [...stepTiles]
            setTiles(snap)
            setMoves(m => m + 1)
        }, 380)
    }, [won, isSolving, SIZE, handleWin])

    useEffect(() => () => { if (solverRef.current) clearInterval(solverRef.current) }, [])

    const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`
    const adjacentSet = getAdjacentIndices(tiles, SIZE)

    return (
        <div className="flex flex-col items-center gap-6 p-4 sm:p-8 bg-zinc-900/60 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 shadow-2xl w-full max-w-[420px] mx-auto select-none">

            {/* Header Stats */}
            <div className="flex justify-between w-full items-center">
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
                    style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)`, gridTemplateRows: `repeat(${SIZE}, 1fr)` }}
                >
                    {tiles.map((tileId, visualIndex) => {
                        const isEmpty = tileId === TOTAL - 1
                        if (isEmpty) return <div key="empty" className="bg-transparent" />

                        const isMovable = adjacentSet.has(visualIndex)
                        const isHinted = hintIdx === visualIndex
                        const r = Math.floor(tileId / SIZE), c = tileId % SIZE
                        const posX = SIZE > 1 ? (c / (SIZE - 1)) * 100 : 0
                        const posY = SIZE > 1 ? (r / (SIZE - 1)) * 100 : 0

                        return (
                            <motion.div
                                key={tileId}
                                layout
                                onClick={() => handleTileClick(visualIndex)}
                                whileHover={isMovable ? { scale: 0.97, filter: "brightness(1.12)" } : {}}
                                whileTap={isMovable ? { scale: 0.93 } : {}}
                                className={`relative rounded-lg overflow-hidden shadow-lg transition-all duration-300
                                    ${isMovable ? 'cursor-pointer' : 'cursor-default'}
                                    ${isHinted
                                        ? 'border-2 border-pink-400 shadow-[0_0_18px_4px_rgba(236,72,153,0.55)]'
                                        : isMovable
                                            ? 'border border-pink-300/40 shadow-[0_0_8px_1px_rgba(236,72,153,0.18)]'
                                            : 'border border-white/8'
                                    }`}
                                style={{
                                    backgroundImage: `url(${imageUrl})`,
                                    backgroundSize: `${SIZE * 100}% ${SIZE * 100}%`,
                                    backgroundPosition: `${posX}% ${posY}%`,
                                }}
                                transition={{ type: "spring", stiffness: 350, damping: 28 }}
                            >
                                {isHinted && (
                                    <motion.div
                                        className="absolute inset-0 bg-pink-400/25 flex items-center justify-center"
                                        animate={{ opacity: [0.4, 0.9, 0.4] }}
                                        transition={{ repeat: Infinity, duration: 0.9 }}
                                    >
                                        <span className="text-white text-lg font-black drop-shadow-lg">👆</span>
                                    </motion.div>
                                )}
                            </motion.div>
                        )
                    })}
                </div>

                {/* Win Overlay */}
                <AnimatePresence>
                    {won && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/92 backdrop-blur-md p-6 text-center rounded-xl"
                        >
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="w-20 h-20 bg-gradient-to-tr from-pink-500 to-purple-500 rounded-full flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(236,72,153,0.6)]"
                            >
                                <Trophy className="w-10 h-10 text-white" />
                            </motion.div>
                            <h3 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">Perfect! 💖</h3>
                            <p className="text-pink-200 italic mb-8 font-serif text-sm leading-relaxed px-4">
                                {victoryMessage || "Solving puzzles with you is my favorite thing to do. You complete me! 🧩✨"}
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

            {/* Idle Tip Floating */}
            <AnimatePresence>
                {showIdleTip && !won && (
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="px-4 py-2 bg-pink-500/15 border border-pink-400/30 rounded-full text-pink-300 text-[11px] font-semibold text-center"
                    >
                        💡 Tap tiles next to the empty space
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Controls */}
            <div className="w-full flex flex-col gap-3">
                {/* Main Help Buttons */}
                {!won && (
                    <div className="flex gap-3 w-full">
                        {/* Hint */}
                        <button
                            onClick={doHint}
                            disabled={isSolving}
                            className="flex-1 flex items-center justify-center gap-2 bg-pink-500/15 hover:bg-pink-500/25 border border-pink-400/30 text-pink-300 hover:text-white rounded-2xl px-4 py-3 text-xs font-bold transition-all active:scale-95 disabled:opacity-40"
                        >
                            <Lightbulb className="w-4 h-4" />
                            Need Help?
                        </button>

                        {/* Auto Solve */}
                        <button
                            onClick={autoSolve}
                            disabled={isSolving || won}
                            className="flex-1 flex items-center justify-center gap-2 bg-purple-500/15 hover:bg-purple-500/25 border border-purple-400/30 text-purple-300 hover:text-white rounded-2xl px-4 py-3 text-xs font-bold transition-all active:scale-95 disabled:opacity-40"
                        >
                            {isSolving ? (
                                <>
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                        className="w-4 h-4 border-2 border-purple-300 border-t-transparent rounded-full"
                                    />
                                    Solving…
                                </>
                            ) : (
                                <>
                                    <Wand2 className="w-4 h-4" />
                                    Auto Solve
                                </>
                            )}
                        </button>
                    </div>
                )}

                {/* Reshuffle */}
                <button
                    onClick={shuffle}
                    className="flex items-center justify-center gap-2 mx-auto text-zinc-500 hover:text-white transition-colors text-[10px] font-bold bg-white/5 px-5 py-2 rounded-full border border-white/5"
                >
                    <RotateCcw className="w-3 h-3" /> Reshuffle
                </button>
            </div>
        </div>
    )
}
