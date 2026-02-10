// Infrastructure: KV Progress Repository
// Implements ProgressRepository using EdgeOne KV

import type { UserProgress } from '@/domain/entities/user-progress.entity'
import type { ProgressRepository } from '../repositories/progress.repository'
import type { EdgeOneKV } from './edgeone-kv.types'

const PROGRESS_PREFIX = 'progress:'
const USER_PROGRESS_INDEX_PREFIX = 'user_progress:'

function serializeProgress(progress: UserProgress): string {
  return JSON.stringify({
    ...progress,
    nextReview: progress.nextReview.toISOString(),
    createdAt: progress.createdAt.toISOString(),
    updatedAt: progress.updatedAt.toISOString(),
    history: progress.history.map((h) => ({
      ...h,
      date: h.date.toISOString(),
    })),
  })
}

function deserializeProgress(data: string): UserProgress {
  const parsed = JSON.parse(data) as Record<string, unknown>
  const history = (parsed.history as Array<Record<string, unknown>>).map(
    (h) => ({
      ...h,
      date: new Date(h.date as string),
    }),
  )

  return {
    ...parsed,
    nextReview: new Date(parsed.nextReview as string),
    createdAt: new Date(parsed.createdAt as string),
    updatedAt: new Date(parsed.updatedAt as string),
    history,
  } as UserProgress
}

function progressKey(userId: string, conceptId: string): string {
  return `${PROGRESS_PREFIX}${userId}:${conceptId}`
}

export class KVProgressRepository implements ProgressRepository {
  constructor(private readonly kv: EdgeOneKV) {}

  async findByUserAndConcept(
    userId: string,
    conceptId: string,
  ): Promise<UserProgress | null> {
    const data = await this.kv.get(progressKey(userId, conceptId))
    if (!data) return null
    return deserializeProgress(data)
  }

  async findByUserId(userId: string): Promise<UserProgress[]> {
    const indexData = await this.kv.get(
      `${USER_PROGRESS_INDEX_PREFIX}${userId}`,
    )
    if (!indexData) return []

    const conceptIds = JSON.parse(indexData) as string[]
    const results: UserProgress[] = []

    for (const conceptId of conceptIds) {
      const progress = await this.findByUserAndConcept(userId, conceptId)
      if (progress) results.push(progress)
    }

    return results
  }

  async create(
    data: Omit<UserProgress, 'createdAt' | 'updatedAt'>,
  ): Promise<UserProgress> {
    const userProgress: UserProgress = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await this.kv.put(
      progressKey(data.userId, data.conceptId),
      serializeProgress(userProgress),
    )

    // Update user-specific index
    const indexData = await this.kv.get(
      `${USER_PROGRESS_INDEX_PREFIX}${data.userId}`,
    )
    const conceptIds: string[] = indexData
      ? (JSON.parse(indexData) as string[])
      : []
    if (!conceptIds.includes(data.conceptId)) {
      conceptIds.push(data.conceptId)
      await this.kv.put(
        `${USER_PROGRESS_INDEX_PREFIX}${data.userId}`,
        JSON.stringify(conceptIds),
      )
    }

    return userProgress
  }

  async update(
    userId: string,
    conceptId: string,
    data: Partial<UserProgress>,
  ): Promise<UserProgress> {
    const existing = await this.findByUserAndConcept(userId, conceptId)
    if (!existing) throw new Error('Progress not found')

    const updated: UserProgress = {
      ...existing,
      ...data,
      updatedAt: new Date(),
    }

    await this.kv.put(
      progressKey(userId, conceptId),
      serializeProgress(updated),
    )
    return updated
  }

  async delete(userId: string, conceptId: string): Promise<void> {
    await this.kv.delete(progressKey(userId, conceptId))

    // Update user-specific index
    const indexData = await this.kv.get(
      `${USER_PROGRESS_INDEX_PREFIX}${userId}`,
    )
    if (indexData) {
      const conceptIds = (JSON.parse(indexData) as string[]).filter(
        (id) => id !== conceptId,
      )
      await this.kv.put(
        `${USER_PROGRESS_INDEX_PREFIX}${userId}`,
        JSON.stringify(conceptIds),
      )
    }
  }
}
