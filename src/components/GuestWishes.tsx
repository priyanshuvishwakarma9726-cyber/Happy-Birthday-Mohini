'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, ThumbsUp, Heart, Star, Smile } from 'lucide-react'

interface Wish {
    id: number;
    name: string;
    message: string;
    reactions: Record<string, number> | string | null;
    is_approved?: boolean;
}

const REACTION_TYPES = ['❤️', '🎉', '🥺', '😂'];

export default function GuestWishes({ title }: { title?: string }) {
    const [wishes, setWishes] = useState<Wish[]>([])
    const [name, setName] = useState('')
    const [message, setMessage] = useState('')
    const [status, setStatus] = useState<string | null>(null)
    const [activeReaction, setActiveReaction] = useState<number | null>(null)

    useEffect(() => {
        fetch('/api/wishes')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setWishes(data)
            })
            .catch(console.error)
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name || !message) return

        setStatus('Sending...')
        try {
            const res = await fetch('/api/wishes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, message })
            })
            if (res.ok) {
                setStatus('Sent for approval! ✨')
                setName('')
                setMessage('')
                setTimeout(() => setStatus(null), 3000)
            } else {
                setStatus('Failed. Try again.')
            }
        } catch (err) {
            setStatus('Error occurred.')
        }
    }

    const handleReact = async (id: number, emote: string) => {
        // Optimistic UI update
        setWishes(prev => prev.map(w => {
            if (w.id === id) {
                let current = typeof w.reactions === 'string' ? JSON.parse(w.reactions) : w.reactions || {}
                current = { ...current, [emote]: (current[emote] || 0) + 1 }
                return { ...w, reactions: current }
            }
            return w
        }))

        setActiveReaction(id) // Trigger animation maybe?

        await fetch('/api/wishes', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'react', id, emote })
        })
    }

    return (
        <section className="py-20 px-4 bg-zinc-900 border-t border-zinc-800">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold text-center mb-12 text-white">
                    {title || "Guestbook ✍️"}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* FORM */}
                    <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 shadow-xl h-fit sticky top-24">
                        <h3 className="text-xl font-bold text-white mb-4">Leave a Wish</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-xs uppercase text-zinc-500 font-bold">Your Name</label>
                                <input
                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-pink-500 outline-none transition-colors"
                                    placeholder="Name"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    maxLength={30}
                                />
                            </div>
                            <div>
                                <label className="text-xs uppercase text-zinc-500 font-bold">Message</label>
                                <textarea
                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-pink-500 outline-none transition-colors min-h-[100px] resize-none"
                                    placeholder="Happy Birthday!! 🎂"
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                    maxLength={300}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={!name || !message || status === 'Sending...'}
                                className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <Send className="w-4 h-4" />
                                {status || "Sign Guestbook"}
                            </button>
                        </form>
                    </div>

                    {/* LIST */}
                    <div className="space-y-6">
                        {wishes.length === 0 ? (
                            <p className="text-center text-zinc-500 py-10">No wishes yet. Be the first! 🥇</p>
                        ) : (
                            <div className="space-y-4">
                                {wishes.map((wish) => {
                                    const reactions = typeof wish.reactions === 'string'
                                        ? JSON.parse(wish.reactions)
                                        : (wish.reactions || {});

                                    return (
                                        <motion.div
                                            key={wish.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            className="bg-zinc-800/50 p-5 rounded-xl border border-zinc-700/50 hover:border-pink-500/30 transition-colors"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-white">{wish.name}</h4>
                                                <span className="text-xs text-zinc-500">Guest</span>
                                            </div>
                                            <p className="text-zinc-300 text-sm mb-4 leading-relaxed">
                                                {wish.message}
                                            </p>

                                            {/* Reactions */}
                                            <div className="flex gap-2 flex-wrap">
                                                {REACTION_TYPES.map(emoji => (
                                                    <button
                                                        key={emoji}
                                                        onClick={() => handleReact(wish.id, emoji)}
                                                        className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-colors ${reactions[emoji] ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30' : 'bg-zinc-900 text-zinc-500 hover:bg-zinc-800'
                                                            }`}
                                                    >
                                                        <span>{emoji}</span>
                                                        <span className="font-mono">{reactions[emoji] || 0}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}
