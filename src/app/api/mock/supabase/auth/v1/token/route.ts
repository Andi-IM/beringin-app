import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()

  // Simulate successful login/signup for any email/password
  const mockUser = {
    id: 'mock-user-id',
    aud: 'authenticated',
    role: 'authenticated',
    email: body.email || 'mock@example.com',
    email_confirmed_at: new Date().toISOString(),
    phone: '',
    confirmation_sent_at: '',
    confirmed_at: new Date().toISOString(),
    last_sign_in_at: new Date().toISOString(),
    app_metadata: { provider: 'email', providers: ['email'] },
    user_metadata: {},
    identities: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const mockSession = {
    access_token: 'mock-access-token',
    token_type: 'bearer',
    expires_in: 3600,
    refresh_token: 'mock-refresh-token',
    user: mockUser,
  }

  return NextResponse.json(mockSession)
}
