// API Route: Dashboard Data
// Using Edge Runtime for EdgeOne KV access

import { Registry } from '@/registry'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const { userId: sessionUserId } = await Registry.getCurrentUser()
    const userId = sessionUserId || searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 },
      )
    }

    const data = await Registry.getDashboardData(userId)
    return NextResponse.json(data)
  } catch (error) {
    if (process.env.NODE_ENV !== 'test') {
      console.error('Dashboard API Error:', error)
    }
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 },
    )
  }
}
