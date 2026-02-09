'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'

// Simple check if URL is YouTube
function isYouTube(url: string) {
    return url?.includes('youtube.com') || url?.includes('youtu.be');
}

export function VoiceMessage({ url, onPlayChange }: { url: string, onPlayChange?: (playing: boolean) => void }) {
    const audioRef = useRef<HTMLAudioElement>(null)
    const [playing, setPlaying] = useState(false)
    const [progress, setProgress] = useState(0)
    const [error, setError] = useState(false)

    useEffect(() => {
        setError(false) // Reset error state on URL change
        const audio = audioRef.current
        if (!audio) return

        const update = () => setProgress((audio.currentTime / audio.duration) * 100)
        const onEnd = () => {
            setPlaying(false)
            setProgress(0)
            onPlayChange?.(false)
        }
        const onError = () => {
            const err = audio.error
            console.error("Audio playback error details:", {
                code: err?.code,
                message: err?.message,
                url: url
            })
            setError(true)
            onPlayChange?.(false)
        }

        audio.addEventListener('timeupdate', update)
        audio.addEventListener('ended', onEnd)
        audio.addEventListener('error', onError)
        return () => {
            audio.removeEventListener('timeupdate', update)
            audio.removeEventListener('ended', onEnd)
            audio.removeEventListener('error', onError)
        }
    }, [url])

    const toggle = async () => {
        if (!audioRef.current) return
        if (playing) {
            audioRef.current.pause()
            setPlaying(false)
            onPlayChange?.(false)
        } else {
            try {
                await audioRef.current.play()
                setPlaying(true)
                onPlayChange?.(true)
            } catch (e) {
                console.error("Play failed:", e)
                setError(true)
            }
        }
    }

    if (!url) return null;

    if (error) {
        return (
            <div className="w-full max-w-md mx-auto bg-red-900/20 border border-red-500/50 rounded-2xl p-4 flex items-center gap-4">
                <p className="text-red-400 text-xs">⚠️ Cannot play audio format. Please upload MP3/WAV.</p>
            </div>
        )
    }

    return (
        <div className="w-full max-w-md mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center gap-4 shadow-xl">
            <button
                onClick={toggle}
                className="w-12 h-12 flex items-center justify-center bg-pink-500 rounded-full text-white hover:bg-pink-600 transition-colors shrink-0"
            >
                {playing ? <Pause className="fill-current w-5 h-5" /> : <Play className="fill-current w-5 h-5 ml-1" />}
            </button>

            <div className="flex-1 bg-zinc-800 h-2 rounded-full overflow-hidden relative">
                <div
                    style={{ width: `${progress}%` }}
                    className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-100 ease-linear"
                />
            </div>
            <audio key={url} ref={audioRef} src={url} preload="metadata" />
            <span className="text-xs text-zinc-500 font-mono shrink-0">Voice Note 🎙️</span>
        </div>
    )
}

export function VideoPlayer({ url, play, onPlayChange }: { url: string, play: boolean, onPlayChange?: (playing: boolean) => void }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [muted, setMuted] = useState(false); // Unmuted by default if overlay logic allows

    useEffect(() => {
        if (play && videoRef.current) {
            videoRef.current.play().then(() => {
                onPlayChange?.(true)
            }).catch(e => {
                console.warn("Autoplay blocked, user interaction needed first.", e)
                setMuted(true) // Fallback
                videoRef.current?.play()
            })
        }
    }, [play])

    if (!url) return null;

    if (isYouTube(url)) {
        // Embed YouTube with special interaction logic
        const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
        return (
            <div className="aspect-video w-full rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl relative">
                <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=${play ? 1 : 0}&mute=0&controls=1&loop=1&playlist=${videoId}`}
                    title="Birthday Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full object-cover"
                />
            </div>
        )
    }

    return (
        <div className="relative group aspect-[9/16] md:aspect-video w-full max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl bg-black">
            <video
                ref={videoRef}
                src={url}
                className="w-full h-full object-cover"
                loop
                playsInline
                controls={true}
                muted={muted}
                onPlay={() => onPlayChange?.(true)}
                onPause={() => onPlayChange?.(false)}
            />

            {/* Custom Controls for Video */}
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-between items-center pointer-events-none">
                <button onClick={() => setMuted(!muted)} className="text-white hover:text-pink-400 p-2 pointer-events-auto">
                    {muted ? <VolumeX /> : <Volume2 />}
                </button>
            </div>
        </div>
    )
}
