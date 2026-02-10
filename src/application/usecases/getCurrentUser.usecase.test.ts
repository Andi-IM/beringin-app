import { getCurrentUser } from './getCurrentUser.usecase'
import { createClient } from '@/infrastructure/auth/supabase-client'

jest.mock('@/infrastructure/auth/supabase-client')

describe('getCurrentUser Use Case', () => {
  const mockGetUser = jest.fn()
  const mockSupabase = {
    auth: {
      getUser: mockGetUser,
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(createClient as jest.Mock).mockResolvedValue(mockSupabase)
  })

  it('should return userId when user is authenticated', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-123' } },
      error: null,
    })

    const result = await getCurrentUser()

    expect(mockGetUser).toHaveBeenCalled()
    expect(result).toEqual({ userId: 'user-123' })
  })

  it('should return null when user is not authenticated', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: null },
      error: null,
    })

    const result = await getCurrentUser()

    expect(result).toEqual({ userId: null })
  })

  it('should return null when an error occurs', async () => {
    mockGetUser.mockRejectedValue(new Error('Supabase error'))

    const result = await getCurrentUser()

    expect(result).toEqual({ userId: null })
  })
})
