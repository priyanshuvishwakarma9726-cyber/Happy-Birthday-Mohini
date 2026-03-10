import React, { ReactNode } from 'react'

// A comprehensive regex for modern emojis including sequences, modifiers, and variation selectors
const EMOJI_REGEX = /((?:\p{Extended_Pictographic}(?:[\uFE0F\uFE0E]|\p{Emoji_Modifier})?(?:\u200D[\p{Extended_Pictographic}\p{Emoji_Presentation}](?:[\uFE0F\uFE0E]|\p{Emoji_Modifier})?)*)|(?:\p{Emoji_Presentation})|(?:\p{Emoji}\uFE0F)|(?:\u26A0\uFE0F)|(?:\u2728))/gu

/**
 * Replaces emojis in text with iOS-style images from emojicdn.elk.sh
 * Returns an array of strings and img components to preserve React behavior and font inheritance.
 */
/**
 * Cleans text for emoji display:
 * 1. Ensures exactly two dots/ellipsis before an emoji if any dots exist.
 * 2. Removes space between dots and emoji.
 */
export function cleanTextForEmoji(text: string): string {
    // Replaces dots/ellipsis and optional spaces with exactly two dots if followed by an emoji
    return text.replace(/[\.…]+(\s*)(?=[\p{Emoji_Presentation}\p{Extended_Pictographic}])/gu, '..');
}

export function renderEmojiText(text: any): ReactNode {
    if (typeof text !== 'string') return text;
    if (!text) return null;

    const cleanedText = cleanTextForEmoji(text);

    // Use split with capturing group to get both text parts and emoji parts
    const parts = cleanedText.split(EMOJI_REGEX);

    // If no emojis found, return the cleaned text
    if (parts.length === 1) return cleanedText;

    return (
        <>
            {parts.map((part, i) => {
                // Every odd index in the split result (when used with capturing group) is our match
                if (i % 2 === 1) {
                    const match = part;
                    // Skip purely numeric, spaces, or simple ASCII characters that might match \p{Emoji}
                    if (/^[\d#*A-Za-z\s]+$/.test(match) || (match.length === 1 && match.charCodeAt(0) < 255)) {
                        return match;
                    }

                    return (
                        <img
                            key={i}
                            src={`https://emojicdn.elk.sh/${encodeURIComponent(match)}?style=apple`}
                            alt={match}
                            className="emoji inline-block w-auto h-[1.2em] select-none pointer-events-none mx-[0.05em]"
                            style={{
                                display: 'inline-block',
                                verticalAlign: 'middle',
                                position: 'relative',
                                top: '-0.05em'
                            }}
                            loading="lazy"
                        />
                    );
                }
                return part;
            })}
        </>
    );
}
