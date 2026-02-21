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
        // Create a hidden iframe for printing to avoid popup issues and 'problem printing' errors
        let printFrame = document.getElementById('print-frame') as HTMLIFrameElement;
        if (!printFrame) {
            printFrame = document.createElement('iframe');
            printFrame.id = 'print-frame';
            printFrame.style.display = 'none';
            document.body.appendChild(printFrame);
        }

        const imageUrl = heroImage || "https://images.unsplash.com/photo-1530103862676-fa8c9d34da3e?q=80&w=1000&auto=format&fit=crop";

        const printHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;600&display=swap" rel="stylesheet">
                <style>
                    body { 
                        margin: 0; 
                        padding: 0; 
                        background: #fff; 
                        font-family: 'Inter', sans-serif;
                        color: #1a1a1a;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    .card-wrapper {
                        width: 100%;
                        min-height: 100vh;
                        padding: 40px;
                        box-sizing: border-box;
                        background: #fff;
                        position: relative;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        text-align: center;
                    }
                    .border-decoration {
                        position: absolute;
                        top: 10px; bottom: 10px; left: 10px; right: 10px;
                        border: 2px solid #fce7f3;
                        pointer-events: none;
                    }
                    .header {
                        margin-top: 20px;
                        margin-bottom: 30px;
                    }
                    .title {
                        font-family: 'Dancing Script', cursive;
                        font-size: 64px;
                        color: #db2777;
                        margin: 0;
                    }
                    .recipient {
                        font-family: 'Playfair Display', serif;
                        font-size: 28px;
                        color: #4b5563;
                        margin-top: 5px;
                        font-weight: 700;
                    }
                    .image-container {
                        width: 300px;
                        height: 300px;
                        border-radius: 15px;
                        overflow: hidden;
                        border: 10px solid #fdf2f8;
                        margin: 20px 0;
                    }
                    .image-container img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }
                    .letter-content {
                        font-family: 'Playfair Display', serif;
                        font-size: 18px;
                        line-height: 1.6;
                        color: #374151;
                        max-width: 90%;
                        margin: 30px 0;
                        white-space: pre-wrap;
                        font-style: italic;
                    }
                    .footer {
                        margin-top: auto;
                        padding-bottom: 20px;
                    }
                    .heart-icon {
                        color: #db2777;
                        font-size: 24px;
                    }
                    .signature {
                        font-family: 'Dancing Script', cursive;
                        font-size: 24px;
                        color: #db2777;
                    }
                    @media print {
                        @page { margin: 10mm; }
                        body { padding: 0; }
                    }
                </style>
            </head>
            <body>
                <div class="card-wrapper">
                    <div class="border-decoration"></div>
                    <div class="header">
                        <div class="title">Happy Birthday</div>
                        <div class="recipient">${recipientName}</div>
                    </div>
                    <div class="image-container">
                        <img src="${imageUrl}" onload="window.imageLoaded = true;" />
                    </div>
                    <div class="letter-content">${letterBody || "Wishing you a lifetime of happiness and love."}</div>
                    <div class="footer">
                        <div class="heart-icon">❤</div>
                        <div class="signature">With Love Always</div>
                    </div>
                </div>
            </body>
            </html>
        `;

        const frameDoc = printFrame.contentWindow?.document || printFrame.contentDocument;
        if (frameDoc) {
            frameDoc.open();
            frameDoc.write(printHtml);
            frameDoc.close();

            // Wait for resources to load before printing
            const checkAndPrint = () => {
                const win = printFrame.contentWindow;
                if (win) {
                    win.focus();
                    win.print();
                }
            };

            setTimeout(checkAndPrint, 1500);
        }
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
