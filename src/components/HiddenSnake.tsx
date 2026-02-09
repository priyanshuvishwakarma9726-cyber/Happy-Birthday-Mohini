'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Trophy, RefreshCw, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import confetti from 'canvas-confetti'

const GRID_SIZE = 20
const CELL_SIZE = 20
const INITIAL_SPEED = 150

type Point = { x: number, y: number }

export default function HiddenSnake({ onClose }: { onClose: () => void }) {
    const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }])
    const [food, setFood] = useState<Point>({ x: 15, y: 10 })
    const [direction, setDirection] = useState<Point>({ x: 1, y: 0 })
    const [gameOver, setGameOver] = useState(false)
    const [score, setScore] = useState(0)
    const [highScore, setHighScore] = useState(0)
    const [isPaused, setIsPaused] = useState(false)

    // Refs for latest state in interval
    const snakeRef = useRef(snake)
    const dirRef = useRef(direction)
    const gameLoopRef = useRef<NodeJS.Timeout>(null)

    useEffect(() => {
        const saved = localStorage.getItem('snake_highscore')
        if (saved) setHighScore(parseInt(saved))
        startGame()
        return () => stopGame()
    }, [])

    useEffect(() => {
        snakeRef.current = snake
    }, [snake])

    useEffect(() => {
        dirRef.current = direction
    }, [direction])

    const startGame = () => {
        setSnake([{ x: 10, y: 10 }])
        setFood(randomFood())
        setDirection({ x: 1, y: 0 })
        setGameOver(false)
        setScore(0)
        setIsPaused(false)
        if (gameLoopRef.current) clearInterval(gameLoopRef.current)
        gameLoopRef.current = setInterval(gameLoop, INITIAL_SPEED)
    }

    const stopGame = () => {
        if (gameLoopRef.current) clearInterval(gameLoopRef.current)
    }

    const randomFood = (): Point => {
        return {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
        }
    }

    const gameLoop = () => {
        const currentHead = snakeRef.current[0]
        const currentDir = dirRef.current

        const newHead = {
            x: currentHead.x + currentDir.x,
            y: currentHead.y + currentDir.y
        }

        // Check Wall Collision
        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
            handleGameOver()
            return
        }

        // Check Self Collision
        if (snakeRef.current.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
            handleGameOver()
            return
        }

        // Move
        const newSnake = [newHead, ...snakeRef.current]

        // Check Food
        if (newHead.x === food.x && newHead.y === food.y) { // This will check against OLD food state, need ref? 
            // Actually functional update is tricky with Interval. 
            // We use state for render, refs for logic? 
            // Let's rely on setState purely? No, stale closures.
            // Using Refs inside Loop is correct.
            // But we need to update 'food'.
            // Simple hack: We'll see if `newHead` matches current `food` state (which might be stale in closure if not careful)
            // But `food` state changes trigger re-render, not re-creation of `gameLoop` if we don't depend on it.
            // Let's use a ref for food too.
        }
        // ...Wait, standard React Snake is simpler with `useInterval` hook pattern.
        // Let's stick to functional updates.

        setSnake(prev => {
            const head = prev[0]
            const next = { x: head.x + dirRef.current.x, y: head.y + dirRef.current.y }

            // Re-check collision inside setter to be safe
            if (next.x < 0 || next.x >= GRID_SIZE || next.y < 0 || next.y >= GRID_SIZE ||
                prev.some(s => s.x === next.x && s.y === next.y)) {
                // We can't easily trigger side-effect (GameOver) here.
                // We'll rely on the outside check or simpler logic.
                return prev
            }

            // Food check - we need latest food. 
            // Actually, let's restart the interval logic to be simpler:
            return prev
        })
    }

    // Refactored Game Loop using `useEffect` dependency on `snake`? 
    // No, that causes jitter.
    // Let's use `latest state` pattern.

    // ... Actually, for a helper component, let's keep it simple.
    // We will just use a `useEffect` with `setTimeout` that calls itself.

    const moveSnake = useCallback(() => {
        if (gameOver || isPaused) return

        setSnake(prevSnake => {
            const newHead = { x: prevSnake[0].x + direction.x, y: prevSnake[0].y + direction.y }

            // Collisions
            if (
                newHead.x < 0 ||
                newHead.x >= GRID_SIZE ||
                newHead.y < 0 ||
                newHead.y >= GRID_SIZE ||
                prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
            ) {
                setGameOver(true)
                return prevSnake
            }

            const newSnake = [newHead, ...prevSnake]

            // Eat Food
            if (newHead.x === food.x && newHead.y === food.y) {
                setScore(s => s + 1)
                setFood(randomFood())
                // Celebration
                confetti({ particleCount: 20, spread: 30, origin: { y: 0.8 }, colors: ['#22c55e'] })
            } else {
                newSnake.pop()
            }

            return newSnake
        })
    }, [direction, food, gameOver, isPaused])

    useEffect(() => {
        const interval = setInterval(moveSnake, Math.max(50, INITIAL_SPEED - (score * 2)))
        return () => clearInterval(interval)
    }, [moveSnake, score])


    const handleKeyDown = (e: KeyboardEvent) => {
        switch (e.key) {
            case 'ArrowUp': if (direction.y !== 1) setDirection({ x: 0, y: -1 }); break;
            case 'ArrowDown': if (direction.y !== -1) setDirection({ x: 0, y: 1 }); break;
            case 'ArrowLeft': if (direction.x !== 1) setDirection({ x: -1, y: 0 }); break;
            case 'ArrowRight': if (direction.x !== -1) setDirection({ x: 1, y: 0 }); break;
        }
    }

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [direction]) // Dep on direction to prevent 180 turn in 1 tick? No, just logic check.

    const handleGameOver = () => {
        setGameOver(true)
        if (score > highScore) {
            setHighScore(score)
            localStorage.setItem('snake_highscore', score.toString())
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
        >
            <div className="bg-zinc-900 border-2 border-green-500 rounded-3xl p-6 shadow-[0_0_50px_rgba(34,197,94,0.3)] w-full max-w-md relative">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2 text-green-400">
                        <Trophy className="w-5 h-5" />
                        <span className="font-bold">High: {highScore}</span>
                    </div>
                    <div className="text-xl font-black text-white glow-text">SNAKE 🐍</div>
                    <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Game Board */}
                <div
                    className="relative bg-black/50 border border-green-500/30 mx-auto"
                    style={{
                        width: GRID_SIZE * CELL_SIZE,
                        height: GRID_SIZE * CELL_SIZE,
                        display: 'grid',
                        gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`
                    }}
                >
                    {/* Snake */}
                    {snake.map((segment, i) => (
                        <div
                            key={i}
                            className="absolute bg-green-500 rounded-sm"
                            style={{
                                width: CELL_SIZE - 2,
                                height: CELL_SIZE - 2,
                                left: segment.x * CELL_SIZE + 1,
                                top: segment.y * CELL_SIZE + 1,
                                opacity: i === 0 ? 1 : 0.6, // Head darker
                                zIndex: 10
                            }}
                        />
                    ))}

                    {/* Food */}
                    <div
                        className="absolute bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_red]"
                        style={{
                            width: CELL_SIZE - 4,
                            height: CELL_SIZE - 4,
                            left: food.x * CELL_SIZE + 2,
                            top: food.y * CELL_SIZE + 2,
                            zIndex: 10
                        }}
                    />

                    {/* Game Over Overlay */}
                    {gameOver && (
                        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20">
                            <h2 className="text-3xl font-black text-red-500 mb-2">GAME OVER</h2>
                            <p className="text-white mb-6">Score: {score}</p>
                            <button
                                onClick={startGame}
                                className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold px-6 py-2 rounded-full transition-transform hover:scale-105"
                            >
                                <RefreshCw className="w-4 h-4" /> Play Again
                            </button>
                        </div>
                    )}
                </div>

                {/* Mobile Controls */}
                <div className="mt-6 grid grid-cols-3 gap-2 max-w-[200px] mx-auto md:hidden">
                    <div />
                    <button onClick={() => direction.y !== 1 && setDirection({ x: 0, y: -1 })} className="bg-zinc-800 p-4 rounded-lg active:bg-green-900"><ChevronUp className="w-6 h-6 text-white" /></button>
                    <div />
                    <button onClick={() => direction.x !== 1 && setDirection({ x: -1, y: 0 })} className="bg-zinc-800 p-4 rounded-lg active:bg-green-900"><ChevronLeft className="w-6 h-6 text-white" /></button>
                    <button onClick={() => direction.y !== -1 && setDirection({ x: 0, y: 1 })} className="bg-zinc-800 p-4 rounded-lg active:bg-green-900"><ChevronDown className="w-6 h-6 text-white" /></button>
                    <button onClick={() => direction.x !== -1 && setDirection({ x: 1, y: 0 })} className="bg-zinc-800 p-4 rounded-lg active:bg-green-900"><ChevronRight className="w-6 h-6 text-white" /></button>
                </div>

                <p className="text-center text-zinc-500 text-xs mt-4 hidden md:block">Use Arrow Keys to Move</p>
            </div>
        </motion.div>
    )
}
