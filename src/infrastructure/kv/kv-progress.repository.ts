// Infrastructure: KV Progress Repository
// Implements ProgressRepository using EdgeOne KV

import type { UserProgress } from '@/domain/entities/user-progress.entity'
import type { ProgressRepository } from '../repositories/progress.repository'

const PROGRESS_ENDPOINT = '/edge-api/progress'

function deserializeProgress(parsed: Record<string, unknown>): UserProgress {
  const history = ((parsed.history as unknown[]) || []).map((h) => {
    const entry = h as Record<string, unknown>
    return {
      ...entry,
      date: new Date(entry.date as string),
    }
  })

  return {
    ...parsed,
    nextReview: new Date(parsed.nextReview as string),
    createdAt: new Date(parsed.createdAt as string),
    updatedAt: new Date(parsed.updatedAt as string),
    history,
  } as UserProgress
}

export class KVProgressRepository implements ProgressRepository {
  async findByUserAndConcept(
    userId: string,
    conceptId: string,
  ): Promise<UserProgress | null> {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
      const response = await fetch(
        `${baseUrl}${PROGRESS_ENDPOINT}?userId=${userId}&conceptId=${conceptId}`,
      )
      if (!response.ok) return null
      const { data } = await response.json()
      return data ? deserializeProgress(data) : null
    } catch (error) {
      console.error('Failed to find progress:', error)
      return null
    }
  }

  async findByUserId(userId: string): Promise<UserProgress[]> {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
      const response = await fetch(
        `${baseUrl}${PROGRESS_ENDPOINT}?userId=${userId}`,
      )
      if (!response.ok) return []
      const { data } = await response.json()
      return (data || []).map(deserializeProgress)
    } catch (error) {
      console.error('Failed to find all progress for user:', error)
      return []
    }
  }

  async create(
    data: Omit<UserProgress, 'createdAt' | 'updatedAt'>,
  ): Promise<UserProgress> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}${PROGRESS_ENDPOINT}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'create',
        userId: data.userId,
        conceptId: data.conceptId,
        data,
      }),
    })

    if (!response.ok) throw new Error('Failed to create progress')
    const result = await response.json()
    return deserializeProgress(result.data)
  }

  async update(
    userId: string,
    conceptId: string,
    data: Partial<UserProgress>,
  ): Promise<UserProgress> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}${PROGRESS_ENDPOINT}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update',
        userId,
        conceptId,
        data,
      }),
    })

    if (!response.ok) throw new Error('Failed to update progress')
    const result = await response.json()
    return deserializeProgress(result.data)
  }

  // New method to leverage Edge-side SM-2
  async recordReview(
    userId: string,
    conceptId: string,
    grade: number,
  ): Promise<UserProgress> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}${PROGRESS_ENDPOINT}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'review',
        userId,
        conceptId,
        grade,
      }),
    })

    if (!response.ok) throw new Error('Failed to record review')
    const result = await response.json()
    return deserializeProgress(result.data)
  }

  async delete(userId: string, conceptId: string): Promise<void> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    await fetch(`${baseUrl}${PROGRESS_ENDPOINT}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', userId, conceptId }),
    })
  }
}
