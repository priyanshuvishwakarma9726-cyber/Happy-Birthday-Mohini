'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'

const DEFAULT_CAKE_WISHES = [
    "May all your dreams come true, today and always. You deserve the world! 🌏💖"
]

// FREE AI ENGINE: NO API KEYS NEEDED
const CAKE_ENGINE = {
    intents: ["May your life be as sweet as this cake,", "On this special day, may the universe conspire to bring you joy,", "I wish that every step you take leads to happiness,", "May your heart always be full of love and laughter,", "I hope this year brings you magic you never expected,", "May you always find the strength to shine,"],
    soul: ["because you are the kindest soul I know.", "just like you bring light to everyone around you.", "and may your beautiful smile never fade away.", "with dreams that take you to the highest peaks.", "and moments that stay in your heart forever.", "because you deserve all the goodness in the world."],
    closure: ["Happy Birthday, my queen! 👑💖", "Stay precisely as magical as you are. ✨❤️", "The world is better with you in it. 🌏🌸", "I love you beyond words, Mohini! 🌹💎", "Cheers to another year of your greatness! 🥂🎉"]
};

export default function DigitalCake({ content }: { content?: any }) {
    const generateWish = () => {
        const intent = CAKE_ENGINE.intents[Math.floor(Math.random() * CAKE_ENGINE.intents.length)];
        const soul = CAKE_ENGINE.soul[Math.floor(Math.random() * CAKE_ENGINE.soul.length)];
        const closure = CAKE_ENGINE.closure[Math.floor(Math.random() * CAKE_ENGINE.closure.length)];
        return `${intent} ${soul} ${closure}`;
    };

    const [currentWish, setCurrentWish] = useState("")

    const [candles, setCandles] = useState([true, true, true, true, true]) // 5 candles, true = lit
    const [wished, setWished] = useState(false)

    const blowCandle = (index: number) => {
        if (!candles[index]) return

        const newCandles = [...candles]
        newCandles[index] = false
        setCandles(newCandles)

        // Play small puff sound if possible? Na, visual only.
    }

    useEffect(() => {
        if (candles.every(c => !c) && !wished) {
            setWished(true)
            setCurrentWish(generateWish())
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#FFD700', '#FFA500', '#FF4500'] // Gold/Orange fire colors
            })
        }
    }, [candles])

    return (
        <div className="relative py-12 flex flex-col items-center justify-center">
            <h3 className="text-2xl font-bold text-pink-400 mb-8 font-handwriting">
                {wished ? "Your Wish is Granted! ✨" : "Make a Wish & Blow the Candles! 🎂"}
            </h3>

            <div className="relative mt-24">
                {/* Cake Base */}
                <div className="w-64 h-32 bg-pink-300 rounded-t-lg relative shadow-lg">
                    <div className="absolute top-0 left-0 w-full h-8 bg-pink-400 rounded-t-lg opacity-50" />
                    <div className="absolute top-1/2 left-0 w-full h-4 bg-white/30 skew-y-1" />

                    {/* Filling */}
                    <div className="absolute bottom-0 w-full h-12 bg-pink-400/30 rounded-b-lg -z-10 translate-y-2 scale-95 blur-sm" />
                </div>

                {/* Candles */}
                <div className="absolute -top-16 left-0 w-full flex justify-center gap-6 px-4">
                    {candles.map((isLit, i) => (
                        <div key={i} className="relative group cursor-pointer" onClick={() => blowCandle(i)}>
                            {/* Flame */}
                            {isLit && (
                                <motion.div
                                    animate={{ scale: [1, 1.1, 1], rotate: [-2, 2, -2] }}
                                    transition={{ repeat: Infinity, duration: 0.5 }}
                                    className="absolute -top-6 left-1/2 -translate-x-1/2 w-4 h-6 bg-gradient-to-t from-orange-500 via-yellow-400 to-white rounded-full blur-[1px] shadow-[0_0_10px_orange]"
                                />
                            )}
                            {/* Wick */}
                            <div className="w-1 h-3 bg-black/50 mx-auto" />
                            {/* Candle Stick */}
                            <div className="w-3 h-12 bg-white border border-zinc-200 rounded-sm shadow-sm relative">
                                <div className="absolute top-2 left-0 w-full h-1 bg-red-400/30 -rotate-12" />
                                <div className="absolute top-6 left-0 w-full h-1 bg-green-400/30 -rotate-12" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {wished && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-12 text-center max-w-sm bg-white/10 p-6 rounded-xl border border-white/20 backdrop-blur-sm"
                >
                    <p className="text-lg italic text-pink-200">
                        "{currentWish}"
                    </p>
                </motion.div>
            )}
        </div>
    )
}
