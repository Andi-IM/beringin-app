// Tests: KV Question Repository

import { KVQuestionRepository } from './kv-question.repository'
import type { ProgressRepository } from '../repositories/progress.repository'
import type { UserProgress } from '@/domain/entities/user-progress.entity'

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
  let repo: KVQuestionRepository

  beforeEach(() => {
    repo = new KVQuestionRepository(createMockProgressRepo())
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should create and retrieve a question', async () => {
    const mockQuestion = {
      id: 'q1',
      conceptId: 'concept-1',
      prompt: 'Explain TCP handshake',
      answerCriteria: 'SYN, SYN-ACK, ACK',
      type: 'text',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockQuestion }),
    })

    const question = await repo.create({
      conceptId: 'concept-1',
      prompt: 'Explain TCP handshake',
      answerCriteria: 'SYN, SYN-ACK, ACK',
      type: 'text',
    })

    expect(question.id).toBeDefined()
    expect(question.prompt).toBe('Explain TCP handshake')
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockQuestion }),
    })

    const found = await repo.findById(question.id)
    expect(found).not.toBeNull()
    expect(found!.prompt).toBe('Explain TCP handshake')
  })

  it('should return null for non-existent question', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    })

    const found = await repo.findById('non-existent')
    expect(found).toBeNull()
  })

  it('should find all questions', async () => {
    const mockData = [
      {
        id: 'q1',
        conceptId: 'c1',
        prompt: 'Q1',
        answerCriteria: 'A1',
        type: 'text',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'q2',
        conceptId: 'c2',
        prompt: 'Q2',
        answerCriteria: 'A2',
        type: 'text',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockData }),
    })

    const all = await repo.findAll()
    expect(all).toHaveLength(2)
  })

  it('should find questions by concept ID', async () => {
    const mockData = [
      {
        id: 'q1',
        conceptId: 'c1',
        prompt: 'Q1',
        answerCriteria: 'A1',
        type: 'text',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'q2',
        conceptId: 'c1',
        prompt: 'Q2',
        answerCriteria: 'A2',
        type: 'text',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockData }),
    })

    const c1Questions = await repo.findByConceptId('c1')
    expect(c1Questions).toHaveLength(2)
  })

  it('should find due questions based on progress', async () => {
    const pastDate = new Date(Date.now() - 86400000)

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
    ]

    const repoWithProgress = new KVQuestionRepository(
      createMockProgressRepo(progressData),
    )

    const mockQuestions = [
      {
        id: 'q1',
        conceptId: 'c1',
        prompt: 'Due Q',
        answerCriteria: 'A',
        type: 'text',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockQuestions }),
    })

    const due = await repoWithProgress.findDueQuestions('user1')
    expect(due).toHaveLength(1)
    expect(due[0].prompt).toBe('Due Q')
  })

  it('should update a question', async () => {
    const mockUpdated = {
      id: 'q1',
      conceptId: 'c1',
      prompt: 'New prompt',
      answerCriteria: 'A',
      type: 'text',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockUpdated }),
    })

    const updated = await repo.update('q1', { prompt: 'New prompt' })
    expect(updated.prompt).toBe('New prompt')
  })

  it('should delete a question', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
    })

    await repo.delete('q1')
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/edge-api/question'),
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('"action":"delete"'),
      }),
    )
  })
})
