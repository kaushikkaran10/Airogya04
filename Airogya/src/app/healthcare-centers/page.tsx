'use client'

import { useState } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Phone, Globe, AlertTriangle, Clock, Building2, Stethoscope, Shield, Heart } from 'lucide-react';
import { odishaHospitalData, type OdishaHospital } from '@/lib/odisha-hospital-data';

export default function HealthcareCentersPage() {
  const { t } = useTranslation();
  const [pincode, setPincode] = useState('');
  const [hospitals, setHospitals] = useState<OdishaHospital[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [emergencyFilter, setEmergencyFilter] = useState<boolean | null>(null);

  const handleSearch = () => {
    setError(null);
    setSearched(true);

    if (!/^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/.test(pincode)) {
      setError('find_hospitals.invalid_pincode.description');
      setHospitals([]);
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const data = odishaHospitalData[pincode.replace(/\s/g, '')] || [];
      let filteredData = data;

      // Apply type filter
      if (typeFilter !== 'all') {
        filteredData = filteredData.filter(hospital => hospital.type === typeFilter);
      }

      // Apply emergency filter
      if (emergencyFilter !== null) {
        filteredData = filteredData.filter(hospital => hospital.emergency === emergencyFilter);
      }

      setHospitals(filteredData);
      if (filteredData.length === 0) {
        setError('find_hospitals.no_results.description');
      }
      setIsLoading(false);
    }, 1000);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'government': return <Shield className="w-4 h-4" />;
      case 'private': return <Building2 className="w-4 h-4" />;
      case 'charitable': return <Heart className="w-4 h-4" />;
      case 'specialty': return <Stethoscope className="w-4 h-4" />;
      default: return <Building2 className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'government': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'private': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'charitable': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'specialty': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

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
              <MapPin className="w-10 h-10 text-green-400" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              {t('pages.healthcare_centers.title')}
            </h1>
            <p className="text-lg text-white/70 mb-6">
              {t('pages.healthcare_centers.subtitle')}
            </p>
          </div>

          <Card className="max-w-4xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl animate-slideInLeft">
          <CardHeader>
            <CardTitle className="text-white text-xl font-semibold">{t('find_hospitals.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mb-6">
              {/* Search Input */}
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder={t('pages.healthcare_centers.search.placeholder')}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-400 focus:border-green-400/50 focus:ring-2 focus:ring-green-400/20"
                />
                <Button 
                  onClick={handleSearch} 
                  disabled={isLoading} 
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-medium px-6 transition-all duration-300 transform hover:scale-105"
                >
                  {isLoading ? t('pages.healthcare_centers.search.searching') : t('pages.healthcare_centers.search.button')}
                </Button>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">{t('pages.healthcare_centers.search.hospital_type')}</label>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="bg-white/10 backdrop-blur-sm border border-white/20 text-white">
                      <SelectValue placeholder={t('pages.healthcare_centers.search.all_types')} />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 backdrop-blur-xl border border-white/20">
                      <SelectItem value="all" className="text-white hover:bg-white/10">{t('pages.healthcare_centers.search.all_types')}</SelectItem>
                      <SelectItem value="government" className="text-white hover:bg-white/10">{t('pages.healthcare_centers.search.government')}</SelectItem>
                      <SelectItem value="private" className="text-white hover:bg-white/10">{t('pages.healthcare_centers.search.private')}</SelectItem>
                      <SelectItem value="charitable" className="text-white hover:bg-white/10">{t('pages.healthcare_centers.search.charitable')}</SelectItem>
                      <SelectItem value="specialty" className="text-white hover:bg-white/10">{t('pages.healthcare_centers.search.specialty')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">{t('pages.healthcare_centers.search.emergency_services')}</label>
                  <Select value={emergencyFilter === null ? 'all' : emergencyFilter.toString()} onValueChange={(value) => setEmergencyFilter(value === 'all' ? null : value === 'true')}>
                    <SelectTrigger className="bg-white/10 backdrop-blur-sm border border-white/20 text-white">
                      <SelectValue placeholder={t('pages.healthcare_centers.search.all_hospitals')} />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 backdrop-blur-xl border border-white/20">
                      <SelectItem value="all" className="text-white hover:bg-white/10">{t('pages.healthcare_centers.search.all_hospitals')}</SelectItem>
                      <SelectItem value="true" className="text-white hover:bg-white/10">{t('pages.healthcare_centers.search.emergency_available')}</SelectItem>
                      <SelectItem value="false" className="text-white hover:bg-white/10">{t('pages.healthcare_centers.search.no_emergency')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {error && (
              <Alert variant="destructive" className="bg-red-500/10 backdrop-blur-sm border border-red-500/30 text-red-300 animate-fadeInUp">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <AlertTitle>{t('find_hospitals.search_failed.title')}</AlertTitle>
                <AlertDescription>{t(error)}</AlertDescription>
              </Alert>
            )}

            {!error && !isLoading && hospitals.length === 0 && searched && (
                 <Alert className="bg-yellow-500/10 backdrop-blur-sm border border-yellow-500/30 text-yellow-300 animate-fadeInUp">
                    <AlertTriangle className="h-4 w-4 text-yellow-400" />
                    <AlertTitle>{t('find_hospitals.no_results.title')}</AlertTitle>
                    <AlertDescription>{t('find_hospitals.no_results.description')}</AlertDescription>
                </Alert>
            )}

            {hospitals.length > 0 && (
              <div className="space-y-6 mt-6">
                {hospitals.map((hospital, index) => (
                  <Card key={index} className="bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:scale-[1.02] animate-fadeInUp" style={{animationDelay: `${index * 100}ms`}}>
                    <CardContent className="p-6">
                      {/* Hospital Header */}
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-xl text-white">{hospital.name}</h3>
                            <Badge className={`${getTypeColor(hospital.type)} border`}>
                              {getTypeIcon(hospital.type)}
                              <span className="ml-1 capitalize">{hospital.type}</span>
                            </Badge>
                            {hospital.emergency && (
                              <Badge className="bg-red-500/20 text-red-300 border-red-500/30 border">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                {t('pages.healthcare_centers.results.emergency')}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-300 flex items-start gap-2 mb-2">
                            <MapPin className="w-4 h-4 mt-0.5 text-green-400 flex-shrink-0" />
                            <span>{hospital.address}</span>
                          </p>
                          <p className="text-sm text-gray-300 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-400" />
                            <span>{hospital.hours}</span>
                          </p>
                        </div>
                        
                        {/* Contact Actions */}
                        <div className="flex flex-col gap-3 items-start md:items-end">
                          <a 
                            href={`tel:${hospital.phone}`} 
                            className="flex items-center gap-2 text-sm bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent hover:from-green-300 hover:to-blue-300 transition-all duration-300 font-medium"
                          >
                            <Phone className="w-4 h-4 text-green-400" />
                            <span>{hospital.phone}</span>
                          </a>
                          {hospital.website && (
                            <a 
                              href={hospital.website} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="flex items-center gap-2 text-sm bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent hover:from-green-300 hover:to-blue-300 transition-all duration-300 font-medium"
                            >
                              <Globe className="w-4 h-4 text-blue-400" />
                              <span>{t('pages.healthcare_centers.results.visit_website')}</span>
                            </a>
                          )}
                          {hospital.directions && (
                            <a 
                              href={hospital.directions} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="flex items-center gap-2 text-sm bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent hover:from-green-300 hover:to-blue-300 transition-all duration-300 font-medium"
                            >
                              <MapPin className="w-4 h-4 text-green-400" />
                              <span>{t('pages.healthcare_centers.results.get_directions')}</span>
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Hospital Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Specialties */}
                        <div>
                          <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                            <Stethoscope className="w-4 h-4 text-green-400" />
                            {t('pages.healthcare_centers.results.specialties')}
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {hospital.specialties.slice(0, 4).map((specialty, idx) => (
                              <Badge key={idx} variant="outline" className="bg-green-500/10 text-green-300 border-green-500/30 text-xs">
                                {specialty}
                              </Badge>
                            ))}
                            {hospital.specialties.length > 4 && (
                              <Badge variant="outline" className="bg-gray-500/10 text-gray-300 border-gray-500/30 text-xs">
                                {t('pages.healthcare_centers.results.more_specialties', { count: hospital.specialties.length - 4 })}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Facilities */}
                        <div>
                          <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-blue-400" />
                            {t('pages.healthcare_centers.results.facilities')}
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {hospital.facilities.slice(0, 4).map((facility, idx) => (
                              <Badge key={idx} variant="outline" className="bg-blue-500/10 text-blue-300 border-blue-500/30 text-xs">
                                {facility}
                              </Badge>
                            ))}
                            {hospital.facilities.length > 4 && (
                              <Badge variant="outline" className="bg-gray-500/10 text-gray-300 border-gray-500/30 text-xs">
                                {t('pages.healthcare_centers.results.more_facilities', { count: hospital.facilities.length - 4 })}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Location Info */}
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span>{hospital.city}, {hospital.district} District</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

          </CardContent>
        </Card>

        </div>
      </div>
    </div>
  );
}
