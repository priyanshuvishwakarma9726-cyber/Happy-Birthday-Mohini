'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Clock, Lock } from 'lucide-react'

export default function CountdownClient({ targetDate, recipientName }: { targetDate: string, recipientName: string }) {
    const router = useRouter()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkFlow = () => {
            // Admin Bypass
            const isAdmin = localStorage.getItem('admin_auth') === 'true' || document.cookie.includes('admin_bypass=true')
            // If admin, we don't return early; we just skip the redirect logic below but render the countdown.

            // 1. Check if countdown completed previously
            const completed = localStorage.getItem('countdownCompleted') === 'true'
            if (!isAdmin && completed) {
                // If countdown done, check if gift opened
                const giftOpened = localStorage.getItem('giftOpened') === 'true'
                if (giftOpened) {
                    router.replace('/home')
                } else {
                    router.replace('/gift')
                }
                return
            }

            // 2. Simple Date Check (No Countdown)
            const checkTime = () => {
                const now = new Date()
                const target = new Date(targetDate)

                if (now >= target) {
                    handleCompletion()
                } else {
                    setLoading(false)
                }
            }

            const handleCompletion = () => {
                if (!isAdmin) {
                    localStorage.setItem('countdownCompleted', 'true')
                    router.replace('/gift')
                } else {
                    setLoading(false)
                }
            }

            // Check every second for auto-unlock
            const timer = setInterval(() => {
                checkTime()
            }, 1000)

            // Initial check
            checkTime()

            return () => clearInterval(timer)
        }

        return checkFlow()
    }, [targetDate, router])

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center text-white">
            <div className="animate-spin w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full" />
        </div>
    )

    return (
        <main className="min-h-screen bg-black flex flex-col items-center justify-center text-white relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black opacity-80" />

            <div className="z-10 text-center space-y-8 px-6 max-w-2xl">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-8 bg-black/50 p-12 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl"
                >
                    <div className="flex justify-center">
                        <div className="p-6 bg-white/5 rounded-full border border-white/10 shadow-[0_0_30px_rgba(236,72,153,0.2)] animate-pulse">
                            <Lock className="w-12 h-12 text-pink-500" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-white">
                            Locked 🔒
                        </h1>
                        <p className="text-zinc-400 text-lg font-medium">
                            This surprise opens on <span className="text-pink-500 font-bold">{new Date(targetDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </p>
                    </div>

                    <p className="text-xs text-zinc-600 font-mono">
                        You will be redirected automatically.
                    </p>
                </motion.div>
            </div>
        </main>
    )
}
