'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Unlock, Settings, Eye, EyeOff, Save, Trash2, CheckCircle, X, AlertTriangle, Camera, Music, Sparkles, MessageSquareHeart, Heart, Gift, Compass, Image as ImageIcon, PenTool, Printer } from 'lucide-react'

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
    scratch_prize_1: string;
    scratch_prompt_1: string;
    scratch_subtext_1: string;
    scratch_prize_2: string;
    scratch_prompt_2: string;
    scratch_subtext_2: string;
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
    card_message?: string;
    card_image_url?: string;
}

interface FeatureFlags {
    show_games: boolean;
    show_letter: boolean;
    show_gallery: boolean;
    show_wishes: boolean;
    show_media: boolean;
    show_puzzle: boolean;
    show_quiz: boolean;
    game_hearts: boolean;
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
    game_hearts: true,
    puzzle_difficulty: 4
}

import { useContent } from '@/context/ContentContext'
import { CMS_CATEGORIES } from '@/lib/cms-config'

export default function AdminPage() {
    const { content: globalContent, updateContent, refreshContent } = useContent()
    const [locked, setLocked] = useState(false) // UNLOCKED BY DEFAULT
    const [clickCount, setClickCount] = useState(0)
    const [password, setPassword] = useState('')

    // Local state for form editing (initialized from global)
    const [localContent, setLocalContent] = useState<Record<string, string>>({})
    const [isDirty, setIsDirty] = useState(false)

    // Sync global content to local state on load or if NO unsaved changes exist
    useEffect(() => {
        if (globalContent && !isDirty) {
            setLocalContent(prev => ({ ...prev, ...globalContent }))
        }
    }, [globalContent, isDirty])

    const [flags, setFlags] = useState<FeatureFlags>(DEFAULT_FLAGS)
    const [memories, setMemories] = useState<any[]>([])
    const [wishes, setWishes] = useState<any[]>([])
    const [wishboxWishes, setWishboxWishes] = useState<any[]>([])
    const [storyCards, setStoryCards] = useState<any[]>([])
    const [stats, setStats] = useState<any>({})
    const [proposalAnswer, setProposalAnswer] = useState<{ answer: string | null; created_at?: string } | null>(null)
    const [uploading, setUploading] = useState(false)
    const [newKey, setNewKey] = useState('')
    const [newValue, setNewValue] = useState('')

    const loadData = async () => {
        try {
            // 1. Refresh global content context
            await refreshContent()

            // 2. Fetch separate tables (memories, wishes, analytics, etc)
            const [memRes, wishRes, statsRes, storyRes, propRes] = await Promise.all([
                fetch('/api/memories').then(r => r.json()),
                fetch('/api/wishes?admin=true').then(r => r.json()),
                fetch('/api/analytics').then(r => r.json()),
                fetch('/api/love-story').then(r => r.json()),
                fetch('/api/proposal').then(r => r.json())
            ])

            if (Array.isArray(memRes)) setMemories(memRes)
            if (Array.isArray(wishRes)) setWishes(wishRes)
            if (statsRes) setStats(statsRes)
            if (Array.isArray(storyRes)) setStoryCards(storyRes)
            if (propRes) setProposalAnswer(propRes)
        } catch (e) {
            console.error("Critical Load Failure:", e)
        }
    }

    // Effect to handle flags sync from global content
    useEffect(() => {
        if (globalContent?.feature_flags && !isDirty) {
            try {
                setFlags(JSON.parse(globalContent.feature_flags))
            } catch (e) { console.error("Flag Parse Error", e) }
        }
    }, [globalContent, isDirty])

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

    const handleLocalChange = (key: string, value: string) => {
        setLocalContent(prev => ({ ...prev, [key]: value }))
        if (!isDirty) setIsDirty(true)
    }

    const handleFlagToggle = (key: keyof FeatureFlags) => {
        setFlags(prev => ({ ...prev, [key]: !prev[key] }))
        if (!isDirty) setIsDirty(true)
    }

    const handleSave = async () => {
        // Save everything in localContent
        const res = await fetch('/api/content', { method: 'POST', body: JSON.stringify(localContent), headers: { 'Content-Type': 'application/json' } })
        if (res.ok) {
            setIsDirty(false) // Allow sync again after save
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

    const handleDeleteProposal = async () => {
        if (confirm('Are you sure you want to clear this decision? This will allow a new one to be recorded.')) {
            const res = await fetch('/api/proposal', { method: 'DELETE' })
            if (res.ok) {
                setProposalAnswer(null)
            }
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
                    <Settings className="w-6 h-6 text-pink-500" /> CONTROL ROOM v2.5 <span className="text-[8px] text-zinc-600 bg-white/5 px-2 py-0.5 rounded-full ml-2">Build: 21Feb-1438</span>
                </h1>
                <div className="flex gap-4">
                    <button onClick={() => window.open('/gift?preview=true', '_blank')} className="bg-zinc-800 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest">Preview</button>
                    <button onClick={handleSave} className="bg-pink-600 px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest shadow-lg shadow-pink-500/20 flex items-center gap-2"><Save className="w-4 h-4" /> Save All</button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-6 md:p-12 space-y-12">
                {/* PROPOSAL RESULT - HIGH VISIBILITY */}
                {proposalAnswer?.answer && (
                    <motion.section
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-1 flex items-center justify-between rounded-[2rem] shadow-2xl ${proposalAnswer.answer === 'Yes' ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-rose-600'}`}
                    >
                        <div className="bg-black/20 backdrop-blur-md w-full m-1 p-8 rounded-[1.8rem] flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-xl ${proposalAnswer.answer === 'Yes' ? 'bg-green-500 shadow-green-500/50' : 'bg-red-500 shadow-red-500/50'}`}>
                                    {proposalAnswer.answer === 'Yes' ? <CheckCircle className="w-12 h-12 text-white" /> : <X className="w-12 h-12 text-white" />}
                                </div>
                                <div className="space-y-1">
                                    <h2 className="text-3xl font-black uppercase tracking-tighter">Secret Vault Decision</h2>
                                    <p className="text-zinc-400 text-sm font-bold uppercase tracking-widest">{proposalAnswer.created_at ? new Date(proposalAnswer.created_at).toLocaleString() : 'Just now'}</p>
                                </div>
                            </div>
                            <div className="text-right flex items-center gap-6">
                                <div>
                                    <p className="text-[10px] uppercase font-black tracking-[0.3em] mb-2 opacity-50">She chose:</p>
                                    <p className="text-7xl font-black italic tracking-tighter">{proposalAnswer.answer.toUpperCase()}!</p>
                                </div>
                                <button onClick={handleDeleteProposal} className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all group">
                                    <Trash2 className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </motion.section>
                )}

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
                                        onClick={() => handleFlagToggle(key as keyof FeatureFlags)}
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

                        {/* ADVANCED - JSON CONFIGS (Cake Only) */}
                        <section className="bg-indigo-900/10 p-8 rounded-3xl border border-indigo-500/20 space-y-8">
                            <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-400"><Compass /> Special Logic (JSON Data)</h2>
                            <div className="grid grid-cols-1">
                                <div><label className="text-[10px] text-zinc-500 uppercase font-black block mb-2">Digital Cake: Random Wishes List (JSON)</label><textarea className="w-full bg-black/40 border border-indigo-500/20 p-3 rounded-xl h-32 font-mono text-[10px]" value={localContent['cake_wishes'] || '[]'} onChange={e => handleLocalChange('cake_wishes', e.target.value)} /></div>
                            </div>
                        </section>


                        {/* GOD MODE TEXT REGISTRY */}
                        {/* DYNAMIC CMS EDITOR */}
                        {CMS_CATEGORIES.map(section => (
                            <section key={section.id} className="bg-zinc-900/30 p-8 rounded-3xl border border-white/5 space-y-6">
                                <h2 className="text-xl font-bold flex items-center gap-2 text-pink-400">
                                    <section.icon className="w-5 h-5" /> {section.title}
                                </h2>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {section.keys.map(field => (
                                        <div key={field.key} className={field.type === 'textarea' ? 'col-span-2' : ''}>
                                            <label className="text-[10px] text-zinc-500 uppercase font-black block mb-2">{field.label}</label>
                                            {field.type === 'textarea' ? (
                                                <textarea
                                                    className="w-full bg-black border border-white/10 p-3 rounded-xl h-32 focus:border-pink-500 outline-none text-sm leading-relaxed"
                                                    value={localContent[field.key] || ''}
                                                    onChange={e => handleLocalChange(field.key, e.target.value)}
                                                />
                                            ) : (
                                                <input
                                                    className="w-full bg-black border border-white/10 p-3 rounded-xl focus:border-pink-500 outline-none text-sm"
                                                    value={localContent[field.key] || ''}
                                                    onChange={e => handleLocalChange(field.key, e.target.value)}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        ))}


                        {/* Love Story Editor */}
                        <section className="bg-rose-900/10 p-8 rounded-3xl border border-rose-500/20 space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold flex items-center gap-2 text-rose-400"><Heart className="w-5 h-5" /> Love Story Editor</h2>
                                <button onClick={() => {
                                    const newStory = { title: "New Chapter", subtitle: "DATE", description: "Write your story...", icon: 'heart', order_index: storyCards.length }
                                    fetch('/api/love-story', { method: 'POST', body: JSON.stringify(newStory), headers: { 'Content-Type': 'application/json' } })
                                        .then(() => fetch('/api/love-story').then(r => r.json()).then(setStoryCards))
                                }} className="bg-rose-600 px-3 py-1.5 rounded-lg text-xs font-bold uppercase hover:bg-rose-500">+ Add Card</button>
                            </div>

                            <div className="grid gap-4">
                                {storyCards.map((card, i) => (
                                    <div key={card.id} className="bg-black/40 p-4 rounded-2xl border border-rose-500/10 flex gap-4 items-start group">
                                        <div className="text-2xl pt-1 select-none">{card.order_index + 1}</div>
                                        <div className="flex-1 space-y-2">
                                            <div className="flex gap-2">
                                                <input className="bg-transparent border-b border-rose-500/30 w-1/3 text-xs font-black uppercase text-rose-400 focus:border-rose-500 outline-none" value={card.subtitle} onChange={e => {
                                                    const updated = storyCards.map(c => c.id === card.id ? { ...c, subtitle: e.target.value } : c);
                                                    setStoryCards(updated);
                                                }} placeholder="SUBTITLE (e.g. 2023)" />
                                                <input className="bg-transparent border-b border-white/10 w-2/3 font-bold focus:border-rose-500 outline-none" value={card.title} onChange={e => {
                                                    const updated = storyCards.map(c => c.id === card.id ? { ...c, title: e.target.value } : c);
                                                    setStoryCards(updated);
                                                }} placeholder="Title" />
                                            </div>
                                            <textarea className="w-full bg-transparent text-sm text-zinc-400 resize-none h-16 border-b border-white/5 focus:border-rose-500 outline-none" value={card.description} onChange={e => {
                                                const updated = storyCards.map(c => c.id === card.id ? { ...c, description: e.target.value } : c);
                                                setStoryCards(updated);
                                            }} placeholder="Story description..." />
                                            <div className="flex justify-between items-center text-[10px] text-zinc-600">
                                                <select className="bg-black border border-white/10 rounded p-1" value={card.icon} onChange={e => {
                                                    const updated = storyCards.map(c => c.id === card.id ? { ...c, icon: e.target.value } : c);
                                                    setStoryCards(updated);
                                                }}>
                                                    <option value="sparkles">Sparkles</option>
                                                    <option value="heart">Heart</option>
                                                    <option value="ring">Ring</option>
                                                    <option value="rocket">Rocket</option>
                                                    <option value="message">Message</option>
                                                </select>
                                                <div className="space-x-2">
                                                    <button onClick={() => fetch('/api/love-story', { method: 'PUT', body: JSON.stringify(card), headers: { 'Content-Type': 'application/json' } }).then(() => alert('Saved!'))} className="bg-green-600/20 text-green-500 px-2 py-1 rounded hover:bg-green-600 hover:text-white transition">Save</button>
                                                    <button onClick={() => { if (confirm('Delete?')) fetch('/api/love-story', { method: 'DELETE', body: JSON.stringify({ id: card.id }), headers: { 'Content-Type': 'application/json' } }).then(() => setStoryCards(p => p.filter(x => x.id !== card.id))) }} className="text-red-500 hover:text-white hover:bg-red-500 px-2 py-1 rounded transition">Delete</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
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
                                        <input type="file" className="hidden" accept="audio/*" onChange={async e => { const f = e.target.files?.[0]; if (f) { const p = await handleFileUpload(f); handleLocalChange('intro_audio_url', p) } }} />
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
                                        <input type="file" className="hidden" accept="audio/*" onChange={async e => { const f = e.target.files?.[0]; if (f) { const p = await handleFileUpload(f); handleLocalChange('favorite_song_url', p) } }} />
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
                                        <input type="file" className="hidden" accept="audio/*" onChange={async e => { const f = e.target.files?.[0]; if (f) { const p = await handleFileUpload(f); handleLocalChange('voice_url', p) } }} />
                                    </label>
                                </div>
                                {localContent['voice_url'] && (
                                    <audio controls src={localContent['voice_url']} className="w-full h-8 opacity-50 hover:opacity-100 transition-opacity" />
                                )}
                            </div>
                        </section>

                        {/* Recent Wishes (Guestbook) */}
                        <section className="bg-zinc-900/30 rounded-3xl border border-white/5 overflow-hidden flex flex-col h-[400px]">
                            <div className="p-4 bg-white/5 border-b border-white/5 flex justify-between items-center"><h3 className="font-bold text-xs uppercase tracking-widest">Guest Wishes</h3><span className="text-[10px] text-zinc-500">{wishes.length}</span></div>
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
                                    <input type="file" className="hidden" onChange={async e => { const f = e.target.files?.[0]; if (f) { const p = await handleFileUpload(f); handleLocalChange('puzzle_image_url', p) } }} />
                                    <Camera className="text-white w-8 h-8" />
                                </label>
                            </div>
                        </section>

                        {/* Printable Card Image Preview */}
                        <section className="bg-zinc-900/30 p-4 rounded-3xl border border-white/5 space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2"><ImageIcon className="w-4 h-4" /> Printable Card Photo</h3>
                            <div className="aspect-square bg-black rounded-2xl overflow-hidden border border-white/10 relative group flex items-center justify-center">
                                {localContent['card_image_url'] ? (
                                    <img src={localContent['card_image_url']} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-zinc-700 text-xs font-bold uppercase tracking-widest">No Card Image</span>
                                )}
                                <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity">
                                    <input type="file" className="hidden" onChange={async e => { const f = e.target.files?.[0]; if (f) { const p = await handleFileUpload(f); handleLocalChange('card_image_url', p) } }} />
                                    <PenTool className="text-white w-8 h-8" />
                                    <span className="text-white text-[10px] uppercase font-bold mt-2">Update Card Photo</span>
                                </label>
                            </div>
                        </section>

                    </div>
                </div >

                {/* Bottom Bar: Full Width Actions */}
                < div className="pt-12 border-t border-white/5" >
                    <button onClick={handleSave} className="w-full py-6 bg-gradient-to-r from-pink-600 to-purple-600 rounded-[2rem] text-xl font-black uppercase tracking-tighter shadow-2xl hover:scale-[1.01] transition-all active:scale-95 flex items-center justify-center gap-4">
                        <Save className="w-8 h-8" /> COMPLETE SYNC & LIVE UPDATE
                    </button>
                </div >
            </main >
        </div >
    )
}
