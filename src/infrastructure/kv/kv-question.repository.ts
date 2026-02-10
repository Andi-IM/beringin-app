// Infrastructure: KV Question Repository
// Implements QuestionRepository using EdgeOne KV

import type { Question } from '@/domain/entities/question.entity'
import type { QuestionRepository } from '../repositories/question.repository'
import type { ProgressRepository } from '../repositories/progress.repository'
import type { EdgeOneKV } from './edgeone-kv.types'

const QUESTION_PREFIX = 'question:'
const CONCEPT_QUESTIONS_PREFIX = 'concept_questions:'

function conceptQuestionKey(conceptId: string, questionId: string): string {
  return `${CONCEPT_QUESTIONS_PREFIX}${conceptId}:${questionId}`
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
    const data = await this.kv.get(`${QUESTION_PREFIX}${id}`)
    if (!data) return null
    return deserializeQuestion(data)
  }

  async findAll(): Promise<Question[]> {
    const questions: Question[] = []

    const { keys } = await this.kv.list({ prefix: QUESTION_PREFIX })

    for (const { name } of keys) {
      const data = await this.kv.get(name)
      if (data) {
        questions.push(deserializeQuestion(data))
      }
    }

    return questions
  }

  async findByConceptId(conceptId: string): Promise<Question[]> {
    const questions: Question[] = []

    const { keys } = await this.kv.list({
      prefix: `${CONCEPT_QUESTIONS_PREFIX}${conceptId}:`,
    })

    for (const { name } of keys) {
      const parts = name.split(':')
      const questionId = parts[parts.length - 1]
      const question = await this.findById(questionId)
      if (question) {
        questions.push(question)
      }
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

    await this.kv.put(conceptQuestionKey(question.conceptId, question.id), '1')

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

    if (existing) {
      await this.kv.delete(conceptQuestionKey(existing.conceptId, id))
    }
  }
}
