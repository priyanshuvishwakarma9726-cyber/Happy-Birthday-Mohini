'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DigitalCake from './DigitalCake'
import confetti from 'canvas-confetti'
import { X, Heart, Sparkles } from 'lucide-react'

export default function BirthdayCakePopup({ isOpen, onClose, content }: { isOpen: boolean, onClose: () => void, content: any }) {
    if (!isOpen) return null

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="relative bg-zinc-900 border border-zinc-700 p-8 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden"
                    >
                        {/* Confetti Background */}
                        <div className="absolute inset-0 opacity-20 pointer-events-none">
                            <Sparkles className="absolute top-10 left-10 text-yellow-400 animate-spin-slow w-8 h-8" />
                            <Heart className="absolute bottom-10 right-10 text-pink-500 animate-pulse w-8 h-8" />
                        </div>

                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors z-50"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="text-center mb-6">
                            <h3 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
                                Happy Birthday! 🎂
                            </h3>
                            <p className="text-zinc-400 text-sm mt-2">Make a wish and blow out the candles!</p>
                        </div>

                        <div className="flex justify-center scale-110 py-4">
                            <DigitalCake content={content} />
                        </div>

                        <button
                            onClick={onClose}
                            className="w-full mt-8 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-3 rounded-xl shadow-lg transition-transform active:scale-95"
                        >
                            Close & Continue ✨
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
