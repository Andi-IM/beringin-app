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
import type { EdgeOneKV } from './edgeone-kv.types'

const CONCEPT_PREFIX = 'concept:'

function serializeConcept(concept: Concept): string {
  return JSON.stringify({
    ...concept,
    createdAt: concept.createdAt.toISOString(),
    updatedAt: concept.updatedAt.toISOString(),
  })
}

function deserializeConcept(data: string): Concept {
  const parsed = JSON.parse(data) as Record<string, unknown>
  return {
    ...parsed,
    createdAt: new Date(parsed.createdAt as string),
    updatedAt: new Date(parsed.updatedAt as string),
  } as Concept
}

export class KVConceptRepository implements ConceptRepository {
  constructor(private readonly kv: EdgeOneKV) {}

  async findById(id: string): Promise<Concept | null> {
    const data = await this.kv.get(`${CONCEPT_PREFIX}${id}`)
    if (!data) return null
    return deserializeConcept(data)
  }

  async findAll(): Promise<Concept[]> {
    const concepts: Concept[] = []

    const { keys } = await this.kv.list({ prefix: CONCEPT_PREFIX })

    for (const { name } of keys) {
      const data = await this.kv.get(name)
      if (data) {
        concepts.push(deserializeConcept(data))
      }
    }

    return concepts
  }

  async findByCategory(category: string): Promise<Concept[]> {
    const all = await this.findAll()
    return all.filter((c) => c.category === category)
  }

  async create(
    data: Omit<Concept, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Concept> {
    const concept: Concept = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await this.kv.put(
      `${CONCEPT_PREFIX}${concept.id}`,
      serializeConcept(concept),
    )

    return concept
  }

  async update(id: string, data: Partial<Concept>): Promise<Concept> {
    const existing = await this.findById(id)
    if (!existing) throw new Error('Concept not found')

    const updated: Concept = {
      ...existing,
      ...data,
      updatedAt: new Date(),
    }

    await this.kv.put(`${CONCEPT_PREFIX}${id}`, serializeConcept(updated))
    return updated
  }

  async delete(id: string): Promise<void> {
    await this.kv.delete(`${CONCEPT_PREFIX}${id}`)
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
