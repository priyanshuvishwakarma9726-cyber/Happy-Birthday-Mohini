'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Trophy, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react'

export interface QuizQuestion {
    q: string;
    options: string[];
    a: string;
    correct: string;
    wrong: string;
}

const DEFAULT_QUESTIONS: QuizQuestion[] = [
    {
        q: "Mohini ka favorite music genre kya hai?",
        options: ["Sad Bollywood songs 😭", "Punjabi songs 🔥", "English EDM 🎧", "Bhajan mode 🛕"],
        a: "Punjabi songs 🔥",
        correct: "Arre waah! Punjabi beats = Mohini ki jaan 🔥",
        wrong: "Galat! Bhai ye Punjabi vibes wali ladki hai 😏"
    },
    {
        q: "Mohini abhi kis year me padh rahi hai?",
        options: ["1st year", "2nd year", "Final year", "College chhod diya 💀"],
        a: "2nd year",
        correct: "Perfect! BALLB 2nd year, lawyer loading… ⚖️😎",
        wrong: "Galat! Abhi lawyer bani nahi hai, raste me hai 😌"
    },
    {
        q: "Mohini ki height kya hai?",
        options: ["5'6", "5'4", "5'2", "Height secret hai 👀"],
        a: "5'2",
        correct: "Chhoti si height, full attitude 😏💖",
        wrong: "Galat! Cute height hai bhai, model wali nahi 😌"
    },
    {
        q: "Mohini ka weight kya hai?",
        options: ["45 kg", "50 kg", "55 kg", "Weight poochna mana hai 😤"],
        a: "Weight poochna mana hai 😤",
        correct: "Smart ho! Ye sawal poochna danger zone hai 💀",
        wrong: "Bhai zinda rehna hai ya nahi? 😭"
    },
    {
        q: "Mohini aur main pehli baar kab mile the?",
        options: ["14/02/2019", "20/05/2018", "01/01/2020", "Yaad hi nahi 🤡"],
        a: "20/05/2018",
        correct: "Legend! Date yaad rakhna = green flag 💚",
        wrong: "Galat! Aisi galti relationship me mehngi padti hai 😏"
    },
    {
        q: "Mohini kitni baar mere ghar aayi hai?",
        options: ["1", "2", "3", "Kabhi nahi"],
        a: "2",
        correct: "Bilkul sahi! Guest nahi, family vibes 😌",
        wrong: "Galat! Counting thodi weak hai tumhari 😜"
    },
    {
        q: "Main Mohini ke ghar kitni baar gaya hoon?",
        options: ["1", "2", "3", "Abhi bhi gate ke bahar hoon 😭"],
        a: "3",
        correct: "Perfect! Attendance full hai bhai 😎",
        wrong: "Galat! Entry mil chuki hai, multiple times 😏"
    },
    {
        q: "Next meetup kab hone wala hai?",
        options: ["January", "February", "April", "Jab kismat chamke 🫠"],
        a: "April",
        correct: "April booked! Calendar me heart bana lo ❤️",
        wrong: "Galat! Thoda wait karo, surprise aa raha 😌"
    },
    {
        q: "Engagement se pehle hum kaha mile the?",
        options: ["Mall", "Kulkula Dham", "Engagement function", "Online only 📱"],
        a: "Engagement function",
        correct: "Correct! Shaadi vibes pehle hi shuru ho chuki thi 😏",
        wrong: "Galat! Engagement ka scene yaad rakho bhai 😌"
    },
    {
        q: "Engagement se pehle hum kaha mile the?",
        options: ["Kulkula Dham", "Restaurant", "Park", "Movie hall"],
        a: "Kulkula Dham",
        correct: "Perfect! Kulkula Dham = memory unlocked 🔓💖",
        wrong: "Galat! Jagah toh sahi chuno! 😏"
    }
]

