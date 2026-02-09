'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import DayNightBackground from '@/components/DayNightBackground'

export default function LockedPage() {
    const [typed, setTyped] = useState('')
    const [showLogin, setShowLogin] = useState(false)
    const [password, setPassword] = useState('')
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
    const router = useRouter()

    useEffect(() => {
        // Keyboard listener for secret "mohini"
        const handleKeyDown = (e: KeyboardEvent) => {
            setTyped(prev => {
                const newStr = (prev + e.key).slice(-6)
                if (newStr.toLowerCase().includes('mohini')) {
                    setShowLogin(true)
                }
                return newStr
            })
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date()
            const currentYear = now.getFullYear()

            // Target: next March 30
            let target = new Date(currentYear, 2, 30) // March 30
            if (now > target) {
                target = new Date(currentYear + 1, 2, 30)
            }

            const diff = Math.max(0, (target.getTime() - now.getTime()) / 1000)

            const d = Math.floor(diff / (3600 * 24))
            const h = Math.floor((diff % (3600 * 24)) / 3600)
            const m = Math.floor((diff % 3600) / 60)
            const s = Math.floor(diff % 60)

            setTimeLeft({ days: d, hours: h, minutes: m, seconds: s })
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    const handleLogin = async () => {
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                body: JSON.stringify({ secret: password }),
                headers: { 'Content-Type': 'application/json' }
            })
            if (res.ok) {
                window.location.href = '/admin' // Force reload to apply cookie and bypass middleware
            } else {
                alert('Nah, wrong password! 😜')
            }
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center cursor-default overflow-hidden relative font-sans">

            {/* Dynamic Background */}
            <DayNightBackground />

            <div className="z-10 relative w-full max-w-4xl mx-auto backdrop-blur-md bg-black/60 rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-4xl md:text-7xl font-black mb-6 drop-shadow-lg text-white tracking-tight">
                        Coming Soon... 🤫
                    </h1>
                </motion.div>

                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-lg md:text-2xl text-white/80 mb-12 font-medium"
                >
                    Sabar ka phal meetha hota hai, Mohini! <br />
                    <span className="text-pink-400 font-bold text-3xl mt-2 inline-block">30th March</span> tak wait karo ❤️
                </motion.p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-16 justify-items-center">
                    {[
                        { val: timeLeft.days, label: 'Days' },
                        { val: timeLeft.hours, label: 'Hours' },
                        { val: timeLeft.minutes, label: 'Mins' },
                        { val: timeLeft.seconds, label: 'Secs' },
                    ].map((item, i) => (
                        <motion.div
                            key={item.label}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 + (i * 0.1) }}
                            className="flex flex-col items-center justify-center p-4 bg-black/40 rounded-2xl w-28 h-28 md:w-36 md:h-36 backdrop-blur-md border border-white/10 shadow-xl"
                        >
                            <span className="text-3xl md:text-5xl font-black text-white tabular-nums">
                                {String(item.val).padStart(2, '0')}
                            </span>
                            <span className="text-xs uppercase tracking-widest text-white/70 mt-2 font-bold">{item.label}</span>
                        </motion.div>
                    ))}
                </div>

                {showLogin && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-black/80 backdrop-blur-md p-6 rounded-2xl border border-pink-500/50 shadow-2xl max-w-sm mx-auto"
                    >
                        <h3 className="text-white font-bold mb-4">Admin Access 🕵️‍♀️</h3>
                        <div className="flex gap-2">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                                placeholder="Enter Secret..."
                                className="flex-1 bg-zinc-800 border-zinc-700 border rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                            />
                            <button
                                onClick={handleLogin}
                                className="bg-pink-600 hover:bg-pink-500 text-white px-4 py-2 rounded-lg font-bold transition-colors shadow-lg shadow-pink-500/20"
                            >
                                Go
                            </button>
                        </div>
                    </motion.div>
                )}

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2, duration: 2 }}
                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-white/20 text-xs select-none whitespace-nowrap"
                >
                    Type "mohini" to unlock instantly (Admin only)
                </motion.div>
            </div>
        </div>
    )
}
