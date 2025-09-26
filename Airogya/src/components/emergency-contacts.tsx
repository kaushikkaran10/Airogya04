"use client";

import { Phone, AlertTriangle, Building } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useTranslation } from '@/hooks/use-translation';

export default function EmergencyContacts() {
  const { t } = useTranslation();

  return (
    <Card className="shadow-lg bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-6 w-6" />
          <span>{t('emergency.contacts.title')}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button asChild variant="outline" className="w-full justify-start text-lg h-12 border-red-500/50 hover:bg-red-500/10 hover:text-red-600 transition-colors">
          <a href="tel:108">
            <Phone className="mr-3 h-5 w-5" />
            {t('emergency.contacts.call108')}
          </a>
        </Button>
        <Button asChild variant="outline" className="w-full justify-start text-lg h-12 transition-colors">
          <a href="tel:102">
            <Phone className="mr-3 h-5 w-5" />
            {t('emergency.contacts.call102')}
          </a>
        </Button>
        <Alert className="mt-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{t('emergency.info.title')}</AlertTitle>
          <AlertDescription>
            {t('emergency.info.description')}
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
