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

        // Simple regex to match emoji sequences and individual characters
        const emojiRegex = /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F|.)/gu
        const characters = Array.from(text.matchAll(emojiRegex), m => m[0])

        let i = 0
        const interval = setInterval(() => {
            if (i < characters.length) {
                setDisplayedText(characters.slice(0, i + 1).join(''))
                i++
            } else {
                clearInterval(interval)
            }
        }, speed)

        return () => clearInterval(interval)
    }, [text, speed, started])

    const renderSegmentedText = (txt: string) => {
        const emojiRegex = /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/gu
        return txt.split(emojiRegex).map((part, i) => {
            if (emojiRegex.test(part)) {
                return <span key={i} className="emoji inline-block not-italic">{part}</span>
            }
            return part
        })
    }

    return (
        <span className={cn("inline-block", className)}>
            {renderSegmentedText(displayedText)}
            <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className={cn("inline-block w-[3px] h-[1em] ml-1 align-middle", cursorColor)}
            />
        </span>
    )
}
