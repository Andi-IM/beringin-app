import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()

  const mockUser = {
    id: 'mock-user-id',
    aud: 'authenticated',
    role: 'authenticated',
    email: body.email || 'mock@example.com',
    email_confirmed_at: new Date().toISOString(),
    app_metadata: { provider: 'email', providers: ['email'] },
    user_metadata: {},
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
