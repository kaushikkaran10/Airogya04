'use client'

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Syringe, CheckCircle, AlertCircle, Clock, Users, Baby, Calendar } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

const childrenVaccines = [
  { name: 'BCG', protection: 'Tuberculosis protection', schedule: 'At birth', status: 'Completed' },
  { name: 'Hepatitis B', protection: 'Liver infection protection', schedule: 'At birth, 6 weeks, 14 weeks', status: 'Completed' },
  { name: 'DPT', protection: 'Diphtheria, Pertussis, Tetanus', schedule: '6, 10, 14 weeks', status: 'Due', dueDate: 'Dec 15, 2024' },
  { name: 'Polio', protection: 'Poliomyelitis protection', schedule: '6, 10, 14 weeks', status: 'Due', dueDate: 'Dec 15, 2024' },
  { name: 'Measles', protection: 'Measles protection', schedule: '9-12 months', status: 'Upcoming', dueDate: 'Jan 20, 2025' },
];

const adultVaccines = [
  { name: 'Influenza', protection: 'Flu protection', schedule: 'Annually', status: 'Completed' },
  { name: 'Tdap/Td', protection: 'Tetanus, Diphtheria, Pertussis', schedule: 'Every 10 years', status: 'Due', dueDate: 'Nov 01, 2028' },
  { name: 'COVID-19', protection: 'COVID-19 protection', schedule: 'As recommended', status: 'Upcoming', dueDate: 'Booster in 2025' },
];

const scheduleData = [
    { age: 'Birth', vaccines: ['BCG', 'Hepatitis B (Dose 1)', 'OPV (Dose 0)'] },
    { age: '6 Weeks', vaccines: ['DPT (Dose 1)', 'Hepatitis B (Dose 2)', 'Polio (Dose 1)'] },
    { age: '10 Weeks', vaccines: ['DPT (Dose 2)', 'Polio (Dose 2)'] },
    { age: '14 Weeks', vaccines: ['DPT (Dose 3)', 'Polio (Dose 3)'] },
    { age: '9-12 Months', vaccines: ['Measles (Dose 1)'] },
    { age: '15-18 Months', vaccines: ['DPT (Booster)', 'Polio (Booster)'] },
];

export default function VaccinationTrackerPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('Children');

  const getStatusBadge = (status: 'Completed' | 'Due' | 'Upcoming', dueDate?: string) => {
    switch (status) {
      case 'Completed':
        return <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg"><CheckCircle className="w-4 h-4 mr-1" />Completed</Badge>;
      case 'Due':
        return <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 shadow-lg"><AlertCircle className="w-4 h-4 mr-1" />Due: {dueDate}</Badge>;
      case 'Upcoming':
        return <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 shadow-lg"><Clock className="w-4 h-4 mr-1" />Upcoming: {dueDate}</Badge>;
      default:
        return null;
    }
  };
  
  const renderContent = () => {
    if (activeTab === 'Schedule') {
        return (
            <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl animate-fadeInUp">
                <CardHeader>
                    <CardTitle className="text-xl bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent flex items-center gap-2">
                      <Calendar className="w-6 h-6 text-green-400" />
                      National Immunization Schedule
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {scheduleData.map((item, index) => (
                            <div 
                              key={index} 
                              className="p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300 animate-slideInLeft"
                              style={{animationDelay: `${index * 100}ms`}}
                            >
                                <h3 className="font-bold text-lg bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">{item.age}</h3>
                                <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1">
                                    {item.vaccines.map((vaccine, vIndex) => (
                                        <li key={vIndex} className="leading-relaxed">{vaccine}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    const data = activeTab === 'Children' ? childrenVaccines : adultVaccines;

    return (
        <div className="space-y-4">
            {data.map((vaccine, index) => (
              <Card 
                key={index} 
                className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl hover:bg-white/10 transition-all duration-300 transform hover:scale-[1.02] animate-fadeInUp"
                style={{animationDelay: `${index * 150}ms`}}
              >
                <CardContent className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm border border-white/10">
                          <Syringe className="w-8 h-8 text-green-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">{vaccine.name}</h3>
                            <p className="text-sm text-gray-300 leading-relaxed">{vaccine.protection}</p>
                            <p className="text-xs text-gray-400 mt-1">{vaccine.schedule}</p>
                        </div>
                    </div>
                    {getStatusBadge(vaccine.status as 'Completed' | 'Due' | 'Upcoming', vaccine.dueDate)}
                </CardContent>
              </Card>
            ))}
        </div>
    );
  };

  const childrenCompleted = childrenVaccines.filter(v => v.status === 'Completed').length;
  const adultCompleted = adultVaccines.filter(v => v.status === 'Completed').length;

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
          <div className="text-center mb-8 animate-fadeInUp">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm border border-white/10 mb-6 animate-float">
              <Syringe className="w-10 h-10 text-green-400" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              Vaccination Tracker
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Track vaccination schedules and get reminders
            </p>
          </div>

          {/* Progress Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl animate-slideInLeft">
                  <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-lg bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm border border-white/10">
                          <Baby className="w-5 h-5 text-green-400" />
                        </div>
                        Children Vaccinations Complete
                      </CardTitle>
                  </CardHeader>
                  <CardContent>
                      <p className="mb-3 text-gray-300 font-medium">{childrenCompleted} of {childrenVaccines.length} vaccines</p>
                      <Progress 
                        value={(childrenCompleted / childrenVaccines.length) * 100} 
                        className="w-full h-3 bg-white/10 rounded-full overflow-hidden"
                      />
                  </CardContent>
              </Card>
              <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl animate-slideInLeft" style={{animationDelay: '200ms'}}>
                  <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-lg bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm border border-white/10">
                          <Users className="w-5 h-5 text-blue-400" />
                        </div>
                        Adult Vaccinations Complete
                      </CardTitle>
                  </CardHeader>
                  <CardContent>
                      <p className="mb-3 text-gray-300 font-medium">{adultCompleted} of {adultVaccines.length} vaccines</p>
                      <Progress 
                        value={(adultCompleted / adultVaccines.length) * 100} 
                        className="w-full h-3 bg-white/10 rounded-full overflow-hidden"
                      />
                  </CardContent>
              </Card>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-full p-1 mb-8 flex justify-between max-w-md mx-auto animate-fadeInUp">
              <Button 
                onClick={() => setActiveTab('Children')} 
                variant={activeTab === 'Children' ? 'secondary' : 'ghost'} 
                className={`flex-1 rounded-full transition-all duration-300 ${
                  activeTab === 'Children' 
                    ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg' 
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Baby className="mr-2 w-4 h-4" />Children
              </Button>
              <Button 
                onClick={() => setActiveTab('Adults')} 
                variant={activeTab === 'Adults' ? 'secondary' : 'ghost'} 
                className={`flex-1 rounded-full transition-all duration-300 ${
                  activeTab === 'Adults' 
                    ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg' 
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Users className="mr-2 w-4 h-4" />Adults
              </Button>
              <Button 
                onClick={() => setActiveTab('Schedule')} 
                variant={activeTab === 'Schedule' ? 'secondary' : 'ghost'} 
                className={`flex-1 rounded-full transition-all duration-300 ${
                  activeTab === 'Schedule' 
                    ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg' 
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Calendar className="mr-2 w-4 h-4" />Schedule
              </Button>
          </div>

          {renderContent()}

        </div>
      </div>
    </div>
  );
}
