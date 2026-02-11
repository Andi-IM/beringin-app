import { createConcept } from './createConcept.usecase'
import {
  InMemoryConceptRepository,
  resetConcepts,
} from '@/infrastructure/repositories/in-memory.repository'

describe('createConcept Use Case', () => {
  let conceptRepo: InMemoryConceptRepository

  beforeEach(() => {
    resetConcepts()
    conceptRepo = new InMemoryConceptRepository()
  })

  it('should create a new concept', async () => {
    // Arrange
    const data = {
      title: 'New Concept',
      description: 'New Description',
      category: 'General',
    }

    // Act
    const result = await createConcept(data, conceptRepo)

    // Assert
    expect(result.id).toBeDefined()
    expect(result.title).toBe(data.title)
    expect(result.description).toBe(data.description)
    expect(result.createdAt).toBeDefined()
  })

  it('should throw error if title is missing', async () => {
    // Arrange
    const data = {
      title: '',
      description: 'Desc',
      category: 'Cat',
    }

    // Act & Assert
    await expect(createConcept(data, conceptRepo)).rejects.toThrow(
      'Title is required',
    )
  })

  it('should throw error if description is missing', async () => {
    // Arrange
    const data = {
      title: 'Title',
      description: '',
      category: 'Cat',
    }

    // Act & Assert
    await expect(createConcept(data, conceptRepo)).rejects.toThrow(
      'Description is required',
    )
  })
})
