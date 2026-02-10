// Application Use Case: Sign In
// Authenticates a user with email and password

import { createClient } from '@/infrastructure/auth/supabase-client'

export interface SignInInput {
  email: string
  password: string
}

export interface SignInOutput {
  success: boolean
  error?: string
}

export async function signIn(input: SignInInput): Promise<SignInOutput> {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}
