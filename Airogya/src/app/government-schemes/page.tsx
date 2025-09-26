'use client'

import { useState, useMemo } from 'react'
import { Search, Filter, MapPin, Calendar, Users, Phone, ExternalLink, Heart, Shield, Baby, Stethoscope, Activity, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Header from "@/components/layout/header"
import { useTranslation } from '@/hooks/use-translation'

// Health-related government schemes data
const healthSchemes = [
  // Central Government Health Schemes
  {
    id: 1,
    name: "Ayushman Bharat (AB-PMJAY)",
    description: "World's largest health insurance scheme providing coverage up to ₹5 lakh per family per year",
    type: "Health Insurance",
    level: "Central",
    coverage: "Secondary and tertiary care hospitalization",
    beneficiaries: "10.74 crore poor and vulnerable families",
    launchYear: 2018,
    status: "Active",
    centers: ["All empaneled hospitals across India"],
    benefits: ["Free treatment up to ₹5 lakh", "Cashless treatment", "Pre and post hospitalization coverage"],
    applicationProcess: "Apply through Common Service Centers or online portal",
    contactInfo: "14555 (Toll-free helpline)"
  },
  {
    id: 2,
    name: "Pradhan Mantri Surakshit Matritva Abhiyan (PMSMA)",
    description: "Comprehensive antenatal care services for pregnant women",
    type: "Maternal Health",
    level: "Central",
    coverage: "Antenatal checkups and care",
    beneficiaries: "All pregnant women",
    launchYear: 2016,
    status: "Active",
    centers: ["Government health facilities", "Private healthcare providers"],
    benefits: ["Free antenatal checkups", "High-risk pregnancy identification", "Specialist consultation"],
    applicationProcess: "Visit nearest health facility on 9th of every month",
    contactInfo: "104 (National Health Helpline)"
  },
  {
    id: 3,
    name: "Janani Shishu Suraksha Karyakram (JSSK)",
    description: "Free delivery and treatment services for pregnant women and sick newborns",
    type: "Maternal & Child Health",
    level: "Central",
    coverage: "Delivery care and newborn treatment",
    beneficiaries: "Pregnant women and newborns",
    launchYear: 2011,
    status: "Active",
    centers: ["Government hospitals", "Accredited private institutions"],
    benefits: ["Free delivery", "Free C-section", "Free medicines", "Free diagnostics"],
    applicationProcess: "Direct admission at government facilities",
    contactInfo: "104 (National Health Helpline)"
  },
  {
    id: 4,
    name: "Rashtriya Bal Swasthya Karyakram (RBSK)",
    description: "Child health screening and early intervention services",
    type: "Child Health",
    level: "Central",
    coverage: "Health screening for children 0-18 years",
    beneficiaries: "Children and adolescents",
    launchYear: 2013,
    status: "Active",
    centers: ["Schools", "Anganwadi centers", "Health facilities"],
    benefits: ["Free health screening", "Treatment of defects", "Referral services"],
    applicationProcess: "Screening conducted at schools and anganwadis",
    contactInfo: "104 (National Health Helpline)"
  },
  {
    id: 5,
    name: "National Programme for Prevention and Control of Cancer, Diabetes, CVD & Stroke",
    description: "Prevention and control of non-communicable diseases",
    type: "Non-Communicable Diseases",
    level: "Central",
    coverage: "Screening and treatment of NCDs",
    beneficiaries: "Adults above 30 years",
    launchYear: 2010,
    status: "Active",
    centers: ["District hospitals", "CHCs", "PHCs"],
    benefits: ["Free screening", "Early detection", "Treatment support"],
    applicationProcess: "Visit nearest health facility for screening",
    contactInfo: "104 (National Health Helpline)"
  },
  // Odisha State Health Schemes
  {
    id: 6,
    name: "Gopabandhu Jan Arogya Yojana (GJAY)",
    description: "Odisha's flagship health insurance scheme providing comprehensive healthcare coverage",
    type: "Health Insurance",
    level: "State",
    coverage: "All medical treatments including critical care",
    beneficiaries: "All families in Odisha",
    launchYear: 2018,
    status: "Active",
    centers: ["Government hospitals", "Empaneled private hospitals"],
    benefits: ["Coverage up to ₹10 lakh", "Cashless treatment", "Pre-existing disease coverage"],
    applicationProcess: "Automatic enrollment for eligible families",
    contactInfo: "14555 (State helpline)"
  },
  {
    id: 7,
    name: "Subhadra Yojana",
    description: "Women's health and empowerment scheme with healthcare benefits",
    type: "Women's Health",
    level: "State",
    coverage: "Healthcare support for women",
    beneficiaries: "Women aged 21-60 years",
    launchYear: 2024,
    status: "Active",
    centers: ["Government health facilities", "Anganwadi centers"],
    benefits: ["Health checkups", "Financial assistance", "Nutritional support"],
    applicationProcess: "Apply through Mo Sarkar portal",
    contactInfo: "155214 (Mo Sarkar helpline)"
  },
  {
    id: 8,
    name: "AMA Clinic Yojana",
    description: "Urban primary healthcare initiative providing quality healthcare at doorstep",
    type: "Primary Healthcare",
    level: "State",
    coverage: "Primary healthcare services in urban areas",
    beneficiaries: "Urban population",
    launchYear: 2023,
    status: "Active",
    centers: ["AMA Clinics in urban areas"],
    benefits: ["Free consultation", "Basic diagnostics", "Medicine supply"],
    applicationProcess: "Direct walk-in at AMA clinics",
    contactInfo: "104 (Health helpline)"
  },
  {
    id: 9,
    name: "Niramaya Yojana",
    description: "Health insurance scheme for Below Poverty Line families",
    type: "Health Insurance",
    level: "State",
    coverage: "Medical treatment for BPL families",
    beneficiaries: "BPL families in Odisha",
    launchYear: 2012,
    status: "Active",
    centers: ["Government and empaneled private hospitals"],
    benefits: ["Coverage up to ₹2 lakh", "Cashless treatment", "Family coverage"],
    applicationProcess: "Apply with BPL certificate",
    contactInfo: "14555 (State helpline)"
  },
  {
    id: 10,
    name: "Khusi Yojana",
    description: "Mental health initiative providing psychological support and treatment",
    type: "Mental Health",
    level: "State",
    coverage: "Mental health services and support",
    beneficiaries: "All citizens requiring mental health support",
    launchYear: 2022,
    status: "Active",
    centers: ["District hospitals", "Mental health centers"],
    benefits: ["Free counseling", "Psychiatric treatment", "Rehabilitation support"],
    applicationProcess: "Visit nearest mental health facility",
    contactInfo: "104 (Mental health helpline)"
  },
  {
    id: 11,
    name: "Mamata Yojana",
    description: "Conditional cash transfer scheme for pregnant and lactating women",
    type: "Maternal Health",
    level: "State",
    coverage: "Financial support for maternal health",
    beneficiaries: "Pregnant and lactating women",
    launchYear: 2011,
    status: "Active",
    centers: ["Anganwadi centers", "Health facilities"],
    benefits: ["Cash incentives", "Nutritional support", "Health checkups"],
    applicationProcess: "Register at nearest Anganwadi center",
    contactInfo: "104 (Health helpline)"
  }
]

export default function GovernmentSchemesPage() {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedLevel, setSelectedLevel] = useState('all')

  const filteredSchemes = useMemo(() => {
    return healthSchemes.filter(scheme => {
      const matchesSearch = scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          scheme.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          scheme.type.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesType = selectedType === "all" || scheme.type === selectedType
      const matchesLevel = selectedLevel === "all" || scheme.level === selectedLevel
      
      return matchesSearch && matchesType && matchesLevel
    })
  }, [searchTerm, selectedType, selectedLevel])

  const schemeTypes = [...new Set(healthSchemes.map(scheme => scheme.type))]
  const schemeLevels = [...new Set(healthSchemes.map(scheme => scheme.level))]

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
          <div className="text-center mb-16">
            <div className="gradient-border rounded-3xl mb-8 inline-block">
              <div className="bg-black rounded-3xl px-4 py-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-white/80">Healthcare Schemes Portal</span>
                </div>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="block text-white">Government</span>
              <span className="block bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">{t('pages.government_schemes.title')}</span>
            </h1>

            <p className="text-xl text-white/70 mb-12 max-w-3xl mx-auto leading-relaxed">
              Comprehensive information about central and state government health schemes designed to provide accessible healthcare for all citizens.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="glass rounded-2xl border border-white/20 p-6 backdrop-blur-xl">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/20 mx-auto mb-4">
                  <Heart className="w-6 h-6 text-emerald-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{healthSchemes.length}</div>
                <div className="text-sm text-white/60">Active Health Schemes</div>
              </div>
              <div className="glass rounded-2xl border border-white/20 p-6 backdrop-blur-xl">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/20 mx-auto mb-4">
                  <Shield className="w-6 h-6 text-blue-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">₹15L+</div>
                <div className="text-sm text-white/60">Maximum Coverage</div>
              </div>
              <div className="glass rounded-2xl border border-white/20 p-6 backdrop-blur-xl">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-500/20 mx-auto mb-4">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">50Cr+</div>
                <div className="text-sm text-white/60">Beneficiaries Covered</div>
              </div>
            </div>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="max-w-7xl mx-auto px-6 lg:px-8 pb-20">
          <div className="glass rounded-2xl border border-white/20 p-6 backdrop-blur-xl mb-12">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search schemes by name, description, or type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-emerald-400/50 focus:ring-emerald-400/20"
                />
              </div>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full lg:w-48 bg-white/5 border-white/20 text-white">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent className="bg-black border-white/20">
                  <SelectItem value="all" className="text-white hover:bg-white/10">All Types</SelectItem>
                  {schemeTypes.map(type => (
                    <SelectItem key={type} value={type} className="text-white hover:bg-white/10">{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="w-full lg:w-48 bg-white/5 border-white/20 text-white">
                  <SelectValue placeholder="Filter by level" />
                </SelectTrigger>
                <SelectContent className="bg-black border-white/20">
                  <SelectItem value="all" className="text-white hover:bg-white/10">All Levels</SelectItem>
                  {schemeLevels.map(level => (
                    <SelectItem key={level} value={level} className="text-white hover:bg-white/10">{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Schemes Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredSchemes.map((scheme, index) => {
          const getTypeIcon = (type: string) => {
            switch (type) {
              case 'Health Insurance': return <Shield className="w-5 h-5" />
              case 'Maternal Health': return <Heart className="w-5 h-5" />
              case 'Child Health': return <Baby className="w-5 h-5" />
              case 'Mental Health': return <Activity className="w-5 h-5" />
              case 'Primary Healthcare': return <Stethoscope className="w-5 h-5" />
              default: return <Heart className="w-5 h-5" />
            }
          }

          const getTypeColor = (type: string) => {
            switch (type) {
              case 'Health Insurance': return 'from-blue-500/20 to-blue-600/20 border-blue-500/30'
              case 'Maternal Health': return 'from-pink-500/20 to-pink-600/20 border-pink-500/30'
              case 'Child Health': return 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30'
              case 'Mental Health': return 'from-purple-500/20 to-purple-600/20 border-purple-500/30'
              case 'Primary Healthcare': return 'from-emerald-500/20 to-emerald-600/20 border-emerald-500/30'
              default: return 'from-gray-500/20 to-gray-600/20 border-gray-500/30'
            }
          }

          return (
            <div
              key={scheme.id}
              className="glass rounded-2xl border border-white/20 p-6 backdrop-blur-xl hover:border-white/30 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${getTypeColor(scheme.type)} border`}>
                    {getTypeIcon(scheme.type)}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white group-hover:text-emerald-400 transition-colors">
                      {scheme.name}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="secondary" className="bg-white/10 text-white/80 border-white/20">
                        {scheme.type}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={`${scheme.level === 'Central' ? 'border-blue-500/50 text-blue-400' : 'border-emerald-500/50 text-emerald-400'}`}
                      >
                        {scheme.level}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  scheme.status === 'Active' 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                }`}>
                  {scheme.status}
                </div>
              </div>

              <p className="text-white/70 mb-6 leading-relaxed">
                {scheme.description}
              </p>

              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="text-xs text-white/60 mb-1">Coverage</div>
                    <div className="text-sm text-white font-medium">{scheme.coverage}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="text-xs text-white/60 mb-1">Beneficiaries</div>
                    <div className="text-sm text-white font-medium">{scheme.beneficiaries}</div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="text-xs text-white/60 mb-2">Key Benefits</div>
                  <div className="flex flex-wrap gap-1">
                    {scheme.benefits.slice(0, 3).map((benefit, idx) => (
                      <span key={idx} className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full border border-emerald-500/30">
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="text-xs text-white/60 mb-1">Application Process</div>
                  <div className="text-sm text-white font-medium">{scheme.applicationProcess}</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex items-center space-x-4 text-sm text-white/60">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Launched {scheme.launchYear}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/20">
                    <Phone className="w-4 h-4 text-white/60" />
                  </button>
                  <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/20">
                    <ExternalLink className="w-4 h-4 text-white/60" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
          </div>

          {filteredSchemes.length === 0 && (
            <div className="text-center py-16">
              <div className="glass rounded-2xl border border-white/20 p-12 backdrop-blur-xl max-w-md mx-auto">
                <Search className="w-16 h-16 text-white/40 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No schemes found</h3>
                <p className="text-white/60">Try adjusting your search criteria or filters to find relevant health schemes.</p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
