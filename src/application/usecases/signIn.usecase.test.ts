import { signIn } from './signIn.usecase'
import { createClient } from '@/infrastructure/auth/supabase-client'

jest.mock('@/infrastructure/auth/supabase-client')

describe('signIn Use Case', () => {
  const mockSignInWithPassword = jest.fn()
  const mockSupabase = {
    auth: {
      signInWithPassword: mockSignInWithPassword,
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(createClient as jest.Mock).mockResolvedValue(mockSupabase)
  })

  it('should return success when sign in is successful', async () => {
    mockSignInWithPassword.mockResolvedValue({ data: {}, error: null })

    const result = await signIn({
      email: 'test@example.com',
      password: 'password123',
    })

    expect(mockSignInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    })
    expect(result).toEqual({ success: true })
  })

  it('should return error when sign in fails', async () => {
    mockSignInWithPassword.mockResolvedValue({
      data: null,
      error: { message: 'Invalid credentials' },
    })

    const result = await signIn({
      email: 'test@example.com',
      password: 'wrong',
    })

    expect(result).toEqual({ success: false, error: 'Invalid credentials' })
  })
})
