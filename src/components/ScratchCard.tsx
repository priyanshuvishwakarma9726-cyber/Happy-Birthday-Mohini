'use client'
import { useRef, useEffect, useState } from 'react'
import confetti from 'canvas-confetti'

interface Props {
    prizeText: string;
    scratchPrompt?: string;
    onReveal?: () => void;
}

export default function ScratchCard({ prizeText, scratchPrompt = 'Scratch Me! ✨', onReveal }: Props) {
    const textToDisplay = prizeText || "A special surprise just for you! 💖"
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [isRevealed, setIsRevealed] = useState(false)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Initial Paint
        if (!isRevealed) {
            ctx.fillStyle = '#CCCCCC' // Silver
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            // Texture/Noise (Optional, keeps it simple for now)

            // Text
            ctx.fillStyle = '#666666'
            ctx.font = 'bold 20px "Comic Sans MS", cursive, sans-serif'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText(scratchPrompt, canvas.width / 2, canvas.height / 2)
        }

        let isDrawing = false

        const getMousePos = (e: MouseEvent | TouchEvent) => {
            const rect = canvas.getBoundingClientRect()
            let clientX = 0
            let clientY = 0

            // Check for touch event safely
            const isTouch = 'touches' in e
            if (isTouch) {
                const touches = (e as TouchEvent).touches
                if (touches && touches.length > 0) {
                    clientX = touches[0].clientX
                    clientY = touches[0].clientY
                }
            } else {
                clientX = (e as MouseEvent).clientX
                clientY = (e as MouseEvent).clientY
            }

            return {
                x: clientX - rect.left,
                y: clientY - rect.top
            }
        }

        const scratch = (x: number, y: number) => {
            ctx.globalCompositeOperation = 'destination-out'
            ctx.beginPath()
            ctx.arc(x, y, 25, 0, Math.PI * 2)
            ctx.fill()
        }

        const checkReveal = () => {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
            const pixels = imageData.data
            let transparentCount = 0

            for (let i = 3; i < pixels.length; i += 4) {
                if (pixels[i] === 0) transparentCount++
            }

            const percentage = (transparentCount / (pixels.length / 4)) * 100

            if (percentage > 40) { // 40% cleared
                setIsRevealed(true)
                onReveal?.()
                canvas.style.transition = 'opacity 1s ease-out'
                canvas.style.opacity = '0'
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#FFD700', '#FFA500']
                })
            }
        }

        const startDrawing = (e: MouseEvent | TouchEvent) => {
            isDrawing = true
            const { x, y } = getMousePos(e)
            scratch(x, y)
        }

        const stopDrawing = () => {
            if (isDrawing) {
                isDrawing = false
                checkReveal()
            }
        }

        const draw = (e: MouseEvent | TouchEvent) => {
            if (!isDrawing) return
            e.preventDefault()
            const { x, y } = getMousePos(e)
            scratch(x, y)
        }

        canvas.addEventListener('mousedown', startDrawing)
        canvas.addEventListener('touchstart', startDrawing)

        window.addEventListener('mousemove', draw)
        window.addEventListener('touchmove', draw, { passive: false })

        window.addEventListener('mouseup', stopDrawing)
        window.addEventListener('touchend', stopDrawing)

        return () => {
            canvas.removeEventListener('mousedown', startDrawing)
            canvas.removeEventListener('touchstart', startDrawing)
            window.removeEventListener('mousemove', draw)
            window.removeEventListener('touchmove', draw)
            window.removeEventListener('mouseup', stopDrawing)
            window.removeEventListener('touchend', stopDrawing)
        }
    }, [isRevealed, onReveal])

    return (
        <div className="relative w-full max-w-[300px] h-[150px] mx-auto overflow-hidden rounded-xl shadow-2xl border-4 border-pink-300 transform hover:scale-105 transition-transform">
            {/* Hidden Content */}
            <div className={`absolute inset-0 bg-white flex items-center justify-center p-4 text-center select-none ${isRevealed ? 'animate-pulse' : ''}`}>
                <h3 className="font-bold text-xl text-pink-600 font-handwriting">
                    {textToDisplay}
                </h3>
            </div>

            {/* Canvas Overlay */}
            <canvas
                ref={canvasRef}
                width={300}
                height={150}
                className={`absolute inset-0 cursor-crosshair touch-none ${isRevealed ? 'pointer-events-none opacity-0 transition-opacity duration-1000' : ''}`}
            />
        </div>
    )
}
