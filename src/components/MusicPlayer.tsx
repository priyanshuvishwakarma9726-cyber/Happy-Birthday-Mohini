'use client'
import { useState, useRef, useEffect } from 'react'
import { Disc, Play, Pause, Volume2, VolumeX } from 'lucide-react'
import { useMusic } from '@/context/MusicContext'

import { usePathname } from 'next/navigation'
const FIXED_YOUTUBE_ID = 'cNGjD0VG4R8'

export default function MusicPlayer() {
    const pathname = usePathname()
    const { isMusicPaused, isPlaying, setIsPlaying } = useMusic()
    const [isMinimized, setIsMinimized] = useState(true)
    const [volume, setVolume] = useState(0.3)
    const [isMuted, setIsMuted] = useState(false)
    const iframeRef = useRef<HTMLIFrameElement>(null)

    // YouTube IFrame API Messenger
    const sendYTCommand = (command: string, args: any[] = []) => {
        if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage(
                JSON.stringify({ event: 'command', func: command, args: args }),
                '*'
            )
        }
    }

    // Handle Music Pause (from Context)
    useEffect(() => {
        if (pathname !== '/home') {
            sendYTCommand('pauseVideo')
            return
        }

        if (isMusicPaused) {
            sendYTCommand('pauseVideo')
        } else if (isPlaying) {
            sendYTCommand('playVideo')
        }
    }, [isMusicPaused, isPlaying, pathname])

    // Sync Volume State
    useEffect(() => {
        sendYTCommand('setVolume', [isMuted ? 0 : volume * 100])
    }, [volume, isMuted])

    // Aggressive Play Attempt & Sync
    useEffect(() => {
        if (pathname !== '/home') {
            sendYTCommand('pauseVideo')
            return
        }

        if (isPlaying && !isMusicPaused) {
            sendYTCommand('playVideo')
        } else {
            sendYTCommand('pauseVideo')
        }
    }, [isPlaying, isMusicPaused, pathname])

    // Handle Restart Trigger
    const { restartTrigger } = useMusic()
    useEffect(() => {
        if (restartTrigger > 0) {
            sendYTCommand('seekTo', [0, true])
            sendYTCommand('playVideo')
        }
    }, [restartTrigger])

    const togglePlay = () => setIsPlaying(!isPlaying)

    return (
        <div className="hidden pointer-events-none opacity-0 invisible h-0 w-0 overflow-hidden">
            <iframe
                ref={iframeRef}
                id="fixed-yt-player"
                src={`https://www.youtube.com/embed/${FIXED_YOUTUBE_ID}?enablejsapi=1&autoplay=0&mute=0&loop=1&playlist=${FIXED_YOUTUBE_ID}&controls=0&playsinline=1`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
        </div>
    )
}
