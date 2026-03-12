import React, { ReactNode } from 'react'

// A comprehensive regex for modern emojis including sequences, modifiers, and variation selectors
// Revised regex to be more aggressive in catching all types of emojis
const EMOJI_REGEX = /([\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F191}-\u{1F251}\u{1F004}\u{1F0CF}\u{1F170}-\u{1F171}\u{1F17E}-\u{1F17F}\u{1F18E}\u{3030}\u{2B50}\u{2B55}\u{2934}-\u{2935}\u{2B05}-\u{2B07}\u{2122}\u{2139}\u{24C2}\u{3297}\u{3299}\u{203C}\u{2049}\u{2194}-\u{2199}\u{21A9}-\u{21AA}\u{231A}-\u{231B}\u{2328}\u{23CF}\u{23E9}-\u{23F3}\u{23F8}-\u{23FA}\u{24C2}\u{25AA}-\u{25AB}\u{25B6}\u{25C0}\u{25FB}-\u{25FE}\u{2600}-\u{2604}\u{260E}\u{2611}\u{2614}-\u{2615}\u{2618}\u{261D}\u{2620}\u{2622}-\u{2623}\u{2626}\u{262A}\u{262E}-\u{262F}\u{2638}-\u{263A}]+)/gu

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
