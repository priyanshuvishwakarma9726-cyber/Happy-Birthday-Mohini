'use client'

import React, { useRef, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Download, RefreshCw, Stars, Heart, CheckCircle2, Loader2, Sparkles, X, AlertCircle } from 'lucide-react'
import confetti from 'canvas-confetti'

const OVERLAYS = [
    { id: 0, name: "Normal", icon: "✨" },
    { id: 1, name: "Valentine", icon: "❤️" },
    { id: 2, name: "Birthday", icon: "🎉" },
    { id: 3, name: "Magic Dust", icon: "🌟" }
]

export default function ARPhotoBooth({ onUploadSuccess }: { onUploadSuccess?: (newPhoto: { file_path: string, id?: number }) => void }) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [stream, setStream] = useState<MediaStream | null>(null)
    const [capturedImage, setCapturedImage] = useState<string | null>(null)
    const [currentOverlay, setCurrentOverlay] = useState(0)
    const [isCapturing, setIsCapturing] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadSuccess, setUploadSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isCameraActive, setIsCameraActive] = useState(false)

    // Start Camera with maximum compatibility
    const startCamera = async () => {
        setError(null)
        setIsCameraActive(false)

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            setError("Your browser doesn't support camera access. 🥺")
            return
        }

        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: "user",
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                },
                audio: false
            })

            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream
                // Crucial for iOS/Safari
                videoRef.current.setAttribute('playsinline', 'true')
                videoRef.current.setAttribute('autoplay', 'true')
                videoRef.current.setAttribute('muted', 'true')

                // Wait for video to be actually playing
                videoRef.current.onloadedmetadata = async () => {
                    try {
                        await videoRef.current?.play()
                        setIsCameraActive(true)
                        setStream(mediaStream)
                    } catch (e) {
                        console.error("Play failed", e)
                        setError("Camera ready but failed to play. Tap to retry.")
                    }
                }
            }
        } catch (err: any) {
            console.error("Camera access error:", err)
            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                setError("Camera access was denied. Please allow it in settings! 🎥")
            } else {
                setError("Could not start camera. Please refresh and try again.")
            }
        }
    }

    const stopCamera = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop())
            setStream(null)
            setIsCameraActive(false)
        }
    }, [stream])

    // Effect to handle initial start or cleanup
    useEffect(() => {
        return () => stopCamera()
    }, [stopCamera])

    const takePhoto = () => {
        const video = videoRef.current
        const canvas = canvasRef.current
        if (!video || !canvas) return

        setIsCapturing(true)
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Use high-res video dimensions for the capture
        canvas.width = video.videoWidth || 1280
        canvas.height = video.videoHeight || 720

        // 1. Draw Video Frame (Mirrored)
        ctx.save()
        ctx.translate(canvas.width, 0)
        ctx.scale(-1, 1)
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        ctx.restore()

        // 2. Draw Overlays onto the canvas
        drawOverlaysOnCanvas(ctx, canvas.width, canvas.height, currentOverlay)

        const dataUrl = canvas.toDataURL('image/jpeg', 0.9)
        setCapturedImage(dataUrl)
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } })
        stopCamera()
        setIsCapturing(false)
    }

    const drawOverlaysOnCanvas = (ctx: CanvasRenderingContext2D, w: number, h: number, type: number) => {
        if (type === 1) { // Love Frame
            ctx.strokeStyle = '#ec4899'
            ctx.lineWidth = w * 0.05
            ctx.strokeRect(0, 0, w, h)
            ctx.fillStyle = "#ec4899"
            ctx.font = `bold ${w * 0.04}px Arial`
            ctx.textAlign = "center"
            ctx.fillText("❤️ HAPPY BIRTHDAY ❤️", w / 2, h * 0.08)
        } else if (type === 2) { // Party
            ctx.fillStyle = "rgba(250, 204, 21, 0.2)"
            ctx.fillRect(0, 0, w, h)
            ctx.font = `${w * 0.1}px Arial`
            ctx.fillText("🎂", w * 0.1, h * 0.2)
            ctx.fillText("🎉", w * 0.8, h * 0.2)
            ctx.fillText("✨", w * 0.1, h * 0.9)
            ctx.fillText("🎁", w * 0.8, h * 0.9)
        } else if (type === 3) { // Glow
            const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w)
            grad.addColorStop(0, 'rgba(236, 72, 153, 0)')
            grad.addColorStop(1, 'rgba(236, 72, 153, 0.3)')
            ctx.fillStyle = grad
            ctx.fillRect(0, 0, w, h)
        }
    }

    const handleUpload = async () => {
        if (!capturedImage) return
        setIsUploading(true)
        try {
            const res = await fetch(capturedImage)
            const blob = await res.blob()
            const file = new File([blob], `ar-booth-${Date.now()}.jpg`, { type: "image/jpeg" })

            const formData = new FormData()
            formData.append('file', file)

            const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
            const uploadData = await uploadRes.json()

            const dbRes = await fetch('/api/memories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'photo',
                    file_path: uploadData.file_path,
                    title: "AR Booth Memory 📸",
                    description: "A magical moment captured! ✨",
                    order_index: 0
                })
            })
            const dbData = await dbRes.json()

            if (dbRes.ok) {
                setUploadSuccess(true)
                onUploadSuccess?.({ file_path: uploadData.file_path, id: dbData.id })
            } else {
                throw new Error("Failed to save memory")
            }
        } catch (e) {
            alert("Upload failed! Please try again. 🥺")
        } finally {
            setIsUploading(false)
        }
    }

    const reset = () => {
        setCapturedImage(null)
        setUploadSuccess(false)
        startCamera()
    }

    return (
        <div className="bg-zinc-950 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col h-[500px] md:h-[600px] relative">

            {/* Camera / Preview Screen */}
            <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
                {!isCameraActive && !capturedImage ? (
                    <div className="p-8 text-center space-y-6">
                        <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto border border-white/5 shadow-inner">
                            <Camera className="w-10 h-10 text-zinc-600" />
                        </div>
                        {error ? (
                            <div className="space-y-4">
                                <p className="text-red-400 font-bold flex items-center justify-center gap-2">
                                    <AlertCircle className="w-5 h-5" /> {error}
                                </p>
                                <button onClick={startCamera} className="w-full py-4 bg-zinc-800 text-white rounded-2xl font-bold">Try Again 🔄</button>
                            </div>
                        ) : (
                            <>
                                <p className="text-zinc-500 font-medium italic">"Create a memory that lasts forever. Use the magic booth below."</p>
                                <button
                                    onClick={startCamera}
                                    className="w-full py-5 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-black rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all"
                                >
                                    OPEN CAMERA 🤳
                                </button>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="w-full h-full relative">
                        {/* Live Feed Container */}
                        {!capturedImage && (
                            <>
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="w-full h-full object-cover scale-x-[-1]"
                                />
                                {/* CSS Overlays for Live Feed (More stable than canvas) */}
                                {currentOverlay === 1 && (
                                    <div className="absolute inset-0 border-[15px] border-pink-500 pointer-events-none z-10 flex flex-col justify-between p-4">
                                        <div className="text-pink-500 font-black text-center text-xl bg-white/10 backdrop-blur-sm p-2 rounded-lg">❤️ FOR MOHINI ❤️</div>
                                        <div className="flex justify-between text-3xl"><span>❤️</span><span>❤️</span></div>
                                    </div>
                                )}
                                {currentOverlay === 2 && (
                                    <div className="absolute inset-0 bg-yellow-400/10 pointer-events-none z-10 flex flex-col justify-between p-10 text-5xl">
                                        <div className="flex justify-between"><span>🎂</span><span>🎉</span></div>
                                        <div className="text-yellow-400 font-black text-center text-2xl tracking-widest animate-pulse">PARTY TIME!</div>
                                        <div className="flex justify-between"><span>✨</span><span>🎁</span></div>
                                    </div>
                                )}
                                {currentOverlay === 3 && (
                                    <div className="absolute inset-0 bg-gradient-to-b from-pink-500/20 to-purple-500/20 pointer-events-none z-10 animate-pulse" />
                                )}
                            </>
                        )}

                        {/* Captured Image Result */}
                        {capturedImage && (
                            <motion.img
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                src={capturedImage}
                                className="w-full h-full object-cover"
                            />
                        )}

                        {/* Capture Flash Effect */}
                        <AnimatePresence>
                            {isCapturing && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: [0, 1, 0] }}
                                    className="absolute inset-0 bg-white z-[100]"
                                />
                            )}
                        </AnimatePresence>

                        {/* Success Screen */}
                        <AnimatePresence>
                            {uploadSuccess && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="absolute inset-0 z-[110] bg-zinc-950/95 flex flex-col items-center justify-center p-8 text-center space-y-6"
                                >
                                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.4)]">
                                        <CheckCircle2 className="w-12 h-12 text-white" />
                                    </div>
                                    <h4 className="text-3xl font-black text-white italic">MEMORIES SAVED! 💖</h4>
                                    <p className="text-zinc-500 text-sm">Now part of your birthday album forever. Go check it out!</p>
                                    <div className="flex gap-4 w-full">
                                        <button onClick={() => {
                                            const a = document.createElement('a');
                                            a.href = capturedImage!;
                                            a.download = 'birthday-memory.jpg';
                                            a.click();
                                        }} className="flex-1 py-4 bg-zinc-800 rounded-2xl font-bold text-[11px] uppercase tracking-widest text-zinc-300">Download 📥</button>
                                        <button onClick={reset} className="flex-1 py-4 bg-pink-600 rounded-2xl font-bold text-[11px] uppercase tracking-widest text-white shadow-xl">Take More 📸</button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Hidden Canvas for Capture */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Bottom Controls */}
            {isCameraActive && !capturedImage && (
                <div className="p-6 bg-zinc-900 border-t border-white/5 space-y-6 z-20">
                    <div className="flex justify-center gap-2 overflow-x-auto no-scrollbar py-1">
                        {OVERLAYS.map(o => (
                            <button
                                key={o.id}
                                onClick={() => setCurrentOverlay(o.id)}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${currentOverlay === o.id ? 'bg-pink-600 text-white shadow-lg' : 'bg-white/5 text-zinc-500 hover:text-white'}`}
                            >
                                {o.icon} {o.name}
                            </button>
                        ))}
                    </div>
                    <div className="flex justify-center">
                        <button
                            onClick={takePhoto}
                            className="w-16 h-16 rounded-full bg-white p-1 shadow-2xl active:scale-90 transition-transform"
                        >
                            <div className="w-full h-full rounded-full border-4 border-black bg-red-500 flex items-center justify-center" />
                        </button>
                    </div>
                </div>
            )}

            {capturedImage && !uploadSuccess && (
                <div className="p-6 bg-zinc-900 border-t border-white/5 space-y-4 z-20">
                    <div className="flex gap-4">
                        <button onClick={reset} className="flex-1 py-4 bg-zinc-800 rounded-2xl font-black text-[10px] uppercase tracking-widest text-zinc-500">Retake 🔄</button>
                        <button
                            onClick={handleUpload}
                            disabled={isUploading}
                            className="flex-[2] py-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl font-black text-xs uppercase tracking-widest text-white shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {isUploading ? <Loader2 className="animate-spin" /> : <Heart className="w-5 h-5 fill-current" />}
                            {isUploading ? 'SAVING...' : 'SAVE TO ALBUM 💖'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
