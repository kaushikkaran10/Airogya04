"use client";

import React from 'react';
import { AlertTriangle, Phone, MapPin, Clock, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTranslation } from '@/hooks/use-translation';

interface EmergencyPopupProps {
  isOpen: boolean;
  onClose: () => void;
  severity?: 'high' | 'critical';
}

const EmergencyPopup: React.FC<EmergencyPopupProps> = ({ 
  isOpen, 
  onClose, 
  severity = 'high' 
}) => {
  const { t } = useTranslation();

  const emergencyContacts = [
    {
      name: 'National Emergency Helpline',
      number: '112',
      description: 'All emergency services',
      available: '24/7'
    },
    {
      name: 'Medical Emergency',
      number: '108',
      description: 'Ambulance & Medical Emergency',
      available: '24/7'
    },
    {
      name: 'Health Helpline',
      number: '104',
      description: 'National Health Helpline',
      available: '24/7'
    },
    {
      name: 'Women Helpline',
      number: '181',
      description: 'Women in Distress',
      available: '24/7'
    }
  ];

  const handleCallEmergency = (number: string) => {
    window.open(`tel:${number}`, '_self');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal={true}>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes emergencySlideIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes emergencyIconPulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
          
          .emergency-container {
            animation: emergencySlideIn 0.2s ease-out;
          }
          
          .emergency-icon-pulse {
            animation: emergencyIconPulse 1.5s infinite ease-in-out;
          }
        `
      }} />
      <DialogContent className="max-w-md mx-auto bg-slate-900/98 border-2 border-red-500/50 shadow-2xl emergency-container backdrop-blur-sm">
        <DialogHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className={`p-4 rounded-full bg-gradient-to-br ${
              severity === 'critical' ? 'from-red-600 to-red-700' : 'from-red-500 to-red-600'
            } shadow-lg`}>
              <AlertTriangle className="h-8 w-8 text-white emergency-icon-pulse" />
            </div>
          </div>
          <DialogTitle className={`text-xl font-bold ${
            severity === 'critical' ? 'text-red-400' : 'text-red-300'
          }`}>
            ⚠️ MEDICAL EMERGENCY ALERT
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Emergency Message */}
          <div className="bg-red-900/30 border border-red-500/40 rounded-lg p-4">
            <p className="text-red-200 font-semibold text-center">
              {severity === 'critical' 
                ? "🚨 Your symptoms may require urgent medical care!"
                : "⚠️ Your symptoms may require urgent medical care!"
              }
            </p>
            <p className="text-red-300 text-sm text-center mt-2">
              Please contact emergency services or visit the nearest hospital immediately.
            </p>
          </div>

          {/* Emergency Contacts */}
          <div className="space-y-3">
            <h3 className="font-semibold text-white flex items-center">
              <Phone className="h-4 w-4 mr-2 text-emerald-400" />
              Emergency Helplines
            </h3>
            
            {emergencyContacts.map((contact, index) => (
              <div key={index} className="bg-slate-800/60 border border-slate-600/60 rounded-lg p-3 hover:bg-slate-700/70 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-white">{contact.name}</p>
                    <p className="text-sm text-slate-300">{contact.description}</p>
                    <div className="flex items-center text-xs text-slate-400 mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      {contact.available}
                    </div>
                  </div>
                  <Button
                    onClick={() => handleCallEmergency(contact.number)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold transition-colors duration-200"
                    size="sm"
                  >
                    {contact.number}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Instructions */}
          <div className="bg-yellow-900/30 border border-yellow-500/40 rounded-lg p-3">
            <h4 className="font-semibold text-yellow-200 mb-2 flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              While waiting for help:
            </h4>
            <ul className="text-sm text-yellow-100 space-y-1">
              <li>• Stay calm and don't panic</li>
              <li>• If possible, have someone stay with you</li>
              <li>• Keep your phone charged and accessible</li>
              <li>• Note your exact location for emergency services</li>
              <li>• If symptoms worsen, call 112 immediately</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-2">
            <Button
              onClick={() => handleCallEmergency('112')}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors duration-200"
            >
              🚨 CALL 112 NOW
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="px-4 border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-white rounded-lg transition-colors duration-200"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Disclaimer */}
          <div className="text-xs text-slate-400 text-center border-t border-slate-700/50 pt-3">
            <p>
              This is an automated alert based on symptom analysis. 
              Always trust your judgment and seek professional medical help when in doubt.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmergencyPopup;