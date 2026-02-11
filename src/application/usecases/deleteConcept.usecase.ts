import type { ConceptRepository } from '@/infrastructure/repositories/concept.repository'

export async function deleteConcept(
  id: string,
  conceptRepo: ConceptRepository,
): Promise<void> {
  const existing = await conceptRepo.findById(id)
  if (!existing) {
    throw new Error('Concept not found')
  }

  await conceptRepo.delete(id)
}
