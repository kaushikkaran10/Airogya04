'use client';

import { Shield, Heart, Bot, Syringe, AlertTriangle, Leaf, Hospital, Activity } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';

export default function HealthcareServices() {
  const { t } = useTranslation();

  const services = [
    {
      id: 'govt-schemes',
      href: '/government-schemes',
      icon: Shield,
      title: t('services.govt_schemes.title'),
      description: t('services.govt_schemes.description'),
      iconColor: 'text-blue-400',
      bgColor: 'bg-blue-900/20'
    },
    {
      id: 'medical-assistant',
      href: '/symptom-checker',
      icon: Bot,
      title: t('services.medical_assistant.title'),
      description: t('services.medical_assistant.description'),
      iconColor: 'text-purple-400',
      bgColor: 'bg-purple-900/20'
    },
    {
      id: 'health-risk-assessment',
      href: '/health-risk-assessment',
      icon: Activity,
      title: t('services.health_risk_assessment.title'),
      description: t('services.health_risk_assessment.description'),
      iconColor: 'text-orange-400',
      bgColor: 'bg-orange-900/20'
    },
    {
      id: 'vaccination-tracker',
      href: '/vaccination-tracker',
      icon: Syringe,
      title: t('services.vaccination_tracker.title'),
      description: t('services.vaccination_tracker.description'),
      iconColor: 'text-green-400',
      bgColor: 'bg-green-900/20'
    },
    
    {
      id: 'farmer-health',
      href: '/farmer-health',
      icon: Leaf,
      title: t('services.farmer_health.title'),
      description: t('services.farmer_health.description'),
      iconColor: 'text-teal-400',
      bgColor: 'bg-teal-900/20'
    },
    {
      id: 'healthcare-centers',
      href: '/healthcare-centers',
      icon: Hospital,
      title: t('Healthcare centers'),
      description: t('Healthcare centers'),
      iconColor: 'text-red-400',
      bgColor: 'bg-red-900/20'
    }
  ];

  return (
    <>
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-slide-up-fade">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground font-headline">{t('services.title')}</h2>
            <p className="mt-2 text-lg text-muted-foreground">
              {t('services.subtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Link href={service.href} key={service.id} className="flex">
                 <Card
                  style={{ animationDelay: `${index * 100}ms`}}
                  className={`bg-card/50 backdrop-blur-sm text-left transition-all duration-300 transform w-full h-full animate-slide-up-fade hover:bg-card/80 hover:shadow-primary/10 hover:shadow-lg hover:-translate-y-2 cursor-pointer`}
                >
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className={`p-3 rounded-lg ${service.bgColor}`}>
                      <service.icon className={`w-6 h-6 ${service.iconColor}`} />
                    </div>
                    <CardTitle className="text-lg font-semibold">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{service.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
