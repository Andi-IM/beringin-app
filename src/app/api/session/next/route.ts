// API Route: Get Next Question
// Using Edge Runtime for EdgeOne KV access

import { Registry } from '@/registry'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || 'demo-user'

    const question = await Registry.getNextQuestion(userId)
    return NextResponse.json(question)
  } catch (error) {
    console.error('Next Question API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch next question' },
      { status: 500 },
    )
  }
}
