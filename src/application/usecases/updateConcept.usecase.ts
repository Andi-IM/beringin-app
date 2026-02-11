import type { Concept } from '@/domain/entities/concept.entity'
import type { ConceptRepository } from '@/infrastructure/repositories/concept.repository'

export type UpdateConceptData = Partial<
  Omit<Concept, 'id' | 'createdAt' | 'updatedAt'>
>

export async function updateConcept(
  id: string,
  data: UpdateConceptData,
  conceptRepo: ConceptRepository,
): Promise<Concept> {
  const existing = await conceptRepo.findById(id)
  if (!existing) {
    throw new Error('Concept not found')
  }

  if (data.title !== undefined && data.title.length < 3) {
    throw new Error('Title must be at least 3 characters')
  }

  if (data.description !== undefined && data.description.length < 10) {
    throw new Error('Description must be at least 10 characters')
  }

  if (data.category !== undefined && !data.category) {
    throw new Error('Category is required')
  }

  return await conceptRepo.update(id, data)
}
