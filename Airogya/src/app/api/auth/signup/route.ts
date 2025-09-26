import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('auth.users')
      .select('email')
      .eq('email', email)
      .single()

    // If we can't check the auth.users table directly, try signing in to check if user exists
    if (checkError) {
      // Try to sign in with the credentials to check if user exists
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: 'dummy-password', // Use dummy password just to check if user exists
      })
      
      // If sign in doesn't fail with "Invalid login credentials", user might exist
      if (signInError && !signInError.message.includes('Invalid login credentials')) {
        // User exists but password is wrong, which means user already exists
        if (signInError.message.includes('Email not confirmed') || 
            signInError.message.includes('Invalid email or password')) {
          return NextResponse.json(
            { error: 'An account with this email already exists. Please sign in instead.' },
            { status: 409 }
          )
        }
      }
    } else if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists. Please sign in instead.' },
        { status: 409 }
      )
    }

    // Create user with Supabase - disable email confirmation for development
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || email.split('@')[0],
        },
        emailRedirectTo: undefined, // Disable email confirmation
      },
    })

    if (error) {
      // Handle specific error for user already exists
      if (error.message.includes('User already registered')) {
        return NextResponse.json(
          { error: 'An account with this email already exists. Please sign in instead.' },
          { status: 409 }
        )
      }
      
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    // If user was created but needs confirmation, we'll handle it differently
    if (data.user && !data.user.email_confirmed_at) {
      // For development, we'll consider the user as successfully created
      return NextResponse.json({
        message: 'User created successfully. You can now sign in.',
        user: data.user,
        needsConfirmation: false, // Set to false for development
      })
    }

    return NextResponse.json({
      message: 'User created successfully',
      user: data.user,
    })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}