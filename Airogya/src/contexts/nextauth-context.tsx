'use client'

import { createContext, useContext } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { Session } from 'next-auth'

interface AuthContextType {
  session: Session | null
  user: Session['user'] | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: any }>
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error?: any }>
  signOut: () => Promise<void>
  signInWithGoogle: () => Promise<{ error?: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const loading = status === 'loading'

  const handleSignIn = async (email: string, password: string) => {
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: true,
        callbackUrl: '/',
      })
      
      if (result?.error) {
        return { error: { message: result.error } }
      }
      
      return { error: null }
    } catch (err) {
      console.error('SignIn error:', err)
      return { error: { message: 'Network error. Please check your connection and try again.' } }
    }
  }

  const handleSignUp = async (email: string, password: string, fullName?: string) => {
    try {
      // Call our signup API
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, fullName }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { error: { message: data.error } }
      }

      // After successful signup, automatically sign in the user
      const signInResult = await signIn('credentials', {
        email,
        password,
        redirect: true,
        callbackUrl: '/',
      })

      if (signInResult?.error) {
        // If sign in fails, still consider signup successful but inform user
        return { 
          error: null,
          message: 'Account created successfully! Please try signing in.'
        }
      }

      return { error: null }
    } catch (error) {
      console.error('Signup error:', error)
      return { error: { message: 'An unexpected error occurred during signup' } }
    }
  }

  const handleSignOut = async () => {
    await signOut({ redirect: false })
  }

  const handleSignInWithGoogle = async () => {
    try {
      const result = await signIn('google', { 
        redirect: true,
        callbackUrl: '/',
      })
      
      if (result?.error) {
        return { error: { message: result.error } }
      }
      
      return { error: null }
    } catch (err) {
      console.error('Google SignIn error:', err)
      return { error: { message: 'Network error. Please check your connection and try again.' } }
    }
  }

  const value = {
    session,
    user: session?.user || null,
    loading,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    signInWithGoogle: handleSignInWithGoogle,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}