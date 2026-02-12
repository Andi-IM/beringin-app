import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const authHeader = request.headers.get('Authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const mockUser = {
    id: 'mock-user-id',
    aud: 'authenticated',
    role: 'authenticated',
    email: 'mock@example.com',
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

  return NextResponse.json(mockUser)
}
