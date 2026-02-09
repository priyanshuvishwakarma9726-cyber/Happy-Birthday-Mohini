'use client'

import { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, BakeShadows, MeshDistortMaterial, Stars, Sparkles } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'
import { Heart, Music, Sparkle } from 'lucide-react'
import confetti from 'canvas-confetti'

const DEFAULT_HINGLISH = [
    "Duniya ki har khushie tumhare kadmon mein ho... ❤️",
    "Ye gulab kabhi nahi murjhayega, bilkul mere pyaar ki tarah.",
    "Tumhari haseen muskurahat hi meri asli jannat hai.",
    "Hamesha mere saath rehna, meri jaan.",
    "Har pal tumhari yaad dil mein basi rehti hai."
]

const DEFAULT_SECRET = [
    "You are the best thing that ever happened to me. ❤️",
    "I'll love you until the last petal falls (and these never will).",
    "Mohini + My Heart = Forever.",
    "Every beat of my heart whispers your name."
]

function Petal({ bloomLevel, ...props }: any) {
    return (
        <mesh {...props}>
            <sphereGeometry args={[0.3, 32, 32]} />
            <MeshDistortMaterial
                color="#fb7185"
                emissive="#fb7185"
                emissiveIntensity={props.isNight ? 0.6 : 0.2}
                distort={0.4}
                speed={2}
                roughness={0}
            />
        </mesh>
    )
}

function RoseCluster({ bloomLevel, isNight }: { bloomLevel: number, isNight: boolean }) {
    const group = useRef<THREE.Group>(null)
    const centerRef = useRef<THREE.Mesh>(null)

    useFrame((state) => {
        const time = state.clock.getElapsedTime()
        if (group.current) {
            // Heartbeat Pulse Animation
            const pulse = 1 + Math.sin(time * 3) * 0.05 // Pulses roughly at 60-80 bpm
            group.current.scale.set(pulse, pulse, pulse)
            group.current.rotation.y = time * 0.2
        }
    })

    return (
        <group ref={group}>
            {/* Center Core */}
            <mesh ref={centerRef} position={[0, 0, 0]} scale={0.5 + bloomLevel * 0.5}>
                <sphereGeometry args={[0.2, 32, 32]} />
                <meshStandardMaterial
                    color="#ec4899"
                    emissive="#ec4899"
                    emissiveIntensity={isNight ? 1.5 : 0.5}
                />
            </mesh>

            {/* Inner Petals - Expand based on bloomLevel */}
            {[...Array(6)].map((_, i) => (
                <Petal
                    key={i}
                    isNight={isNight}
                    position={[
                        Math.cos(i * 1.05) * (0.1 + bloomLevel * 0.3),
                        Math.sin(i * 1.05) * (0.1 + bloomLevel * 0.3),
                        0
                    ]}
                    rotation={[0, 0, i * 1.05]}
                    scale={(0.4 + bloomLevel * 0.6) * (0.8 + Math.random() * 0.2)}
                />
            ))}

            {/* Outer Petals - More spread in daytime/high bloom */}
            {[...Array(8)].map((_, i) => (
                <Petal
                    key={`outer-${i}`}
                    isNight={isNight}
                    position={[
                        Math.cos(i * 0.78) * (0.2 + bloomLevel * 0.5),
                        Math.sin(i * 0.78) * (0.2 + bloomLevel * 0.5),
                        0.2
                    ]}
                    rotation={[0.2, 0, i * 0.78]}
                    scale={0.6 + bloomLevel * 0.8}
                />
            ))}

            {/* Stem */}
            <mesh position={[0, -2, 0]}>
                <cylinderGeometry args={[0.05, 0.05, 4, 32]} />
                <meshStandardMaterial color={isNight ? "#064e3b" : "#22c55e"} />
            </mesh>
        </group>
    )
}

