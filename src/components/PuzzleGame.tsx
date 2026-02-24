'use client'
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect, useRef, useCallback } from "react"
import { RotateCcw, Timer, Trophy, Play, Lightbulb, Wand2 } from 'lucide-react'
import confetti from 'canvas-confetti'

interface PuzzleGameProps {
    imageUrl: string
    difficulty?: 3 | 4 | 5
    victoryMessage?: string
    onComplete?: () => void
}

// ════════════════════════════════════════════════════════════════════
// HEURISTICS
// ════════════════════════════════════════════════════════════════════

function manhattan(tiles: number[], size: number): number {
    let d = 0
    const blank = size * size - 1
    for (let i = 0; i < tiles.length; i++) {
        const v = tiles[i]
        if (v === blank) continue
        d += Math.abs(Math.floor(v / size) - Math.floor(i / size))
            + Math.abs((v % size) - (i % size))
    }
    return d
}

/** Linear conflict: adds 2 for every pair of tiles in correct row/col but swapped. */
function linearConflict(tiles: number[], size: number): number {
    let lc = 0
    // Rows
    for (let row = 0; row < size; row++) {
        for (let col1 = 0; col1 < size - 1; col1++) {
            const t1 = tiles[row * size + col1]
            if (t1 === size * size - 1 || Math.floor(t1 / size) !== row) continue
            for (let col2 = col1 + 1; col2 < size; col2++) {
                const t2 = tiles[row * size + col2]
                if (t2 === size * size - 1 || Math.floor(t2 / size) !== row) continue
                if (t1 > t2) lc += 2
            }
        }
    }
    // Cols
    for (let col = 0; col < size; col++) {
        for (let row1 = 0; row1 < size - 1; row1++) {
            const t1 = tiles[row1 * size + col]
            if (t1 === size * size - 1 || (t1 % size) !== col) continue
            for (let row2 = row1 + 1; row2 < size; row2++) {
                const t2 = tiles[row2 * size + col]
                if (t2 === size * size - 1 || (t2 % size) !== col) continue
                if (t1 > t2) lc += 2
            }
        }
    }
    return lc
}

function heuristic(tiles: number[], size: number): number {
    return manhattan(tiles, size) + linearConflict(tiles, size)
}

// ════════════════════════════════════════════════════════════════════
// IDA* SOLVER
// Returns ordered list of visual-indices to click (tile pos → empty pos swap)
// Returns [] if already solved, null on timeout.
// ════════════════════════════════════════════════════════════════════

function solvePuzzle(startTiles: number[], size: number, timeoutMs = 5000): number[] | null {
    const blank = size * size - 1
    if (startTiles.every((v, i) => v === i)) return []

    const moveSeq: number[] = []
    const deadline = Date.now() + timeoutMs
    const FOUND = -1

    function neighbors(ei: number): number[] {
        const r = Math.floor(ei / size), c = ei % size
        const ns: number[] = []
        if (r > 0) ns.push(ei - size)
        if (r < size - 1) ns.push(ei + size)
        if (c > 0) ns.push(ei - 1)
        if (c < size - 1) ns.push(ei + 1)
        return ns
    }

    function search(tiles: number[], g: number, bound: number, prevEmpty: number): number {
        if (Date.now() > deadline) return Infinity
        const h = heuristic(tiles, size)
        const f = g + h
        if (f > bound) return f
        if (h === 0) return FOUND
        let min = Infinity
        const ei = tiles.indexOf(blank)
        for (const n of neighbors(ei)) {
            if (n === prevEmpty) continue          // never undo last move
            const next = tiles.slice()
            next[ei] = next[n]
            next[n] = blank
            moveSeq.push(n)
            const t = search(next, g + 1, bound, ei)
            if (t === FOUND) return FOUND
            if (t < min) min = t
            moveSeq.pop()
        }
        return min
    }

    let bound = heuristic(startTiles, size)
    while (true) {
        if (Date.now() > deadline) return null
        const t = search([...startTiles], 0, bound, -1)
        if (t === FOUND) return [...moveSeq]
        if (t === Infinity) return null
        bound = t
    }
}

// ════════════════════════════════════════════════════════════════════
// SHUFFLE HELPERS (Fisher-Yates + solvability)
// ════════════════════════════════════════════════════════════════════

function countInversions(arr: number[]): number {
    const flat = arr.filter(v => v !== arr.length - 1)
    let inv = 0
    for (let i = 0; i < flat.length - 1; i++)
        for (let j = i + 1; j < flat.length; j++)
            if (flat[i] > flat[j]) inv++
    return inv
}

