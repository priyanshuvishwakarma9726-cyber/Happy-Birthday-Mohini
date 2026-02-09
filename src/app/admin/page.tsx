'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Unlock, Settings, Eye, EyeOff, Save, Trash2, CheckCircle, AlertTriangle, Camera, Music, Sparkles, MessageSquareHeart, Heart, Gift, Compass } from 'lucide-react'

// Types
interface Content {
    hero_title: string;
    hero_subtitle: string;
    message_body: string;
    video_url: string;
    voice_url: string;
    favorite_song_url: string;
    intro_audio_url: string;
    long_letter_title: string;
    long_letter_body: string;
    feature_flags: string;
    love_messages: string;
    quiz_data: string;
    puzzle_image_url: string;
    romantic_dict: string; // JSON string for RomanticAI
    future_goals: string; // JSON string for OurFutureMagic
    cake_wishes: string; // JSON string for DigitalCake
    scratch_card_prize: string;
    gallery_title: string;
    wishes_title: string;
    social_title: string;
    social_subtitle: string;
    gift_shop_title: string;
    gift_shop_subtitle: string;
    recipient_name: string;
    message_title: string;
    media_title: string;
    audio_title: string;
    birthday_date: string;
}

interface FeatureFlags {
    show_games: boolean;
    show_letter: boolean;
    show_gallery: boolean;
    show_wishes: boolean;
    show_media: boolean;
    show_puzzle: boolean;
    show_quiz: boolean;
    puzzle_difficulty: 3 | 4 | 5;
}

const DEFAULT_FLAGS: FeatureFlags = {
    show_games: true,
    show_letter: true,
    show_gallery: true,
    show_wishes: true,
    show_media: true,
    show_puzzle: true,
    show_quiz: true,
    puzzle_difficulty: 4
}

import { useContent } from '@/context/ContentContext'

