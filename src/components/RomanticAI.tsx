'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, Check, Sparkles, MessageSquareHeart } from 'lucide-react'

// Simple 'AI' replacement dictionary
const DEFAULT_DICT: Record<string, string> = {
    "happy birthday": "On this glorious day of your existence,",
    "love you": "cherish you eternally",
    "beautiful": "radiant like the moon",
    "amazing": "breathtakingly magical",
    "happy": "overjoyed",
    "wish": "manifest my deepest desire",
    "good": "divine",
    "best": "most exquisite",
    "friend": "soul companion",
    "party": "celebration of life",
    "cake": "sweetest delight",
    "gift": "token of my affection",
    "mohini": "Mohini, my muse,", // Personalize
}

export default function RomanticAI({ content }: { content?: any }) {
    const dict = (() => {
        try {
            if (!content?.romantic_dict) return DEFAULT_DICT;
            const parsed = JSON.parse(content.romantic_dict);
            return (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) ? parsed : DEFAULT_DICT;
        } catch (e) {
            console.warn("RomanticAI: Failed to parse romantic_dict, using default dictionary.");
            return DEFAULT_DICT;
        }
    })();
    const [text, setText] = useState('')
    const [listening, setListening] = useState(false)
    const [output, setOutput] = useState('')
    const [isProcessing, setIsProcessing] = useState(false)

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
        }

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript
            setText(transcript)
            setListening(false)
        }

        recognition.onerror = (event: any) => {
            console.error(event.error)
            setListening(false)
        }

        recognition.onend = () => setListening(false)

        recognition.start()
    }

    const romanticize = () => {
        setIsProcessing(true)
        setTimeout(() => {
            let polished = text.toLowerCase()
            Object.keys(dict).forEach(key => {
                const regex = new RegExp(`\\b${key}\\b`, 'gi')
                polished = polished.replace(regex, dict[key])
            })
            // Capitalize first letter
            polished = polished.charAt(0).toUpperCase() + polished.slice(1)
            setOutput(polished)
            setIsProcessing(false)
        }, 1500) // Fake AI delay
    }

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-xl mx-auto shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500" />

            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-300 to-purple-300 mb-6 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-pink-400" /> AI Poet Assistant 🤖
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
                    onClick={romanticize}
                    disabled={!text || isProcessing}
                    className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold py-3 rounded-xl hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 transition-transform active:scale-95"
                >
                    {isProcessing ? (
                        <>
                            <Sparkles className="w-5 h-5 animate-spin" /> Magic Happening...
                        </>
                    ) : (
                        <>
                            <MessageSquareHeart className="w-5 h-5" /> Make it Romantic! 💖
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
                        <p className="text-xl font-serif italic text-pink-100 leading-relaxed indent-8">
                            "{output}"
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
