'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Crown } from 'lucide-react';
import { useStats } from '@/components/stats-provider';

export default function WelcomePage() {
  const router = useRouter();
  const { t } = useStats();
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
    const timer = setTimeout(() => {
      router.push('/home');
    }, 2500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen bg-background transition-opacity duration-1000 ${show ? 'opacity-100' : 'opacity-0'}`}
      onClick={() => router.push('/home')}
    >
      <div className="relative">
        <div className="absolute -inset-4 bg-im-cyan rounded-full blur-2xl opacity-20 animate-pulse" />
        <Crown className="w-24 h-24 text-im-cyan relative animate-bounce" />
      </div>

      <div className="mt-8 text-center px-4">
        <h1 className="text-5xl font-black tracking-tighter text-foreground shadow-text italic">
          IM KING
        </h1>
        <p className="mt-2 text-im-cyan font-bold tracking-[0.2em] text-sm uppercase">
          {t('title')}
        </p>
      </div>

      <div className="absolute bottom-12 text-zinc-500 text-xs font-mono animate-pulse uppercase tracking-[0.3em]">
        {t('loading')}
      </div>
    </div>
  );
}
