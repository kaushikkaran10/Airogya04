"use client";

import { Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';

export default function MedicalDisclaimer() {
  const { t } = useTranslation();

  return (
    <Card className="bg-background/70 border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Info className="h-5 w-5" />
          {t('disclaimer.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-muted-foreground">
        <p>
         {t('disclaimer.p1')}
        </p>
        <p>
         {t('disclaimer.p2')}
        </p>
        <div className="p-4 rounded-md border bg-secondary/50">
            <h4 className="font-semibold text-foreground mb-2">{t('disclaimer.cultural_note.title')}</h4>
            <p>{t('disclaimer.cultural_note.p1')}</p>
        </div>
      </CardContent>
    </Card>
  );
}
