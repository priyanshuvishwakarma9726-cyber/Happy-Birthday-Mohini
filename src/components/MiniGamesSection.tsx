'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Disc, Gamepad2, Gift, Sparkles, Heart, Cake, Stars } from 'lucide-react'

// Games
import Candle from './Candle'
import ScratchCard from './ScratchCard'
import ChaosButton from './ChaosButton'
import MohiniQuiz from './MohiniQuiz'
import PuzzleGame from './PuzzleGame'
import HeartCollector from './HeartCollector'

interface FeatureFlags {
    show_games: boolean;
    show_letter: boolean;
    show_gallery: boolean;
    show_wishes: boolean;
    show_media: boolean;
    game_hearts: boolean;
    show_puzzle: boolean;
    show_quiz: boolean;
    puzzle_difficulty: 3 | 4 | 5;
}

interface Props {
    gallery: { url: string }[]
    content: any
    flags: FeatureFlags
}

export default function MiniGamesSection({ gallery, content, flags }: Props) {
    const [tab, setTab] = useState<'surprises' | 'arcade'>('arcade') // Default to Arcade to show new games

    return (
        <section className="py-20 px-4 bg-zinc-950 relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-1/4 left-0 w-64 h-64 bg-pink-600/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-[100px]" />

            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 mb-6 drop-shadow-sm">
                        Fun Zone! 🎠
                    </h2>

                    {/* Tabs */}
                    <div className="inline-flex bg-zinc-900 p-1 rounded-full border border-zinc-800 shadow-xl">
                        <button
                            onClick={() => setTab('arcade')}
                            className={`px-6 py-2 rounded-full font-bold text-sm md:text-base flex items-center gap-2 transition-all ${tab === 'arcade'
                                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                                : 'text-zinc-500 hover:text-white'
                                }`}
                        >
                            <Gamepad2 className="w-4 h-4" /> Arcade
                        </button>
                        <button
                            onClick={() => setTab('surprises')}
                            className={`px-6 py-2 rounded-full font-bold text-sm md:text-base flex items-center gap-2 transition-all ${tab === 'surprises'
                                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                                : 'text-zinc-500 hover:text-white'
                                }`}
                        >
                            <Gift className="w-4 h-4" /> Surprises
                        </button>
                    </div>
                </motion.div>

                <AnimatePresence mode="wait">
                    {tab === 'surprises' ? (
                        <motion.div
                            key="surprises"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center justify-items-center"
                        >
                            <div className="w-full max-w-sm"><Candle /></div>
                            <div className="w-full max-w-sm rotate-2 hover:rotate-0 transition-transform">
                                <ScratchCard secretWish={content.message_body ? "Open your heart... ❤️" : "You are magical! ✨"} />
                            </div>
                            <div className="flex flex-col items-center gap-4">
                                <ChaosButton />
                                <p className="text-zinc-500 text-xs text-center">Warning: Extreme Fun! ⚠️</p>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="arcade"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-16"
                        >
                            {/* Drag & Drop Puzzle - MOVED TO TOP */}
                            {flags.show_puzzle && (
                                <div className="space-y-8 pb-12 border-b border-zinc-900">
                                    <h3 className="text-3xl font-black text-center text-white flex items-center justify-center gap-3">
                                        <Stars className="text-pink-500 animate-pulse" /> Love Puzzle 🧩
                                    </h3>
                                    <PuzzleGame
                                        imageUrl={content.puzzle_image_url || (gallery && gallery.length > 0 ? gallery[0].url : '/uploads/fcee3990-4c9a-4f33-b444-2ef2453bc780-that.priyanshu_1.jpg')}
                                        difficulty={flags.puzzle_difficulty || 4}
                                    />
                                </div>
                            )}

                            {/* NEW GAMES ROW 1 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                                {flags.game_hearts && (
                                    <div className="space-y-4">
                                        <h3 className="text-2xl font-bold text-center text-white flex items-center justify-center gap-2">
                                            Heart Hunter 💘
                                        </h3>
                                        <HeartCollector />
                                    </div>
                                )}
                            </div>

                            {/* CAKE BUILDER & TRIVIA */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">


                                {flags.show_quiz && (
                                    <div className="space-y-4">
                                        <h3 className="text-2xl font-bold text-center text-white flex items-center justify-center gap-2">
                                            <Sparkles className="text-yellow-400" /> Roast Quiz 😏
                                        </h3>
                                        <MohiniQuiz quizData={content.quiz_data} />
                                    </div>
                                )}


                            </div>

                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    )
}
