'use client'

import React from 'react'

interface EmojiProps {
    symbol: string
    label?: string
    className?: string
}

export default function Emoji({ symbol, label, className = "" }: EmojiProps) {
    return (
        <span
            className={`emoji inline-block font-["Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", sans-serif] not-italic select-none leading-none ${className}`}
            role="img"
            aria-label={label ? label : ""}
            aria-hidden={label ? "false" : "true"}
            style={{
                fontStyle: 'normal',
                verticalAlign: 'middle',
                lineHeight: '1'
            }}
        >
            {symbol}
        </span>
    )
}
