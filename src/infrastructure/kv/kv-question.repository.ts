// Infrastructure: KV Question Repository
// Implements QuestionRepository using EdgeOne KV

import type { Question } from '@/domain/entities/question.entity'
import type { QuestionRepository } from '../repositories/question.repository'
import type { ProgressRepository } from '../repositories/progress.repository'

const QUESTION_ENDPOINT = '/edge-api/question'

function deserializeQuestion(parsed: Record<string, unknown>): Question {
  return {
    ...parsed,
    createdAt: new Date(parsed.createdAt as string),
    updatedAt: new Date(parsed.updatedAt as string),
  } as Question
}

export class KVQuestionRepository implements QuestionRepository {
  constructor(private readonly progressRepo: ProgressRepository) {}

  async findById(id: string): Promise<Question | null> {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
      const response = await fetch(`${baseUrl}${QUESTION_ENDPOINT}?id=${id}`)
      if (!response.ok) return null
      const { data } = await response.json()
      return data ? deserializeQuestion(data) : null
    } catch (error) {
      console.error('Failed to find question by id:', error)
      return null
    }
  }

  async findAll(): Promise<Question[]> {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
      const response = await fetch(`${baseUrl}${QUESTION_ENDPOINT}`)
      if (!response.ok) return []
      const { data } = await response.json()
      return (data || []).map(deserializeQuestion)
    } catch (error) {
      console.error('Failed to find all questions:', error)
      return []
    }
  }

  async findByConceptId(conceptId: string): Promise<Question[]> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const response = await fetch(
      `${baseUrl}${QUESTION_ENDPOINT}?conceptId=${conceptId}`,
    )
    if (!response.ok) return []
    const { data } = await response.json()
    return (data || []).map(deserializeQuestion)
  }

  async findDueQuestions(userId: string): Promise<Question[]> {
    const now = new Date()
    const allProgress = await this.progressRepo.findByUserId(userId)
    const dueConceptIds = allProgress
      .filter((p) => p.nextReview <= now)
      .map((p) => p.conceptId)

    if (dueConceptIds.length === 0) return []

    const questionsPromises = dueConceptIds.map((conceptId) =>
      this.findByConceptId(conceptId),
    )
    const questionsArrays = await Promise.all(questionsPromises)
    return questionsArrays.flat()
  }

  async create(
    data: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Question> {
    const question = {
      ...data,
      id: crypto.randomUUID(),
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}${QUESTION_ENDPOINT}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'create', data: question }),
    })

    if (!response.ok) throw new Error('Failed to create question')
    const result = await response.json()
    return deserializeQuestion(result.data)
  }

  async update(id: string, data: Partial<Question>): Promise<Question> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}${QUESTION_ENDPOINT}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update', id, data }),
    })

    if (!response.ok) throw new Error('Failed to update question')
    const result = await response.json()
    return deserializeQuestion(result.data)
  }

  async delete(id: string): Promise<void> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    await fetch(`${baseUrl}${QUESTION_ENDPOINT}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', id }),
    })
  }
}
