// Domain Entity: Concept
// Pure business logic - no framework dependencies

export type ConceptStatus =
  | 'new'
  | 'learning'
  | 'reviewing'
  | 'stable'
  | 'fragile'
  | 'lapsed'

export interface Concept {
  id: string
  userId: string // Owner of this concept
  title: string
  description: string
  category: string
  parentId?: string
  createdAt: Date
  updatedAt: Date
}

export interface ConceptWithStatus extends Concept {
  status: ConceptStatus
  nextReview?: Date
  lastInterval?: number // in days
  easeFactor: number
}
