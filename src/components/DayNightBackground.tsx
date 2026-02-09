'use client'
import { useState, useEffect } from 'react'

export default function DayNightBackground() {
    const [isNight, setIsNight] = useState(false)

    useEffect(() => {
        const checkTime = () => {
            const hours = new Date().getHours()
            // Night is considered 6 PM to 6 AM
            setIsNight(hours >= 18 || hours < 6)
        }

        checkTime()
        const interval = setInterval(checkTime, 60000) // Check every minute
        return () => clearInterval(interval)
    }, [])

    if (isNight) {
        return (
            <div className="absolute inset-0 z-0 transition-opacity duration-1000 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-zinc-900 via-[#09090b] to-black">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
                {/* Stars */}
                <div className="star-field absolute inset-0">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute rounded-full bg-white animate-pulse"
                            style={{
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                width: `${Math.random() * 3}px`,
                                height: `${Math.random() * 3}px`,
                                animationDelay: `${Math.random() * 5}s`,
                                opacity: Math.random() * 0.7 + 0.3
                            }}
                        />
                    ))}
                </div>
            </div>
        )
    }

    // Day / Sunset Theme
    return (
        <div className="absolute inset-0 z-0 transition-opacity duration-1000 bg-gradient-to-br from-rose-100 via-pink-100 to-sky-100">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-40 mix-blend-overlay"></div>
            {/* Floating Clouds or Light Orbs */}
            <div className="absolute top-10 right-10 w-64 h-64 bg-yellow-300 rounded-full blur-[100px] opacity-40 mix-blend-multiply animate-blob"></div>
            <div className="absolute bottom-10 left-10 w-64 h-64 bg-pink-300 rounded-full blur-[100px] opacity-40 mix-blend-multiply animate-blob animation-delay-2000"></div>
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-300 rounded-full blur-[100px] opacity-40 mix-blend-multiply animate-blob animation-delay-4000"></div>
        </div>
    )
}
