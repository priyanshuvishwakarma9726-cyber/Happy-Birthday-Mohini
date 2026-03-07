'use client'

import React from 'react'

interface EmojiProps {
    symbol: string
    label?: string
    className?: string
}

export default function Emoji({ symbol, label, className = "" }: EmojiProps) {
    if (!symbol) return null;

    return (
        <img
            src={`https://emojicdn.elk.sh/${encodeURIComponent(symbol)}?style=apple`}
            alt={label || symbol}
            className={`emoji inline-block w-[1.2em] h-[1.2em] align-[-0.2em] select-none pointer-events-none ${className}`}
            draggable={false}
        />
    )
}
