// API Route: Submit Answer
// Using Edge Runtime for EdgeOne KV access

import { Registry } from '@/registry'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validation
    const { userId: sessionUserId } = await Registry.getCurrentUser()
    const {
      userId: bodyUserId,
      conceptId,
      questionId,
      userAnswer,
      isCorrect,
      confidence,
      responseTime,
    } = body
    const userId = sessionUserId || bodyUserId
    if (
      !userId ||
      !conceptId ||
      !questionId ||
      typeof isCorrect !== 'boolean'
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      )
    }

    const result = await Registry.submitAnswer({
      userId,
      conceptId,
      questionId,
      userAnswer,
      isCorrect,
      confidence,
      responseTime,
    })

    return NextResponse.json(result)
  } catch (error) {
    if (process.env.NODE_ENV !== 'test') {
      console.error('Submit Answer API Error:', error)
    }
    return NextResponse.json(
      { error: 'Failed to submit answer' },
      { status: 500 },
    )
  }
}