function isSolvable(arr: number[], size: number): boolean {
    const inv = countInversions(arr)
    if (size % 2 === 1) return inv % 2 === 0
    const blankRow = Math.floor(arr.indexOf(size * size - 1) / size)
    return (inv + (size - blankRow)) % 2 === 1
}

function createShuffledTiles(size: number): number[] {
    const total = size * size
    let arr: number[]
    do {
        arr = Array.from({ length: total }, (_, i) => i)
        for (let i = total - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]]
        }
    } while (!isSolvable(arr, size) || arr.every((v, i) => v === i))
    return arr
}

// ════════════════════════════════════════════════════════════════════
// ADJACENT GLOW HELPER
// ════════════════════════════════════════════════════════════════════

function getAdjacentSet(tiles: number[], size: number): Set<number> {
    const blank = size * size - 1
    const ei = tiles.indexOf(blank)
    const r = Math.floor(ei / size), c = ei % size
    const adj = new Set<number>()
    if (r > 0) adj.add(ei - size)
    if (r < size - 1) adj.add(ei + size)
    if (c > 0) adj.add(ei - 1)
    if (c < size - 1) adj.add(ei + 1)
    return adj
}

// ════════════════════════════════════════════════════════════════════
// COMPONENT
// ════════════════════════════════════════════════════════════════════

