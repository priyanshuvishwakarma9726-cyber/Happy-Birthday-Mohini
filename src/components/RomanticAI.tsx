'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, Check, Sparkles, MessageSquareHeart } from 'lucide-react'

// Sophisticated Client-Side 'AI' Engine (Free & API-less)
const POETIC_ENGINE = {
    vocab: {
        "love": ["adore you with every fiber of my being", "cherish our soul's connection", "worship the very air you breathe", "hold you in the highest sanctity of my heart"],
        "happy": ["overjoyed with celestial bliss", "radiating with infinite joy", "bathed in the golden glow of euphoria", "dancing in a sea of pure delight"],
        "birthday": ["anniversary of your cosmic arrival", "magnificent day you entered this world", "celebration of the miracle that is you", "day the stars aligned to create perfection"],
        "beautiful": ["ethereal as a dream", "more radiant than a thousand suns", "a masterpiece crafted by divine hands", "stunning beyond the reach of human words"],
        "always": ["until the stars cease to shine", "for all eternity and a day more", "through every heartbeat of time", "as long as the universe continues to expand"],
        "forever": ["across the endless horizons of destiny", "into the infinite reaches of time", "beyond the boundaries of forever", "until the oceans dry and mountains crumble"],
        "miss": ["yearn for your presence like the earth yearns for rain", "ache for the warmth of your smile", "feel a void that only you can fill", "count every second until we meet again"],
        "together": ["intertwined like two vines in a garden of paradise", "as one single heartbeat in two bodies", "on a journey through the constellations of fate", "unified in a tapestry of shared dreams"],
        "smile": ["the light that guides me through the darkest nights", "a curve that sets the whole world straight", "a symphony of joy for my weary soul", "the most precious treasure I have ever beheld"],
        "heart": ["the sacred temple of my love", "the compass that always points to you", "a vessel overflowing with devotion", "the sanctuary where you will always reside"],
        "amazing": ["extraordinary beyond measure", "a celestial wonder that defies logic", "magnificent in every conceivable way", "breath-taking like a sunset on the edge of the world"],
        "best": ["the most exquisite soul I have ever known", "the pinnacle of human grace", "unrivaled in beauty and kindness", "the greatest blessing life has ever bestowed upon me"],
        "sweet": ["tender as a rose petal in the morning dew", "delicate and nourishing to my spirit", "more intoxicating than the finest honey", "a gentle whisper of grace in a loud world"],
        "mohini": ["Mohini, my muse and my moonlight", "Mohini, the queen of my quiet moments", "Mohini, the melody that my heart hums", "Mohini, my most cherished blessing"],
    } as Record<string, string[]>,

    connectors: [
        " In the quiet whispers of my soul,",
        " Within the chambers of my deepest thoughts,",
        " As the moon chases the sun across the sky,",
        " With a devotion that knows no bounds,",
        " Under the watchful eyes of the angels,",
        " In this beautiful journey called life,",
    ],

    structures: [
        "{connector} I want to say that {p1}. You are {p2} and I will {p3} {p4}.",
        "My dearest, {p1}. To me, you are {p2}. I promise to {p3} {p4}. {connector}",
        "Every time I think of you, I feel {p1}. You remain {p2}, and my only wish is to {p3} {p4}.",
    ]
};