export default function AdminPage() {
    const { content: globalContent, updateContent, refreshContent } = useContent()
    const [locked, setLocked] = useState(false) // UNLOCKED BY DEFAULT
    const [clickCount, setClickCount] = useState(0)
    const [password, setPassword] = useState('')

    // Local state for form editing (initialized from global)
    const [localContent, setLocalContent] = useState<Record<string, string>>({})

    // Sync global content to local state on load
    useEffect(() => {
        if (globalContent) {
            setLocalContent(prev => ({ ...prev, ...globalContent }))
        }
    }, [globalContent])

    const [flags, setFlags] = useState<FeatureFlags>(DEFAULT_FLAGS)
    const [memories, setMemories] = useState<any[]>([])
    const [wishes, setWishes] = useState<any[]>([])
    const [stats, setStats] = useState<any>({})
    const [uploading, setUploading] = useState(false)
    const [newKey, setNewKey] = useState('')
    const [newValue, setNewValue] = useState('')

    const loadData = async () => {
        try {
            // 1. Refresh global content context
            await refreshContent()

            // 2. Fetch separate tables (memories, wishes, analytics)
            const [memRes, wishRes, statsRes] = await Promise.all([
                fetch('/api/memories').then(r => r.json()),
                fetch('/api/wishes?admin=true').then(r => r.json()),
                fetch('/api/analytics').then(r => r.json())
            ])

            if (Array.isArray(memRes)) setMemories(memRes)
            if (Array.isArray(wishRes)) setWishes(wishRes)
            if (statsRes) setStats(statsRes)
        } catch (e) {
            console.error("Critical Load Failure:", e)
        }
    }

    // Effect to handle flags sync from global content
    useEffect(() => {
        if (globalContent?.feature_flags) {
            try {
                setFlags(JSON.parse(globalContent.feature_flags))
            } catch (e) { console.error("Flag Parse Error", e) }
        }
    }, [globalContent])

    useEffect(() => {
        if (localStorage.getItem('admin_auth') === 'true' || document.cookie.includes('admin_bypass=true')) {
            setLocked(false)
            loadData()
        }
    }, [])

    // Ensure flags update local content before save
    useEffect(() => {
        setLocalContent(prev => ({ ...prev, feature_flags: JSON.stringify(flags) }))
    }, [flags])

    const handleLogin = () => {
        if (password === 'mohini' || password === '2005') {
            localStorage.setItem('admin_auth', 'true')
            document.cookie = "admin_bypass=true; path=/; max-age=31536000"
            setLocked(false)
            loadData()
        } else alert('Access Denied 🚫')
    }

    const handleSave = async () => {
        // Save everything in localContent
        const res = await fetch('/api/content', { method: 'POST', body: JSON.stringify(localContent), headers: { 'Content-Type': 'application/json' } })
        if (res.ok) {
            alert('God Mode Sync Complete! ⚡')
            refreshContent() // Trigger global update
        }
    }

    const handleDeleteKey = async (key: string) => {
        if (confirm(`Delete key "${key}"? This cannot be undone.`)) {
            // In a real generic DB we would DELETE, but here our API calls INSERT ON DUPLICATE.
            // We need a specific DELETE endpoint or just ignore it. 
            // For now, we'll just remove it from local state and save, but DB might still have it.
            // Actually, to fully delete, we'd need to update the API. 
            // Let's just set it to empty string for now or implement DELETE later.
            const newC = { ...localContent }
            delete newC[key]
            setLocalContent(newC)
        }
    }

    const addNewKey = () => {
        if (newKey && !localContent[newKey]) {
            setLocalContent({ ...localContent, [newKey]: newValue })
            setNewKey('')
            setNewValue('')
        }
    }

    const handleFileUpload = async (file: File) => {
        const formData = new FormData(); formData.append('file', file)
        const res = await fetch('/api/upload', { method: 'POST', body: formData })
        const data = await res.json()
        return data.file_path
    }

    if (locked) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4" onClick={() => setClickCount(p => p + 1)}>
                {clickCount < 5 ? (
                    <div className="text-center group">
                        <h1 className="text-9xl font-black text-white/5 transition-colors group-hover:text-white/10">404</h1>
                        <p className="text-zinc-500 mt-4">Page Not Found</p>
                    </div>
                ) : (
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="p-8 bg-zinc-900 rounded-2xl border border-zinc-800 w-full max-w-sm shadow-[0_0_50px_rgba(236,72,153,0.1)]">
                        <div className="flex justify-center mb-6"><Lock className="w-12 h-12 text-pink-500" /></div>
                        <input type="password" placeholder="Passcode" className="w-full bg-black border border-zinc-800 p-3 rounded-lg mb-4 text-center tracking-widest focus:border-pink-500 outline-none" value={password} onChange={e => setPassword(e.target.value)} />
                        <button onClick={handleLogin} className="w-full bg-pink-600 py-3 rounded-lg font-bold">UNLOCK PROTOCOL</button>
                    </motion.div>
                )}
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-white font-sans">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5 p-6 flex justify-between items-center">
                <h1 className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500 flex items-center gap-2">
                    <Settings className="w-6 h-6 text-pink-500" /> CONTROL ROOM v2.0
                </h1>
                <div className="flex gap-4">
                    <button onClick={() => window.open('/gift?preview=true', '_blank')} className="bg-zinc-800 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest">Preview</button>
                    <button onClick={handleSave} className="bg-pink-600 px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest shadow-lg shadow-pink-500/20 flex items-center gap-2"><Save className="w-4 h-4" /> Save All</button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-6 md:p-12 space-y-12">
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['views', 'heart_clicks', 'snake_unlocked', 'wish_reactions'].map(key => (
                        <div key={key} className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5">
                            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">{key.replace('_', ' ')}</p>
                            <p className="text-3xl font-black text-white">{stats[key] || 0}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Panel: Content & Logic */}
                    <div className="lg:col-span-8 space-y-12">

                        {/* 1. Global Features */}
                        <section className="space-y-6">
                            <h2 className="text-xl font-bold flex items-center gap-2"><Sparkles className="text-yellow-500 w-5 h-5" /> Global Logic</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {Object.keys(flags).filter(k => typeof flags[k as keyof FeatureFlags] === 'boolean').map(key => (
                                    <button
                                        key={key}
                                        onClick={() => setFlags({ ...flags, [key]: !flags[key as keyof FeatureFlags] })}
                                        className={`p-4 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${flags[key as keyof FeatureFlags] ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}
                                    >
                                        {key.replace('show_', '')}
                                    </button>
                                ))}
                                <button
                                    onClick={() => {
                                        localStorage.removeItem('countdownCompleted');
                                        localStorage.removeItem('giftUnlocked');
                                        localStorage.removeItem('giftOpened');
                                        document.cookie = "gift_unlocked=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
                                        alert('Flow State Reset! 🔄');
                                    }}
                                    className="p-4 rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-widest hover:bg-blue-500/20 transition-all"
                                >
                                    RESET FLOW
                                </button>
                            </div>
                        </section>

                        {/* GOD MODE TEXT REGISTRY */}
                        <section className="bg-zinc-900/30 p-8 rounded-3xl border border-white/5 space-y-6">
                            <h2 className="text-xl font-bold flex items-center gap-2 text-yellow-400"><Compass className="w-5 h-5" /> God Mode Registry (Advanced)</h2>
                            <div className="bg-black/40 p-4 rounded-xl max-h-96 overflow-y-auto space-y-2">
                                {Object.entries(localContent).map(([k, v]) => (
                                    <div key={k} className="flex items-center gap-2 group">
                                        <div className="w-1/3">
                                            <p className="text-[10px] font-mono text-zinc-500 truncate" title={k}>{k}</p>
                                        </div>
                                        <input
                                            className="flex-1 bg-transparent border-b border-white/10 text-xs p-1 focus:border-yellow-500 outline-none font-mono text-yellow-100"
                                            value={v || ''}
                                            onChange={(e) => setLocalContent({ ...localContent, [k]: e.target.value })}
                                        />
                                        <button onClick={() => handleDeleteKey(k)} className="opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-500/20 p-1 rounded"><Trash2 className="w-3 h-3" /></button>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input className="bg-black border border-white/10 p-2 rounded-lg text-xs flex-1" placeholder="New Key (e.g. ui_btn_label)" value={newKey} onChange={e => setNewKey(e.target.value)} />
                                <input className="bg-black border border-white/10 p-2 rounded-lg text-xs flex-1" placeholder="Value" value={newValue} onChange={e => setNewValue(e.target.value)} />
                                <button onClick={addNewKey} className="bg-yellow-600/20 text-yellow-500 px-4 rounded-lg text-xs font-bold uppercase hover:bg-yellow-600 hover:text-white transition-all">+ Add</button>
                            </div>
                        </section>

                        <section className="bg-zinc-900/30 p-8 rounded-3xl border border-white/5 space-y-6">
                            <h2 className="text-xl font-bold flex items-center gap-2 text-blue-400"><Settings className="w-5 h-5" /> Section Titles</h2>
                            <div className="grid grid-cols-2 gap-4">
                                {['recipient_name', 'gallery_title', 'wishes_title', 'social_title', 'social_subtitle', 'gift_shop_title', 'gift_shop_subtitle', 'message_title', 'media_title', 'audio_title'].map(field => (
                                    <div key={field}><label className="text-[10px] text-zinc-500 uppercase font-black">{field.replace('_', ' ')}</label><input className="w-full bg-black border border-white/10 p-3 rounded-xl focus:border-blue-500 outline-none" value={localContent[field] || ''} onChange={e => setLocalContent({ ...localContent, [field]: e.target.value })} /></div>
                                ))}
                                <div><label className="text-[10px] text-zinc-500 uppercase font-black text-pink-500">Birthday Date & Time</label><input type="datetime-local" className="w-full bg-black border border-pink-500/50 p-3 rounded-xl focus:border-pink-500 outline-none text-white" value={localContent['birthday_date'] || ''} onChange={e => setLocalContent({ ...localContent, 'birthday_date': e.target.value })} /></div>
                            </div>
                        </section>

                        {/* 2. Hero & Core Text */}
                        <section className="bg-zinc-900/30 p-8 rounded-3xl border border-white/5 space-y-6">
                            <h2 className="text-xl font-bold flex items-center gap-2 text-pink-400"><Heart className="w-5 h-5" /> Main Content</h2>
                            <div className="space-y-4">
                                <div><label className="text-[10px] text-zinc-500 uppercase font-black">Hero Title</label><input className="w-full bg-black border border-white/10 p-3 rounded-xl focus:border-pink-500 outline-none" value={localContent['hero_title'] || ''} onChange={e => setLocalContent({ ...localContent, 'hero_title': e.target.value })} /></div>
                                <div><label className="text-[10px] text-zinc-500 uppercase font-black">Hero Subtitle</label><input className="w-full bg-black border border-white/10 p-3 rounded-xl focus:border-pink-500 outline-none" value={localContent['hero_subtitle'] || ''} onChange={e => setLocalContent({ ...localContent, 'hero_subtitle': e.target.value })} /></div>
                                <div><label className="text-[10px] text-zinc-500 uppercase font-black">Main Message</label><textarea className="w-full bg-black border border-white/10 p-3 rounded-xl h-32 focus:border-pink-500 outline-none" value={localContent['message_body'] || ''} onChange={e => setLocalContent({ ...localContent, 'message_body': e.target.value })} /></div>
                            </div>
                        </section>

                        {/* 3. Love Letter & AI Poem Dictionary */}
                        <section className="grid md:grid-cols-2 gap-8">
                            <div className="bg-pink-900/10 p-8 rounded-3xl border border-pink-500/20 space-y-4">
                                <h3 className="font-bold text-pink-400 flex items-center gap-2 uppercase tracking-widest text-sm"><MessageSquareHeart /> Love Letter</h3>
                                <input className="w-full bg-black/40 border border-pink-500/20 p-3 rounded-xl text-sm" placeholder="Title..." value={localContent['long_letter_title'] || ''} onChange={e => setLocalContent({ ...localContent, 'long_letter_title': e.target.value })} />
                                <textarea className="w-full bg-black/40 border border-pink-500/20 p-3 rounded-xl h-64 text-sm font-serif" placeholder="Body..." value={localContent['long_letter_body'] || ''} onChange={e => setLocalContent({ ...localContent, 'long_letter_body': e.target.value })} />
                            </div>
                            <div className="bg-purple-900/10 p-8 rounded-3xl border border-purple-500/20 space-y-4">
                                <h3 className="font-bold text-purple-400 flex items-center gap-2 uppercase tracking-widest text-sm"><Sparkles /> AI Poet Dictionary (JSON)</h3>
                                <textarea className="w-full bg-black/40 border border-purple-500/20 p-4 rounded-xl h-[330px] font-mono text-[10px]" value={localContent['romantic_dict'] || '{}'} onChange={e => setLocalContent({ ...localContent, 'romantic_dict': e.target.value })} />
                                <p className="text-[9px] text-zinc-600 italic">Format: {"{ \"word\": \"poem replacement\" }"}</p>
                            </div>
                        </section>

                        {/* 4. Games & Pitara Data */}
                        <section className="bg-indigo-900/10 p-8 rounded-3xl border border-indigo-500/20 space-y-8">
                            <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-400"><Compass /> Game Engines & Pitara</h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <label className="text-[10px] text-zinc-500 uppercase font-black block mb-2">Pitara Predictions (JSON Array)</label>
                                    <textarea className="w-full bg-black/40 border border-indigo-500/20 p-3 rounded-xl h-64 font-mono text-[10px]" value={localContent['future_goals'] || '[]'} onChange={e => setLocalContent({ ...localContent, 'future_goals': e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-[10px] text-zinc-500 uppercase font-black block mb-2">Quiz Questions (JSON Array)</label>
                                    <textarea className="w-full bg-black/40 border border-indigo-500/20 p-3 rounded-xl h-64 font-mono text-[10px]" value={localContent['quiz_data'] || '[]'} onChange={e => setLocalContent({ ...localContent, 'quiz_data': e.target.value })} />
                                </div>
                            </div>
                        </section>

                        {/* Extra Feature Text Edits */}
                        <section className="grid grid-cols-2 gap-8">
                            <div className="bg-zinc-900/30 p-6 rounded-3xl border border-white/5 space-y-4">
                                <h3 className="font-bold text-white text-xs uppercase tracking-widest">Scratch Card Prize</h3>
                                <input className="w-full bg-black border border-white/10 p-3 rounded-xl text-sm" value={localContent['scratch_card_prize'] || ''} onChange={e => setLocalContent({ ...localContent, 'scratch_card_prize': e.target.value })} />
                            </div>
                            <div className="bg-zinc-900/30 p-6 rounded-3xl border border-white/5 space-y-4">
                                <h3 className="font-bold text-white text-xs uppercase tracking-widest text-pink-400">Cake Wishes (JSON)</h3>
                                <textarea className="w-full bg-black border border-white/10 p-3 rounded-xl text-[10px] font-mono h-24" value={localContent['cake_wishes'] || '[]'} onChange={e => setLocalContent({ ...localContent, 'cake_wishes': e.target.value })} />
                            </div>
                            <div className="bg-zinc-900/30 p-6 rounded-3xl border border-white/5 space-y-4 col-span-2">
                                <h3 className="font-bold text-white text-xs uppercase tracking-widest text-pink-400">Hidden Messages (Love Popups)</h3>
                                <textarea className="w-full bg-black border border-white/10 p-3 rounded-xl text-[10px] font-mono h-24" value={localContent['love_messages'] || '[]'} onChange={e => setLocalContent({ ...localContent, 'love_messages': e.target.value })} />
                                <p className="text-[9px] text-zinc-600 italic">Format: ["Message 1", "Message 2"]</p>
                            </div>
                        </section>

                    </div>

                    {/* Right Panel: Media & Memory */}
                    <div className="lg:col-span-4 space-y-8">

                        {/* Assets / URLs - FILE UPLOAD ONLY */}
                        <section className="bg-zinc-900/30 p-6 rounded-3xl border border-white/5 space-y-6">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2"><Music className="w-4 h-4" /> Media Assets</h2>

                            {/* Intro Audio */}
                            <div className="space-y-3">
                                <label className="text-[10px] text-zinc-500 uppercase font-black">Intro Music / Audio</label>
                                <div className="flex gap-2">
                                    <input className="flex-1 bg-black border border-white/10 p-2 rounded-lg text-xs text-zinc-500 font-mono" value={localContent['intro_audio_url'] || ''} readOnly placeholder="No file uploaded" />
                                    <label className="bg-pink-600 px-3 py-2 rounded-lg text-xs font-bold cursor-pointer hover:bg-pink-500 flex items-center gap-1 shrink-0">
                                        <Save className="w-3 h-3" /> Upload
                                        <input type="file" className="hidden" accept="audio/*" onChange={async e => { const f = e.target.files?.[0]; if (f) { const p = await handleFileUpload(f); setLocalContent(prev => ({ ...prev, 'intro_audio_url': p })) } }} />
                                    </label>
                                </div>
                                {localContent['intro_audio_url'] && (
                                    <audio controls src={localContent['intro_audio_url']} className="w-full h-8 opacity-50 hover:opacity-100 transition-opacity" />
                                )}
                            </div>

                            {/* Favorite Song */}
                            <div className="space-y-3">
                                <label className="text-[10px] text-zinc-500 uppercase font-black">Favorite Song (BG)</label>
                                <div className="flex gap-2">
                                    <input className="flex-1 bg-black border border-white/10 p-2 rounded-lg text-xs text-zinc-500 font-mono" value={localContent['favorite_song_url'] || ''} readOnly placeholder="No file uploaded" />
                                    <label className="bg-purple-600 px-3 py-2 rounded-lg text-xs font-bold cursor-pointer hover:bg-purple-500 flex items-center gap-1 shrink-0">
                                        <Save className="w-3 h-3" /> Upload
                                        <input type="file" className="hidden" accept="audio/*" onChange={async e => { const f = e.target.files?.[0]; if (f) { const p = await handleFileUpload(f); setLocalContent(prev => ({ ...prev, 'favorite_song_url': p })) } }} />
                                    </label>
                                </div>
                                {localContent['favorite_song_url'] && (
                                    <audio controls src={localContent['favorite_song_url']} className="w-full h-8 opacity-50 hover:opacity-100 transition-opacity" />
                                )}
                            </div>

                            {/* Voice Note */}
                            <div className="space-y-3">
                                <label className="text-[10px] text-zinc-500 uppercase font-black">Voice Note</label>
                                <div className="flex gap-2">
                                    <input className="flex-1 bg-black border border-white/10 p-2 rounded-lg text-xs font-mono text-zinc-500" value={localContent['voice_url'] || ''} readOnly placeholder="No file uploaded" />
                                    <label className="bg-blue-600 px-3 py-2 rounded-lg text-xs font-bold cursor-pointer hover:bg-blue-500 flex items-center gap-1 shrink-0">
                                        <Save className="w-3 h-3" /> Upload
                                        <input type="file" className="hidden" accept="audio/*" onChange={async e => { const f = e.target.files?.[0]; if (f) { const p = await handleFileUpload(f); setLocalContent(prev => ({ ...prev, 'voice_url': p })) } }} />
                                    </label>
                                </div>
                                {localContent['voice_url'] && (
                                    <audio controls src={localContent['voice_url']} className="w-full h-8 opacity-50 hover:opacity-100 transition-opacity" />
                                )}
                            </div>
                        </section>

                        {/* Recent Wishes */}
                        <section className="bg-zinc-900/30 rounded-3xl border border-white/5 overflow-hidden flex flex-col h-[400px]">
                            <div className="p-4 bg-white/5 border-b border-white/5 flex justify-between items-center"><h3 className="font-bold text-xs uppercase tracking-widest">Wishes Approval</h3><span className="text-[10px] text-zinc-500">{wishes.length}</span></div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                {wishes.map(w => (
                                    <div key={w.id} className="p-3 bg-black/40 rounded-xl border border-white/5 relative group">
                                        <button onClick={async () => { await fetch('/api/wishes', { method: 'DELETE', body: JSON.stringify({ id: w.id }) }); setWishes(p => p.filter(x => x.id !== w.id)) }} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-3 h-3" /></button>
                                        <p className="text-xs font-bold text-pink-400 mb-1">{w.name}</p>
                                        <p className="text-[11px] text-zinc-500 leading-tight">"{w.message}"</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Memory Management */}
                        <section className="bg-zinc-900/30 rounded-3xl border border-white/5 overflow-hidden flex flex-col h-[500px]">
                            <div className="p-4 bg-white/5 border-b border-white/5 flex justify-between items-center">
                                <h3 className="font-bold text-xs uppercase tracking-widest flex items-center gap-2"><Camera className="w-4 h-4" /> Gallery Manager</h3>
                                <label className="bg-white text-black px-3 py-1 rounded-full text-[10px] font-bold cursor-pointer hover:bg-zinc-200 flex items-center gap-1">
                                    <input type="file" className="hidden" multiple accept="image/*,video/*" onChange={async e => {
                                        console.log("File input changed", e.target.files)
                                        if (e.target.files && e.target.files.length > 0) {
                                            setUploading(true)
                                            try {
                                                const files = Array.from(e.target.files);
                                                console.log("Files selected:", files.map(f => f.name))

                                                for (const file of files) {
                                                    const formData = new FormData();
                                                    formData.append('file', file)

                                                    console.log(`Uploading ${file.name}...`)
                                                    const res = await fetch('/api/upload', { method: 'POST', body: formData })
                                                    const data = await res.json()
                                                    console.log("Upload response:", data)

                                                    if (!res.ok) {
                                                        alert(`Failed: ${file.name} - ${data.error}`)
                                                        continue;
                                                    }

                                                    const path = data.file_path
                                                    const memRes = await fetch('/api/memories', {
                                                        method: 'POST', body: JSON.stringify({
                                                            type: file.type.startsWith('video') ? 'video' : 'image',
                                                            file_path: path, title: 'New Memory', description: ''
                                                        })
                                                    })

                                                    if (!memRes.ok) {
                                                        const memData = await memRes.json()
                                                        alert(`Database Error: ${memData.error}`)
                                                        console.error("Memory creation failed:", memData)
                                                    }
                                                }
                                                // Refresh memories
                                                const m = await fetch('/api/memories').then(r => r.json());
                                                setMemories(m);
                                            } catch (err) {
                                                alert("Upload process encountered an error.")
                                                console.error("Upload error client-side:", err)
                                            } finally {
                                                setUploading(false)
                                                // Reset input to allow re-upload
                                                e.target.value = ''
                                            }
                                        }
                                    }} />
                                    {uploading ? 'Uploading...' : '+ Add Media'}
                                </label>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-4">
                                {memories.map(m => (
                                    <div key={m.id} className="relative group rounded-xl overflow-hidden border border-white/10 aspect-square">
                                        {m.file_path ? (
                                            m.type === 'video' ? (
                                                <video src={m.file_path} className="w-full h-full object-cover" />
                                            ) : (
                                                <img src={m.file_path} className="w-full h-full object-cover" />
                                            )
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-zinc-600 text-[10px]">No Media</div>
                                        )}
                                        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-3 text-center space-y-2">
                                            <input
                                                className="bg-transparent text-white text-[10px] text-center w-full border-b border-white/20 focus:border-pink-500 outline-none font-bold"
                                                value={m.title || ''}
                                                placeholder="Title"
                                                onChange={e => { const nm = memories.map(x => x.id === m.id ? { ...x, title: e.target.value } : x); setMemories(nm); }}
                                                onBlur={async () => await fetch('/api/memories', { method: 'PUT', body: JSON.stringify({ ...m, action: 'update' }) })}
                                            />
                                            <textarea
                                                className="bg-transparent text-white/70 text-[9px] text-center w-full border-b border-white/20 focus:border-pink-500 outline-none resize-none h-10"
                                                value={m.description || ''}
                                                placeholder="Write a moment..."
                                                onChange={e => { const nm = memories.map(x => x.id === m.id ? { ...x, description: e.target.value } : x); setMemories(nm); }}
                                                onBlur={async () => await fetch('/api/memories', { method: 'PUT', body: JSON.stringify({ ...m, action: 'update' }) })}
                                            />
                                            <button onClick={async () => { if (confirm('Delete this memory?')) { await fetch('/api/memories', { method: 'DELETE', body: JSON.stringify({ id: m.id }) }); setMemories(prev => prev.filter(x => x.id !== m.id)) } }} className="bg-red-500/20 text-red-500 p-2 rounded-full hover:bg-red-500 hover:text-white transition-colors"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Puzzle Image Preview */}
                        <section className="bg-zinc-900/30 p-4 rounded-3xl border border-white/5 space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2"><Camera className="w-4 h-4" /> Puzzle Piece</h3>
                            <div className="aspect-square bg-black rounded-2xl overflow-hidden border border-white/10 relative group flex items-center justify-center">
                                {localContent['puzzle_image_url'] ? (
                                    <img src={localContent['puzzle_image_url']} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-zinc-700 text-xs font-bold uppercase tracking-widest">No Image</span>
                                )}
                                <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity">
                                    <input type="file" className="hidden" onChange={async e => { const f = e.target.files?.[0]; if (f) { const p = await handleFileUpload(f); setLocalContent({ ...localContent, 'puzzle_image_url': p }) } }} />
                                    <Camera className="text-white w-8 h-8" />
                                </label>
                            </div>
                        </section>

                    </div>
                </div>

                {/* Bottom Bar: Full Width Actions */}
                <div className="pt-12 border-t border-white/5">
                    <button onClick={handleSave} className="w-full py-6 bg-gradient-to-r from-pink-600 to-purple-600 rounded-[2rem] text-xl font-black uppercase tracking-tighter shadow-2xl hover:scale-[1.01] transition-all active:scale-95 flex items-center justify-center gap-4">
                        <Save className="w-8 h-8" /> COMPLETE SYNC & LIVE UPDATE
                    </button>
                </div>
            </main>
        </div>
    )
}
