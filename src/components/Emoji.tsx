'use client'

import React from 'react'

interface EmojiProps {
    symbol: string
    label?: string
    className?: string
}

export default function Emoji({ symbol, label, className = "" }: EmojiProps) {
    // We clean the symbol mostly to fix some variation selectors if needed, but Elk handles standard emojis well
    const emojiSrc = `https://emojicdn.elk.sh/${encodeURIComponent(symbol)}?style=apple`

    return (
        <img
            src={emojiSrc}
            alt={label || symbol}
            aria-hidden={label ? "false" : "true"}
            aria-label={label ? label : ""}
            className={`emoji inline-block align-middle pb-[2px] ${className}`}
            style={{ width: '1.15em', height: '1.15em', verticalAlign: 'middle' }}
            draggable={false}
            onError={(e) => {
                // Fallback to text if the image fails to load
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.removeAttribute('style');
            }}
        />
    )
}
