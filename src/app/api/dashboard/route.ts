// API Route: Dashboard Data
// Using Edge Runtime for EdgeOne KV access

import { Registry } from '@/registry'
import { NextResponse } from 'next/server'
import { logger } from '@/lib/logger'

// export const runtime = 'edge' // Commented out for local dev (shared memory)

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

    let data = await Registry.getDashboardData(userId)

    if (data.concepts.length === 0) {
      await Registry.ensureUserOnboarded(userId)
      // Re-fetch data after seeding
      data = await Registry.getDashboardData(userId)
    }

    return NextResponse.json(data)
  } catch (error) {
    logger.error('Dashboard API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 },
    )
  }
}
