// Tests: KV Question Repository

import { KVQuestionRepository } from './kv-question.repository'
import type { EdgeOneKV } from './edgeone-kv.types'
import type { ProgressRepository } from '../repositories/progress.repository'
import type { UserProgress } from '@/domain/entities/user-progress.entity'

function createMockKV(): EdgeOneKV & { store: Map<string, string> } {
  const store = new Map<string, string>()
  return {
    store,
    get: jest.fn((key: string) => Promise.resolve(store.get(key) ?? null)),
    put: jest.fn((key: string, value: string) => {
      store.set(key, value)
      return Promise.resolve()
    }),
    delete: jest.fn((key: string) => {
      store.delete(key)
      return Promise.resolve()
    }),
    list: jest.fn(
      (options?: { prefix?: string; limit?: number }) => {
        const allKeys = Array.from(store.keys())
        const filteredKeys = options?.prefix
          ? allKeys.filter((key) => key.startsWith(options.prefix as string))
          : allKeys
        const keys = filteredKeys.map((name) => ({ name }))
        return Promise.resolve({ keys })
      },
    ),
  }
}

function createMockProgressRepo(
  progressData: UserProgress[] = [],
): ProgressRepository {
  return {
    findByUserAndConcept: jest.fn(),
    findByUserId: jest.fn().mockResolvedValue(progressData),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  }
}

describe('KVQuestionRepository', () => {
  let kv: ReturnType<typeof createMockKV>
  let repo: KVQuestionRepository

  beforeEach(() => {
    kv = createMockKV()
    repo = new KVQuestionRepository(kv, createMockProgressRepo())
  })

  it('should create and retrieve a question', async () => {
    const question = await repo.create({
      conceptId: 'concept-1',
      prompt: 'Explain TCP handshake',
      answerCriteria: 'SYN, SYN-ACK, ACK',
      type: 'text',
    })

    expect(question.id).toBeDefined()
    expect(question.prompt).toBe('Explain TCP handshake')

    const found = await repo.findById(question.id)
    expect(found).not.toBeNull()
    expect(found!.prompt).toBe('Explain TCP handshake')
  })

  it('should return null for non-existent question', async () => {
    const found = await repo.findById('non-existent')
    expect(found).toBeNull()
  })

  it('should find all questions', async () => {
    await repo.create({
      conceptId: 'c1',
      prompt: 'Q1',
      answerCriteria: 'A1',
      type: 'text',
    })
    await repo.create({
      conceptId: 'c2',
      prompt: 'Q2',
      answerCriteria: 'A2',
      type: 'text',
    })

    const all = await repo.findAll()
    expect(all).toHaveLength(2)
  })

  it('should find questions by concept ID', async () => {
    await repo.create({
      conceptId: 'c1',
      prompt: 'Q1',
      answerCriteria: 'A1',
      type: 'text',
    })
    await repo.create({
      conceptId: 'c1',
      prompt: 'Q2',
      answerCriteria: 'A2',
      type: 'text',
    })
    await repo.create({
      conceptId: 'c2',
      prompt: 'Q3',
      answerCriteria: 'A3',
      type: 'text',
    })

    const c1Questions = await repo.findByConceptId('c1')
    expect(c1Questions).toHaveLength(2)

    const c2Questions = await repo.findByConceptId('c2')
    expect(c2Questions).toHaveLength(1)
  })

  it('should find due questions based on progress', async () => {
    const pastDate = new Date(Date.now() - 86400000)
    const futureDate = new Date(Date.now() + 86400000)

    const progressData: UserProgress[] = [
      {
        userId: 'user1',
        conceptId: 'c1',
        status: 'reviewing',
        nextReview: pastDate,
        lastInterval: 1,
        easeFactor: 2.5,
        history: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 'user1',
        conceptId: 'c2',
        status: 'stable',
        nextReview: futureDate,
        lastInterval: 7,
        easeFactor: 2.5,
        history: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    const repoWithProgress = new KVQuestionRepository(
      kv,
      createMockProgressRepo(progressData),
    )

    await repoWithProgress.create({
      conceptId: 'c1',
      prompt: 'Due Q',
      answerCriteria: 'A',
      type: 'text',
    })
    await repoWithProgress.create({
      conceptId: 'c2',
      prompt: 'Not Due Q',
      answerCriteria: 'B',
      type: 'text',
    })

    const due = await repoWithProgress.findDueQuestions('user1')
    expect(due).toHaveLength(1)
    expect(due[0].prompt).toBe('Due Q')
  })

  it('should update a question', async () => {
    const question = await repo.create({
      conceptId: 'c1',
      prompt: 'Old prompt',
      answerCriteria: 'A',
      type: 'text',
    })

    const updated = await repo.update(question.id, { prompt: 'New prompt' })
    expect(updated.prompt).toBe('New prompt')
  })

  it('should throw when updating non-existent question', async () => {
    await expect(repo.update('bad-id', { prompt: 'X' })).rejects.toThrow(
      'Question not found',
    )
  })

  it('should delete a question and update indices', async () => {
    const question = await repo.create({
      conceptId: 'c1',
      prompt: 'To Delete',
      answerCriteria: 'A',
      type: 'text',
    })

    await repo.delete(question.id)

    const found = await repo.findById(question.id)
    expect(found).toBeNull()

    const all = await repo.findAll()
    expect(all).toHaveLength(0)

    const byConceptId = await repo.findByConceptId('c1')
    expect(byConceptId).toHaveLength(0)
  })
})