export default function MohiniQuiz({ quizData }: { quizData?: string }) {
    const [current, setCurrent] = useState(0)
    const [score, setScore] = useState(0)
    const [showResult, setShowResult] = useState(false)
    const [feedback, setFeedback] = useState<{ msg: string; isCorrect: boolean } | null>(null)
    const [quizStarted, setQuizStarted] = useState(false)
    const [questions, setQuestions] = useState<QuizQuestion[]>(DEFAULT_QUESTIONS)

    useEffect(() => {
        if (quizData) {
            try {
                const parsed = JSON.parse(quizData)
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setQuestions(parsed)
                }
            } catch (e) {
                console.error("Quiz Data Parse Error", e)
            }
        }
    }, [quizData])

    const [isTransitioning, setIsTransitioning] = useState(false)

    // Reset transition state when question changes
    useEffect(() => {
        setIsTransitioning(false)
    }, [current])

    const handleAnswer = (option: string) => {
        const activeQuestion = questions[current]
        if (feedback || !activeQuestion) return // Prevent multiple clicks

        const isCorrect = option === activeQuestion.a
        if (isCorrect) {
            setScore(prev => prev + 1)
            confetti({
                particleCount: 50,
                spread: 60,
                origin: { y: 0.8 },
                colors: ['#ec4899', '#8b5cf6']
            })
        }

        setFeedback({
            msg: isCorrect ? activeQuestion.correct : activeQuestion.wrong,
            isCorrect
        })
    }

    const handleNext = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);

        setFeedback(null)
        if (current < questions.length - 1) {
            setCurrent(prev => prev + 1)
        } else {
            setShowResult(true)
            // Trigger final confetti if perfect score
            if (score === questions.length) {
                confetti({
                    particleCount: 200,
                    spread: 100,
                    origin: { y: 0.6 }
                })
            }
        }
    }

    const getScoreMessage = () => {
        const percentage = (score / questions.length) * 100
        if (percentage === 100) return "Certified Mohini Expert 💖🏆"
        if (percentage >= 70) return "Dangerously close to perfect 😎🔥"
        if (percentage >= 40) return "Okay okay, thoda effort dikha 😏"
        return "Tumhe Mohini pe research karni padegi 😭"
    }

    // Safety check for active question
    const activeQuestion = questions[current]

    if (!quizStarted) {
        return (
            <div className="w-full max-w-xl mx-auto p-12 bg-zinc-900/80 backdrop-blur-xl rounded-[3rem] border-2 border-pink-500/20 shadow-2xl text-center space-y-8">
                <div className="w-24 h-24 bg-gradient-to-tr from-pink-500 to-purple-600 rounded-3xl mx-auto flex items-center justify-center rotate-12 shadow-lg">
                    <Trophy className="w-12 h-12 text-white -rotate-12" />
                </div>
                <div className="space-y-4">
                    <h2 className="text-4xl font-black text-white italic tracking-tighter">
                        Quiz About Mohini 😏💖 <br />
                        <span className="text-pink-500">(Roast Mode)</span>
                    </h2>
                    <p className="text-zinc-400 font-medium">Dekhte hain tum Mohini ko kitna jaante ho!</p>
                </div>
                <button
                    onClick={() => setQuizStarted(true)}
                    className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase tracking-tighter hover:scale-[1.02] active:scale-95 transition-all text-xl shadow-xl flex items-center justify-center gap-2"
                >
                    Chalo Shuru Karein <ArrowRight className="w-6 h-6" />
                </button>
            </div>
        )
    }

    if (showResult) {
        return (
            <div className="w-full max-w-xl mx-auto p-12 bg-zinc-900/80 backdrop-blur-xl rounded-[3rem] border-2 border-white/10 shadow-2xl text-center space-y-10">
                <div className="space-y-2">
                    <p className="text-pink-500 font-black uppercase tracking-[0.2em] text-sm">Final Score</p>
                    <h3 className="text-7xl font-black text-white">{score}/{questions.length}</h3>
                </div>

                <div className="p-8 bg-black/40 rounded-3xl border border-white/5">
                    <p className="text-2xl font-bold text-pink-100 italic leading-relaxed">
                        "{getScoreMessage()}"
                    </p>
                </div>

                <button
                    onClick={() => {
                        setCurrent(0); setScore(0); setShowResult(false); setFeedback(null);
                    }}
                    className="w-full bg-zinc-800 hover:bg-zinc-700 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all"
                >
                    <RefreshCw className="w-5 h-5" /> Phir Se Try Karein?
                </button>
            </div>
        )
    }

    // Guard against index out of bounds during transition or empty data
    if (!activeQuestion) return null;

    return (
        <div className="w-full max-w-xl mx-auto p-8 md:p-12 bg-zinc-900/80 backdrop-blur-xl rounded-[4rem] border-2 border-white/5 shadow-2xl relative overflow-hidden min-h-[500px] flex flex-col justify-between">
            {/* Progress Bar */}
            <div className="absolute top-0 left-0 w-full h-2 bg-white/5">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((current + 1) / questions.length) * 100}%` }}
                    className="h-full bg-gradient-to-r from-pink-500 to-purple-500"
                />
            </div>

            <div className="flex justify-between items-center mb-8">
                <span className="bg-pink-500/10 text-pink-500 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-pink-500/20">
                    Question {current + 1}/{questions.length}
                </span>
                <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold">
                    Score: <span className="text-white">{score}</span>
                </div>
            </div>

            <AnimatePresence mode='wait'>
                {feedback ? (
                    <motion.div
                        key="feedback"
                        initial={{ scale: 0.9, opacity: 0, y: 10 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 1.1, opacity: 0 }}
                        className="flex-1 flex flex-col items-center justify-center text-center space-y-6"
                    >
                        <div className={`p-6 rounded-3xl ${feedback.isCorrect ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                            {feedback.isCorrect ? <Trophy className="w-12 h-12 text-green-400" /> : <AlertCircle className="w-12 h-12 text-red-400" />}
                        </div>
                        <p className={`text-3xl font-bold leading-tight ${feedback.isCorrect ? 'text-green-100' : 'text-red-100'}`}>
                            {feedback.msg}
                        </p>
                        <motion.button
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleNext}
                            className="mt-8 px-10 py-4 bg-white text-black rounded-2xl font-black flex items-center gap-2 shadow-xl hover:shadow-2xl transition-all"
                        >
                            {current === questions.length - 1 ? 'Show Results' : 'Next Question'}
                            <ArrowRight className="w-5 h-5" />
                        </motion.button>
                    </motion.div>
                ) : (
                    <motion.div
                        key={current}
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        className="flex-1 flex flex-col justify-center space-y-8"
                    >
                        <h3 className="text-2xl md:text-3xl font-black text-white text-center leading-tight">
                            {activeQuestion.q}
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                            {activeQuestion.options.map((opt, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswer(opt)}
                                    className="group relative w-full p-6 bg-white/5 hover:bg-white/10 rounded-3xl border-2 border-white/5 hover:border-pink-500/50 transition-all text-left active:scale-[0.98]"
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-black text-zinc-400 group-hover:bg-pink-500 group-hover:text-white transition-colors">
                                            {String.fromCharCode(65 + idx)}
                                        </span>
                                        <span className="text-lg md:text-xl text-zinc-200 font-bold group-hover:text-white transition-colors">
                                            {opt}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="mt-8 text-center">
                <p className="text-zinc-600 text-[10px] uppercase font-bold tracking-widest">Only legends know the truth 😏</p>
            </div>
        </div>
    )
}
