import type { Concept } from '@/domain/entities/concept.entity'
import type { ConceptRepository } from '@/infrastructure/repositories/concept.repository'

export async function getAllConcepts(
  conceptRepo: ConceptRepository,
): Promise<Concept[]> {
  return await conceptRepo.findAll()
}
