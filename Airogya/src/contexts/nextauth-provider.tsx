'use client'

import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'

interface NextAuthProviderProps {
  children: ReactNode
}

export function NextAuthProvider({ children }: NextAuthProviderProps) {
  return (
    <SessionProvider 
      basePath="/api/auth"
      refetchInterval={5 * 60} // Refetch session every 5 minutes
      refetchOnWindowFocus={false} // Don't refetch on window focus to reduce requests
    >
      {children}
    </SessionProvider>
  )
}