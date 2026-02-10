// Infrastructure: KV Question Repository
// Implements QuestionRepository using EdgeOne KV

import type { Question } from '@/domain/entities/question.entity'
import type { QuestionRepository } from '../repositories/question.repository'
import type { ProgressRepository } from '../repositories/progress.repository'
import type { EdgeOneKV } from './edgeone-kv.types'

const QUESTION_PREFIX = 'question:'

function questionKey(conceptId: string, questionId: string): string {
  return `${QUESTION_PREFIX}${conceptId}:${questionId}`
}

function serializeQuestion(question: Question): string {
  return JSON.stringify({
    ...question,
    createdAt: question.createdAt.toISOString(),
    updatedAt: question.updatedAt.toISOString(),
  })
}

function deserializeQuestion(data: string): Question {
  const parsed = JSON.parse(data) as Record<string, unknown>
  return {
    ...parsed,
    createdAt: new Date(parsed.createdAt as string),
    updatedAt: new Date(parsed.updatedAt as string),
  } as Question
}

export class KVQuestionRepository implements QuestionRepository {
  constructor(
    private readonly kv: EdgeOneKV,
    private readonly progressRepo: ProgressRepository,
  ) {}

  async findById(id: string): Promise<Question | null> {
    // Since keys are structured as question:conceptId:id, we need to find the key first
    const { keys } = await this.kv.list({ prefix: QUESTION_PREFIX })
    const targetKey = keys.find((k) => k.name.endsWith(`:${id}`))
    if (!targetKey) return null

    const data = await this.kv.get(targetKey.name)
    if (!data) return null
    return deserializeQuestion(data)
  }

  async findAll(): Promise<Question[]> {
    const { keys } = await this.kv.list({ prefix: QUESTION_PREFIX })
    if (keys.length === 0) return []

    const questionDataPromises = keys.map((key) => this.kv.get(key.name))
    const allQuestionData = await Promise.all(questionDataPromises)

    return allQuestionData
      .filter((data): data is string => data !== null)
      .map(deserializeQuestion)
  }

  async findByConceptId(conceptId: string): Promise<Question[]> {
    const { keys } = await this.kv.list({
      prefix: `${QUESTION_PREFIX}${conceptId}:`,
    })
    if (keys.length === 0) return []

    const questionDataPromises = keys.map((key) => this.kv.get(key.name))
    const allQuestionData = await Promise.all(questionDataPromises)

    return allQuestionData
      .filter((data): data is string => data !== null)
      .map(deserializeQuestion)
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
    const question: Question = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await this.kv.put(
      questionKey(question.conceptId, question.id),
      serializeQuestion(question),
    )

    return question
  }

  async update(id: string, data: Partial<Question>): Promise<Question> {
    const existing = await this.findById(id)
    if (!existing) throw new Error('Question not found')

    const updated: Question = {
      ...existing,
      ...data,
      updatedAt: new Date(),
    }

    // Since conceptId might have changed, we need to handle potential key change
    if (data.conceptId && data.conceptId !== existing.conceptId) {
      await this.kv.delete(questionKey(existing.conceptId, id))
      await this.kv.put(
        questionKey(data.conceptId, id),
        serializeQuestion(updated),
      )
    } else {
      await this.kv.put(
        questionKey(existing.conceptId, id),
        serializeQuestion(updated),
      )
    }

    return updated
  }

  async delete(id: string): Promise<void> {
    const { keys } = await this.kv.list({ prefix: QUESTION_PREFIX })
    const targetKey = keys.find((k) => k.name.endsWith(`:${id}`))

    if (targetKey) {
      await this.kv.delete(targetKey.name)
    }
  }
}
