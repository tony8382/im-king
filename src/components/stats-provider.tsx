'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Locale, TranslationKey, translations } from '@/lib/i18n';

interface Stats {
    name: string;
    credits: number;
    win: number;
    lose: number;
    language: Locale;
    theme: 'light' | 'dark' | 'system';
    seenQuestions: number[];
}

interface StatsContextType {
    stats: Stats;
    setName: (name: string) => void;
    addCredit: (amount: number) => void;
    reduceCredit: (amount: number) => void;
    addWin: () => void;
    addLose: () => void;
    setLanguage: (lang: Locale) => void;
    setTheme: (theme: 'light' | 'dark' | 'system') => void;
    markQuestionAsSeen: (id: number) => void;
    t: (key: TranslationKey) => string;
    loading: boolean;
}

const StatsContext = createContext<StatsContextType | undefined>(undefined);

export function StatsProvider({ children }: { children: React.ReactNode }) {
    const [stats, setStats] = useState<Stats>({
        name: 'Player',
        credits: 0,
        win: 0,
        lose: 0,
        language: 'zh',
        theme: 'system',
        seenQuestions: [],
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Detect environment language
        const envLang = typeof window !== 'undefined' ? (navigator.language.startsWith('zh') ? 'zh' : 'en') : 'en';

        const savedStats = localStorage.getItem('im-king-stats');
        if (savedStats) {
            const parsed = JSON.parse(savedStats);
            setStats({
                ...parsed,
                language: parsed.language || envLang,
                theme: parsed.theme || 'system',
                seenQuestions: parsed.seenQuestions || [],
            });
        } else {
            setStats(prev => ({ ...prev, language: envLang }));
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        if (!loading) {
            localStorage.setItem('im-king-stats', JSON.stringify(stats));

            // Apply theme
            const root = window.document.documentElement;
            const isDark = stats.theme === 'dark' || (stats.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
            if (isDark) {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
        }
    }, [stats, loading]);

    const setName = (name: string) => setStats(prev => ({ ...prev, name }));
    const addCredit = (amount: number) => setStats(prev => ({ ...prev, credits: prev.credits + amount }));
    const reduceCredit = (amount: number) => setStats(prev => ({ ...prev, credits: Math.max(0, prev.credits - amount) }));
    const addWin = () => setStats(prev => ({ ...prev, win: prev.win + 1 }));
    const addLose = () => setStats(prev => ({ ...prev, lose: prev.lose + 1 }));
    const setLanguage = (language: Locale) => setStats(prev => ({ ...prev, language }));
    const setTheme = (theme: 'light' | 'dark' | 'system') => setStats(prev => ({ ...prev, theme }));

    const markQuestionAsSeen = (id: number) => {
        setStats(prev => {
            if (prev.seenQuestions.includes(id)) return prev;
            return { ...prev, seenQuestions: [...prev.seenQuestions, id] };
        });
    };

    const t = (key: TranslationKey) => {
        return translations[stats.language][key] || key;
    };

    return (
        <StatsContext.Provider value={{
            stats, setName, addCredit, reduceCredit, addWin, addLose,
            setLanguage, setTheme, markQuestionAsSeen, t, loading
        }}>
            {children}
        </StatsContext.Provider>
    );
}

export function useStats() {
    const context = useContext(StatsContext);
    if (context === undefined) {
        throw new Error('useStats must be used within a StatsProvider');
    }
    return context;
}
