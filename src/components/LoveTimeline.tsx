'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Rocket, Sparkles, Heart, MessageCircle } from 'lucide-react'

interface Milestone {
    id: number
    subtitle: string
    title: string
    description: string
    icon: string
    order_index: number
}

const ICONS: Record<string, any> = {
    'sparkles': Sparkles,
    'heart': Heart,
    'ring': Heart, // fallback
    'rocket': Rocket,
    'message': MessageCircle
}

export default function LoveTimeline() {
    const [timelineData, setTimelineData] = useState<Milestone[]>([])

    useEffect(() => {
        fetch('/api/love-story')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setTimelineData(data)
            })
            .catch(err => console.error("Failed to load story:", err))
    }, [])

    if (timelineData.length === 0) return null

    return (
        <section className="py-20 px-6 relative overflow-hidden">
            <h2 className="text-3xl md:text-5xl font-black text-center mb-20 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                Hamari Pyaari Kahani 📖
            </h2>

            <div className="max-w-4xl mx-auto relative">
                {/* Vertical Line */}
                <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-pink-500/50 to-transparent" />

                {timelineData.map((item, i) => {
                    const Icon = ICONS[item.icon] || Sparkles
                    return (
                        <motion.div
                            initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: i * 0.2 }}
                            viewport={{ once: true }}
                            key={item.id}
                            className={`relative flex items-center mb-16 md:mb-24 ${i % 2 === 0 ? 'md:flex-row-reverse' : 'md:flex-row'}`}
                        >
                            {/* Dot */}
                            <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-zinc-900 border-2 border-pink-500 z-10 shadow-[0_0_15px_rgba(236,72,153,0.5)] flex items-center justify-center text-pink-400">
                                <Icon className="w-4 h-4" />
                            </div>

                            {/* Content Card */}
                            <div className={`pl-16 md:pl-0 w-full md:w-1/2 ${i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'}`}>
                                <div className="bg-zinc-900/40 backdrop-blur-md p-6 md:p-8 rounded-3xl border border-white/5 hover:border-pink-500/30 transition-all group hover:bg-zinc-900/60 shadow-lg">
                                    <span className="text-xs font-black uppercase tracking-[0.2em] text-pink-400 mb-3 block">
                                        {item.subtitle}
                                    </span>
                                    <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-pink-200 transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-zinc-400 font-medium leading-relaxed text-sm md:text-base">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )
                })}
            </div>
        </section>
    )
}
