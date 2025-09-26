'use client'

import { NextAuthProvider } from '@/contexts/nextauth-provider'
import { AuthProvider } from '@/contexts/nextauth-context'
import { LanguageProvider } from '@/context/language-context'
import { EmergencyProvider } from '@/contexts/emergency-context'
import { Toaster } from '@/components/ui/toaster'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <NextAuthProvider>
      <AuthProvider>
        <LanguageProvider>
          <EmergencyProvider>
            {children}
            <Toaster />
          </EmergencyProvider>
        </LanguageProvider>
      </AuthProvider>
    </NextAuthProvider>
  )
}