export default function PuzzleGame({ imageUrl, difficulty = 4, victoryMessage, onComplete }: PuzzleGameProps) {
    const SIZE = difficulty
    const TOTAL = SIZE * SIZE
    const BLANK = TOTAL - 1

    const [tiles, setTiles] = useState<number[]>([])
    const [won, setWon] = useState(false)
    const [timer, setTimer] = useState(0)
    const [isActive, setIsActive] = useState(false)
    const [moves, setMoves] = useState(0)
    const [hintIdx, setHintIdx] = useState<number | null>(null)
    const [showIdleTip, setShowIdleTip] = useState(false)
    const [isSolving, setIsSolving] = useState(false)
    const [solveStatus, setSolveStatus] = useState<'idle' | 'computing' | 'ready' | 'failed'>('idle')

    // Persistent refs
    const tilesRef = useRef(tiles)
    tilesRef.current = tiles
    const solverRef = useRef<ReturnType<typeof setInterval> | null>(null)
    const idleRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const solveGenRef = useRef(0)   // generation counter to cancel stale computes

    // Solution path: ordered list of visual indices to click
    const solutionRef = useRef<number[]>([])
    // Where we are in the stored solution (how many steps already applied)
    const cursorRef = useRef(0)

    // ── Idle tip ──────────────────────────────────────────────────────────────
    const resetIdle = useCallback(() => {
        if (idleRef.current) clearTimeout(idleRef.current)
        setShowIdleTip(false)
        idleRef.current = setTimeout(() => setShowIdleTip(true), 25000)
    }, [])

    // ── Async: precompute solution path ───────────────────────────────────────
    const computeSolution = useCallback((currentTiles: number[]) => {
        const gen = ++solveGenRef.current
        setSolveStatus('computing')
        solutionRef.current = []
        cursorRef.current = 0
        // Defer to next tick so UI renders first
        setTimeout(() => {
            if (solveGenRef.current !== gen) return   // stale
            const path = solvePuzzle(currentTiles, SIZE, SIZE <= 3 ? 8000 : 6000)
            if (solveGenRef.current !== gen) return   // stale
            if (path !== null) {
                solutionRef.current = path
                cursorRef.current = 0
                setSolveStatus('ready')
            } else {
                solutionRef.current = []
                cursorRef.current = 0
                setSolveStatus('failed')
            }
        }, 0)
    }, [SIZE])

    // ── Shuffle / new game ────────────────────────────────────────────────────
    const shuffle = useCallback(() => {
        if (solverRef.current) clearInterval(solverRef.current)
        ++solveGenRef.current   // cancel any in-flight solve
        const fresh = createShuffledTiles(SIZE)
        setTiles(fresh)
        setWon(false)
        setTimer(0)
        setMoves(0)
        setIsActive(true)
        setHintIdx(null)
        setShowIdleTip(false)
        setIsSolving(false)
        resetIdle()
        computeSolution(fresh)
    }, [SIZE, resetIdle, computeSolution])

    useEffect(() => { shuffle() }, [difficulty, imageUrl])

    // ── Timer ─────────────────────────────────────────────────────────────────
    useEffect(() => {
        let itv: ReturnType<typeof setInterval>
        if (isActive && !won) itv = setInterval(() => setTimer(t => t + 1), 1000)
        return () => clearInterval(itv)
    }, [isActive, won])

    // Cleanup on unmount
    useEffect(() => () => {
        if (solverRef.current) clearInterval(solverRef.current)
        if (idleRef.current) clearTimeout(idleRef.current)
        ++solveGenRef.current
    }, [])

    // ── Win handler ───────────────────────────────────────────────────────────
    const handleWin = useCallback((nextTiles: number[]) => {
        if (nextTiles.every((v, i) => v === i)) {
            setWon(true)
            setIsActive(false)
            setShowIdleTip(false)
            setIsSolving(false)
            if (idleRef.current) clearTimeout(idleRef.current)
            if (solverRef.current) clearInterval(solverRef.current)
            ++solveGenRef.current
            confetti({ particleCount: 160, spread: 70, origin: { y: 0.6 }, colors: ['#ec4899', '#8b5cf6', '#ffffff'] })
            onComplete?.()
            return true
        }
        return false
    }, [onComplete])

    // ── Apply a single move (swap tile at clickIdx with blank) ────────────────
    const applyMove = useCallback((clickIdx: number, current: number[]): number[] => {
        const ei = current.indexOf(BLANK)
        const next = current.slice()
        next[ei] = next[clickIdx]
        next[clickIdx] = BLANK
        return next
    }, [BLANK])

    // ── Manual tile click ─────────────────────────────────────────────────────
    const handleTileClick = useCallback((visualIndex: number) => {
        if (won || isSolving) return
        const cur = tilesRef.current
        const ei = cur.indexOf(BLANK)
        const r = Math.floor(visualIndex / SIZE), c = visualIndex % SIZE
        const er = Math.floor(ei / SIZE), ec = ei % SIZE
        if (Math.abs(r - er) + Math.abs(c - ec) !== 1) return

        const next = applyMove(visualIndex, cur)
        setTiles(next)
        setMoves(m => m + 1)
        setHintIdx(null)
        resetIdle()

        // Track solution cursor: if this move matches expected next hint move → advance
        const sol = solutionRef.current
        if (sol.length > 0 && cursorRef.current < sol.length && sol[cursorRef.current] === visualIndex) {
            cursorRef.current++
        } else {
            // User deviated — recompute from new state
            computeSolution(next)
        }

        handleWin(next)
    }, [won, isSolving, SIZE, BLANK, applyMove, resetIdle, computeSolution, handleWin])

    // ── Hint: apply next move from precomputed path ───────────────────────────
    const doHint = useCallback(() => {
        if (won || isSolving) return
        const sol = solutionRef.current
        const cur = cursorRef.current

        if (solveStatus === 'computing') return   // wait
        if (sol.length === 0 || cur >= sol.length) return  // no path or already done

        const nextMoveIdx = sol[cur]
        cursorRef.current++

        // Flash hint glow
        setHintIdx(nextMoveIdx)
        setTimeout(() => setHintIdx(null), 700)

        // Apply after brief glow
        setTimeout(() => {
            const next = applyMove(nextMoveIdx, tilesRef.current)
            setTiles(next)
            setMoves(m => m + 1)
            resetIdle()
            handleWin(next)
        }, 350)
    }, [won, isSolving, solveStatus, applyMove, resetIdle, handleWin])

    // ── Auto Solve: replay entire remaining solution path ─────────────────────
    const autoSolve = useCallback(() => {
        if (won || isSolving) return
        if (solveStatus === 'computing') return

        const sol = solutionRef.current
        if (sol.length === 0) return

        setIsSolving(true)
        setHintIdx(null)

        // Start from the cursor position (user may have partially solved manually)
        let step = cursorRef.current

        solverRef.current = setInterval(() => {
            if (step >= sol.length) {
                if (solverRef.current) clearInterval(solverRef.current)
                setIsSolving(false)
                return
            }
            const nextMoveIdx = sol[step]
            step++
            cursorRef.current = step

            const next = applyMove(nextMoveIdx, tilesRef.current)
            setTiles(next)
            setMoves(m => m + 1)

            if (next.every((v, i) => v === i)) {
                if (solverRef.current) clearInterval(solverRef.current)
                handleWin(next)
            }
        }, 400)
    }, [won, isSolving, solveStatus, applyMove, handleWin])

    const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`
    const adjacentSet = tiles.length ? getAdjacentSet(tiles, SIZE) : new Set<number>()
    const solutionReady = solveStatus === 'ready' && solutionRef.current.length > cursorRef.current
    const hintLabel = solveStatus === 'computing' ? '⏳ Computing…' : solveStatus === 'failed' ? '⚠️ No Path' : '💡 Hint'

    return (
        <div className="flex flex-col items-center gap-6 p-4 sm:p-8 bg-zinc-900/60 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 shadow-2xl w-full max-w-[420px] mx-auto select-none">

            {/* Stats */}
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

            {/* Board */}
            <div className="relative bg-black/40 p-2 rounded-2xl border-2 border-white/5 shadow-inner aspect-square w-full">
                <div
                    className="grid w-full h-full gap-1.5"
                    style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)`, gridTemplateRows: `repeat(${SIZE}, 1fr)` }}
                >
                    {tiles.map((tileId, visualIndex) => {
                        const isEmpty = tileId === BLANK
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
                                whileHover={isMovable ? { scale: 0.97, filter: "brightness(1.13)" } : {}}
                                whileTap={isMovable ? { scale: 0.93 } : {}}
                                className={`relative rounded-lg overflow-hidden shadow-lg transition-shadow duration-300
                                    ${isMovable ? 'cursor-pointer' : 'cursor-default'}
                                    ${isHinted
                                        ? 'border-2 border-pink-400 shadow-[0_0_20px_5px_rgba(236,72,153,0.6)]'
                                        : isMovable
                                            ? 'border border-pink-300/35 shadow-[0_0_8px_1px_rgba(236,72,153,0.18)]'
                                            : 'border border-white/8'
                                    }`}
                                style={{
                                    backgroundImage: `url(${imageUrl})`,
                                    backgroundSize: `${SIZE * 100}% ${SIZE * 100}%`,
                                    backgroundPosition: `${posX}% ${posY}%`,
                                }}
                                transition={{ type: "spring", stiffness: 360, damping: 28 }}
                            >
                                {isHinted && (
                                    <motion.div
                                        className="absolute inset-0 bg-pink-400/20 flex items-center justify-center pointer-events-none"
                                        animate={{ opacity: [0.3, 1, 0.3] }}
                                        transition={{ repeat: Infinity, duration: 0.7 }}
                                    >
                                        <span className="text-white text-xl drop-shadow-lg">👆</span>
                                    </motion.div>
                                )}
                            </motion.div>
                        )
                    })}
                </div>

                {/* Win overlay */}
                <AnimatePresence>
                    {won && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.88 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/92 backdrop-blur-md p-6 text-center rounded-xl"
                        >
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="w-20 h-20 bg-gradient-to-tr from-pink-500 to-purple-600 rounded-full flex items-center justify-center mb-4 shadow-[0_0_32px_rgba(236,72,153,0.65)]"
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

            {/* Idle tip */}
            <AnimatePresence>
                {showIdleTip && !won && (
                    <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        className="px-4 py-2 bg-pink-500/12 border border-pink-400/25 rounded-full text-pink-300 text-[11px] font-semibold text-center"
                    >
                        💡 Tap tiles next to the empty space
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Controls */}
            {!won && (
                <div className="w-full flex flex-col gap-3">
                    <div className="flex gap-3 w-full">
                        {/* Hint button */}
                        <button
                            onClick={doHint}
                            disabled={isSolving || !solutionReady}
                            className="flex-1 flex items-center justify-center gap-2 bg-pink-500/14 hover:bg-pink-500/24 border border-pink-400/28 text-pink-300 hover:text-white rounded-2xl px-4 py-3 text-xs font-bold transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <Lightbulb className="w-4 h-4 shrink-0" />
                            {hintLabel}
                        </button>

                        {/* Auto Solve button */}
                        <button
                            onClick={autoSolve}
                            disabled={isSolving || !solutionReady}
                            className="flex-1 flex items-center justify-center gap-2 bg-purple-500/14 hover:bg-purple-500/24 border border-purple-400/28 text-purple-300 hover:text-white rounded-2xl px-4 py-3 text-xs font-bold transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {isSolving ? (
                                <>
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
                                        className="w-4 h-4 border-2 border-purple-300 border-t-transparent rounded-full shrink-0"
                                    />
                                    Solving…
                                </>
                            ) : (
                                <>
                                    <Wand2 className="w-4 h-4 shrink-0" />
                                    Auto Solve
                                </>
                            )}
                        </button>
                    </div>

                    <button
                        onClick={shuffle}
                        className="flex items-center justify-center gap-2 mx-auto text-zinc-500 hover:text-white transition-colors text-[10px] font-bold bg-white/5 px-5 py-2 rounded-full border border-white/5"
                    >
                        <RotateCcw className="w-3 h-3" /> Reshuffle
                    </button>
                </div>
            )}
        </div>
    )
}
