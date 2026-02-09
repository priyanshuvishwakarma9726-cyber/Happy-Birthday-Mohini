'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { PartyPopper } from 'lucide-react'

export default function ConfettiChaos() {
    const [clicked, setClicked] = useState(false)

    const explode = () => {
        setClicked(true)

        // Create random confetti over 3 seconds
        const duration = 2000;
        const end = Date.now() + duration;

        (function frame() {
            const x = Math.random()
            const y = Math.random() * 0.5

            confetti({
                particleCount: 5 + (Math.random() * 20),
                angle: Math.random() * 360,
                spread: 50 + (Math.random() * 50),
                origin: { x, y },
                colors: ['#ec4899', '#a855f7', '#fb7185', '#60a5fa', '#34d399']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            } else {
                setClicked(false)
            }
        }());
    }

    return (
        <motion.button
            whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
            whileTap={{ scale: 0.9 }}
            onClick={explode}
            className="group relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
        >
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-zinc-900 rounded-md group-hover:bg-opacity-0 flex items-center gap-2 font-bold">
                <PartyPopper className={`w-5 h-5 ${clicked ? 'animate-bounce' : ''}`} />
                Chaos Mode 🎊
            </span>
        </motion.button>
    )
}
