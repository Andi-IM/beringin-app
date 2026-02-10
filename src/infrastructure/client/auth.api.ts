import { createClient } from '@/infrastructure/auth/supabase-browser'

const AUTH_CALLBACK_PATH = '/auth/callback'
const OAUTH_PROVIDER = { GOOGLE: 'google' as const }

const getSupabase = () => createClient()

export const AuthApi = {
  async signIn(data: { email: string; password: string }) {
    const supabase = getSupabase()
    const { error } = await supabase.auth.signInWithPassword(data)
    if (error) return { success: false, error: error.message }
    return { success: true }
  },

  async signUp(data: { email: string; password: string }) {
    const supabase = getSupabase()
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `${window.location.origin}${AUTH_CALLBACK_PATH}`,
      },
    })
    if (error) return { success: false, error: error.message }
    return { success: true }
  },

  async signOut() {
    const supabase = getSupabase()
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async signInWithGoogle() {
    const supabase = getSupabase()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: OAUTH_PROVIDER.GOOGLE,
      options: {
        redirectTo: `${window.location.origin}${AUTH_CALLBACK_PATH}`,
      },
    })
    if (error) return { success: false, error: error.message }
    return { success: true }
  },
}
