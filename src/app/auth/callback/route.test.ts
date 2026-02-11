import { GET } from './route'
import { NextResponse } from 'next/server'
import { createClient } from '@/infrastructure/auth/supabase-client'

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    redirect: jest.fn(),
  },
}))

// Mock Supabase Client
jest.mock('@/infrastructure/auth/supabase-client', () => ({
  createClient: jest.fn(),
}))

describe('GET /auth/callback', () => {
  const mockExchangeCodeForSession = jest.fn()
  const mockRedirect = NextResponse.redirect as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
    ;(createClient as jest.Mock).mockResolvedValue({
      auth: {
        exchangeCodeForSession: mockExchangeCodeForSession,
      },
    })
  })

  it('redirects to next url when code is valid', async () => {
    mockExchangeCodeForSession.mockResolvedValue({ error: null })
    const request = new Request(
      'http://localhost/auth/callback?code=valid-code&next=/custom-page',
    )

    await GET(request)

    expect(createClient).toHaveBeenCalled()
    expect(mockExchangeCodeForSession).toHaveBeenCalledWith('valid-code')
    expect(mockRedirect).toHaveBeenCalledWith('http://localhost/custom-page')
  })

  it('redirects to dashboard when code is valid but next is missing', async () => {
    mockExchangeCodeForSession.mockResolvedValue({ error: null })
    const request = new Request(
      'http://localhost/auth/callback?code=valid-code',
    )

    await GET(request)

    expect(createClient).toHaveBeenCalled()
    expect(mockExchangeCodeForSession).toHaveBeenCalledWith('valid-code')
    // origin + default next
    expect(mockRedirect).toHaveBeenCalledWith('http://localhost/dashboard')
  })

  it('redirects to error page when code is missing', async () => {
    const request = new Request('http://localhost/auth/callback') // No code

    await GET(request)

    expect(createClient).not.toHaveBeenCalled()
    expect(mockRedirect).toHaveBeenCalledWith(
      'http://localhost/auth/auth-code-error',
    )
  })

  it('redirects to error page when exchangeCodeForSession fails', async () => {
    mockExchangeCodeForSession.mockResolvedValue({
      error: new Error('Auth error'),
    })
    const request = new Request(
      'http://localhost/auth/callback?code=invalid-code',
    )

    await GET(request)

    expect(createClient).toHaveBeenCalled()
    expect(mockExchangeCodeForSession).toHaveBeenCalledWith('invalid-code')
    // Should fall through to the error redirect at the end of the function
    expect(mockRedirect).toHaveBeenCalledWith(
      'http://localhost/auth/auth-code-error',
    )
  })
})
