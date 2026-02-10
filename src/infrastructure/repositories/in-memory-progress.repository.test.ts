import {
  InMemoryProgressRepository,
  resetProgress,
} from './in-memory.repository'

describe('InMemoryProgressRepository', () => {
  let repository: InMemoryProgressRepository

  beforeEach(() => {
    // Clear all progress before each test
    resetProgress()
    repository = new InMemoryProgressRepository()
  })

  afterEach(() => {
    // Clean up after each test
    resetProgress()
  })

  describe('findByUserAndConcept', () => {
    it('should return null when progress not found', async () => {
      const result = await repository.findByUserAndConcept(
        'user-1',
        'concept-1',
      )
      expect(result).toBeNull()
    })

    it('should return progress when found', async () => {
      const createdProgress = await repository.create({
        userId: 'user-1',
        conceptId: 'concept-1',
        status: 'learning',
        nextReview: new Date('2024-01-10'),
        lastInterval: 1,
        easeFactor: 2.5,
        history: [],
      })

      const result = await repository.findByUserAndConcept(
        'user-1',
        'concept-1',
      )
      expect(result).toEqual(createdProgress)
    })

    it('should return null when user does not match', async () => {
      await repository.create({
        userId: 'user-1',
        conceptId: 'concept-1',
        status: 'learning',
        nextReview: new Date('2024-01-10'),
        lastInterval: 1,
        easeFactor: 2.5,
        history: [],
      })

      const result = await repository.findByUserAndConcept(
        'user-2',
        'concept-1',
      )
      expect(result).toBeNull()
    })

    it('should return null when concept does not match', async () => {
      await repository.create({
        userId: 'user-1',
        conceptId: 'concept-1',
        status: 'learning',
        nextReview: new Date('2024-01-10'),
        lastInterval: 1,
        easeFactor: 2.5,
        history: [],
      })

      const result = await repository.findByUserAndConcept(
        'user-1',
        'concept-2',
      )
      expect(result).toBeNull()
    })
  })

  describe('findByUserId', () => {
    it('should return empty array for non-existent user', async () => {
      const result = await repository.findByUserId('non-existent-user')
      expect(result).toEqual([])
    })

    it('should return all progress for specific user', async () => {
      await repository.create({
        userId: 'user-1',
        conceptId: 'concept-1',
        status: 'learning',
        nextReview: new Date('2024-01-10'),
        lastInterval: 1,
        easeFactor: 2.5,
        history: [],
      })
      await repository.create({
        userId: 'user-2',
        conceptId: 'concept-2',
        status: 'stable',
        nextReview: new Date('2024-01-15'),
        lastInterval: 21,
        easeFactor: 2.8,
        history: [],
      })
      await repository.create({
        userId: 'user-1',
        conceptId: 'concept-3',
        status: 'new',
        nextReview: new Date('2024-01-05'),
        lastInterval: 0,
        easeFactor: 2.5,
        history: [],
      })

      const user1Progress = await repository.findByUserId('user-1')
      expect(user1Progress).toHaveLength(2)
      user1Progress.forEach((progress) => {
        expect(progress.userId).toBe('user-1')
      })

      const user2Progress = await repository.findByUserId('user-2')
      expect(user2Progress).toHaveLength(1)
      expect(user2Progress[0].userId).toBe('user-2')
    })
  })

  describe('create', () => {
    it('should create progress with generated timestamps', async () => {
      const data = {
        userId: 'user-1',
        conceptId: 'concept-1',
        status: 'new' as const,
        nextReview: new Date('2024-01-10'),
        lastInterval: 0,
        easeFactor: 2.5,
        history: [],
      }

      const result = await repository.create(data)

      expect(result.userId).toBe(data.userId)
      expect(result.conceptId).toBe(data.conceptId)
      expect(result.status).toBe(data.status)
      expect(result.nextReview).toEqual(data.nextReview)
      expect(result.lastInterval).toBe(data.lastInterval)
      expect(result.easeFactor).toBe(data.easeFactor)
      expect(result.history).toEqual(data.history)
      expect(result.createdAt).toBeInstanceOf(Date)
      expect(result.updatedAt).toBeInstanceOf(Date)
      expect(result.createdAt).toEqual(result.updatedAt)
    })

    it('should create progress with empty history', async () => {
      const data = {
        userId: 'user-1',
        conceptId: 'concept-1',
        status: 'learning' as const,
        nextReview: new Date('2024-01-10'),
        lastInterval: 1,
        easeFactor: 2.6,
        history: [
          {
            date: new Date('2024-01-01'),
            result: true,
            confidence: 'high' as const,
            interval: 1,
            responseTime: 10,
          },
        ],
      }

      const result = await repository.create(data)

      expect(result.history).toHaveLength(1)
      expect(result.history[0]).toEqual(data.history[0])
    })
  })

  describe('update', () => {
    it('should throw error when progress not found', async () => {
      await expect(
        repository.update('user-1', 'concept-1', { status: 'stable' }),
      ).rejects.toThrow('Progress not found')
    })

    it('should update progress and set new updatedAt timestamp', async () => {
      const createdProgress = await repository.create({
        userId: 'user-1',
        conceptId: 'concept-1',
        status: 'learning',
        nextReview: new Date('2024-01-10'),
        lastInterval: 1,
        easeFactor: 2.6,
        history: [],
      })

      const originalUpdatedAt = createdProgress.updatedAt
      await new Promise((resolve) => setTimeout(resolve, 10)) // Small delay

      const updateData = {
        status: 'stable' as const,
        nextReview: new Date('2024-01-20'),
        lastInterval: 21,
        easeFactor: 2.8,
      }

      const result = await repository.update('user-1', 'concept-1', updateData)

      expect(result.userId).toBe(createdProgress.userId)
      expect(result.conceptId).toBe(createdProgress.conceptId)
      expect(result.status).toBe(updateData.status)
      expect(result.nextReview).toEqual(updateData.nextReview)
      expect(result.lastInterval).toBe(updateData.lastInterval)
      expect(result.easeFactor).toBe(updateData.easeFactor)
      expect(result.history).toEqual(createdProgress.history) // unchanged
      expect(result.createdAt).toEqual(createdProgress.createdAt) // unchanged
      expect(result.updatedAt).not.toEqual(originalUpdatedAt)
      expect(result.updatedAt).toBeInstanceOf(Date)
    })

    it('should update progress history', async () => {
      const originalHistory = [
        {
          date: new Date('2024-01-01'),
          result: true,
          confidence: 'high' as const,
          interval: 1,
          responseTime: 10,
        },
      ]

      await repository.create({
        userId: 'user-1',
        conceptId: 'concept-1',
        status: 'learning',
        nextReview: new Date('2024-01-10'),
        lastInterval: 1,
        easeFactor: 2.6,
        history: originalHistory,
      })

      const newHistory = [
        ...originalHistory,
        {
          date: new Date('2024-01-02'),
          result: false,
          confidence: 'low' as const,
          interval: 1,
          responseTime: 20,
        },
      ]

      const result = await repository.update('user-1', 'concept-1', {
        history: newHistory,
      })

      expect(result.history).toHaveLength(2)
      expect(result.history).toEqual(newHistory)
    })
  })

  describe('delete', () => {
    it('should not throw error when deleting non-existent progress', async () => {
      await expect(
        repository.delete('user-1', 'concept-1'),
      ).resolves.not.toThrow()
    })

    it('should delete existing progress', async () => {
      await repository.create({
        userId: 'user-1',
        conceptId: 'concept-1',
        status: 'learning',
        nextReview: new Date('2024-01-10'),
        lastInterval: 1,
        easeFactor: 2.5,
        history: [],
      })

      await repository.delete('user-1', 'concept-1')

      const found = await repository.findByUserAndConcept('user-1', 'concept-1')
      expect(found).toBeNull()
    })
  })

  describe('Integration with other user progress', () => {
    it('should not affect other users progress', async () => {
      await repository.create({
        userId: 'user-1',
        conceptId: 'concept-1',
        status: 'learning',
        nextReview: new Date('2024-01-10'),
        lastInterval: 1,
        easeFactor: 2.5,
        history: [],
      })

      await repository.create({
        userId: 'user-2',
        conceptId: 'concept-1',
        status: 'stable',
        nextReview: new Date('2024-01-15'),
        lastInterval: 21,
        easeFactor: 2.8,
        history: [],
      })

      // Update user 1 progress
      await repository.update('user-1', 'concept-1', { status: 'stable' })

      // Check that user 2 progress is unchanged
      const unchangedProgress = await repository.findByUserAndConcept(
        'user-2',
        'concept-1',
      )
      expect(unchangedProgress?.status).toBe('stable') // Check status directly
      expect(unchangedProgress?.nextReview).toEqual(new Date('2024-01-15')) // Check nextReview directly

      // Check that user 1 progress is updated
      const updatedProgress = await repository.findByUserAndConcept(
        'user-1',
        'concept-1',
      )
      expect(updatedProgress?.status).toBe('stable')
    })

    it('should not affect other concepts progress for same user', async () => {
      await repository.create({
        userId: 'user-1',
        conceptId: 'concept-1',
        status: 'learning',
        nextReview: new Date('2024-01-10'),
        lastInterval: 1,
        easeFactor: 2.5,
        history: [],
      })

      await repository.create({
        userId: 'user-1',
        conceptId: 'concept-2',
        status: 'stable',
        nextReview: new Date('2024-01-15'),
        lastInterval: 21,
        easeFactor: 2.8,
        history: [],
      })

      // Update concept 1 progress
      await repository.update('user-1', 'concept-1', { status: 'stable' })

      // Check that concept 2 progress is unchanged
      const unchangedProgress = await repository.findByUserAndConcept(
        'user-1',
        'concept-2',
      )
      expect(unchangedProgress?.status).toBe('stable')
      expect(unchangedProgress?.nextReview).toEqual(new Date('2024-01-15'))
      expect(unchangedProgress?.lastInterval).toBe(21)
      expect(unchangedProgress?.easeFactor).toBe(2.8)

      // Check that concept 1 progress is updated
      const updatedProgress = await repository.findByUserAndConcept(
        'user-1',
        'concept-1',
      )
      expect(updatedProgress?.status).toBe('stable')
    })
  })
})
