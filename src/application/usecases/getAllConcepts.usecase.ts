import type { Concept } from '@/domain/entities/concept.entity'
import type { ConceptRepository } from '@/infrastructure/repositories/concept.repository'

export async function getAllConcepts(
  userId: string,
  conceptRepo: ConceptRepository,
): Promise<Concept[]> {
  // We will need to update the repository interface to support finding by userId
  // For now, let's assume findAll returns all, and we filter (inefficient but safe for MVP transition)
  // Ideally: return await conceptRepo.findAllByUserId(userId)
  const all = await conceptRepo.findAll()
  return all.filter((c) => c.userId === userId)
}
