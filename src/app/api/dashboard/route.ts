// API Route: Dashboard Data
// Using Edge Runtime for EdgeOne KV access

import { Registry } from '@/registry'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || 'demo-user'

    const data = await Registry.getDashboardData(userId)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Dashboard API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 },
    )
  }
}
