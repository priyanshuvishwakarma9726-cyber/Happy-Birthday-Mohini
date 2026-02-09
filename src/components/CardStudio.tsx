'use client'
import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Printer, Mail, Heart, Download, X, Share2 } from 'lucide-react'
import confetti from 'canvas-confetti'

interface Props {
    recipientName: string;
    letterBody: string;
    heroImage?: string;
    title?: string;
    subtitle?: string;
}

export default function CardStudio({ recipientName, letterBody, heroImage, title, subtitle }: Props) {
    const [isOpen, setIsOpen] = useState(false)

    const triggerHeartRain = () => {
        const duration = 3000;
        const end = Date.now() + duration;

        (function frame() {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                shapes: ['circle'],
                colors: ['#ec4899', '#db2777', '#f472b6']
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                shapes: ['circle'],
                colors: ['#ec4899', '#db2777', '#f472b6']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    }

    const handlePrint = () => {
        // Open a new window for printing
        const printWindow = window.open('', '_blank');
        if (!printWindow) return alert('Please allow popups to print!');

        const content = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Birthday Card for ${recipientName}</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Dancing+Script:wght@400;700&display=swap');
                    body { margin: 0; padding: 0; font-family: 'Playfair Display', serif; background: #fff; color: #333; }
                    .card-container { width: 100%; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px; box-sizing: border-box; border: 20px solid #fdf2f8; }
                    .title { font-size: 60px; font-weight: 700; color: #db2777; margin-bottom: 20px; font-family: 'Dancing Script', cursive; }
                    .photo-frame { width: 300px; height: 300px; border-radius: 50%; overflow: hidden; border: 10px solid #fce7f3; margin-bottom: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
                    .photo-frame img { width: 100%; height: 100%; object-fit: cover; }
                    .body-text { font-size: 18px; line-height: 1.8; text-align: center; max-width: 600px; margin-bottom: 40px; font-style: italic; white-space: pre-wrap; }
                    .footer { font-size: 16px; color: #888; margin-top: auto; }
                    .heart { color: #ec4899; font-size: 24px; }
                    @media print {
                        .no-print { display: none; }
                        body { -webkit-print-color-adjust: exact; }
                    }
                </style>
            </head>
            <body>
                <div class="card-container">
                    <h1 class="title">Happy Birthday ${recipientName}</h1>
                    ${heroImage ? `<div class="photo-frame"><img src="${heroImage}" /></div>` : ''}
                    <div class="body-text">${letterBody || "Wishing you a day filled with love, laughter, and endless joy. You are special!"}</div>
                    
                    <div class="footer">
                        <span class="heart">❤</span> Created with Love
                    </div>
                </div>
                <script>
                    window.onload = () => { setTimeout(() => { window.print(); window.close(); }, 500); }
                </script>
            </body>
            </html>
        `;

        printWindow.document.write(content);
        printWindow.document.close();
    }

    const handleEmail = () => {
        const subject = encodeURIComponent(`A Special Birthday Card for ${recipientName} 🎂`);
        const body = encodeURIComponent(`Hey!\n\nI created a special birthday surprise for you. Check it out here:\n\n${window.location.origin}\n\n"${letterBody.slice(0, 100)}..."\n\nWith Love ❤️`);
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
    }

    return (
        <section className="py-20 px-4 bg-zinc-900 border-t border-zinc-800">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                    {title || "Gift Shop 🎁"}
                </h2>
                <p className="text-zinc-400 mb-8">{subtitle || "Take a piece of this memory with you."}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Printable Card */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-zinc-800/50 p-6 rounded-2xl border border-zinc-700/50 flex flex-col items-center gap-4 cursor-pointer group"
                        onClick={handlePrint}
                    >
                        <div className="p-4 bg-pink-500/10 rounded-full group-hover:bg-pink-500/20 transition-colors">
                            <Printer className="w-8 h-8 text-pink-500" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Printable Card</h3>
                        <p className="text-sm text-zinc-400">Download a high-quality PDF version of your love letter.</p>
                    </motion.div>

                    {/* Email Card */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-zinc-800/50 p-6 rounded-2xl border border-zinc-700/50 flex flex-col items-center gap-4 cursor-pointer group"
                        onClick={handleEmail}
                    >
                        <div className="p-4 bg-purple-500/10 rounded-full group-hover:bg-purple-500/20 transition-colors">
                            <Mail className="w-8 h-8 text-purple-500" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Send E-Card</h3>
                        <p className="text-sm text-zinc-400">Share this magical experience via email instantly.</p>
                    </motion.div>

                    {/* Heart Rain */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-zinc-800/50 p-6 rounded-2xl border border-zinc-700/50 flex flex-col items-center gap-4 cursor-pointer group"
                        onClick={triggerHeartRain}
                    >
                        <div className="p-4 bg-red-500/10 rounded-full group-hover:bg-red-500/20 transition-colors">
                            <Heart className="w-8 h-8 text-red-500" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Shower Love</h3>
                        <p className="text-sm text-zinc-400">Trigger a magical rain of hearts on screen!</p>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
