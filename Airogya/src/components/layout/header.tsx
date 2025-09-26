'use client';
import { ChevronDown, Globe, User, LogOut, Menu } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/nextauth-context'
import { signIn } from 'next-auth/react';
import { useTranslation } from '@/hooks/use-translation';
import LanguageSwitcher from '@/components/language-switcher';
import Logo from '@/components/ui/logo';
import { useState } from 'react';

export default function Header() {
  const { t } = useTranslation();
  const { user, loading, signOut } = useAuth();
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  const toggleServicesDropdown = () => {
    setIsServicesDropdownOpen(!isServicesDropdownOpen);
  };

  const toggleLanguageDropdown = () => {
    setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-nav">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-16 header-nav">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 text-lg font-semibold group">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <Logo className="h-6 w-6 text-white" />
            </div>
            <span className="text-white font-semibold">Airogya</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <div className="flex items-center gap-6 text-sm font-medium">
              <Link href="/symptom-checker" className="px-4 py-2 bg-white/10 text-white rounded-2xl hover:bg-white/20 transition-all duration-300 backdrop-blur-sm">
                {t('header.health_check')}
              </Link>
              <Link href="/healthcare-centers" className="text-white/70 hover:text-white transition-colors duration-300">
                {t('header.find_centers')}
              </Link>
              <div className="relative group">
                <button 
                  onClick={toggleServicesDropdown}
                  className="flex items-center gap-1 text-white/70 hover:text-white transition-colors duration-300"
                >
                  {t('header.services')} <ChevronDown className="w-4 h-4" />
                </button>
                {isServicesDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 glass rounded-2xl border border-white/20 shadow-xl backdrop-blur-xl">
                    <div className="p-2">
                      <Link href="/government-schemes" className="block px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors">
                        {t('header.government_schemes')}
                      </Link>
                      <Link href="/vaccination-tracker" className="block px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors">
                        Vaccination Tracker
                      </Link>
                      <Link href="/farmer-health" className="block px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors">
                        {t('header.farmer_health')}
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              <Link href="/government-schemes" className="text-white/70 hover:text-white transition-colors duration-300">
                {t('header.schemes')}
              </Link>
              <Link href="/farmer-health" className="text-white/70 hover:text-white transition-colors duration-300">
                {t('header.farmer_health')}
              </Link>
            </div>
            
            <div className="flex items-center gap-4">
               {/* Language Switcher */}
               <LanguageSwitcher />
               
               <div className="w-px h-6 bg-white/20"></div>
               
               {/* Conditional Authentication UI */}
               {loading ? (
                 // Loading state
                 <div className="flex items-center gap-2">
                   <div className="w-8 h-8 bg-white/20 rounded-full animate-pulse"></div>
                 </div>
               ) : user ? (
                 // Authenticated user
                 <div className="flex items-center gap-3">
                   <span className="text-sm font-medium text-white/70">
                     Welcome, {user.name || user.email?.split('@')[0]}
                   </span>
                   <button
                     onClick={() => signOut()}
                     className="flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors duration-300 px-3 py-2 rounded-xl hover:bg-white/10"
                   >
                     <LogOut className="w-4 h-4" />
                     Logout
                   </button>
                 </div>
               ) : (
                 // Unauthenticated user
                 <div className="flex items-center gap-3">
                   <button
                     onClick={() => signIn()}
                     className="text-sm font-medium text-white/70 hover:text-white transition-colors duration-300 px-3 py-2 rounded-xl hover:bg-white/10"
                   >
                     Sign In
                   </button>
                   <Link
                     href="/signup"
                     className="text-sm font-medium bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white px-4 py-2 rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/25"
                   >
                     Sign Up
                   </Link>
                 </div>
               )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button className="p-2 text-white/70 hover:text-white transition-colors duration-300">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
