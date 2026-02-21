'use client'
import { motion } from 'framer-motion'
import { useState } from 'react'

export interface GalleryItem {
    id: number;
    url: string;
    type?: 'image' | 'video';
    caption: string;
}

export default function GallerySection({ items, title }: { items: GalleryItem[], title?: string }) {
    const [selectedId, setSelectedId] = useState<number | null>(null)

    if (!items || items.length === 0) return null;

    return (
        <section className="py-20 px-4 bg-zinc-950">
            <div className="max-w-6xl mx-auto">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent"
                >
                    {title || "Found Memories 📸"}
                </motion.h2>

                <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                    {items.map((item, i) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            viewport={{ once: true, margin: "-100px" }}
                            className="break-inside-avoid relative group rounded-2xl overflow-hidden shadow-xl bg-zinc-900 border border-zinc-800"
                        >
                            {item.type === 'video' ? (
                                <div className="relative group min-h-[200px] bg-zinc-800 flex items-center justify-center overflow-hidden">
                                    <video
                                        src={item.url}
                                        className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-110"
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        controls={false}
                                        onError={(e) => {
                                            const video = e.target as HTMLVideoElement;
                                            const container = video.parentElement;
                                            if (container) {
                                                container.innerHTML = `<img src="https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?q=80&w=600&auto=format&fit=crop" class="w-full h-auto object-cover" />`;
                                            }
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                                </div>
                            ) : (
                                <img
                                    src={item.url}
                                    alt={item.caption}
                                    className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-110"
                                    loading="lazy"
                                    decoding="async"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.onerror = null; // Prevent infinite loop
                                        target.src = "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?q=80&w=600&auto=format&fit=crop";
                                    }}
                                />
                            )}
                            {item.caption && (
                                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                                    <p className="text-white text-sm font-medium drop-shadow-md">
                                        {item.caption}
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
