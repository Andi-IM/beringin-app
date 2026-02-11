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

  // Optional: validation logic for update data

  return await conceptRepo.update(id, data)
}
