import { AuthApi } from './auth.api'
import { createClient } from '@/infrastructure/auth/supabase-browser'

jest.mock('@/infrastructure/auth/supabase-browser', () => ({
  createClient: jest.fn(),
}))

describe('AuthApi', () => {
  const mockSupabase = {
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      signInWithOAuth: jest.fn(),
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(createClient as jest.Mock).mockReturnValue(mockSupabase)
  })

  describe('signIn', () => {
    it('returns success true on successful sign in', async () => {
      mockSupabase.auth.signInWithPassword.mockResolvedValue({ error: null })
      const result = await AuthApi.signIn({
        email: 'test@example.com',
        password: 'password',
      })
      expect(result).toEqual({ success: true })
      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password',
      })
    })

    it('returns error on failed sign in', async () => {
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        error: { message: 'Invalid credentials' },
      })
      const result = await AuthApi.signIn({
        email: 'test@example.com',
        password: 'password',
      })
      expect(result).toEqual({ success: false, error: 'Invalid credentials' })
    })
  })

  describe('signUp', () => {
    it('returns success true on successful sign up', async () => {
      mockSupabase.auth.signUp.mockResolvedValue({ error: null })

      const result = await AuthApi.signUp({
        email: 'test@example.com',
        password: 'password',
      })
      expect(result).toEqual({ success: true })
      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password',
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
    })

    it('returns error on failed sign up', async () => {
      mockSupabase.auth.signUp.mockResolvedValue({
        error: { message: 'User already exists' },
      })
      const result = await AuthApi.signUp({
        email: 'test@example.com',
        password: 'password',
      })
      expect(result).toEqual({ success: false, error: 'User already exists' })
    })
  })

  describe('signOut', () => {
    it('calls signOut successfully', async () => {
      mockSupabase.auth.signOut.mockResolvedValue({ error: null })
      await expect(AuthApi.signOut()).resolves.toBeUndefined()
      expect(mockSupabase.auth.signOut).toHaveBeenCalled()
    })

    it('throws error on failed signOut', async () => {
      const mockError = new Error('Signout failed')
      mockSupabase.auth.signOut.mockResolvedValue({ error: mockError })
      await expect(AuthApi.signOut()).rejects.toThrow('Signout failed')
    })
  })

  describe('signInWithGoogle', () => {
    it('returns success true on successful google sign in', async () => {
      mockSupabase.auth.signInWithOAuth.mockResolvedValue({ error: null })
      const result = await AuthApi.signInWithGoogle()
      expect(result).toEqual({ success: true })
      expect(mockSupabase.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
    })

    it('returns error on failed google sign in', async () => {
      mockSupabase.auth.signInWithOAuth.mockResolvedValue({
        error: { message: 'OAuth error' },
      })
      const result = await AuthApi.signInWithGoogle()
      expect(result).toEqual({ success: false, error: 'OAuth error' })
    })
  })
})
