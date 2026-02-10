// API Route: Get Next Question
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

    const question = await Registry.getNextQuestion(userId)
    return NextResponse.json(question)
  } catch (error) {
    if (process.env.NODE_ENV !== 'test') {
      console.error('Next Question API Error:', error)
    }
    return NextResponse.json(
      { error: 'Failed to fetch next question' },
      { status: 500 },
    )
  }
}
