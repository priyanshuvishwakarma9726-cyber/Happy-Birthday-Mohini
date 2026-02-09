'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface ContentContextType {
    content: Record<string, string>
    refreshContent: () => Promise<void>
    updateContent: (newContent: Record<string, string>) => void
    isLoading: boolean
}

const ContentContext = createContext<ContentContextType | undefined>(undefined)

export function ContentProvider({ children, initialContent = {} }: { children: ReactNode, initialContent?: Record<string, string> }) {
    const [content, setContent] = useState<Record<string, string>>(initialContent)
    const [isLoading, setIsLoading] = useState(false)

    const refreshContent = async () => {
        setIsLoading(true)
        try {
            const res = await fetch('/api/content')
            const data = await res.json()
            setContent(prev => ({ ...prev, ...data }))
        } catch (e) {
            console.error("Failed to refresh content", e)
        } finally {
            setIsLoading(false)
        }
    }

    const updateContent = (newContent: Record<string, string>) => {
        setContent(prev => ({ ...prev, ...newContent }))
    }

    // Initial Fetch (if initialContent is empty or stale)
    useEffect(() => {
        refreshContent()
        // Poll every 30 seconds for real-time-ish updates
        const interval = setInterval(refreshContent, 30000)
        return () => clearInterval(interval)
    }, [])

    return (
        <ContentContext.Provider value={{ content, refreshContent, updateContent, isLoading }}>
            {children}
        </ContentContext.Provider>
    )
}

export function useContent() {
    const context = useContext(ContentContext)
    if (context === undefined) {
        throw new Error('useContent must be used within a ContentProvider')
    }
    return context
}

export function useText(key: string, defaultText: string = "") {
    const { content } = useContent()
    if (!content) return defaultText
    return content[key] !== undefined ? content[key] : defaultText
}
