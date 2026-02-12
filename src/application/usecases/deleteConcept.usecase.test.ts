import { deleteConcept } from './deleteConcept.usecase'
import {
  InMemoryConceptRepository,
  resetConcepts,
} from '@/infrastructure/repositories/in-memory.repository'
import type { Concept } from '@/domain/entities/concept.entity'

describe('deleteConcept Use Case', () => {
  let conceptRepo: InMemoryConceptRepository
  let existingConcept: Concept

  beforeEach(async () => {
    resetConcepts()
    conceptRepo = new InMemoryConceptRepository()
    existingConcept = await conceptRepo.create({
      title: 'To Delete',
      description: 'Desc',
      category: 'Cat',
      userId: 'user-1',
    })
  })

  it('should delete an existing concept', async () => {
    // Act
    await deleteConcept(existingConcept.id, conceptRepo)

    // Assert
    const deleted = await conceptRepo.findById(existingConcept.id)
    expect(deleted).toBeNull()
  })

  it('should throw error if concept not found', async () => {
    // Act & Assert
    await expect(deleteConcept('non-existent-id', conceptRepo)).rejects.toThrow(
      'Concept not found',
    )
  })
})
