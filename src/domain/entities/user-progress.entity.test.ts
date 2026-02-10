import type { ConceptStatus } from './concept.entity'
import { ProgressHistory, UserProgress } from './user-progress.entity'

describe('UserProgress Entity', () => {
  describe('ProgressHistory Type', () => {
    it('should create a valid progress history entry', () => {
      const history: ProgressHistory = {
        date: new Date('2024-01-01'),
        result: true,
        confidence: 'high',
        interval: 7,
        responseTime: 15,
      }

      expect(history.date).toEqual(new Date('2024-01-01'))
      expect(history.result).toBe(true)
      expect(history.confidence).toBe('high')
      expect(history.interval).toBe(7)
      expect(history.responseTime).toBe(15)
    })

    it('should create a progress history entry with incorrect result', () => {
      const history: ProgressHistory = {
        date: new Date('2024-01-02'),
        result: false,
        confidence: 'low',
        interval: 1,
        responseTime: 45,
      }

      expect(history.result).toBe(false)
      expect(history.confidence).toBe('low')
      expect(history.interval).toBe(1)
      expect(history.responseTime).toBe(45)
    })

    it('should create a progress history entry with no confidence', () => {
      const history: ProgressHistory = {
        date: new Date('2024-01-03'),
        result: true,
        confidence: 'none',
        interval: 3,
        responseTime: 20,
      }

      expect(history.confidence).toBe('none')
    })
  })

  describe('UserProgress Type', () => {
    it('should create a valid user progress entry', () => {
      const history: ProgressHistory[] = [
        {
          date: new Date('2024-01-01'),
          result: true,
          confidence: 'high',
          interval: 1,
          responseTime: 10,
        },
        {
          date: new Date('2024-01-02'),
          result: false,
          confidence: 'low',
          interval: 1,
          responseTime: 25,
        },
      ]

      const userProgress: UserProgress = {
        userId: 'user-1',
        conceptId: 'concept-1',
        status: 'learning',
        nextReview: new Date('2024-01-03'),
        lastInterval: 1,
        easeFactor: 2.5,
        history,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
      }

      expect(userProgress.userId).toBe('user-1')
      expect(userProgress.conceptId).toBe('concept-1')
      expect(userProgress.status).toBe('learning')
      expect(userProgress.nextReview).toEqual(new Date('2024-01-03'))
      expect(userProgress.lastInterval).toBe(1)
      expect(userProgress.easeFactor).toBe(2.5)
      expect(userProgress.history).toHaveLength(2)
      expect(userProgress.createdAt).toEqual(new Date('2024-01-01'))
      expect(userProgress.updatedAt).toEqual(new Date('2024-01-02'))
    })

    it('should create a user progress entry with empty history', () => {
      const userProgress: UserProgress = {
        userId: 'user-2',
        conceptId: 'concept-2',
        status: 'new',
        nextReview: new Date('2024-01-01'),
        lastInterval: 0,
        easeFactor: 2.5,
        history: [],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      }

      expect(userProgress.history).toHaveLength(0)
      expect(userProgress.status).toBe('new')
      expect(userProgress.lastInterval).toBe(0)
    })

    it('should create a user progress entry with stable status', () => {
      const userProgress: UserProgress = {
        userId: 'user-3',
        conceptId: 'concept-3',
        status: 'stable',
        nextReview: new Date('2024-01-10'),
        lastInterval: 21,
        easeFactor: 2.8,
        history: [],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      }

      expect(userProgress.status).toBe('stable')
      expect(userProgress.lastInterval).toBe(21)
      expect(userProgress.easeFactor).toBe(2.8)
    })
  })

  describe('Status Integration', () => {
    it('should work with all concept statuses', () => {
      const statuses: ConceptStatus[] = [
        'new',
        'learning',
        'reviewing',
        'stable',
        'fragile',
        'lapsed',
      ]

      statuses.forEach((status) => {
        const userProgress: UserProgress = {
          userId: 'user-test',
          conceptId: 'concept-test',
          status,
          nextReview: new Date(),
          lastInterval: status === 'new' ? 0 : 1,
          easeFactor: 2.5,
          history: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        expect(userProgress.status).toBe(status)
      })
    })
  })
})
