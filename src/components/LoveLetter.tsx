'use client'

import { useRef, useState } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Heart, Mail, MousePointer2, X } from 'lucide-react'

interface Props {
    title: string;
    body: string;
    gallery: { url: string, caption?: string }[];
}

export default function LoveLetter({ title, body, gallery }: Props) {
    if (!body) return null; // Don't render if empty

    const ref = useRef(null)
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "center center"]
    })

    // Animate blur from 10px to 0px as it scrolls into view
    const blurAmount = useTransform(scrollYProgress, [0, 1], ["10px", "0px"])
    const opacityValue = useTransform(scrollYProgress, [0, 0.5], [0, 1])

    const [isOpen, setIsOpen] = useState(false)

    return (
        <section ref={ref} className="py-32 px-4 bg-zinc-950 relative overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[#f8f5f2] opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

            <div className="max-w-6xl mx-auto relative">
                <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">

                    {/* Left Polaroids (Floating) */}
                    <div className="hidden lg:flex flex-col gap-12 w-1/3">
                        {gallery.slice(0, 2).map((img, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -50, rotate: -5 }}
                                whileInView={{ opacity: 1, x: 0, rotate: i % 2 === 0 ? -6 : 4 }}
                                transition={{ delay: i * 0.2 }}
                                className="bg-white p-4 pb-14 shadow-[0_10px_30px_rgba(0,0,0,0.3)] transform hover:scale-110 hover:rotate-0 transition-all duration-500 relative group"
                            >
                                <div className="aspect-square bg-zinc-100 overflow-hidden filter sepia-[0.2] relative">
                                    <img
                                        src={img.url}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.onerror = null;
                                            target.src = "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?q=80&w=400&auto=format&fit=crop";
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <p className="font-handwriting text-zinc-600 text-center mt-6 transform -rotate-1 text-2xl">
                                    {img.caption || 'For You ❤️'}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Center Letter Container with Opening Animation */}
                    <div className="relative group perspective-1000">
                        <AnimatePresence mode="wait">
                            {!isOpen ? (
                                <motion.div
                                    key="envelope"
                                    initial={{ opacity: 0, scale: 0.8, rotate: -2 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    onClick={() => setIsOpen(true)}
                                    className="w-full md:w-[600px] h-[400px] bg-[#f8f5f2] border-2 border-pink-200 rounded-lg shadow-2xl flex flex-col items-center justify-center cursor-pointer relative overflow-hidden active:scale-95 transition-transform"
                                >
                                    {/* Envelope Flap Design */}
                                    <div className="absolute top-0 left-0 right-0 h-48 bg-zinc-100/50 clip-path-envelope-flap border-b border-pink-100" />

                                    <div className="z-10 text-center space-y-4">
                                        <div className="relative">
                                            <Mail className="w-16 h-16 text-pink-400 mx-auto" />
                                            <motion.div
                                                animate={{ scale: [1, 1.2, 1] }}
                                                transition={{ repeat: Infinity, duration: 2 }}
                                                className="absolute -top-2 -right-2"
                                            >
                                                <Heart className="w-8 h-8 text-pink-500 fill-pink-500" />
                                            </motion.div>
                                        </div>
                                        <h3 className="text-2xl font-serif text-pink-800 italic">You have a letter...</h3>
                                        <div className="flex items-center justify-center gap-2 text-pink-400 animate-bounce">
                                            <MousePointer2 className="w-4 h-4" />
                                            <span className="text-sm font-medium uppercase tracking-widest">Click to Open</span>
                                        </div>
                                    </div>

                                    {/* Wax Seal like element */}
                                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center shadow-lg border-2 border-pink-400">
                                        <Heart className="w-6 h-6 text-white fill-white" />
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="letter"
                                    initial={{ opacity: 0, scale: 0.5, y: 100, rotateX: 90 }}
                                    animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
                                    transition={{ type: "spring", damping: 12, stiffness: 100 }}
                                    className="bg-[#fff9f0] text-zinc-800 p-8 md:p-12 max-w-2xl w-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform rotate-1 border border-zinc-200 relative transition-all duration-700"
                                >
                                    {/* Tape effect */}
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-8 bg-white/50 backdrop-blur-sm shadow-sm rotate-2 transform border-l border-r border-white/80" />

                                    <div className="mb-8 text-center border-b-2 border-pink-200 pb-6">
                                        <Heart className="w-8 h-8 text-pink-500 mx-auto mb-4 fill-pink-500" />
                                        <h2 className="text-3xl md:text-5xl font-serif italic text-pink-900 line-clamp-2">
                                            {title || "My Sincereset Feelings"}
                                        </h2>
                                    </div>

                                    <div className="prose prose-lg prose-p:font-serif prose-p:text-zinc-700 prose-p:leading-loose text-lg md:text-xl font-medium whitespace-pre-line max-h-[500px] overflow-y-auto custom-scrollbar pr-4">
                                        {body}
                                    </div>

                                    <div className="mt-12 text-right">
                                        <p className="font-handwriting text-3xl text-pink-600 transform -rotate-3 inline-block">
                                            — With all my love ❤️
                                        </p>
                                    </div>

                                    <button
                                        onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                                        className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-zinc-500 hover:text-pink-400 text-sm flex items-center gap-1 transition-colors group"
                                    >
                                        <X className="w-4 h-4 group-hover:rotate-90 transition-transform" /> Close Letter
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Right Polaroids */}
                    <div className="hidden lg:flex flex-col gap-12 w-1/3">
                        {gallery.slice(2, 4).map((img, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 50, rotate: 5 }}
                                whileInView={{ opacity: 1, x: 0, rotate: i % 2 === 0 ? 6 : -4 }}
                                transition={{ delay: 0.2 + (i * 0.2) }}
                                className="bg-white p-4 pb-14 shadow-[0_10px_30px_rgba(0,0,0,0.3)] transform hover:scale-110 hover:rotate-0 transition-all duration-500 relative group"
                            >
                                <div className="aspect-square bg-zinc-100 overflow-hidden filter sepia-[0.2] relative">
                                    <img
                                        src={img.url}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.onerror = null;
                                            target.src = "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?q=80&w=400&auto=format&fit=crop";
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <p className="font-handwriting text-zinc-600 text-center mt-6 transform -rotate-1 text-2xl">
                                    {img.caption || 'Forever ✨'}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    )
}
