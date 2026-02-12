import type { Concept } from '@/domain/entities/concept.entity'
import type { ConceptRepository } from '@/infrastructure/repositories/concept.repository'

export async function getAllConcepts(
  userId: string,
  conceptRepo: ConceptRepository,
): Promise<Concept[]> {
  return await conceptRepo.findAllByUserId(userId)
}
