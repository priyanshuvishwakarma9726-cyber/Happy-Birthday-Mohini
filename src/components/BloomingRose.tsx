'use client'

import { renderEmojiText } from '@/lib/emoji-helper'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Gift, AlertTriangle, Terminal, XCircle, HeartPulse, RefreshCw, ScanFace, Lock, Trash2 } from 'lucide-react'
import confetti from 'canvas-confetti'

export default function BloomingRose({ content }: { content?: any }) {
    // Stage 0: Dodging Button (Extremely annoying)
    // Stage 1: Fake Face ID Scan
    // Stage 2: Embarrassing Security Typo
    // Stage 3: Fake Phone Formatting
    // Stage 4: Apology
    const [stage, setStage] = useState(0)
    const [isNight, setIsNight] = useState(true)

    // Stage 0: Dodging
    const [dodgeCount, setDodgeCount] = useState(0)
    const [buttonPos, setButtonPos] = useState({ x: 0, y: 0 })

    // Stage 1: Face Scan
    const [scanProgress, setScanProgress] = useState(0)
    const [scanFailed, setScanFailed] = useState(false)

    // Stage 2: Security Question
    const [inputText, setInputText] = useState("")
    const [inputError, setInputError] = useState("")
    const requiredText = "Me Priyanshu ki har baat manungi Promise "

    // Stage 3: Fake Deletion
    const [terminalLines, setTerminalLines] = useState<string[]>([])
    const terminalRef = useRef<HTMLDivElement>(null)
    const [deletionComplete, setDeletionComplete] = useState(false)

    // Stage 4: Apology
    const [aiApology, setAiApology] = useState("")

    useEffect(() => {
        const hour = new Date().getHours()
        setIsNight(hour >= 18 || hour < 6)
    }, [])

    // === STAGE 0 LOGIC ===
    const handleMouseNear = () => {
        if (stage !== 0) return
        if (dodgeCount < 8) { // Gotta chase it 8 times!
            const randomX = (Math.random() - 0.5) * 250 // Moves further
            const randomY = (Math.random() - 0.5) * 200
            setButtonPos({ x: randomX, y: randomY })
            setDodgeCount(prev => prev + 1)
        }
    }

    const handleStage0Click = () => {
        if (dodgeCount >= 8) {
            setStage(1)
            startFaceScan()
        }
    }

    // === STAGE 1 LOGIC ===
    const startFaceScan = () => {
        let p = 0
        setScanFailed(false)
        const int = setInterval(() => {
            p += 10
            setScanProgress(p)
            if (p >= 100) {
                clearInterval(int)
                setScanFailed(true)
            }
        }, 300)
    }

    const proceedToStage2 = () => {
        setStage(2)
    }

    // === STAGE 2 LOGIC ===
    const checkSecurity = (e: React.FormEvent) => {
        e.preventDefault()
        if (inputText.toLowerCase().trim() === requiredText.toLowerCase()) {
            setStage(3)
            startFakeDeletion()
        } else {
            setInputError(`Galat! Exact ye type karo: "${requiredText}" 😂`)
            // Vibrate effect
            setTimeout(() => setInputError(""), 3000)
        }
    }

    // === STAGE 3 LOGIC ===
    const startFakeDeletion = () => {
        setTerminalLines(["[SYSTEM] Connecting to Mohini's phone...", "[SYSTEM] Root access granted."])
        let step = 0
        const logs = [
            "Scanning Myntra Wishlist... 🛍️ FAILED! Too much data.",
            "Analyzing 'Nakhre' folder... 💅 WARNING: Extremely high levels.",
            "Deleting boring Instagram Reels... 🎬 20%",
            "Deleting Whatsapp chats (except mine)... 💬 50%",
            "Formatting useless gallery screenshots... 📸 80%",
            "Bypassing security... 🛡️ Done.",
            "Sending money from her bank to boyfriend... 💸 Processing...",
            "SUCCESS! Bank balance is now 0. 🥳",
            "ERROR: Gift protocol corrupted. ⚠️ Attempting manual override..."
        ]

        const interval = setInterval(() => {
            if (step < logs.length) {
                const currentLog = logs[step]; // Capture synchronously!
                setTerminalLines(prev => [...prev, currentLog])
                step++
                if (terminalRef.current) {
                    terminalRef.current.scrollTop = terminalRef.current.scrollHeight
                }
            } else {
                clearInterval(interval)
                setTimeout(() => setDeletionComplete(true), 1500)
            }
        }, 800)
    }

    // === STAGE 4 LOGIC ===
    const fetchApology = async () => {
        setStage(4)
        confetti({ particleCount: 200, spread: 120, origin: { y: 0.4 }, colors: ['#f43f5e', '#a855f7', '#ec4899', '#fbbf24'] })

        try {
            const res = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: "Say sorry after annoying prank", type: "prank_apology" })
            })
            const data = await res.json()
            if (data.result) setAiApology(data.result.replace(/["']/g, ''))
            else setAiApology("Acha baba sorry! Majak kar raha tha pagal, tumhe preshan kiye bina mera din thodi nikalta hai! 😂 Love you endlessly! ❤️💖")
        } catch {
            setAiApology("Acha baba sorry! Majak kar raha tha pagal! Meri favourite timepass ho tum! 😂 Love you always! ❤️")
        }
    }

    const handleReset = () => {
        setStage(0)
        setDodgeCount(0)
        setButtonPos({ x: 0, y: 0 })
        setScanProgress(0)
        setScanFailed(false)
        setInputText("")
        setTerminalLines([])
        setDeletionComplete(false)
        setAiApology("")
    }

    // Get taunt for stage 0
    const getDodgeTaunt = () => {
        if (dodgeCount === 0) return "Click me to see magic! ✨"
        if (dodgeCount < 3) return "Arey idhar dhyan do! 😂"
        if (dodgeCount < 6) return "Thoda aur fast! 🐢"
        if (dodgeCount < 8) return "Ek aakhri baar try karo! 😜"
        return "Thak gayi kya? Chal click karle! 😎"
    }

    return (
        <div className={`w-full relative overflow-hidden rounded-[3rem] border shadow-2xl transition-colors duration-1000 min-h-[500px] flex flex-col justify-center items-center ${isNight ? 'bg-zinc-950 border-white/5' : 'bg-gradient-to-b from-zinc-900 to-black border-white/10'
            }`}>
            {/* Annoying Red Flash in Stage 3 */}
            {stage === 3 && (
                <motion.div animate={{ opacity: [0, 0.3, 0] }} transition={{ repeat: Infinity, duration: 0.5 }} className="absolute inset-0 bg-red-600 z-0 pointer-events-none" />
            )}

            <div className="relative z-10 p-8 w-full max-w-lg mb-10 w-full">
                <AnimatePresence mode="wait">

                    {/* STAGE 0: DODGING BUTTON */}
                    {stage === 0 && (
                        <motion.div
                            key="s0"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex flex-col flex-1 min-h-[400px] items-center justify-center space-y-12"
                        >
                            <div className="text-center space-y-4">
                                <h3 className="text-4xl font-black text-pink-400">{renderEmojiText("Claim Your Gift! 🎁")}</h3>
                                <p className="text-zinc-500 font-bold uppercase tracking-widest">{renderEmojiText(getDodgeTaunt())}</p>
                            </div>

                            <div className="relative w-full h-[250px] flex items-center justify-center">
                                <motion.div
                                    animate={{ x: buttonPos.x, y: buttonPos.y }}
                                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                                    className="absolute"
                                    onHoverStart={handleMouseNear}
                                    onTouchStart={handleMouseNear}
                                >
                                    <button
                                        onClick={handleStage0Click}
                                        className={`px-8 py-5 rounded-full font-black text-white shadow-xl shadow-pink-500/30 flex items-center gap-2 z-20 transition-all ${dodgeCount >= 8 ? 'bg-green-500 hover:scale-105 shadow-green-500/50' : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:scale-105'}`}
                                    >
                                        <Gift className="w-5 h-5" />
                                        {dodgeCount >= 8 ? renderEmojiText("Thik h ab click karlo 🙄") : "Apna Gift Kholo"}
                                    </button>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}

                    {/* STAGE 1: FAKE FACE SCAN */}
                    {stage === 1 && (
                        <motion.div
                            key="s1"
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-black border border-zinc-800 p-8 rounded-3xl shadow-2xl flex flex-col items-center justify-center space-y-8"
                        >
                            <div className="relative w-32 h-32 flex items-center justify-center">
                                <ScanFace className={`w-16 h-16 ${scanFailed ? 'text-red-500' : 'text-blue-500'}`} />
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className={`absolute inset-0 border-2 border-dashed rounded-full ${scanFailed ? 'border-red-500' : 'border-blue-500 opacity-50'}`}
                                />
                                {!scanFailed && (
                                    <motion.div
                                        animate={{ top: ['0%', '100%', '0%'] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                        className="absolute left-0 right-0 h-1 bg-blue-400/80 shadow-[0_0_10px_#60a5fa] rounded-full z-10"
                                    />
                                )}
                            </div>

                            <div className="text-center w-full space-y-4">
                                <h4 className="font-mono font-bold text-xl text-white select-none">{renderEmojiText("Face ID Authentication 👤 🛡️")}</h4>
                                <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                                    <div className={`h-full transition-all duration-300 ${scanFailed ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${scanProgress}%` }} />
                                </div>
                                <div className={`font-mono text-sm h-12 flex flex-row flex-wrap items-center justify-center gap-1 px-4 ${scanFailed ? 'text-red-400 font-bold' : 'text-blue-400'}`}>
                                    {scanFailed ? (
                                        renderEmojiText("ERROR: Too much 'Nakhre' & 'Ego' detected! 😤 🚫 💅")
                                    ) : (
                                        renderEmojiText("Scanning innocence... 🔍 😇")
                                    )}
                                </div>
                            </div>

                            {scanFailed && (
                                <button
                                    onClick={proceedToStage2}
                                    className="bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs p-3 rounded-lg flex items-center gap-2 uppercase tracking-widest"
                                >
                                    <Lock className="w-4 h-4" /> Use Manual Password
                                </button>
                            )}
                        </motion.div>
                    )}

                    {/* STAGE 2: MANUAL EMBARRASSING PASSWORD */}
                    {stage === 2 && (
                        <motion.div
                            key="s2"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="bg-black/80 backdrop-blur-md border border-pink-500/30 p-8 rounded-3xl shadow-[0_0_30px_rgba(236,72,153,0.1)] text-center space-y-6"
                        >
                            <Lock className="w-12 h-12 text-pink-500 mx-auto" />
                            <h4 className="text-xl font-black text-white">Security Verification Phase</h4>
                            <p className="text-zinc-400 text-sm">Face ID failed. Please type the exact secret pledge to prove it's you.</p>

                            <div className="bg-pink-950/30 p-4 rounded-xl border border-pink-500/20 text-pink-300 font-mono text-sm italic">
                                "{requiredText}"
                            </div>

                            <form onSubmit={checkSecurity} className="space-y-4">
                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    placeholder="Type exactly here..."
                                    className={`w-full bg-zinc-900 text-white px-4 py-4 rounded-xl border focus:outline-none transition-colors ${inputError ? 'border-red-500' : 'border-zinc-700 focus:border-pink-500'}`}
                                />
                                {inputError && <p className="text-red-400 text-xs font-bold animate-bounce">{renderEmojiText(inputError)}</p>}
                                <button type="submit" className="w-full bg-pink-600 hover:bg-pink-500 text-white font-black py-4 rounded-xl shadow-lg transition-colors">
                                    {renderEmojiText("Verify 🙄")}
                                </button>
                            </form>
                        </motion.div>
                    )}

                    {/* STAGE 3: FAKE HACK / DELETION */}
                    {stage === 3 && (
                        <motion.div
                            key="s3"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="w-full bg-zinc-950 border-2 border-red-500/50 rounded-2xl overflow-hidden font-mono shadow-[0_0_50px_rgba(220,38,38,0.3)] shadow-red-500/20"
                        >
                            <div className="bg-red-950/80 px-4 py-2 flex items-center justify-between border-b border-red-500/30">
                                <div className="flex items-center gap-2 text-red-500 text-xs font-bold uppercase tracking-widest">
                                    <Terminal className="w-4 h-4" /> root@mohini_phone:~
                                </div>
                            </div>

                            <div ref={terminalRef} className="p-4 h-[250px] overflow-y-auto space-y-2 text-xs text-red-400 md:text-sm scroll-smooth bg-black/50">
                                {terminalLines.map((line, idx) => (
                                    <div key={idx} className={(line || "").includes("ERROR") || (line || "").includes("WARNING") ? 'font-bold' : ''}>
                                        <span className="text-green-500 mr-2 border-r border-green-500/20 pr-1">&gt;</span>
                                        {renderEmojiText(line)}
                                    </div>
                                ))}
                                {!deletionComplete && (
                                    <div className="animate-pulse"><span className="text-green-500 mr-2">&gt;</span>_</div>
                                )}
                            </div>

                            <div className="p-4 border-t border-red-500/30 bg-black flex justify-center h-20">
                                <AnimatePresence>
                                    {deletionComplete && (
                                        <motion.button
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            onClick={fetchApology}
                                            className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-lg font-black tracking-widest flex items-center gap-2 animate-bounce w-full justify-center shadow-lg shadow-red-500/30"
                                        >
                                            <Trash2 className="w-5 h-5" /> STOP DELETION PROCESS!
                                        </motion.button>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    )}

                    {/* STAGE 4: SWEET APOLOGY */}
                    {stage === 4 && (
                        <motion.div
                            key="s4"
                            initial={{ opacity: 0, scale: 0.5, rotate: -3 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            className="bg-gradient-to-br from-pink-500/10 to-rose-500/20 border border-pink-500/30 p-8 md:p-10 rounded-[2.5rem] text-center space-y-8 backdrop-blur-xl shadow-2xl relative"
                        >
                            <motion.div
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="mx-auto bg-gradient-to-tr from-rose-500 to-pink-500 text-white w-20 h-20 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(244,63,94,0.4)]"
                            >
                                <HeartPulse className="w-10 h-10" />
                            </motion.div>

                            <h3 className="text-3xl font-black text-rose-300 mt-6 tracking-tighter">{renderEmojiText("PRANK COMPLETED! 😂")}</h3>

                            {aiApology ? (
                                <div className="relative">
                                    <span className="absolute -top-4 -left-2 text-4xl text-pink-500/20">"</span>
                                    <p className="text-lg md:text-xl font-serif leading-relaxed italic text-pink-100 z-10 relative px-4">
                                        {renderEmojiText(aiApology)}
                                    </p>
                                    <span className="absolute -bottom-6 -right-2 text-4xl text-pink-500/20">"</span>
                                </div>
                            ) : (
                                <p className="text-pink-400 font-mono text-xs uppercase tracking-widest animate-pulse">{renderEmojiText("Loading lots of love... 🥺")}</p>
                            )}

                            <div className="pt-6 border-t border-pink-500/20">
                                <button
                                    onClick={handleReset}
                                    className="mx-auto flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-zinc-500 hover:text-pink-400 transition-colors"
                                >
                                    <RefreshCw className="w-4 h-4" /> Reset The Prank
                                </button>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    )
}
