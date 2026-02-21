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
                                <video
                                    src={item.url}
                                    className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                />
                            ) : (
                                <img
                                    src={item.url}
                                    alt={item.caption}
                                    className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                                    loading="lazy"
                                    decoding="async"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=600&auto=format&fit=crop";
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