export default function RomanticAI({ content }: { content?: any }) {
    const [text, setText] = useState('')
    const [listening, setListening] = useState(false)
    const [output, setOutput] = useState('')
    const [isProcessing, setIsProcessing] = useState(false)

    const romanticize = (inputText?: string) => {
        const targetText = inputText || text;
        if (!targetText) return;

        setIsProcessing(true)
        setTimeout(() => {
            const inputLower = targetText.toLowerCase();

            // Extract identified keys from input
            const foundKeys = Object.keys(POETIC_ENGINE.vocab).filter(key =>
                inputLower.includes(key)
            );

            // Select 3 unique poetic phrases based on found keys or defaults
            const getPhrase = (index: number) => {
                const key = foundKeys[index] || Object.keys(POETIC_ENGINE.vocab)[Math.floor(Math.random() * Object.keys(POETIC_ENGINE.vocab).length)];
                const phrases = POETIC_ENGINE.vocab[key];
                return phrases[Math.floor(Math.random() * phrases.length)];
            };

            const p1 = getPhrase(0);
            const p2 = getPhrase(1);
            const p3 = getPhrase(2);
            const p4 = getPhrase(3);
            const connector = POETIC_ENGINE.connectors[Math.floor(Math.random() * POETIC_ENGINE.connectors.length)];
            const structure = POETIC_ENGINE.structures[Math.floor(Math.random() * POETIC_ENGINE.structures.length)];

            let polished = structure
                .replace('{connector}', connector)
                .replace('{p1}', p1)
                .replace('{p2}', p2)
                .replace('{p3}', p3)
                .replace('{p4}', p4);

            setOutput(polished);
            setIsProcessing(false)
        }, 1500) // Fake AI delay
    }

    // Voice Recognition (Browser API)
    const startListening = () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert("Your browser doesn't support voice recognition. Try Chrome!")
            return
        }

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        const recognition = new SpeechRecognition()
        recognition.lang = 'en-US'
        recognition.interimResults = false
        recognition.maxAlternatives = 1

        recognition.onstart = () => {
            setListening(true)
            setText('')
            setOutput('')
        }

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript
            setText(transcript)
            setListening(false)
            // Auto-trigger the romanticize engine for 'magic' feel
            romanticize(transcript)
        }

        recognition.onerror = (event: any) => {
            console.error(event.error)
            setListening(false)
        }

        recognition.onend = () => setListening(false)

        recognition.start()
    }

    // Helper to wrap emojis
    const renderEmojiText = (txt: string) => {
        if (!txt) return txt;
        return txt.split(/(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/u).map((part, i) => {
            if (/(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/u.test(part)) {
                return <span key={i} className="emoji inline-block not-italic">{part}</span>
            }
            return part
        })
    }

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-xl mx-auto shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500" />

            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-300 to-purple-300 mb-6 flex items-center gap-2 font-romantic">
                <Sparkles className="w-6 h-6 text-pink-400" /> {renderEmojiText("AI Poet Assistant 🤖")}
            </h3>

            <p className="text-zinc-400 text-sm mb-6">
                Speak your simple birthday wish, and watch AI turn it into poetry!
            </p>

            <div className="space-y-4">
                <div className="relative">
                    <textarea
                        value={text}
                        onChange={e => setText(e.target.value)}
                        placeholder="Say 'Happy Birthday Mohini, I love you!'"
                        className="w-full bg-zinc-950/50 p-4 rounded-xl border border-zinc-800 focus:border-pink-500 outline-none text-white min-h-[100px] resize-none pr-12"
                    />
                    <button
                        onClick={startListening}
                        className={`absolute bottom-3 right-3 p-2 rounded-full transition-colors ${listening ? 'bg-red-500 animate-pulse text-white' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}
                        title="Mic Input"
                    >
                        <Mic className="w-5 h-5" />
                    </button>
                </div>

                <button
                    onClick={() => romanticize()}
                    disabled={!text || isProcessing}
                    className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold py-3 rounded-xl hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 transition-transform active:scale-95"
                >
                    {isProcessing ? (
                        <>
                            <Sparkles className="w-5 h-5 animate-spin" /> {renderEmojiText("Magic Happening... ✨")}
                        </>
                    ) : (
                        <>
                            <MessageSquareHeart className="w-5 h-5" /> {renderEmojiText("Make it Romantic! 💖")}
                        </>
                    )}
                </button>
            </div>

            <AnimatePresence>
                {output && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-6 bg-pink-900/10 border border-pink-500/20 p-6 rounded-xl relative"
                    >
                        <div className="absolute -top-3 -right-3">
                            <span className="text-4xl animate-bounce">✨</span>
                        </div>
                        <h4 className="text-xs uppercase text-pink-400 font-bold mb-2 tracking-widest">AI Result:</h4>
                        <p className="text-xl font-romantic italic text-pink-100 leading-relaxed indent-8">
                            "{renderEmojiText(output)}"
                        </p>

                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(output)
                                    alert('Copied to heart! (and clipboard)')
                                }}
                                className="text-xs text-pink-400 hover:text-white flex items-center gap-1"
                            >
                                <Check className="w-3 h-3" /> Copy Poem
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
