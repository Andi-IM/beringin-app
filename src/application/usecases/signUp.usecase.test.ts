import { signUp } from './signUp.usecase'
import { createClient } from '@/infrastructure/auth/supabase-client'

jest.mock('@/infrastructure/auth/supabase-client')

describe('signUp Use Case', () => {
  const mockSignUp = jest.fn()
  const mockSupabase = {
    auth: {
      signUp: mockSignUp,
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(createClient as jest.Mock).mockResolvedValue(mockSupabase)
  })

  it('should return success when sign up is successful', async () => {
    mockSignUp.mockResolvedValue({ data: { user: { id: '123' } }, error: null })

    const result = await signUp({
      email: 'test@example.com',
      password: 'password123',
    })

    expect(mockSignUp).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
      options: {
        emailRedirectTo: 'http://localhost:3000/auth/callback',
      },
    })
    expect(result).toEqual({ success: true })
  })

  it('should return error when sign up fails', async () => {
    mockSignUp.mockResolvedValue({
      data: { user: null },
      error: { message: 'User already exists' },
    })

    const result = await signUp({
      email: 'test@example.com',
      password: 'password123',
    })

    expect(result).toEqual({ success: false, error: 'User already exists' })
  })
})
