import type { Concept } from '@/domain/entities/concept.entity'
import type { ConceptRepository } from '@/infrastructure/repositories/concept.repository'

export interface CreateConceptData {
  title: string
  description: string
  category: string
  parentId?: string
}

export async function createConcept(
  data: CreateConceptData,
  conceptRepo: ConceptRepository,
): Promise<Concept> {
  if (!data.title) {
    throw new Error('Title is required')
  }
  if (!data.description) {
    throw new Error('Description is required')
  }
  if (!data.category) {
    throw new Error('Category is required')
  }

  return await conceptRepo.create(data)
}
