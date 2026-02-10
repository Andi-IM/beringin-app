// Infrastructure: Repository Interfaces
// Defines contracts for data access (no implementation details)

import type {
  Concept,
  ConceptWithStatus,
} from '@/domain/entities/concept.entity'

export interface ConceptRepository {
  findById(id: string): Promise<Concept | null>
  findAll(): Promise<Concept[]>
  findByCategory(category: string): Promise<Concept[]>
  create(
    concept: Omit<Concept, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Concept>
  update(id: string, data: Partial<Concept>): Promise<Concept>
  delete(id: string): Promise<void>
}

export interface ConceptProgressRepository {
  findConceptsWithStatus(userId: string): Promise<ConceptWithStatus[]>
  findDueConcepts(userId: string): Promise<ConceptWithStatus[]>
}
