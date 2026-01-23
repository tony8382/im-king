'use client';

import { useStats } from "@/components/stats-provider";
import { Coins } from "lucide-react";

export function Header() {
    const { stats, t, setLanguage, setTheme } = useStats();

    const toggleLanguage = () => {
        setLanguage(stats.language === 'zh' ? 'en' : 'zh');
    };

    const toggleTheme = () => {
        const nextTheme = stats.theme === 'dark' ? 'light' : 'dark';
        setTheme(nextTheme);
    };

    return (
        <div className="flex items-center justify-between p-4 bg-background/50 backdrop-blur-md border-b border-foreground/5 sticky top-0 z-50">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-im-cyan/10 flex items-center justify-center border border-im-cyan/20 overflow-hidden">
                    <img
                        src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${stats.name}&backgroundColor=b6e3f4`}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{t('you')}</p>
                    <p className="text-sm font-black text-foreground">{stats.name}</p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button
                    onClick={toggleLanguage}
                    className="text-[10px] font-black w-7 h-7 rounded-lg bg-im-blue/10 text-im-blue border border-im-blue/20 flex items-center justify-center uppercase transition-colors hover:bg-im-blue/20"
                >
                    {stats.language === 'zh' ? 'EN' : '中'}
                </button>
                <button
                    onClick={toggleTheme}
                    className="p-1.5 rounded-lg bg-im-cyan/10 text-im-cyan border border-im-cyan/20 transition-colors hover:bg-im-cyan/20"
                >
                    {stats.theme === 'dark' ? '☀️' : '🌙'}
                </button>
                <div className="flex items-center gap-2 bg-foreground/5 px-3 py-1.5 rounded-full border border-foreground/5">
                    <Coins className="text-yellow-500 w-4 h-4 shadow-sm" />
                    <span className="text-sm font-black text-yellow-500 tabular-nums">
                        {stats.credits.toLocaleString()}
                    </span>
                </div>
            </div>
        </div>
    );
}
