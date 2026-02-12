// Infrastructure: KV Concept Repository
// Implements ConceptRepository and ConceptProgressRepository using EdgeOne KV

import type {
  Concept,
  ConceptWithStatus,
} from '@/domain/entities/concept.entity'
import type {
  ConceptRepository,
  ConceptProgressRepository,
} from '../repositories/concept.repository'
import type { ProgressRepository } from '../repositories/progress.repository'

const CONCEPT_ENDPOINT = '/edge-api/concept'

function deserializeConcept(parsed: Record<string, unknown>): Concept {
  return {
    ...parsed,
    createdAt: new Date(parsed.createdAt as string),
    updatedAt: new Date(parsed.updatedAt as string),
  } as Concept
}

export class KVConceptRepository implements ConceptRepository {
  async findById(id: string): Promise<Concept | null> {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
      const response = await fetch(`${baseUrl}${CONCEPT_ENDPOINT}?id=${id}`)
      if (!response.ok) return null
      const { data } = await response.json()
      return data ? deserializeConcept(data) : null
    } catch (error) {
      console.error('Failed to find concept by id:', error)
      return null
    }
  }

  async findAll(): Promise<Concept[]> {
    console.warn(
      'KVConceptRepository.findAll() is deprecated. Use findAllByUserId()',
    )
    return []
  }

  async findAllByUserId(userId: string): Promise<Concept[]> {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
      const response = await fetch(
        `${baseUrl}${CONCEPT_ENDPOINT}?userId=${userId}`,
      )
      if (!response.ok) return []
      const { data } = await response.json()
      return (data || []).map(deserializeConcept)
    } catch (error) {
      console.error('Failed to find concepts by user:', error)
      return []
    }
  }

  async findByCategory(category: string): Promise<Concept[]> {
    const all = await this.findAll()
    return all.filter((c) => c.category === category)
  }

  async create(
    data: Omit<Concept, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Concept> {
    const concept = {
      ...data,
      id: crypto.randomUUID(),
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}${CONCEPT_ENDPOINT}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'create', data: concept }),
    })

    if (!response.ok) throw new Error('Failed to create concept')
    const result = await response.json()
    return deserializeConcept(result.data)
  }

  async update(id: string, data: Partial<Concept>): Promise<Concept> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}${CONCEPT_ENDPOINT}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update', id, data }),
    })

    if (!response.ok) throw new Error('Failed to update concept')
    const result = await response.json()
    return deserializeConcept(result.data)
  }

  async delete(id: string): Promise<void> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    await fetch(`${baseUrl}${CONCEPT_ENDPOINT}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', id }),
    })
  }
}

export class KVConceptProgressRepository implements ConceptProgressRepository {
  constructor(
    private readonly conceptRepo: ConceptRepository,
    private readonly progressRepo: ProgressRepository,
  ) {}

  async findConceptsWithStatus(userId: string): Promise<ConceptWithStatus[]> {
    const concepts = await this.conceptRepo.findAll()
    const allProgress = await this.progressRepo.findByUserId(userId)

    return concepts.map((concept) => {
      const userProgress = allProgress.find((p) => p.conceptId === concept.id)

      return {
        ...concept,
        status: userProgress?.status || 'new',
        nextReview: userProgress?.nextReview,
        lastInterval: userProgress?.lastInterval,
        easeFactor: userProgress?.easeFactor || 2.5,
      }
    })
  }

  async findDueConcepts(userId: string): Promise<ConceptWithStatus[]> {
    const now = new Date()
    const allConcepts = await this.findConceptsWithStatus(userId)
    return allConcepts.filter((c) => !c.nextReview || c.nextReview <= now)
  }
}
