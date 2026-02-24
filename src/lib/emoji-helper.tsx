import React, { ReactNode } from 'react'
import Emoji from '@/components/Emoji'

// Regex to detect emoji sequences
const EMOJI_REGEX = /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F|\p{Emoji_Modifier_Base}[\p{Emoji_Modifier}]?|\p{Emoji_Component}+|\p{Emoji})/gu

/**
 * Splits text by emojis and wraps each emoji in the <Emoji> component.
 * This ensures high-quality, cross-platform emoji rendering.
 */
export function renderEmojiText(text: string): ReactNode {
    if (!text) return null

    const parts = text.split(EMOJI_REGEX)

    return (
        <>
            {parts.map((part, i) => {
                if (!part) return null
                if (EMOJI_REGEX.test(part)) {
                    EMOJI_REGEX.lastIndex = 0 // Reset stateful regex
                    return <Emoji key={i} symbol={part} />
                }
                EMOJI_REGEX.lastIndex = 0
                return <React.Fragment key={i}>{part}</React.Fragment>
            })}
        </>
    )
}
