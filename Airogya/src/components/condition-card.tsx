"use client";

import { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { AlertTriangle, Clock, Heart, Info, ExternalLink, Stethoscope } from 'lucide-react';
import { useTranslation } from "@/hooks/use-translation";
import type { AnalyzeSymptomsOutput } from "@/ai/flows/analyze-symptoms-and-suggest-conditions";
import ConditionDetails from "./condition-details";

type ConditionCardProps = {
  condition: AnalyzeSymptomsOutput["conditions"][0];
};

const severityConfig = {
  Mild: {
    variant: "default" as const,
    color: "border-green-500/30 bg-green-500/5",
    icon: Heart,
    iconColor: "text-green-400",
    urgency: "Low Priority",
    timeframe: "Monitor for 24-48 hours"
  },
  Moderate: {
    variant: "secondary" as const,
    color: "border-yellow-500/30 bg-yellow-500/5",
    icon: Clock,
    iconColor: "text-yellow-400",
    urgency: "Medium Priority",
    timeframe: "Consider doctor visit within 24h"
  },
  Severe: {
    variant: "destructive" as const,
    color: "border-red-500/30 bg-red-500/5",
    icon: AlertTriangle,
    iconColor: "text-red-400",
    urgency: "High Priority",
    timeframe: "Seek immediate medical attention"
  }
};

export default function ConditionCard({ condition }: ConditionCardProps) {
  const { t } = useTranslation();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const severity = condition.severity;
  const config = severityConfig[severity] || severityConfig.Mild;
  const SeverityIcon = config.icon;

  return (
    <>
      <Card className={`flex flex-col h-full backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2 ${config.color}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full bg-background/50 ${config.iconColor}`}>
                <SeverityIcon className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold leading-tight">{condition.condition}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={config.variant} className="text-xs">
                    {severity}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{config.urgency}</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-grow space-y-4">
          {/* Timeframe */}
          <div className="flex items-center gap-2 p-2 rounded-lg bg-background/30">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">{config.timeframe}</span>
          </div>

          {/* Next Steps */}
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Stethoscope className="w-4 h-4" />
              Recommended Actions:
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{condition.nextSteps}</p>
          </div>

          {/* Severity-specific recommendations */}
          {severity === 'Severe' && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-sm font-semibold text-red-400">Urgent Care Needed</span>
              </div>
              <p className="text-xs text-red-300">
                This condition may require immediate medical attention. Don't delay seeking professional help.
              </p>
            </div>
          )}

          {severity === 'Moderate' && (
            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Info className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-semibold text-yellow-400">Medical Consultation Advised</span>
              </div>
              <p className="text-xs text-yellow-300">
                Consider scheduling an appointment with your healthcare provider for proper evaluation.
              </p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="pt-3 space-y-2">
          <Button 
            variant="outline" 
            className="w-full flex items-center gap-2" 
            onClick={() => setIsDetailsOpen(true)}
          >
            <ExternalLink className="w-4 h-4" />
            Learn More
          </Button>
        </CardFooter>
      </Card>
      
      {isDetailsOpen && (
        <ConditionDetails
          conditionName={condition.condition}
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
        />
      )}
    </>
  );
}
