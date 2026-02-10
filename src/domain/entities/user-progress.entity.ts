// Domain Entity: UserProgress
// Tracks learning progress per concept

import type { ConceptStatus } from './concept.entity'

export interface ProgressHistory {
  date: Date
  result: boolean // correct or incorrect
  confidence: 'high' | 'low' | 'none'
  interval: number // days
  responseTime: number // seconds
}

export interface UserProgress {
  userId: string
  conceptId: string
  status: ConceptStatus
  nextReview: Date
  lastInterval: number // in days
  easeFactor: number // SM-2 style multiplier
  history: ProgressHistory[]
  createdAt: Date
  updatedAt: Date
}
