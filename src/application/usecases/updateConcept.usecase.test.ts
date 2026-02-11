import { updateConcept } from './updateConcept.usecase'
import {
  InMemoryConceptRepository,
  resetConcepts,
} from '@/infrastructure/repositories/in-memory.repository'
import type { Concept } from '@/domain/entities/concept.entity'

describe('updateConcept Use Case', () => {
  let conceptRepo: InMemoryConceptRepository
  let existingConcept: Concept

  beforeEach(async () => {
    resetConcepts()
    conceptRepo = new InMemoryConceptRepository()
    existingConcept = await conceptRepo.create({
      title: 'Old Title',
      description: 'Old Description',
      category: 'Old Category',
    })
  })

  it('should update an existing concept', async () => {
    // Arrange
    const updateData = {
      title: 'New Title',
      description: 'New Description',
    }

    // Act
    const result = await updateConcept(
      existingConcept.id,
      updateData,
      conceptRepo,
    )

    // Assert
    expect(result.id).toBe(existingConcept.id)
    expect(result.title).toBe(updateData.title)
    expect(result.description).toBe(updateData.description)
    expect(result.category).toBe(existingConcept.category) // Unchanged
    expect(result.updatedAt.getTime()).toBeGreaterThan(
      existingConcept.updatedAt.getTime(),
    )
  })

  it('should throw error if concept not found', async () => {
    // Act & Assert
    await expect(
      updateConcept('non-existent-id', { title: 'New' }, conceptRepo),
    ).rejects.toThrow('Concept not found')
  })
})
