"use client";

import { ShieldCheck, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";

type Severity = "Mild" | "Moderate" | "Severe";

interface GuidanceCardProps {
  severity: Severity;
}

// A simple UserMd icon as lucide-react doesn't have it
const UserMdIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 2a5 5 0 0 0-5 5v3.5a3.5 3.5 0 0 0 7 0V7a5 5 0 0 0-5-5Z"/><path d="M12 11c-1.66 0-3 1.34-3 3v2h6v-2c0-1.66-1.34-3-3-3Z"/><path d="M21.5 16h-3.5a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2.5a1 1 0 0 1 1 1v1.5a.5.5 0 0 1-.5.5h-15a.5.5 0 0 1-.5-.5V21a1 1 0 0 1 1-1h2.5a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H2.5"/></svg>
);

const guidanceConfig = {
  Mild: {
    icon: ShieldCheck,
    textKey: 'guidance.mild',
    className: "border-green-500 bg-green-500/10",
    iconClassName: "text-green-600",
  },
  Moderate: {
    icon: UserMdIcon,
    textKey: 'guidance.moderate',
    className: "border-yellow-500 bg-yellow-500/10",
    iconClassName: "text-yellow-600",
  },
  Severe: {
    icon: AlertTriangle,
    textKey: 'guidance.severe',
    className: "border-destructive bg-destructive/10",
    iconClassName: "text-destructive",
  },
};

export default function GuidanceCard({ severity }: GuidanceCardProps) {
  const { t } = useTranslation();
  const config = guidanceConfig[severity];
  const Icon = config.icon;

  return (
    <Card className={`shadow-lg ${config.className}`}>
      <CardHeader className="flex flex-row items-center gap-4 space-y-0">
        <div className="p-3 bg-background rounded-full">
            <Icon className={`h-8 w-8 ${config.iconClassName}`} />
        </div>
        <CardTitle className="text-2xl font-bold font-headline">{t('guidance.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg">{t(config.textKey)}</p>
      </CardContent>
    </Card>
  );
}
