"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/context/language-context";
import { getConditionInfo } from "@/app/actions";
import { useTranslation } from "@/hooks/use-translation";

interface ConditionDetailsProps {
  conditionName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ConditionDetails({
  conditionName,
  open,
  onOpenChange,
}: ConditionDetailsProps) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) {
      setLoading(true);
      setExplanation(null);
      
      const fetchExplanation = async () => {
        try {
          const result = await getConditionInfo(conditionName, language);
          setExplanation(result.simplifiedExplanation);
        } catch (error) {
          console.error("Failed to fetch condition information:", error);
          setExplanation(t('condition.details.error'));
        } finally {
          setLoading(false);
        }
      };

      fetchExplanation();
    }
  }, [open, conditionName, language, t]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline">{t('condition.details.title')} {conditionName}</DialogTitle>
          <DialogDescription>
            {t('condition.details.description')}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="py-4 whitespace-pre-wrap">
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[80%]" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[90%]" />
              </div>
            ) : (
              explanation
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
