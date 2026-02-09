'use client'

import { Facebook, Instagram, Send, Twitter, Link } from 'lucide-react'

export default function SocialShare() {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://mohini-birthday.vercel.app'
    const message = encodeURIComponent("Check out this amazing birthday surprise for Mohini! 🎂✨ It's magical! " + shareUrl)

    const handleShare = (platform: string) => {
        let url = ''
        switch (platform) {
            case 'whatsapp':
                url = `https://wa.me/?text=${message}`
                break
            case 'telegram':
                url = `https://t.me/share/url?url=${shareUrl}&text=${message}`
                break
            case 'twitter':
                url = `https://twitter.com/intent/tweet?text=${message}`
                break
        }
        if (url) window.open(url, '_blank')
    }

    const copyLink = () => {
        navigator.clipboard.writeText(shareUrl)
        alert('Link copied! Share it everywhere! 🌍')
    }

    return (
        <div className="flex gap-4 items-center justify-center p-4 bg-zinc-900/50 rounded-full backdrop-blur-sm border border-zinc-800 shadow-xl w-fit mx-auto mt-8">
            <span className="text-zinc-400 text-sm font-bold uppercase tracking-wider mr-2">Share the Love:</span>

            <button onClick={() => handleShare('whatsapp')} className="p-2 bg-green-500/10 hover:bg-green-500 rounded-full text-green-500 hover:text-white transition-all">
                <Send className="w-5 h-5" />
            </button>

            <button onClick={() => handleShare('telegram')} className="p-2 bg-blue-500/10 hover:bg-blue-500 rounded-full text-blue-500 hover:text-white transition-all">
                <Send className="w-5 h-5 rotate-[-45deg]" />
            </button>

            <button onClick={copyLink} className="p-2 bg-zinc-700/50 hover:bg-white rounded-full text-zinc-400 hover:text-black transition-all">
                <Link className="w-5 h-5" />
            </button>
        </div>
    )
}
