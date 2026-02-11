'use client'

import React, { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
// ... (imports)
import confetti from 'canvas-confetti'
import FloatingHearts from './FloatingHearts'
import { Sparkles, FullScreenSparkles } from './Sparkles'
import { useRouter } from 'next/navigation'
import TypewriterText from './TypewriterText'
import TimeGreeting from './TimeGreeting'
import LoveTimeline from './LoveTimeline'
import CinematicEnd from './CinematicEnd'
import PremiumLoader from './PremiumLoader'

import { Heart, Stars, Music, PartyPopper, Lock, Key, X, Gift, Moon, PlayCircle } from 'lucide-react'
import SurpriseSection from './SurpriseSection'
import { VideoPlayer, VoiceMessage } from '@/components/MediaSection'

import GallerySection from '@/components/GallerySection'
import MusicPlayer from '@/components/MusicPlayer'
import GuestWishes from '@/components/GuestWishes'
import MiniGamesSection from '@/components/MiniGamesSection'
import BloomingRose from '@/components/BloomingRose'
import RomanticAI from '@/components/RomanticAI'
import OurFutureMagic from '@/components/OurFutureMagic'
import SocialShare from '@/components/SocialShare'
import GifGenerator from '@/components/GifGenerator'
import StoryGenerator from '@/components/StoryGenerator'
import LoveLetter from '@/components/LoveLetter'
import CardStudio from '@/components/CardStudio'
import DigitalCake from '@/components/DigitalCake'
import ScratchCard from '@/components/ScratchCard'
import { useMusic } from '@/context/MusicContext'
import BirthdayCakePopup from '@/components/BirthdayCakePopup'
import WishBox from '@/components/WishBox'

// Types
interface Content {
    hero_title?: string;
    hero_subtitle?: string;
    message_body?: string;
    video_url?: string;
    voice_url?: string;
    favorite_song_url?: string;
    intro_audio_url?: string;
    long_letter_title?: string;
    long_letter_body?: string;
    feature_flags?: string;
    love_messages?: string;
    background_music?: string;
    puzzle_image_url?: string;
    quiz_data?: string;
    birthday_date?: string;
    recipient_name?: string;
    media_title?: string;
    audio_title?: string;
    gallery_title?: string;
    social_title?: string;
    social_subtitle?: string;
    gift_shop_title?: string;
    gift_shop_subtitle?: string;
    wishes_title?: string;
    message_title?: string;
}

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

interface GalleryItem {
    id: number;
    url: string;
    type?: 'image' | 'video';
    caption: string;
}

interface Song {
    id: number;
    title: string;
    artist: string;
    url: string;
}

export default function HomeClient({ content, gallery, playlist, skipIntro = false }: { content: Content, gallery: GalleryItem[], playlist: Song[], skipIntro?: boolean }) {
    const { setIsPlaying, setMusicPaused, setUnlocked, isUnlocked } = useMusic()
    const router = useRouter()
    const [playing, setPlaying] = useState(false)
    const [verifying, setVerifying] = useState(true)

    // PAGE FLOW GUARD
    useEffect(() => {
        const checkFlow = () => {
            // Admin Bypass
            const isAdmin = localStorage.getItem('admin_auth') === 'true' || document.cookie.includes('admin_bypass=true')

            // 1. Check if unlocked (from Gift Page action)
            // If user refreshes, isUnlocked resets to false -> Goes to Gift
            // We REMOVED the Admin check here so that even Admin gets redirected on refresh.
            if (!isUnlocked) {
                router.replace('/gift')
                return
            }

            // If we are here, access is granted
            setPlaying(true)
            setUnlocked(true)
            setVerifying(false)

            // FORCE AUTOPLAY
            // We dispatch a click event on document body to try and bypass browser autoplay policies
            setTimeout(() => {
                setIsPlaying(true)
                const playEvent = new MouseEvent('click', { view: window, bubbles: true, cancelable: true });
                document.body.dispatchEvent(playEvent);
            }, 500)
        }

        checkFlow()
    }, [content.birthday_date, router, setIsPlaying, setUnlocked])

    const introAudioRef = useRef<HTMLAudioElement>(null)

    // We removed the 'forcePlay' interaction listeners as requested.
    // Music will only play when component mounts and logic triggers it.

    // Feature Flags
    const [flags, setFlags] = useState<FeatureFlags>({
        show_games: true, show_letter: true, show_gallery: true, show_wishes: true, show_media: true,
        game_hearts: true, show_puzzle: true, show_quiz: true, puzzle_difficulty: 3
    })

    const [localGallery, setLocalGallery] = useState<GalleryItem[]>(gallery)



    const [isMusicPausedExternally, setIsMusicPausedExternally] = useState(false)
    const [currentTheme, setCurrentTheme] = useState<'romantic' | 'party' | 'cozy'>('romantic')
    const [showCake, setShowCake] = useState(false)
    const [showSecretVault, setShowSecretVault] = useState(false)
    const [secretCode, setSecretCode] = useState('')
    const [vaultUnlocked, setVaultUnlocked] = useState(false)

    // Coordination for Background Music
    const handleMediaPlay = (playing: boolean) => {
        setMusicPaused(playing)
    }
    // ... (rest of state)

    // ... (effects)

    // Simplified Heart Click (Just Confetti)
    const handleHeartClick = () => {
        fetch('/api/analytics', { method: 'POST', body: JSON.stringify({ event: 'heart_clicks' }), headers: { 'Content-Type': 'application/json' } }).catch(() => { })
        confetti({ particleCount: 15, spread: 40, origin: { y: 0.6 }, colors: ['#ec4899'] })
    }

    const unlockVault = () => {
        // Check Birthdate (e.g. 24 Oct -> 2410)
        if (secretCode === '3003') {
            setVaultUnlocked(true)
            setSecretCode('')
        } else {
            alert('Incorrect Code! Try your birthday (DDMM) 😉')
            setSecretCode('')
        }
    }

    const getThemeStyles = () => {
        switch (currentTheme) {
            case 'party':
                return "bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-purple-950 transition-colors duration-1000"
            case 'cozy':
                return "bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-950/20 via-zinc-950 to-black transition-colors duration-1000"
            default:
                return "bg-black transition-colors duration-1000"
        }
    }

    // ...

    if (verifying) return <PremiumLoader />

    return (
        <main className={`min-h-screen text-white selection:bg-pink-500/30 overflow-x-hidden relative ${getThemeStyles()}`}>



            {/* HERO SECTION */}
            <section className="h-screen flex flex-col items-center justify-center relative bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-black overflow-hidden">
                <FloatingHearts theme={currentTheme} />
                <FullScreenSparkles theme={currentTheme} />

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={playing ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="text-center z-10 p-4 relative"
                >
                    <TimeGreeting name={content.recipient_name?.split(' ')[0] || "Mohini"} />

                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-sm md:text-base mb-8 animate-pulse backdrop-blur-sm">
                        <Stars className="w-4 h-4" />
                        <span>Scroll Down for More!</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-pink-100 to-zinc-500 mb-6 tracking-tighter whitespace-pre-line leading-[1.1] relative select-none cursor-pointer" onClick={handleHeartClick}>
                        <Sparkles className="inline-block mr-4 animate-pulse" color="#ec4899" />
                        <TypewriterText text={content.hero_title || "Happy Birthday\nMohini ❤️"} speed={150} />
                    </h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={playing ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ delay: 1, duration: 1 }}
                        className="text-lg md:text-2xl text-zinc-400 mt-4 max-w-xl mx-auto leading-relaxed px-4"
                    >
                        {content.hero_subtitle || "Ye website sirf tumhare liye ❤️"}
                    </motion.p>

                    {/* Simple Social Share Bar (Hero) */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={playing ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ delay: 1.5, duration: 1 }}
                        className="mt-8"
                    >
                        <SocialShare />
                    </motion.div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={playing ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: 2, duration: 1 }}
                    className="absolute bottom-10 animate-bounce cursor-pointer z-50 text-white"
                    onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                >
                    <p className="text-zinc-500 text-sm">Scroll Karo 👇</p>
                </motion.div>
            </section>

            {/* MINI GAMES ARCADE - MOVED UP */}
            {playing && flags.show_games && (
                <MiniGamesSection gallery={localGallery} content={content} flags={flags} />
            )}


            {/* INTERACTIVE */}
            {playing && flags.show_games && (
                <>
                    <section className="py-20 px-4 bg-zinc-950/20">
                        <div className="max-w-6xl mx-auto space-y-20">
                            {/* Row 1: Rose & AR */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                <div><BloomingRose content={content} /></div>
                                <div className="space-y-12"><RomanticAI content={content} /><OurFutureMagic content={content} /></div>
                            </div>

                            {/* Row 2: Digital Cake & Scratch Card */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-zinc-900/40 p-8 rounded-3xl border border-white/5">
                                <div className="text-center space-y-4">
                                    <DigitalCake content={content} />
                                </div>
                                <div className="text-center space-y-8">
                                    <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-400">
                                        Your Surprise Gift 🎁
                                    </h3>
                                    <ScratchCard prizeText="One Free 'Yes' Day! (Valid Forever) 💖" content={content} />
                                    <p className="text-sm text-zinc-500 italic">Scratch to reveal your gift!</p>
                                </div>
                            </div>
                        </div>
                    </section>


                </>
            )}

            {/* LOVE LETTER */}
            {playing && flags.show_letter && content.long_letter_body && (
                <LoveLetter
                    title={content.long_letter_title || "My Heart's Letter"}
                    body={content.long_letter_body}
                    gallery={localGallery.slice(0, 4)}
                />
            )}

            {/* BIRTHDAY WISH BOX */}
            {playing && flags.show_wishes && (
                <WishBox />
            )}

            {/* MEDIA */}
            {flags.show_media && (content.video_url || content.voice_url) && (
                <section className="py-20 px-4 bg-zinc-950/50 relative">
                    <div className="max-w-4xl mx-auto space-y-12">
                        {content.video_url && (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
                                <h2 className="text-3xl font-bold text-center mb-8 text-white">{content.media_title || "Our Memories 🎥"}</h2>
                                <VideoPlayer url={content.video_url} play={playing} onPlayChange={handleMediaPlay} />
                            </motion.div>
                        )}
                        {content.voice_url && (
                            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="pt-8 text-center">
                                <h3 className="text-xl text-zinc-400 mb-4 flex items-center justify-center gap-2"><Music className="w-5 h-5" /> {content.audio_title || "Listen to this..."}</h3>
                                <VoiceMessage url={content.voice_url} onPlayChange={handleMediaPlay} />
                            </motion.div>
                        )}
                    </div>
                </section>
            )}

            {/* GALLERY */}
            {flags.show_gallery && <GallerySection items={localGallery} title={content.gallery_title} />}

            {/* Birthday Cake Overlay */}
            <AnimatePresence>
                {showCake && <BirthdayCakePopup isOpen={showCake} onClose={() => setShowCake(false)} content={content} />}
            </AnimatePresence>



            {/* CARD STUDIO */}
            {playing && flags.show_wishes && (
                <CardStudio
                    recipientName={content.recipient_name || content.hero_title?.split('\n')[1]?.replace('❤️', '').trim() || "Mohini"}
                    letterBody={content.long_letter_body || content.message_body || "Happy Birthday!"}
                    heroImage={localGallery[0]?.url}
                    title={content.gift_shop_title}
                    subtitle={content.gift_shop_subtitle}
                />
            )}

            {/* GUEST WISHES */}
            {flags.show_wishes && <GuestWishes title={content.wishes_title} />}

            {/* LOVE TIMELINE */}
            {playing && <LoveTimeline />}

            {/* MESSAGE */}
            <section className="min-h-[60vh] flex items-center justify-center py-20 px-6 bg-zinc-950 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-pink-900/20 via-transparent to-transparent opacity-50" />
                <div className="max-w-3xl text-center space-y-8 z-10">
                    <Heart className="w-16 h-16 text-pink-500 mx-auto fill-current animate-pulse opacity-80 filter drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]" />
                    <h2 className="text-3xl md:text-6xl font-black text-white tracking-tight">{content.message_title || "Ek Chhota Sa Message 💌"}</h2>
                    <div className="relative p-8 md:p-12 bg-zinc-900/50 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl">
                        <div className="text-lg md:text-xl text-zinc-300 leading-loose space-y-6 font-light whitespace-pre-wrap text-left md:text-center">
                            {content.message_body || "Happy Birthday Mohini! 🎉"}
                        </div>
                        <p className="font-handwriting text-4xl text-pink-400 mt-12 transform -rotate-2 inline-block drop-shadow-lg">- YOUR LOVE</p>
                    </div>
                </div>
            </section>

            <CinematicEnd name={content.recipient_name || "Mohini"} />

            {/* FOOTER & SECRET VAULT TRIGGER */}
            <footer className="py-12 text-center border-t border-zinc-900 mt-20 bg-black relative">
                <p className="text-zinc-600 text-sm flex items-center justify-center gap-2">
                    Made with
                    <button onClick={() => setShowSecretVault(true)} className="hover:scale-125 transition-transform"><Heart className="w-4 h-4 fill-pink-600 text-pink-600 animate-pulse" /></button>
                    for Mohini
                </p>
            </footer>

            {/* SECRET VAULT MODAL */}
            <AnimatePresence>
                {showSecretVault && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
                    >
                        <div className="max-w-md w-full bg-zinc-900 border border-zinc-700 p-8 rounded-2xl text-center shadow-2xl relative">
                            <button onClick={() => setShowSecretVault(false)} className="absolute top-4 right-4 text-zinc-500 hover:text-white"><X className="w-6 h-6" /></button>

                            {!vaultUnlocked ? (
                                <div className="space-y-6">
                                    <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Lock className="w-8 h-8 text-zinc-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white">Secret Vault 🔒</h3>
                                    <p className="text-zinc-400 text-sm">Enter your Birth Date (DDMM) to unlock.</p>
                                    <div className="flex gap-2 justify-center">
                                        <input
                                            type="password"
                                            maxLength={4}
                                            className="bg-black border border-zinc-700 text-center text-2xl tracking-[1em] text-white p-4 rounded-lg w-48 focus:border-pink-500 outline-none"
                                            value={secretCode}
                                            onChange={e => setSecretCode(e.target.value)}
                                            placeholder="••••"
                                        />
                                    </div>
                                    <button
                                        onClick={unlockVault}
                                        className="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold py-3 rounded-lg"
                                    >
                                        Unlock
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                                        <Key className="w-8 h-8 text-green-400" />
                                    </div>
                                    <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                                        SURPRISE! 🎉
                                    </h3>
                                    <p className="text-zinc-300 text-lg italic leading-relaxed">
                                        "Knowing you is the greatest gift of all. Here's a secret promise: I will always be your biggest fan. 💖"
                                    </p>
                                    <div className="p-4 bg-zinc-950 rounded border border-zinc-800 text-left text-xs font-mono text-green-400">
                                        <p>{`> SECRET_LEVEL_UNLOCKED: TRUE`}</p>
                                        <p>{`> HAPPINESS_LEVEL: INFINITY`}</p>
                                        <p>{`> LOVE_STATUS: ETERNAL`}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    )
}
