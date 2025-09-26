'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Menu, 
  X, 
  ChevronDown, 
  Clock, 
  Activity, 
  TrendingUp, 
  Users, 
  MapPin, 
  Phone,
  Stethoscope,
  Heart,
  Shield,
  Search,
  ArrowRight,
  Zap,
  Star,
  CheckCircle,
  Calendar,
  Brain,
  Eye
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/layout/header"
import { useTranslation } from '@/hooks/use-translation'

export default function HomePage() {
  const { t } = useTranslation()
  const [isLoaded, setIsLoaded] = useState(false)
  const [symptomText, setSymptomText] = useState("")
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const quickSymptoms = [
    "Fever", "Headache", "Cough", "Fatigue", "Nausea", "Chest Pain"
  ];

  const handleSymptomClick = (symptom: string) => {
    if (!selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const removeSymptom = (symptom: string) => {
    setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      window.location.href = "/symptom-checker";
    }, 2000);
  };

  const handleEmergencyCall = (type: string) => {
    const numbers = {
      ambulance: "108",
      hospital: "102",
      helpline: "1075"
    };
    
    if (typeof window !== 'undefined') {
      window.open(`tel:${numbers[type as keyof typeof numbers]}`, '_self');
    }
  };

  const handleFindNearestHospital = () => {
    window.location.href = "/healthcare-centers";
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden font-sans antialiased" style={{fontFamily: 'Inter, sans-serif'}}>
      {/* Background Elements */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.05),transparent_50%)]"></div>
      </div>

      {/* Navigation */}
      <Header />

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
            
            {/* Hero Content - Spans 5 columns */}
            <div className="lg:col-span-5 opacity-0 animate-slide-in-left delay-300" style={{opacity: isLoaded ? 1 : 0}}>
              <div className="gradient-border rounded-3xl mb-8 inline-block">
                <div className="bg-black rounded-3xl px-4 py-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-white/80">Advanced Healthcare Platform</span>
                  </div>
                </div>
              </div>

              <h1 className="sm:text-7xl xl:text-8xl leading-none text-6xl font-medium tracking-tighter mb-8">
                <span className="block text-white">{t('hero.title')}</span>
                <span className="block healthcare-gradient">{t('hero.subtitle')}</span>
              </h1>

              <p className="text-xl text-white/70 mb-10 max-w-lg leading-relaxed">
                {t('app.description')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-16">
                <Link href="/symptom-checker" className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-medium rounded-3xl transition-all duration-300 shadow-xl shadow-emerald-500/25 transform hover:scale-105">
                  Start Health Check
                </Link>
                <Link href="/healthcare-centers" className="px-8 py-4 glass border border-white/20 hover:border-white/40 text-white font-medium rounded-3xl transition-all duration-300 backdrop-blur-sm">
                  Find Centers
                </Link>
              </div>
            </div>

            {/* Health Check Card - Spans 4 columns */}
            <div className="lg:col-span-4 opacity-0 animate-fade-in-up delay-500" style={{opacity: isLoaded ? 1 : 0}}>
              <div className="glass rounded-3xl p-8 backdrop-blur-xl border border-white/20 shadow-2xl animate-float">
                
                {/* Card Header */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-1">{t('homepage.quick_health_check.title')}</h3>
                    <p className="text-sm text-white/60">{t('homepage.quick_health_check.subtitle')}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-3 hover:bg-white/10 rounded-2xl transition-colors duration-300">
                      <Activity className="w-5 h-5 text-white/60" />
                    </button>
                    <button className="p-3 hover:bg-white/10 rounded-2xl transition-colors duration-300">
                      <Stethoscope className="w-5 h-5 text-white/60" />
                    </button>
                  </div>
                </div>

                {/* Symptom Input */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-white">{t('homepage.quick_health_check.describe_symptoms')}</span>
                    <span className="text-sm text-white/60">{t('homepage.quick_health_check.ai_analysis')}</span>
                  </div>
                  
                  <div className="relative">
                    <textarea
                      value={symptomText}
                      onChange={(e) => setSymptomText(e.target.value)}
                      placeholder={t('homepage.quick_health_check.placeholder')}
                      className="w-full h-24 bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-white/40 resize-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300 backdrop-blur-sm"
                    />
                  </div>
                </div>

                {/* Quick Symptoms */}
                <div className="mb-6">
                  <span className="text-sm font-medium text-white mb-3 block">{t('homepage.quick_health_check.quick_symptoms')}</span>
                  <div className="flex flex-wrap gap-2">
                    {quickSymptoms.map((symptom) => (
                      <button
                        key={symptom}
                        onClick={() => handleSymptomClick(symptom)}
                        className="px-3 py-1.5 text-xs bg-white/10 hover:bg-emerald-500/20 text-white/80 hover:text-white rounded-full transition-all duration-300 border border-white/10 hover:border-emerald-500/30"
                      >
                        {symptom}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected Symptoms */}
                {selectedSymptoms.length > 0 && (
                  <div className="mb-6">
                    <span className="text-sm font-medium text-white mb-3 block">{t('homepage.quick_health_check.selected_symptoms')}</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedSymptoms.map((symptom) => (
                        <div key={symptom} className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 text-emerald-300 rounded-full text-xs border border-emerald-500/30">
                          <span>{symptom}</span>
                          <button onClick={() => removeSymptom(symptom)} className="hover:text-emerald-100">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}



                {/* Analyze Button */}
                <button 
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || (!symptomText.trim() && selectedSymptoms.length === 0)}
                  className="w-full py-4 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium rounded-2xl transition-all duration-300 shadow-xl shadow-emerald-500/25 transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 btn-hover-scale"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      {t('homepage.quick_health_check.analyzing')}
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      {t('homepage.quick_health_check.analyze_symptoms')}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Health Stats - Spans 3 columns */}
            <div className="lg:col-span-3 space-y-6 opacity-0 animate-slide-in-right delay-700" style={{opacity: isLoaded ? 1 : 0}}>
              
              {/* Live Health Data */}
              <div className="glass rounded-3xl p-6 backdrop-blur-xl border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">{t('homepage.health_updates.title')}</h3>
                     <div className="flex items-center gap-2">
                       <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                       <span className="text-xs text-white/60">{t('homepage.health_updates.live_data')}</span>
                     </div>
                </div>
                
                <div className="space-y-4">
                  <Link href="/government-schemes" className="flex items-center justify-between p-4 hover:bg-white/5 rounded-2xl transition-all duration-300 cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-emerald-500/30">
                        <Shield className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{t('homepage.health_updates.health_schemes')}</p>
                        <p className="text-xs text-white/60">{t('homepage.health_updates.government_programs')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-white">11+</p>
                      <p className="text-xs text-emerald-400 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {t('homepage.health_updates.active')}
                      </p>
                    </div>
                  </Link>

                  <Link href="/vaccination-tracker" className="flex items-center justify-between p-4 hover:bg-white/5 rounded-2xl transition-all duration-300 cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-blue-500/30">
                        <Activity className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{t('homepage.health_updates.vaccinations')}</p>
                        <p className="text-xs text-white/60">{t('homepage.health_updates.track_progress')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-white">85%</p>
                      <p className="text-xs text-emerald-400 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {t('homepage.health_updates.coverage')}
                      </p>
                    </div>
                  </Link>

                  <Link href="/farmer-health" className="flex items-center justify-between p-4 hover:bg-white/5 rounded-2xl transition-all duration-300 cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-purple-500/30">
                        <Users className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{t('homepage.health_updates.farmer_health')}</p>
                        <p className="text-xs text-white/60">{t('homepage.health_updates.rural_healthcare')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-white">2.5K+</p>
                      <p className="text-xs text-emerald-400 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {t('homepage.health_updates.served')}
                      </p>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Emergency Contacts */}
              <div className="glass rounded-3xl p-6 backdrop-blur-xl border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-6">{t('homepage.emergency_contacts.title')}</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-2xl transition-colors duration-300">
                    <div className="w-10 h-10 bg-red-500/20 rounded-2xl flex items-center justify-center border border-red-500/30">
                      <Phone className="w-5 h-5 text-red-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-white">{t('homepage.emergency_contacts.ambulance')}</p>
                      <p className="text-xs text-white/60">{t('homepage.emergency_contacts.emergency_number')}</p>
                    </div>
                    <button 
                      onClick={() => handleEmergencyCall('ambulance')}
                      className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-xl transition-colors duration-300 text-sm font-medium border border-red-500/30"
                    >
                      {t('homepage.emergency_contacts.call')}
                    </button>
                  </div>

                  <div className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-2xl transition-colors duration-300">
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-2xl flex items-center justify-center border border-emerald-500/30">
                      <MapPin className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-white">{t('homepage.emergency_contacts.nearest_hospital')}</p>
                      <p className="text-xs text-white/60">{t('homepage.emergency_contacts.find_nearby_centers')}</p>
                    </div>
                    <button 
                      onClick={handleFindNearestHospital}
                      className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-xl transition-colors duration-300 text-sm font-medium border border-emerald-500/30"
                    >
                      {t('homepage.emergency_contacts.find')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
