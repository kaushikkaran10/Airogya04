"use client";

import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Clock, Heart, Info, Phone, Stethoscope } from 'lucide-react';
import { useTranslation } from "@/hooks/use-translation";
import type { AnalyzeSymptomsOutput } from "@/ai/flows/analyze-symptoms-and-suggest-conditions";
import ConditionCard from "./condition-card";
import EmergencyPopup from "./emergency-popup";
import { useEmergency } from "@/contexts/emergency-context";

type Severity = "Mild" | "Moderate" | "Severe";

interface AIAnalysisResultsProps {
  results: AnalyzeSymptomsOutput;
  showEmergencyAlert: boolean;
}

const severityConfig = {
  Mild: {
    color: "bg-green-500/10 border-green-500/20 text-green-400",
    badgeVariant: "default" as const,
    icon: Heart,
    urgency: "Low Priority",
    timeframe: "Monitor symptoms for 24-48 hours"
  },
  Moderate: {
    color: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
    badgeVariant: "secondary" as const,
    icon: Clock,
    urgency: "Medium Priority",
    timeframe: "Consider consulting a doctor within 24 hours"
  },
  Severe: {
    color: "bg-red-500/10 border-red-500/20 text-red-400",
    badgeVariant: "destructive" as const,
    icon: AlertTriangle,
    urgency: "High Priority",
    timeframe: "Seek immediate medical attention"
  }
};

export default function AIAnalysisResults({ 
  results, 
  showEmergencyAlert, 
}: AIAnalysisResultsProps) {
  const { t } = useTranslation();
  const { triggerEmergency, canTriggerEmergency } = useEmergency();

  const getHighestSeverity = (conditions: AnalyzeSymptomsOutput['conditions']): Severity => {
    const severities = conditions.map(c => c.severity);
    if (severities.includes('Severe')) return 'Severe';
    if (severities.includes('Moderate')) return 'Moderate';
    return 'Mild';
  };

  const highestSeverity = getHighestSeverity(results.conditions);
  const severityInfo = severityConfig[highestSeverity];
  const SeverityIcon = severityInfo.icon;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-fadeInUp">
      {/* Analysis Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/10 mb-4">
          <Stethoscope className="w-8 h-8 text-blue-400" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          AI Analysis Results
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Based on your symptoms, here's what our AI analysis suggests. Please remember this is for informational purposes only and should not replace professional medical advice.
        </p>
      </div>

      {/* Overall Assessment Card */}
      <Card className={`${severityInfo.color} border-2 backdrop-blur-sm`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SeverityIcon className="w-6 h-6" />
              <CardTitle className="text-xl">Overall Assessment</CardTitle>
            </div>
            <Badge variant={severityInfo.badgeVariant} className="text-sm font-semibold">
              {highestSeverity} Severity
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Priority Level
              </h4>
              <p className="text-sm">{severityInfo.urgency}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Recommended Action
              </h4>
              <p className="text-sm">{severityInfo.timeframe}</p>
            </div>
          </div>
          
          {highestSeverity === 'Severe' && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <span className="font-semibold text-red-400">Emergency Alert</span>
              </div>
              <p className="text-sm text-red-300 mb-3">
                Your symptoms may indicate a serious condition requiring immediate medical attention.
              </p>
              {!showEmergencyAlert && (
                <Button 
                  onClick={() => canTriggerEmergency() && triggerEmergency('critical')}
                  variant="destructive" 
                  size="sm"
                  className="flex items-center gap-2"
                  disabled={!canTriggerEmergency()}
                >
                  <Phone className="w-4 h-4" />
                  Emergency Contacts
                </Button>
              )}
              {showEmergencyAlert && (
                <p className="text-sm text-red-300 font-medium">
                  Emergency contacts are already displayed above.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Conditions Analysis */}
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2">Possible Conditions</h3>
          <p className="text-muted-foreground">
            Based on your symptoms, here are the conditions our AI has identified, ranked by likelihood and severity.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {results.conditions.map((condition, index) => (
            <div key={index} className="relative">
              {index === 0 && (
                <div className="absolute -top-3 -right-3 z-10">
                  <Badge variant="outline" className="bg-blue-500/10 border-blue-500/30 text-blue-400">
                    Most Likely
                  </Badge>
                </div>
              )}
              <ConditionCard condition={condition} />
            </div>
          ))}
        </div>
      </div>

      {/* General Recommendations */}
      <Card className="bg-card/50 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-green-400" />
            General Health Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2 text-green-400">Immediate Care:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Rest and stay hydrated</li>
                <li>• Monitor your symptoms closely</li>
                <li>• Avoid strenuous activities</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-blue-400">When to Seek Help:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Symptoms worsen or persist</li>
                <li>• New concerning symptoms appear</li>
                <li>• You feel unsure about your condition</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg">
            <p className="text-sm text-blue-300">
              <strong>Disclaimer:</strong> This AI analysis is for informational purposes only and should not replace professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for medical concerns.
            </p>
          </div>
        </CardContent>
      </Card>


    </div>
  );
}