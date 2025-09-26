"use client";

import { Sparkles } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

export default function Hero() {
  const { t } = useTranslation();
  return (
    <section className="text-center py-16 md:py-24">
      <div className="flex justify-center items-center gap-4 animate-slide-up-fade" style={{ animationDelay: '0.2s', animationFillMode: 'backwards' }}>
        <Sparkles className="w-8 h-8 text-primary animate-pulse" />
        <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground tracking-tight">
          {t('hero.title')}
        </h1>
        <Sparkles className="w-8 h-8 text-primary animate-pulse" />
      </div>
      <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto animate-slide-up-fade" style={{ animationDelay: '0.4s', animationFillMode: 'backwards' }}>
        {t('hero.subtitle')}
      </p>
    </section>
  );
}
