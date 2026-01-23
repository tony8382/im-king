'use client';

import { useState, useEffect, useMemo } from 'react';
import { Header } from "@/components/header";
import { useStats } from "@/components/stats-provider";
import questionsData from "@/data/questions.json";
import { ChevronLeft, Search, Coins, RefreshCw, HelpCircle, CheckCircle2, X } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function Library() {
    const { addCredit, t, stats } = useStats();
    const [search, setSearch] = useState('');
    const [rewardReady, setRewardReady] = useState(false);
    const [timerProgress, setTimerProgress] = useState(0);
    const [timeLeft, setTimeLeft] = useState(20);
    const [isGettingReward, setIsGettingReward] = useState(false);

    // Reward Timer Logic
    useEffect(() => {
        if (rewardReady || isGettingReward) return;

        const interval = setInterval(() => {
            setTimerProgress(prev => {
                if (prev >= 100) {
                    setRewardReady(true);
                    return 100;
                }
                return prev + 1;
            });
            setTimeLeft(prev => Math.max(0, prev - 0.2));
        }, 200);

        return () => clearInterval(interval);
    }, [rewardReady, isGettingReward]);

    const handleGetCredit = () => {
        if (!rewardReady) return;
        setIsGettingReward(true);
        const amount = Math.floor(Math.random() * 5) + 1;
        addCredit(amount);

        // Reset timer
        setRewardReady(false);
        setTimerProgress(0);
        setTimeLeft(20);
        setIsGettingReward(false);
    };

    const filteredQuestions = useMemo(() => {
        return (questionsData as any[]).filter(q =>
            stats.seenQuestions.includes(q.id) &&
            (q.question.toLowerCase().includes(search.toLowerCase()) ||
                Object.values(q.options).some((o: any) => o.toLowerCase().includes(search.toLowerCase())))
        );
    }, [search, stats.seenQuestions]);

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            {/* Header */}
            <div className="flex items-center p-4 bg-background/50 backdrop-blur-md sticky top-0 z-50 border-b border-foreground/5">
                <Link href="/home" className="p-2 -ml-2 hover:bg-foreground/10 rounded-full transition-colors">
                    <ChevronLeft className="w-6 h-6 text-foreground" />
                </Link>
                <h1 className="flex-1 text-center text-xl font-black text-im-cyan tracking-widest uppercase">
                    {t('library')}
                </h1>
                <div className="w-10" />
            </div>

            <Header />

            <div className="flex flex-col p-6 gap-8 pb-20 overflow-y-auto">
                {/* Reward Section (Original Feature) */}
                <div className="bg-foreground/5 rounded-[2.5rem] p-8 border border-foreground/5 shadow-2xl relative overflow-hidden">
                    <div className="flex flex-col items-center">
                        <h2 className="text-zinc-500 font-black tracking-[0.3em] text-[10px] uppercase mb-6">{t('bonusCredits')}</h2>

                        <div className="relative w-48 h-48 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle
                                    cx="96" cy="96" r="80"
                                    fill="transparent"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    className="text-foreground/5"
                                />
                                <motion.circle
                                    cx="96" cy="96" r="80"
                                    fill="transparent"
                                    stroke="#07c9cc"
                                    strokeWidth="12"
                                    strokeDasharray="502.65"
                                    strokeDashoffset={502.65 * (1 - timerProgress / 100)}
                                    strokeLinecap="round"
                                    className="transition-all duration-300 shadow-[0_0_10px_rgba(7,201,204,0.5)]"
                                />
                            </svg>

                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-5xl font-black text-foreground italic tabular-nums leading-none">
                                    {Math.ceil(timeLeft)}
                                </span>
                                <span className="text-[10px] font-bold text-im-cyan tracking-widest mt-1 uppercase">{t('seconds')}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleGetCredit}
                            disabled={!rewardReady}
                            className={`mt-8 w-full py-5 rounded-2xl font-black italic text-lg transition-all active:scale-95 flex items-center justify-center gap-3 ${rewardReady
                                ? 'bg-im-cyan text-black hover:scale-105 shadow-[0_10px_20px_rgba(7,201,204,0.3)]'
                                : 'bg-foreground/5 text-zinc-500 cursor-not-allowed'
                                }`}
                        >
                            {rewardReady ? <CheckCircle2 className="w-5 h-5" /> : <RefreshCw className="w-5 h-5 animate-spin" />}
                            {t('getCredit')}
                        </button>
                    </div>

                    {/* Decorative */}
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-im-cyan/5 rounded-full blur-2xl" />
                </div>

                {/* Question Database Search */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-foreground font-black italic text-xl tracking-tighter uppercase">{t('questionBank')}</h3>
                        <span className="text-im-cyan text-[10px] font-black">{filteredQuestions.length} ITEMS</span>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input
                            type="text"
                            placeholder={t('searchQuestions')}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-foreground/5 border border-foreground/5 rounded-2xl py-4 pl-12 pr-12 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-im-cyan/50 transition-all font-bold placeholder:text-zinc-600 shadow-inner"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch('')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-black/10 rounded-full transition-colors"
                            >
                                <X className="w-4 h-4 text-zinc-500" />
                            </button>
                        )}
                    </div>

                    <div className="flex flex-col gap-4 mt-2">
                        <AnimatePresence mode="popLayout">
                            {filteredQuestions.slice(0, 20).map((q, idx) => (
                                <motion.div
                                    key={q.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: Math.min(idx * 0.05, 0.5) }}
                                    className="bg-foreground/5 p-6 rounded-[2.5rem] border border-foreground/5 flex flex-col gap-4 shadow-sm"
                                >
                                    <div className="flex gap-3">
                                        <div className="w-6 h-6 shrink-0 bg-im-cyan/10 rounded-lg flex items-center justify-center border border-im-cyan/20">
                                            <HelpCircle className="w-3.5 h-3.5 text-im-cyan" />
                                        </div>
                                        <p className="text-foreground font-bold text-sm leading-relaxed">{q.question}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        {Object.entries(q.options).map(([key, val]: [any, any]) => (
                                            <div
                                                key={key}
                                                className={`text-[10px] p-2 rounded-xl border flex items-center gap-2 ${q.answer === key
                                                    ? 'bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400'
                                                    : 'bg-foreground/5 border-transparent text-zinc-500'
                                                    }`}
                                            >
                                                <span className="font-black opacity-50">{key}</span>
                                                <span className="font-bold truncate">{val}</span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {(questionsData as any[]).length > 20 && !search && (
                            <p className="text-center py-4 text-zinc-500 text-[10px] font-black tracking-widest uppercase">
                                Showing top 20 questions
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
