'use client'
import { useState, useEffect } from 'react'
import { Moon, Sun, Cloud, Stars } from 'lucide-react'
import { motion } from 'framer-motion'

export default function TimeGreeting({ name }: { name: string }) {
    const [greeting, setGreeting] = useState({
        text: "Hello",
        icon: Sun,
        color: "text-amber-400",
        message: "Hope your day is beautiful!"
    })

    useEffect(() => {
        const hour = new Date().getHours()

        if (hour >= 5 && hour < 12) {
            setGreeting({
                text: "Good Morning",
                icon: Sun,
                color: "text-amber-400",
                message: "Utho aur chamko meri jaan! ☀️"
            })
        } else if (hour >= 12 && hour < 17) {
            setGreeting({
                text: "Good Afternoon",
                icon: Cloud,
                color: "text-sky-400",
                message: "Lunch kiya kya? Miss you! 🥪"
            })
        } else if (hour >= 17 && hour < 21) {
            setGreeting({
                text: "Good Evening",
                icon: Stars,
                color: "text-indigo-400",
                message: "Shaam haseen hai, par tum se kam! 🌆"
            })
        } else {
            setGreeting({
                text: "Good Night",
                icon: Moon,
                color: "text-purple-400",
                message: "Sapno mein milte hain... 😴"
            })
        }
    }, [])

    const Icon = greeting.icon

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-2 py-4"
        >
            <div className={`p-3 rounded-full bg-white/5 border border-white/10 ${greeting.color} bg-opacity-20 backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.1)]`}>
                <Icon className="w-6 h-6 animate-pulse" />
            </div>
            <h3 className="text-xl font-medium text-zinc-300">
                {greeting.text}, <span className="text-pink-400 font-bold">{name}</span>
            </h3>
            <p className="text-sm text-zinc-500 italic font-medium tracking-wide">
                "{greeting.message}"
            </p>
        </motion.div>
    )
}