export default function BloomingRose({ content }: { content?: any }) {
    const hinglishMessages = content?.love_messages ? JSON.parse(content.love_messages) : DEFAULT_HINGLISH
    const secretMessages = content?.long_letter_title ? [content.long_letter_title] : DEFAULT_SECRET
    const [bloomLevel, setBloomLevel] = useState(0.5)
    const [isNight, setIsNight] = useState(false)
    const [petalsFallen, setPetalsFallen] = useState(0)
    const [currentLine, setCurrentLine] = useState("")
    const [secretRevealed, setSecretRevealed] = useState(false)
    const [holdProgress, setHoldProgress] = useState(0)
    const holdTimer = useRef<any>(null)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    useEffect(() => {
        const hour = new Date().getHours()
        // Morning (6-12): Budish (0.3-0.6)
        // Afternoon (12-18): Full Bloom (0.9-1.0)
        // Night (18-6): Glowing Full (0.8)
        if (hour >= 6 && hour < 11) setBloomLevel(0.4)
        else if (hour >= 11 && hour < 18) setBloomLevel(1.0)
        else setBloomLevel(0.8)

        setIsNight(hour >= 18 || hour < 6)

        // Infinite Petal interval
        const interval = setInterval(() => {
            setPetalsFallen(p => p + 1)
        }, 5000)

        // Preload whisper audio if needed - using a placeholder for now
        // audioRef.current = new Audio('path_to_whisper.mp3')

        return () => clearInterval(interval)
    }, [])

    const handleInteraction = () => {
        // Petal fall effect
        setPetalsFallen(p => p + 1)

        // Random Line
        const randomLine = hinglishMessages[Math.floor(Math.random() * hinglishMessages.length)]
        setCurrentLine(randomLine)
        setTimeout(() => setCurrentLine(""), 3000)

        // Confetti Hearts
        confetti({
            particleCount: 15,
            spread: 40,
            origin: { y: 0.7 },
            colors: ['#f43f5e', '#ec4899', '#fb7185'],
            shapes: ['circle']
        })
    }

    const startHold = () => {
        let progress = 0
        holdTimer.current = setInterval(() => {
            progress += 5
            setHoldProgress(progress)
            if (progress >= 100) {
                clearInterval(holdTimer.current)
                setSecretRevealed(true)
                confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } })
            }
        }, 150)
    }

    const endHold = () => {
        clearInterval(holdTimer.current)
        if (!secretRevealed) setHoldProgress(0)
    }


    return (
        <div
            className={`h-[600px] w-full relative overflow-hidden rounded-[3rem] border border-white/10 shadow-2xl transition-colors duration-1000 ${isNight ? 'bg-zinc-950' : 'bg-gradient-to-b from-zinc-900 to-black'}`}
            onMouseDown={startHold}
            onMouseUp={endHold}
            onTouchStart={startHold}
            onTouchEnd={endHold}
            onClick={handleInteraction}
        >
            {/* Header Content */}
            <div className="absolute top-10 left-0 right-0 z-20 text-center space-y-2 pointer-events-none px-6">
                <motion.h3
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl md:text-4xl font-black italic text-pink-300 drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]"
                >
                    A Rose That Never Fades… 🌹
                </motion.h3>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.3em]">
                    {isNight ? "Night Bloom Mode: On ✨" : "Sunlight Symbiosis Active ☀️"}
                </p>
            </div>


            {/* Interaction Feedback: Hinglish Line */}
            <AnimatePresence>
                {currentLine && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: -20 }}
                        className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 bg-black/60 backdrop-blur-xl px-8 py-4 rounded-2xl border border-pink-500/30 text-pink-100 font-serif italic text-lg text-center max-w-[80%]"
                    >
                        "{currentLine}"
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hold Progress Bar */}
            {holdProgress > 0 && !secretRevealed && (
                <div className="absolute inset-x-20 bottom-10 h-1.5 bg-white/5 rounded-full z-30 overflow-hidden">
                    <motion.div
                        className="h-full bg-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.8)]"
                        initial={{ width: 0 }}
                        animate={{ width: `${holdProgress}%` }}
                    />
                    <p className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-black text-pink-400 uppercase tracking-widest whitespace-nowrap">Keep holding for a secret...</p>
                </div>
            )}

            {/* Secret Message Overlay */}
            <AnimatePresence>
                {secretRevealed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 z-[40] bg-black/80 backdrop-blur-2xl flex flex-col items-center justify-center p-10 text-center space-y-8"
                    >
                        <Heart className="w-16 h-16 text-pink-500 fill-pink-500 animate-bounce" />
                        <h4 className="text-3xl md:text-5xl font-black italic text-white tracking-tighter">
                            {secretMessages[Math.floor(Math.random() * secretMessages.length)]}
                        </h4>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setSecretRevealed(false);
                                setHoldProgress(0);
                            }}
                            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-8 py-3 rounded-full text-sm font-bold uppercase tracking-widest transition-colors"
                        >
                            Back to the Rose
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 3D Rose Canvas */}
            <Canvas camera={{ position: [0, 0, 5], fov: 40 }} dpr={[1, 2]}>
                <ambientLight intensity={isNight ? 0.3 : 0.6} />
                <pointLight position={[10, 10, 10]} intensity={1.5} color={isNight ? "#c084fc" : "#fcd34d"} />
                <pointLight position={[-10, 10, -10]} intensity={0.5} color="#ec4899" />

                {isNight ? (
                    <>
                        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                        <Sparkles count={50} scale={5} size={2} speed={0.4} color="#f472b6" />
                    </>
                ) : (
                    <Sparkles count={30} scale={4} size={3} speed={0.2} color="#fbbf24" opacity={0.3} />
                )}

                <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                    <RoseCluster bloomLevel={bloomLevel} isNight={isNight} />
                </Float>

                <BakeShadows />
            </Canvas>

            {/* Footer Stats & Interactions */}
            <div className="absolute bottom-8 left-10 z-20 flex flex-col items-start gap-1 pointer-events-none">
                <div className="flex items-center gap-2 text-zinc-500 font-bold uppercase tracking-[0.2em] text-[10px]">
                    <Heart className="w-3 h-3 text-pink-600 fill-pink-600" />
                    <span>Petals fallen: ∞</span>
                </div>
                <p className="text-zinc-700 text-[8px] uppercase tracking-widest font-black">Symbolizing Endless Love</p>
            </div>

            <div className="absolute bottom-8 right-10 z-20 text-right pointer-events-none">
                <p className="text-zinc-600 text-[9px] uppercase tracking-widest font-black flex items-center gap-1 justify-end">
                    Tap to bloom petals <Sparkle className="w-2 h-2" />
                </p>
                <p className="text-zinc-700 text-[8px] font-bold">Hold for heart secrets</p>
            </div>
        </div>
    )
}
