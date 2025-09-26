"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Leaf, AlertTriangle, Wind, Sun, Droplets, Shield, Phone, Activity } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

const tabs = [
  "Farm Safety",
  "Common Issues",
  "Prevention",
  "Emergency Care"
];

const content = {
  "Farm Safety": [
    {
      title: "Pesticide Safety",
      icon: <AlertTriangle className="w-6 h-6 text-yellow-400" />,
      points: [
        "Always wear protective equipment",
        "Read labels carefully before use",
        "Store chemicals safely away from children",
        "Wash hands thoroughly after handling",
        "Never eat or drink while spraying"
      ]
    },
    {
      title: "Machinery Safety",
      icon: <Wind className="w-6 h-6 text-blue-400" />,
      points: [
        "Regular maintenance of equipment",
        "Proper training before operation",
        "Use safety guards and shields",
        "Never operate when tired",
        "Keep first aid kit nearby"
      ]
    }
  ],
  "Common Issues": [
    {
        title: "Heat-Related Illnesses",
        icon: <Sun className="w-6 h-6 text-orange-400" />,
        points: [
            "Heat stroke, heat exhaustion, and dehydration are common.",
            "Symptoms include dizziness, nausea, headache, and high body temperature.",
            "Can be prevented by staying hydrated and taking breaks in the shade."
        ]
    },
    {
        title: "Respiratory Problems",
        icon: <Activity className="w-6 h-6 text-cyan-400" />,
        points: [
            "Exposure to dust, molds, and chemicals can cause asthma and other issues.",
            "Proper ventilation and wearing masks can reduce risks.",
        ]
    }
  ],
  "Prevention": [
    {
        title: "Hydration and Nutrition",
        icon: <Droplets className="w-6 h-6 text-blue-400" />,
        points: [
            "Drink plenty of water throughout the day.",
            "Eat a balanced diet to maintain energy levels.",
            "Avoid excessive caffeine and sugary drinks."
        ]
    },
    {
        title: "Protective Gear",
        icon: <Shield className="w-6 h-6 text-green-400" />,
        points: [
            "Use appropriate personal protective equipment (PPE) for tasks.",
            "This includes gloves, masks, boots, and hearing protection.",
            "Ensure gear is in good condition and fits properly."
        ]
    }
  ],
  "Emergency Care": [
    {
        title: "First Aid",
        icon: <Phone className="w-6 h-6 text-red-400" />,
        points: [
            "Know basic first aid for common injuries like cuts, burns, and sprains.",
            "Have a well-stocked first aid kit easily accessible.",
            "In case of serious injury, call emergency services immediately."
        ]
    }
  ]
};

export default function FarmerHealthPage() {
  const [activeTab, setActiveTab] = useState("Farm Safety");
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-black to-blue-900/20" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-green-500/5 to-blue-500/5 rounded-full blur-3xl" />
      
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8 md:py-12">
          {/* Hero Section */}
          <div className="text-center mb-12 animate-fadeInUp">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm border border-white/10 mb-6 animate-float">
              <Leaf className="w-10 h-10 text-green-400" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              {t('pages.farmer_health.title')}
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Specialized health guidance for agricultural workers
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-full p-2 mb-8 flex justify-between max-w-2xl mx-auto animate-slideInLeft">
            {tabs.map(tab => (
              <Button
                key={tab}
                variant={activeTab === tab ? 'secondary' : 'ghost'}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 text-center rounded-full transition-all duration-300 font-medium ${
                  activeTab === tab 
                    ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg transform scale-105' 
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab}
              </Button>
            ))}
          </div>

          {/* Content */}
          <div className="max-w-2xl mx-auto">
            {content[activeTab as keyof typeof content].map((section, index) => (
              <div 
                key={index} 
                className="mb-8 p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300 transform hover:scale-[1.02] animate-fadeInUp"
                style={{animationDelay: `${index * 100}ms`}}
              >
                <div className="flex items-center mb-4">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm border border-white/10">
                    {section.icon}
                  </div>
                  <h2 className="ml-4 text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                    {section.title}
                  </h2>
                </div>
                <ul className="space-y-3">
                  {section.points.map((point, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-green-400 mr-3 mt-1 text-lg">●</span>
                      <span className="text-gray-300 leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
