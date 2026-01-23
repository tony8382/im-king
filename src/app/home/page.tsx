'use client';

import { Header } from "@/components/header";
import { UserCircle, Trophy, BookOpen, ChevronRight } from "lucide-react";
import Link from "next/link";

import { useStats } from "@/components/stats-provider";

export default function Home() {
    const { t } = useStats();

    const menuItems = [
        {
            title: t('profile'),
            href: "/profile",
            icon: UserCircle,
            className: "bg-gradient-to-br from-rose-400 to-red-500 dark:from-red-900 dark:to-red-950",
            textColor: "text-white",
            description: t('playerProfile')
        },
        {
            title: t('challenge'),
            href: "/challenge",
            icon: Trophy,
            className: "bg-gradient-to-br from-amber-400 to-orange-500 dark:from-amber-900 dark:to-orange-950",
            textColor: "text-white",
            description: t('selectLevel')
        },
        {
            title: t('library'),
            href: "/library",
            icon: BookOpen,
            className: "bg-gradient-to-br from-indigo-500 to-slate-700 dark:from-indigo-900 dark:to-slate-950",
            textColor: "text-white",
            description: t('questionBank')
        }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />

            <div className="flex-1 flex flex-col p-6 gap-6 pb-12 overflow-y-auto">
                {menuItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`group relative flex items-center p-8 ${item.className} rounded-[2.5rem] overflow-hidden card-3d shadow-xl`}
                    >
                        <div className="flex items-center gap-6 relative z-10 w-full">
                            <div className="p-4 bg-black/10 rounded-2xl group-hover:bg-black/20 transition-colors">
                                <item.icon className="w-10 h-10 text-white" />
                            </div>

                            <div className="flex-1">
                                <h2 className="text-3xl font-black text-white shadow-text tracking-tighter italic leading-none uppercase">
                                    {item.title}
                                </h2>
                                <p className="text-white/70 text-[10px] font-bold mt-2 uppercase tracking-widest leading-none">
                                    {item.description}
                                </p>
                            </div>

                            <ChevronRight className="w-8 h-8 text-white/40 group-hover:translate-x-1 group-hover:text-white transition-all" />
                        </div>

                        {/* Decorative background element */}
                        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all" />
                    </Link>
                ))}
            </div>

            <div className="p-6 text-center">
                <p className="text-[10px] text-zinc-500 font-bold tracking-[0.2em] uppercase opacity-50">
                    NCUE IM - DEVELOPED BY NCUE IM STUDENTS
                </p>
            </div>
        </div>
    );
}
