'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

interface Milestone {
    year: string
    title: string
    description: string
    icon: string
    color: string
}

const timelineData: Milestone[] = [
    { year: 'Start', title: 'The First Spark', description: 'Jab pehli baar nazrein mili thi... ✨', icon: '⚡', color: 'text-amber-400' },
    { year: 'Then', title: 'Growing Closer', description: 'Chhote chhote messages aur lambi baatein. 📱', icon: '💬', color: 'text-pink-400' },
    { year: 'Now', title: 'My Favourite Person', description: 'Tumhare bina ab din shuru nahi hota. ☕', icon: '❤️', color: 'text-red-500' },
    { year: 'Future', title: 'Forever Together', description: 'Hamesha ke liye sirf tum aur main. 🚀', icon: '♾️', color: 'text-purple-400' }
]

export default function LoveTimeline() {
    return (
        <section className="py-20 px-6 relative overflow-hidden">
            <h2 className="text-3xl font-black text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                Hamari Pyaari Kahani 📖
            </h2>

            <div className="max-w-2xl mx-auto relative">
                {/* Vertical Line */}
                <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-pink-500/50 to-transparent" />

                {timelineData.map((item, i) => (
                    <motion.div
                        initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: i * 0.2 }}
                        viewport={{ once: true }}
                        key={i}
                        className={`relative flex items-center mb-12 isolate ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                    >
                        {/* Dot */}
                        <div className="absolute left-8 md:left-1/2 -ml-[10px] w-5 h-5 rounded-full bg-zinc-900 border-2 border-pink-500 z-10 shadow-[0_0_15px_rgba(236,72,153,0.5)] flex items-center justify-center text-[10px]">
                            {item.icon}
                        </div>

                        {/* Content Card */}
                        <div className={`ml-20 md:ml-0 md:w-1/2 p-4 ${i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'}`}>
                            <div className="bg-zinc-900/40 backdrop-blur-md p-6 rounded-2xl border border-white/5 hover:border-pink-500/30 transition-colors group">
                                <span className={`text-xs font-black uppercase tracking-widest ${item.color} mb-2 block`}>
                                    {item.year}
                                </span>
                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-pink-200 transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-zinc-400 font-medium leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}
