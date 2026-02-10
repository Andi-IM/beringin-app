// Application Use Case: Get Current User
// Retrieves the currently authenticated user's ID

import { createClient } from '@/infrastructure/auth/supabase-client'

export interface GetCurrentUserOutput {
  userId: string | null
}

export async function getCurrentUser(): Promise<GetCurrentUserOutput> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    return { userId: user?.id ?? null }
  } catch {
    return { userId: null }
  }
}
