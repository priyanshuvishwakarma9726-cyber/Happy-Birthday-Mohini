'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TypewriterProps {
    text: string
    className?: string
    speed?: number
    cursorColor?: string
    delay?: number
}

export default function TypewriterText({
    text,
    className,
    speed = 100,
    cursorColor = "bg-pink-500",
    delay = 0
}: TypewriterProps) {
    const [displayedText, setDisplayedText] = useState('')
    const [started, setStarted] = useState(false)

    useEffect(() => {
        const startTimeout = setTimeout(() => {
            setStarted(true)
        }, delay)
        return () => clearTimeout(startTimeout)
    }, [delay])

    useEffect(() => {
        if (!started) return

        let i = 0
        const interval = setInterval(() => {
            if (i < text.length) {
                setDisplayedText(text.slice(0, i + 1))
                i++
            } else {
                clearInterval(interval)
            }
        }, speed)

        return () => clearInterval(interval)
    }, [text, speed, started])

    return (
        <span className={cn("inline-block", className)}>
            {displayedText}
            <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className={cn("inline-block w-[3px] h-[1em] ml-1 align-middle", cursorColor)}
            />
        </span>
    )
}
