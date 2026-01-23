'use client';

import { useStats } from "@/components/stats-provider";
import { ChevronLeft, User, Trophy, Frown, Coins, Pencil } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Profile() {
    const { stats, setName, t } = useStats();
    const [isEditing, setIsEditing] = useState(false);
    const [tempName, setTempName] = useState(stats.name);

    const handleSaveName = () => {
        setName(tempName);
        setIsEditing(false);
    };

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            {/* Header */}
            <div className="flex items-center p-4 bg-background/50 backdrop-blur-md sticky top-0 z-50 border-b border-foreground/5">
                <Link href="/home" className="p-2 -ml-2 hover:bg-foreground/10 rounded-full transition-colors">
                    <ChevronLeft className="w-6 h-6 text-im-cyan" />
                </Link>
                <h1 className="flex-1 text-center text-xl font-black text-im-cyan tracking-widest uppercase">
                    {t('profile')}
                </h1>
                <div className="w-10" />
            </div>

            <div className="flex-1 flex flex-col pt-8">
                {/* Avatar & Name Section */}
                <div className="flex flex-col items-center px-6 pb-12">
                    <div className="relative">
                        <div className="w-32 h-32 rounded-full bg-zinc-800 border-4 border-im-blue flex items-center justify-center shadow-2xl overflow-hidden ring-4 ring-im-blue/20">
                            <img
                                src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${stats.name}`}
                                alt="Avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex flex-col items-center w-full max-w-xs">
                        {isEditing ? (
                            <div className="flex flex-col gap-2 w-full">
                                <input
                                    type="text"
                                    value={tempName}
                                    onChange={(e) => setTempName(e.target.value)}
                                    className="bg-zinc-800/50 border-b-2 border-im-cyan text-foreground text-3xl font-black text-center focus:outline-none px-2 py-1 italic rounded-t-lg"
                                    autoFocus
                                    onBlur={handleSaveName}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                                />
                                <p className="text-[10px] text-zinc-500 font-bold text-center uppercase tracking-widest mt-1">
                                    Press enter to save
                                </p>
                            </div>
                        ) : (
                            <div
                                onClick={() => { setTempName(stats.name); setIsEditing(true); }}
                                className="flex items-center gap-2 group cursor-pointer"
                            >
                                <h2 className="text-4xl font-black text-foreground italic shadow-text group-hover:text-im-cyan transition-colors">
                                    {stats.name}
                                </h2>
                                <Pencil className="w-4 h-4 text-im-cyan opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        )}

                        <div className="mt-3 flex items-center gap-2 px-4 py-1.5 bg-foreground/5 rounded-full border border-foreground/5 shadow-sm">
                            <Coins className="w-4 h-4 text-yellow-500" />
                            <span className="text-yellow-500 font-black tabular-nums">
                                {stats.credits.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="flex-1 bg-im-blue px-6 py-12 rounded-t-[3rem] shadow-2xl">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-black/20 p-6 rounded-[2rem] flex flex-col items-center border border-white/5 transition-transform hover:scale-[1.02]">
                            <div className="p-3 bg-white/10 rounded-2xl mb-4">
                                <Trophy className="w-8 h-8 text-white" />
                            </div>
                            <p className="text-white font-black text-4xl tabular-nums">
                                {stats.win}
                            </p>
                            <p className="text-white/40 text-[10px] font-black tracking-[0.2em] mt-2 uppercase">
                                {t('victories')}
                            </p>
                        </div>

                        <div className="bg-black/20 p-6 rounded-[2rem] flex flex-col items-center border border-white/5 transition-transform hover:scale-[1.02]">
                            <div className="p-3 bg-white/10 rounded-2xl mb-4">
                                <Frown className="w-8 h-8 text-white" />
                            </div>
                            <p className="text-white font-black text-4xl tabular-nums">
                                {stats.lose}
                            </p>
                            <p className="text-white/40 text-[10px] font-black tracking-[0.2em] mt-2 uppercase">
                                {t('defeats')}
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 p-6 bg-black/20 rounded-[2rem] border border-white/5">
                        <div className="flex justify-between items-center mb-6">
                            <p className="text-white font-black italic tracking-wider uppercase">{t('winRate')}</p>
                            <p className="text-im-cyan font-black italic">
                                {stats.win + stats.lose > 0
                                    ? Math.round((stats.win / (stats.win + stats.lose)) * 100)
                                    : 0}%
                            </p>
                        </div>

                        <div className="h-4 bg-black/40 rounded-full overflow-hidden p-1">
                            <div
                                className="h-full bg-im-cyan rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(7,201,204,0.5)]"
                                style={{ width: `${stats.win + stats.lose > 0 ? (stats.win / (stats.win + stats.lose)) * 100 : 0}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
