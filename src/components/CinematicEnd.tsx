'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Heart, X } from 'lucide-react'

export default function CinematicEnd({ name }: { name: string }) {
    const [open, setOpen] = useState(false)

    return (
        <>
            {/* Minimal Trigger Button */}
            <div className="flex justify-center py-20 bg-black">
                <button
                    onClick={() => setOpen(true)}
                    className="group relative px-8 py-3 rounded-full bg-white/5 border border-white/10 hover:border-pink-500/50 hover:bg-pink-500/10 transition-all active:scale-95"
                >
                    <span className="text-zinc-400 group-hover:text-pink-300 font-serif italic text-lg tracking-wide transition-colors">
                        "One last thing..."
                    </span>
                    <div className="absolute inset-0 rounded-full border border-pink-500/0 group-hover:border-pink-500/20 blur-md transition-all" />
                </button>
            </div>

            {/* Cinematic Overlay */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center p-6 text-center overflow-hidden"
                    >
                        {/* Background Stars / Dust */}
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
                        <div className="absolute inset-0 bg-gradient-to-t from-pink-900/20 via-black to-black pointer-events-none" />

                        {/* Close Button */}
                        <button
                            onClick={() => setOpen(false)}
                            className="absolute top-8 right-8 text-zinc-600 hover:text-white transition-colors z-50"
                        >
                            <X className="w-8 h-8" />
                        </button>

                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="max-w-2xl space-y-8 z-10"
                        >
                            <motion.div
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                            >
                                <Heart className="w-24 h-24 text-pink-600 fill-pink-600 mx-auto drop-shadow-[0_0_30px_rgba(236,72,153,0.6)]" />
                            </motion.div>

                            <h1 className="text-4xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-pink-100 to-zinc-500 tracking-tighter leading-tight font-romantic">
                                Forever Together<br />
                                <span className="text-pink-500">{name}</span>
                            </h1>

                            <p className="text-xl md:text-2xl text-zinc-400 font-romantic italic max-w-lg mx-auto leading-relaxed">
                                "Chahe kal jo bhi ho, mera aaj aur aane wala har pal sirf tumhara hai." <span className="emoji inline-block not-italic">❤️</span>
                            </p>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 2, duration: 2 }}
                                className="pt-12"
                            >
                                <p className="text-[10px] text-zinc-600 uppercase tracking-[0.5em] font-black">
                                    THE END OF THE BEGINNING
                                </p>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
