'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useStats } from "@/components/stats-provider";
import { GAME_CONFIG, COLORS } from "@/lib/constants";
import questionsData from "@/data/questions.json";
import { ChevronLeft, Timer, Target, User, Crown, X, Trophy, TrendingUp, TrendingDown, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { playSound } from "@/lib/audio";
import { AnimatePresence, motion } from "framer-motion";

interface Question {
    id: number;
    question: string;
    answer: string;
    options: {
        A: string;
        B: string;
        C: string;
        D: string;
    };
}

export default function Room({ params }: { params: { id: string } }) {
    const router = useRouter();
    const levelId = parseInt(params.id);
    const config = GAME_CONFIG.levels.find(l => l.level === levelId) || GAME_CONFIG.levels[0];
    const { stats, addCredit, reduceCredit, addWin, addLose, t, markQuestionAsSeen } = useStats();

    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [questionCount, setQuestionCount] = useState(0);
    const [timeLeft, setTimeLeft] = useState(config.time);
    const [myScore, setMyScore] = useState(0);
    const [proScore, setProScore] = useState(0);
    const [gameState, setGameState] = useState<'playing' | 'result'>('playing');
    const [userAnswer, setUserAnswer] = useState<string | null>(null);
    const [aiAnswer, setAiAnswer] = useState<string | null>(null);
    const [roundProcessed, setRoundProcessed] = useState(false);

    // Notification state
    const [notification, setNotification] = useState<{ title: string, message: string, type: 'success' | 'warning' } | null>(null);

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const nextQuestion = useCallback(() => {
        if (questionCount >= config.questions) {
            setGameState('result');
            return;
        }

        const randomIdx = Math.floor(Math.random() * questionsData.length);
        const nextQ = questionsData[randomIdx] as Question;
        setCurrentQuestion(nextQ);
        markQuestionAsSeen(nextQ.id);

        setQuestionCount(prev => prev + 1);
        setTimeLeft(config.time);
        setUserAnswer(null);
        setAiAnswer(null);
        setRoundProcessed(false);
    }, [config.questions, config.time, questionCount, markQuestionAsSeen]);

    useEffect(() => {
        nextQuestion();
    }, []);

    // Timer Effect
    useEffect(() => {
        if (gameState !== 'playing' || !currentQuestion || roundProcessed) return;

        if (timeLeft <= 0) {
            // Time up, process round if not already done
            if (!userAnswer && !aiAnswer) {
                // Both timed out? 
                processRound();
            }
            return;
        }

        timerRef.current = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [timeLeft, currentQuestion, gameState, roundProcessed]);

    // AI Logic Effect
    useEffect(() => {
        if (!currentQuestion || gameState !== 'playing' || roundProcessed || aiAnswer) return;

        // @ts-ignore - Dynamic config properties
        const { aiSpeedMin, aiSpeedMax, aiAccuracy } = config;
        const min = (aiSpeedMin || 2) * 1000;
        const max = (aiSpeedMax || 5) * 1000;
        const delay = Math.random() * (max - min) + min;

        const timeout = setTimeout(() => {
            const isCorrect = Math.random() < (aiAccuracy || 0.5);
            let picked = currentQuestion.answer;

            if (!isCorrect) {
                const options = ['A', 'B', 'C', 'D'].filter(o => o !== currentQuestion.answer);
                picked = options[Math.floor(Math.random() * options.length)];
            }
            setAiAnswer(picked);
        }, delay);

        return () => clearTimeout(timeout);
    }, [currentQuestion, gameState, roundProcessed, aiAnswer]);

    // Round End Check
    useEffect(() => {
        if (roundProcessed) return;

        // If both answered, or time up (handled in timer effect, but also here for safety)
        if ((userAnswer && aiAnswer)) {
            processRound();
        } else if (timeLeft === 0) {
            processRound();
        }
    }, [userAnswer, aiAnswer, timeLeft, roundProcessed]);


    const handleUserAnswer = (option: string) => {
        if (userAnswer || roundProcessed) return;
        setUserAnswer(option);
        playSound('click');
    };

    const processRound = () => {
        if (roundProcessed) return;
        setRoundProcessed(true);

        // Calculate scores
        let myPoints = 0;
        let proPoints = 0;

        if (userAnswer === currentQuestion?.answer) {
            // Score based on speed? Or just fixed? Previous code: timeLeft * 10
            myPoints = timeLeft * 10;
        }

        if (aiAnswer === currentQuestion?.answer) {
            proPoints = (Math.floor(Math.random() * config.time) + 1) * 10; // Simulated AI time score
        }

        // Delay to show result then update
        setTimeout(() => {
            if (myPoints > 0) {
                setMyScore(prev => prev + myPoints);
                playSound('correct');
            } else if (userAnswer) {
                playSound('wrong');
            }

            if (proPoints > 0) setProScore(prev => prev + proPoints);

            setTimeout(() => {
                nextQuestion();
            }, 2000);
        }, 500);
    };

    const finalizeGame = () => {
        const isWin = myScore > proScore;
        const currentCredits = stats.credits;
        let newCredits = currentCredits;

        if (isWin) {
            addWin();
            addCredit(config.score);
            newCredits += config.score;
            playSound('win');
        } else if (myScore < proScore) {
            addLose();
            reduceCredit(config.score);
            newCredits = Math.max(0, currentCredits - config.score); // Prevent negative?
            playSound('lose');
        }

        // Check for promotion/demotion
        // Check if we unlocked the NEXT level
        const nextLevel = GAME_CONFIG.levels.find(l => l.level === levelId + 1);
        if (nextLevel) {
            // @ts-ignore
            if (currentCredits < nextLevel.unlockScore && newCredits >= nextLevel.unlockScore) {
                setNotification({
                    title: t('congratulations') || 'Congratulations!', // Fallback if t not updated
                    message: `${t('unlocked') || 'Unlocked'} Level ${nextLevel.level}!`,
                    type: 'success'
                });
                playSound('win');
                return; // Stay on screen to show notification
            }
        }

        // Check demotion (current level lock)
        // @ts-ignore
        if (config.unlockScore > 0 && currentCredits >= config.unlockScore && newCredits < config.unlockScore) {
            setNotification({
                title: t('warning') || 'Warning!',
                message: `${t('locked') || 'Locked'} Level ${levelId}!`,
                type: 'warning'
            });
            playSound('lose');
            return;
        }

        router.push('/challenge');
    };

    const closeNotification = () => {
        setNotification(null);
        router.push('/challenge'); // Or challenge?
    };

    if (gameState === 'result') {
        const isWin = myScore > proScore;
        const isDraw = myScore === proScore;

        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6 relative">
                {/* Notification Overlay */}
                <AnimatePresence>
                    {notification && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="absolute inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm"
                        >
                            <div className="bg-zinc-900 border border-white/10 p-8 rounded-[2rem] max-w-sm w-full text-center shadow-2xl">
                                <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-6 ${notification.type === 'success' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                                    {notification.type === 'success' ?
                                        <TrendingUp className="w-10 h-10 text-green-500" /> :
                                        <TrendingDown className="w-10 h-10 text-red-500" />
                                    }
                                </div>
                                <h3 className="text-2xl font-black text-white mb-2 uppercase italic">{notification.title}</h3>
                                <p className="text-zinc-400 mb-8">{notification.message}</p>
                                <button
                                    onClick={closeNotification}
                                    className="w-full py-4 bg-white text-black font-black rounded-xl hover:scale-105 transition-transform"
                                >
                                    OK
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="w-full bg-foreground/5 rounded-[3rem] p-12 flex flex-col items-center border border-foreground/5 shadow-2xl">
                    <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-8 ${isWin ? 'bg-green-500/20' : isDraw ? 'bg-zinc-500/20' : 'bg-red-500/20'}`}>
                        {isWin ? <Crown className="w-16 h-16 text-green-500 animate-bounce" /> : <X className="w-16 h-16 text-red-500" />}
                    </div>

                    <h2 className={`text-6xl font-black italic shadow-text mb-4 uppercase tracking-tighter ${isWin ? 'text-green-500' : isDraw ? 'text-zinc-500' : 'text-red-500'}`}>
                        {isWin ? t('victory') : isDraw ? t('draw') : t('defeat')}
                    </h2>

                    <div className="flex gap-12 mt-8">
                        <div className="text-center">
                            <p className="text-zinc-500 text-[10px] font-black tracking-widest uppercase mb-1">{t('you')}</p>
                            <p className="text-4xl font-black text-foreground tabular-nums">{myScore}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-zinc-500 text-[10px] font-black tracking-widest uppercase mb-1">{t('pro')}</p>
                            <p className="text-4xl font-black text-foreground tabular-nums">{proScore}</p>
                        </div>
                    </div>

                    <div className="mt-12 flex flex-col items-center">
                        <p className="text-zinc-500 font-bold mb-4 uppercase tracking-[0.3em] text-[10px]">{t('reward')}</p>
                        <div className="flex items-center gap-2 bg-foreground/5 px-6 py-3 rounded-full border border-foreground/5 shadow-inner">
                            <Target className="w-5 h-5 text-yellow-500" />
                            <span className={`text-2xl font-black ${isWin ? 'text-green-500' : isDraw ? 'text-zinc-500' : 'text-red-500'}`}>
                                {isWin ? `+${config.score}` : isDraw ? '0' : `-${config.score}`}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={finalizeGame}
                        className="mt-12 w-full py-5 bg-im-cyan text-black font-black italic text-xl rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-im-cyan/20"
                    >
                        {notification ? '...' : t('continue')}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-im-blue overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-black/20 backdrop-blur-md sticky top-0 z-50">
                <Link href="/challenge" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <ChevronLeft className="w-6 h-6 text-white" />
                </Link>
                <div className="flex items-center gap-3">
                    <div className="bg-black/40 px-4 py-1 rounded-full border border-white/10 flex items-center gap-2 shadow-inner">
                        <Timer className={`w-4 h-4 ${timeLeft <= 2 ? 'text-red-500 animate-pulse' : 'text-im-cyan'}`} />
                        <span className={`font-black tabular-nums text-lg ${timeLeft <= 2 ? 'text-red-500' : 'text-white'}`}>
                            {timeLeft}
                        </span>
                    </div>
                </div>
                <div className="w-10" />
            </div>

            <div className="flex-1 flex flex-col p-6 pt-2">
                {/* Score Bars */}
                <div className="flex flex-col gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-im-cyan ring-4 ring-im-cyan/20 shrink-0 shadow-lg">
                            <img
                                src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${stats.name}&backgroundColor=b6e3f4`}
                                alt="You"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-end mb-1">
                                <span className="text-[10px] font-black text-im-cyan uppercase tracking-widest">{stats.name}</span>
                                <span className="text-sm font-black text-white tabular-nums">{myScore}</span>
                            </div>
                            <div className="h-3 bg-black/40 rounded-full overflow-hidden p-[2px]">
                                <div
                                    className="h-full bg-im-cyan transition-all duration-500 ease-out rounded-full"
                                    style={{ width: `${Math.min(100, (myScore / (config.questions * config.time * 10)) * 100)}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-red-400 ring-4 ring-red-400/20 shrink-0 shadow-lg bg-zinc-800">
                            <img
                                src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${config.name}`}
                                alt="Pro"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-end mb-1">
                                <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">{config.name}</span>
                                <span className="text-sm font-black text-white tabular-nums">{proScore}</span>
                            </div>
                            <div className="h-3 bg-black/40 rounded-full overflow-hidden p-[2px]">
                                <div
                                    className="h-full bg-red-400 transition-all duration-500 ease-out rounded-full"
                                    style={{ width: `${Math.min(100, (proScore / (config.questions * config.time * 10)) * 100)}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Question Area */}
                <div className="flex-1 flex flex-col">
                    <div className="bg-zinc-900/90 rounded-[3rem] p-10 mb-8 border border-white/5 min-h-[180px] flex items-center justify-center relative overflow-hidden shadow-2xl">
                        <p className="text-white text-2xl font-bold text-center relative z-10 leading-relaxed italic shadow-text">
                            {currentQuestion?.question}
                        </p>
                        <div className="absolute top-0 left-0 w-2 h-full bg-im-cyan shadow-[0_0_15px_rgba(7,201,204,0.5)]" />
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <span className="text-8xl font-black italic text-white/5">{questionCount}</span>
                        </div>
                    </div>

                    {/* Options Grid */}
                    <div className="grid grid-cols-1 gap-4 mb-8">
                        {['A', 'B', 'C', 'D'].map((key) => {
                            const optionText = currentQuestion?.options[key as keyof Question['options']];
                            const isCorrect = currentQuestion?.answer === key;
                            const isSelected = userAnswer === key;
                            const isAiSelected = aiAnswer === key;

                            // Visualize result only if round processed or user selected (for immediate feedback on selection)
                            // But we usually only show correctness at end of round.
                            // If roundProcessed: show everything.
                            // If not: show user selection (neutral/highlight) and AI selection (tag).

                            let variant = 'default';

                            if (roundProcessed) {
                                if (isCorrect) {
                                    if (isSelected || isAiSelected) variant = 'correct'; // Highlight correct if anyone picked it
                                    else variant = 'correct-h'; // Show correct answer dimmed
                                } else {
                                    if (isSelected) variant = 'wrong';
                                }
                            } else {
                                if (isSelected) variant = 'selected';
                            }

                            return (
                                <button
                                    key={key}
                                    onClick={() => handleUserAnswer(key)}
                                    disabled={!!userAnswer || roundProcessed}
                                    className={`relative flex items-center p-6 rounded-[1.5rem] border-2 transition-all duration-300 transform 
                                        ${variant === 'default' ? 'bg-white/10 border-white/10 hover:bg-white/20 active:scale-[0.98]' :
                                            variant === 'selected' ? 'bg-im-cyan/20 border-im-cyan scale-[1.02]' :
                                                variant === 'correct' ? 'bg-green-500 border-green-400 scale-[1.02] shadow-[0_10px_20px_rgba(34,197,94,0.3)]' :
                                                    variant === 'wrong' ? 'bg-red-500 border-red-400 scale-[1.02] shadow-[0_10px_20px_rgba(239,68,68,0.3)]' :
                                                        variant === 'correct-h' ? 'bg-green-500/20 border-green-500' : ''
                                        }`}
                                >
                                    <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-black mr-6 text-lg ${variant === 'correct' || variant === 'wrong' ? 'bg-black/20 text-white' : 'bg-white/10 text-white/60'
                                        }`}>
                                        {key}
                                    </span>
                                    <span className={`flex-1 text-left font-bold text-lg ${variant === 'correct' || variant === 'wrong' ? 'text-white' : 'text-white/90'}`}>
                                        {optionText}
                                    </span>

                                    {isSelected && (
                                        <div className="absolute -right-2 -top-2 bg-white text-black text-[10px] font-black px-3 py-1 rounded-full border border-black shadow-xl uppercase tracking-widest">{t('you')}</div>
                                    )}
                                    {isAiSelected && (
                                        <div className="absolute -left-2 -top-2 bg-yellow-400 text-black text-[10px] font-black px-3 py-1 rounded-full border border-black shadow-xl uppercase tracking-widest">{t('pro')}</div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Decorative Bottom */}
            <div className="h-2 bg-gradient-to-r from-transparent via-im-cyan/30 to-transparent blur-sm" />
        </div>
    );
}
