'use client'
import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, Play } from 'lucide-react'

export default function SurpriseOpener({ onStart }: { onStart: () => void }) {
    const [isOpen, setIsOpen] = useState(false)

    const handleStart = () => {
        window.scrollTo(0, 0)
        setIsOpen(true)
        onStart()
    }

    return (
        <AnimatePresence>
            {!isOpen && (
                <motion.div
                    exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                    transition={{ duration: 1 }}
                    className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
                >
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleStart}
                        className="group relative px-8 py-4 bg-white text-black font-bold text-xl rounded-full overflow-hidden shadow-[0_0_50px_rgba(255,255,255,0.3)] transition-all"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <span className="relative z-10 flex items-center gap-3 group-hover:text-white transition-colors">
                            <Play className="fill-current w-5 h-5" />
                            Open Your Gift 🎁
                        </span>
                    </motion.button>

                    <p className="mt-6 text-zinc-500 text-sm animate-pulse">
                        (Turn up your volume 🔊)
                    </p>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
