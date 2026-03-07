'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { renderEmojiText, cleanTextForEmoji } from '@/lib/emoji-helper'

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

        // Use Intl.Segmenter to accurately split graphemes including complex emojis (e.g., family or skin tone emojis)
        const cleaned = cleanTextForEmoji(text)
        const segmenter = new Intl.Segmenter(navigator.language, { granularity: 'grapheme' })
        const characters = Array.from(segmenter.segment(cleaned)).map(s => s.segment)

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

    return (
        <span className={cn("inline-block", className)}>
            {renderEmojiText(displayedText)}
        </span>
    )
}
