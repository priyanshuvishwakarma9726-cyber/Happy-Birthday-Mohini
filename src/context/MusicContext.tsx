'use client'
import React, { createContext, useContext, useState, useEffect } from 'react'

interface MusicContextType {
    isMusicPaused: boolean
    setMusicPaused: (paused: boolean) => void
    isPlaying: boolean
    setIsPlaying: (playing: boolean) => void
    isUnlocked: boolean
    setUnlocked: (unlocked: boolean) => void
    restartMusic: () => void
    restartTrigger: number
}

const MusicContext = createContext<MusicContextType | undefined>(undefined)

export function MusicProvider({ children }: { children: React.ReactNode }) {
    const [isMusicPaused, setMusicPaused] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isUnlocked, setUnlocked] = useState(false)

    const [restartTrigger, setRestartTrigger] = useState(0)

    const restartMusic = () => {
        setRestartTrigger(prev => prev + 1)
    }

    // Persist Playing State across pages in Session
    useEffect(() => {
        const stored = sessionStorage.getItem('music_playing')
        if (stored === 'true') setIsPlaying(true)
    }, [])

    useEffect(() => {
        if (isPlaying) sessionStorage.setItem('music_playing', 'true')
        else sessionStorage.setItem('music_playing', 'false')
    }, [isPlaying])

    return (
        <MusicContext.Provider value={{
            isMusicPaused,
            setMusicPaused,
            isPlaying,
            setIsPlaying,
            isUnlocked,
            setUnlocked,
            restartTrigger,
            restartMusic
        }}>
            {children}
        </MusicContext.Provider>
    )
}

export function useMusic() {
    const context = useContext(MusicContext)
    if (context === undefined) {
        throw new Error('useMusic must be used within a MusicProvider')
    }
    return context
}
