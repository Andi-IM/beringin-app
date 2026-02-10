// Application Use Case: Sign Up
// Registers a new user with email and password

import { createClient } from '@/infrastructure/auth/supabase-client'

export interface SignUpInput {
  email: string
  password: string
}

export interface SignUpOutput {
  success: boolean
  error?: string
}

export async function signUp(input: SignUpInput): Promise<SignUpOutput> {
  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
    },
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}
