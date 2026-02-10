// Infrastructure: KV Question Repository
// Implements QuestionRepository using EdgeOne KV

import type { Question } from '@/domain/entities/question.entity'
import type { QuestionRepository } from '../repositories/question.repository'
import type { ProgressRepository } from '../repositories/progress.repository'
import type { EdgeOneKV } from './edgeone-kv.types'

const QUESTION_PREFIX = 'question:'
const QUESTION_INDEX_KEY = 'questions_index'
const CONCEPT_QUESTIONS_PREFIX = 'concept_questions:'

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
    const data = await this.kv.get(`${QUESTION_PREFIX}${id}`)
    if (!data) return null
    return deserializeQuestion(data)
  }

  async findAll(): Promise<Question[]> {
    const indexData = await this.kv.get(QUESTION_INDEX_KEY)
    if (!indexData) return []

    const ids = JSON.parse(indexData) as string[]
    const questions: Question[] = []

    for (const id of ids) {
      const question = await this.findById(id)
      if (question) questions.push(question)
    }

    return questions
  }

  async findByConceptId(conceptId: string): Promise<Question[]> {
    const indexData = await this.kv.get(
      `${CONCEPT_QUESTIONS_PREFIX}${conceptId}`,
    )
    if (!indexData) return []

    const ids = JSON.parse(indexData) as string[]
    const questions: Question[] = []

    for (const id of ids) {
      const question = await this.findById(id)
      if (question) questions.push(question)
    }

    return questions
  }

  async findDueQuestions(userId: string): Promise<Question[]> {
    const now = new Date()
    const allProgress = await this.progressRepo.findByUserId(userId)
    const dueConceptIds = allProgress
      .filter((p) => p.nextReview <= now)
      .map((p) => p.conceptId)

    const questions: Question[] = []
    for (const conceptId of dueConceptIds) {
      const conceptQuestions = await this.findByConceptId(conceptId)
      questions.push(...conceptQuestions)
    }

    return questions
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
      `${QUESTION_PREFIX}${question.id}`,
      serializeQuestion(question),
    )

    // Update global index
    const indexData = await this.kv.get(QUESTION_INDEX_KEY)
    const ids: string[] = indexData ? (JSON.parse(indexData) as string[]) : []
    ids.push(question.id)
    await this.kv.put(QUESTION_INDEX_KEY, JSON.stringify(ids))

    // Update concept-specific index
    const conceptIndexData = await this.kv.get(
      `${CONCEPT_QUESTIONS_PREFIX}${question.conceptId}`,
    )
    const conceptIds: string[] = conceptIndexData
      ? (JSON.parse(conceptIndexData) as string[])
      : []
    conceptIds.push(question.id)
    await this.kv.put(
      `${CONCEPT_QUESTIONS_PREFIX}${question.conceptId}`,
      JSON.stringify(conceptIds),
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

    await this.kv.put(`${QUESTION_PREFIX}${id}`, serializeQuestion(updated))
    return updated
  }

  async delete(id: string): Promise<void> {
    const existing = await this.findById(id)
    await this.kv.delete(`${QUESTION_PREFIX}${id}`)

    // Update global index
    const indexData = await this.kv.get(QUESTION_INDEX_KEY)
    if (indexData) {
      const ids = (JSON.parse(indexData) as string[]).filter((i) => i !== id)
      await this.kv.put(QUESTION_INDEX_KEY, JSON.stringify(ids))
    }

    // Update concept-specific index
    if (existing) {
      const conceptIndexData = await this.kv.get(
        `${CONCEPT_QUESTIONS_PREFIX}${existing.conceptId}`,
      )
      if (conceptIndexData) {
        const conceptIds = (JSON.parse(conceptIndexData) as string[]).filter(
          (i) => i !== id,
        )
        await this.kv.put(
          `${CONCEPT_QUESTIONS_PREFIX}${existing.conceptId}`,
          JSON.stringify(conceptIds),
        )
      }
    }
  }
}
