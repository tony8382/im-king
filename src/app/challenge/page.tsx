'use client';

import { Header } from "@/components/header";
import { GAME_CONFIG, COLORS } from "@/lib/constants";
import { ChevronLeft, ChevronRight, Zap, Timer, HelpCircle, Target, Lock } from "lucide-react";
import Link from "next/link";

import { useStats } from "@/components/stats-provider";

export default function Challenge() {
    const { t, stats } = useStats();

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            {/* Custom Header with Back Button */}
            <div className="flex items-center p-4 bg-background/50 backdrop-blur-md sticky top-0 z-50 border-b border-foreground/5">
                <Link href="/home" className="p-2 -ml-2 hover:bg-foreground/10 rounded-full transition-colors">
                    <ChevronLeft className="w-6 h-6 text-im-cyan" />
                </Link>
                <h1 className="flex-1 text-center text-xl font-black text-im-cyan tracking-widest uppercase">
                    {t('selectLevel')}
                </h1>
                <div className="w-10" />
            </div>

            <Header />

            <div className="flex-1 flex flex-col p-6 gap-6 pb-12 overflow-y-auto">
                {GAME_CONFIG.levels.map((level, index) => {
                    const isLocked = stats.credits < level.unlockScore;

                    return (
                        <Link
                            key={level.level}
                            href={isLocked ? '#' : `/room/${level.level}`}
                            className={`group relative flex flex-col overflow-hidden rounded-[2.5rem] card-3d shadow-2xl transition-all ${isLocked ? 'opacity-70 grayscale cursor-not-allowed' : ''
                                }`}
                            style={{ backgroundColor: (level as any).color }}
                            onClick={(e) => isLocked && e.preventDefault()}
                        >
                            <div className="p-8 relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex flex-col">
                                        <span className="text-white/60 text-[10px] font-black tracking-[0.2em] uppercase leading-none">
                                            {t('difficulty')} 0{level.level}
                                        </span>
                                        <h2 className="text-4xl font-black text-white italic shadow-text mt-2 uppercase tracking-tighter">
                                            LEVEL {level.level < 10 ? `0${level.level}` : level.level}
                                        </h2>
                                    </div>
                                    <div className="bg-black/20 p-4 rounded-2xl group-hover:scale-110 transition-transform shadow-inner">
                                        {isLocked ? <Lock className="w-8 h-8 text-white/50" /> : <Zap className="w-8 h-8 text-white" />}
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <div className="flex items-center gap-2 bg-black/10 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/5">
                                        <HelpCircle className="w-4 h-4 text-white/80" />
                                        <span className="text-xs font-bold text-white">{level.questions} {t('qs')}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-black/10 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/5">
                                        <Timer className="w-4 h-4 text-white/80" />
                                        <span className="text-xs font-bold text-white">{level.time}s</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-black/10 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/5">
                                        <Target className="w-4 h-4 text-white/80" />
                                        <span className="text-xs font-bold text-white">+{level.score}</span>
                                    </div>
                                </div>
                            </div>

                            {isLocked && (
                                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center z-20">
                                    <Lock className="w-16 h-16 text-white/20 mb-4" />
                                    <div className="bg-black/40 px-6 py-2 rounded-full border border-white/10 backdrop-blur-md">
                                        <p className="text-white font-bold text-sm uppercase tracking-widest">
                                            Unlock at <span className="text-im-cyan">{level.unlockScore}</span>
                                        </p>
                                    </div>
                                </div>
                            )}

                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
