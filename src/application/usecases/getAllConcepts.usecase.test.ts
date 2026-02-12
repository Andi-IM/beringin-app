import { getAllConcepts } from './getAllConcepts.usecase'
import {
  InMemoryConceptRepository,
  resetConcepts,
} from '@/infrastructure/repositories/in-memory.repository'
import type { Concept } from '@/domain/entities/concept.entity'

describe('getAllConcepts Use Case', () => {
  let conceptRepo: InMemoryConceptRepository

  beforeEach(() => {
    resetConcepts()
    conceptRepo = new InMemoryConceptRepository()
  })

  it('should return all concepts', async () => {
    // Arrange
    const concept1: Omit<Concept, 'id' | 'createdAt' | 'updatedAt'> = {
      title: 'Concept 1',
      description: 'Desc 1',
      category: 'Cat 1',
      userId: 'user-1',
    }
    const concept2: Omit<Concept, 'id' | 'createdAt' | 'updatedAt'> = {
      title: 'Concept 2',
      description: 'Desc 2',
      category: 'Cat 2',
      userId: 'user-1',
    }

    await conceptRepo.create(concept1)
    await conceptRepo.create(concept2)

    // Act
    const result = await getAllConcepts('user-1', conceptRepo)

    // Assert
    expect(result).toHaveLength(2)
    expect(result[0].title).toBe('Concept 1')
    expect(result[1].title).toBe('Concept 2')
  })

  it('should return empty array if no concepts exist', async () => {
    // Act
    const result = await getAllConcepts('user-1', conceptRepo)

    // Assert
    expect(result).toHaveLength(0)
  })
})
