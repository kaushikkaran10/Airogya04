"use client";

import React, { createContext, useContext, useState, useRef, ReactNode } from 'react';

interface EmergencyContextType {
  isEmergencyActive: boolean;
  showEmergencyAlert: boolean;
  emergencySeverity: 'high' | 'critical';
  triggerEmergency: (severity?: 'high' | 'critical') => void;
  closeEmergency: () => void;
  canTriggerEmergency: () => boolean;
}

const EmergencyContext = createContext<EmergencyContextType | undefined>(undefined);

interface EmergencyProviderProps {
  children: ReactNode;
}

export function EmergencyProvider({ children }: EmergencyProviderProps) {
  const [showEmergencyAlert, setShowEmergencyAlert] = useState(false);
  const [emergencySeverity, setEmergencySeverity] = useState<'high' | 'critical'>('high');
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  
  // Use ref only for timing data to prevent rapid successive triggers
  const timingRef = useRef<{
    lastTriggerTime: number;
    cooldownPeriod: number;
  }>({
    lastTriggerTime: 0,
    cooldownPeriod: 3000, // 3 second cooldown
  });

  const canTriggerEmergency = (): boolean => {
    const now = Date.now();
    const timeSinceLastTrigger = now - timingRef.current.lastTriggerTime;
    
    // Allow trigger if not currently active OR cooldown period has passed
    return !isEmergencyActive || 
           timeSinceLastTrigger > timingRef.current.cooldownPeriod;
  };

  const triggerEmergency = (severity: 'high' | 'critical' = 'high') => {
    if (!canTriggerEmergency()) {
      console.log('Emergency trigger blocked - cooldown active or already showing');
      return;
    }

    console.log('Triggering emergency with severity:', severity);
    
    timingRef.current.lastTriggerTime = Date.now();
    
    // Use a single state update to prevent multiple renders
    setIsEmergencyActive(true);
    setEmergencySeverity(severity);
    
    // Delay showing the alert slightly to ensure state is stable
    setTimeout(() => {
      setShowEmergencyAlert(true);
    }, 50);
  };

  const closeEmergency = () => {
    console.log('Closing emergency alert');
    
    // Immediately hide the alert
    setShowEmergencyAlert(false);
    
    // Reset active state after a longer delay to prevent rapid re-triggers
    setTimeout(() => {
      setIsEmergencyActive(false);
    }, 2000); // Increased from 1000ms to 2000ms
  };

  const contextValue: EmergencyContextType = {
    isEmergencyActive,
    showEmergencyAlert,
    emergencySeverity,
    triggerEmergency,
    closeEmergency,
    canTriggerEmergency,
  };

  return (
    <EmergencyContext.Provider value={contextValue}>
      {children}
    </EmergencyContext.Provider>
  );
}

export function useEmergency(): EmergencyContextType {
  const context = useContext(EmergencyContext);
  if (context === undefined) {
    throw new Error('useEmergency must be used within an EmergencyProvider');
  }
  return context;
}