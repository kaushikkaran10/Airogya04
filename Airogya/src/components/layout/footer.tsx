'use client';

import { useTranslation } from '@/hooks/use-translation';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-secondary/50 py-4 mt-16 border-t">
      <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
        <p>{t('footer.copy')}</p>
        <div className="text-xs mt-2 space-y-1">
          <p>{t('footer.disclaimer1')}</p>
          <p>{t('footer.disclaimer2')}</p>
          <p>{t('footer.disclaimer3')}</p>
          <p>{t('footer.disclaimer4')}</p>
        </div>
      </div>
    </footer>
  );
}
