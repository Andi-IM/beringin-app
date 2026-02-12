import { ConceptStatus, Concept, ConceptWithStatus } from './concept.entity'

describe('Concept Entity', () => {
  describe('Concept Type', () => {
    it('should create a valid concept', () => {
      const concept: Concept = {
        id: 'concept-1',
        userId: 'user-1',
        title: 'Test Concept',
        description: 'Test Description',
        category: 'test',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      }

      expect(concept.id).toBe('concept-1')
      expect(concept.title).toBe('Test Concept')
      expect(concept.description).toBe('Test Description')
      expect(concept.category).toBe('test')
      expect(concept.createdAt).toEqual(new Date('2024-01-01'))
      expect(concept.updatedAt).toEqual(new Date('2024-01-01'))
    })

    it('should create a concept with optional parentId', () => {
      const concept: Concept = {
        id: 'concept-2',
        userId: 'user-1',
        title: 'Child Concept',
        description: 'Child Description',
        category: 'test',
        parentId: 'concept-1',
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
      }

      expect(concept.parentId).toBe('concept-1')
    })

    it('should create a concept without parentId', () => {
      const concept: Concept = {
        id: 'concept-3',
        userId: 'user-1',
        title: 'Root Concept',
        description: 'Root Description',
        category: 'test',
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-03'),
      }

      expect(concept.parentId).toBeUndefined()
    })
  })

  describe('ConceptWithStatus Type', () => {
    it('should create a concept with full status information', () => {
      const conceptWithStatus: ConceptWithStatus = {
        id: 'concept-4',
        userId: 'user-1',
        title: 'Learning Concept',
        description: 'Learning Description',
        category: 'test',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
        status: 'learning',
        nextReview: new Date('2024-01-05'),
        lastInterval: 3,
        easeFactor: 2.5,
      }

      expect(conceptWithStatus.status).toBe('learning')
      expect(conceptWithStatus.nextReview).toEqual(new Date('2024-01-05'))
      expect(conceptWithStatus.lastInterval).toBe(3)
      expect(conceptWithStatus.easeFactor).toBe(2.5)
    })

    it('should create a concept without optional review fields', () => {
      const conceptWithStatus: ConceptWithStatus = {
        id: 'concept-5',
        userId: 'user-1',
        title: 'New Concept',
        description: 'New Description',
        category: 'test',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        status: 'new',
        easeFactor: 2.5,
      }

      expect(conceptWithStatus.status).toBe('new')
      expect(conceptWithStatus.nextReview).toBeUndefined()
      expect(conceptWithStatus.lastInterval).toBeUndefined()
      expect(conceptWithStatus.easeFactor).toBe(2.5)
    })
  })

  describe('ConceptStatus Type', () => {
    it('should accept all valid concept statuses', () => {
      const validStatuses: ConceptStatus[] = [
        'new',
        'learning',
        'reviewing',
        'stable',
        'fragile',
        'lapsed',
      ]

      validStatuses.forEach((status) => {
        const concept: ConceptWithStatus = {
          id: `concept-${status}`,
          userId: 'user-1',
          title: `Concept ${status}`,
          description: `Description for ${status}`,
          category: 'test',
          createdAt: new Date(),
          updatedAt: new Date(),
          status,
          easeFactor: 2.5,
        }

        expect(concept.status).toBe(status)
      })
    })
  })
})
