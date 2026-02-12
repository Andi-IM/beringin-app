// Infrastructure: In-Memory Implementation (for MVP)
// Will be replaced with Supabase/Firebase later

import type {
  Concept,
  ConceptWithStatus,
} from '@/domain/entities/concept.entity'
import type { Question } from '@/domain/entities/question.entity'
import type { UserProgress } from '@/domain/entities/user-progress.entity'
import type {
  ConceptRepository,
  ConceptProgressRepository,
} from './concept.repository'
import type { QuestionRepository } from './question.repository'
import type { ProgressRepository } from './progress.repository'

import fs from 'fs'
import path from 'path'

// Mock data storage
const concepts: Concept[] = []
const questions: Question[] = []
const progress: UserProgress[] = []

// File Persistence Logic (for Local Dev)
const DB_DIR = path.join(process.cwd(), '.tmp')
const DB_FILE = path.join(DB_DIR, 'db.json')

function saveDB() {
  if (typeof window !== 'undefined') return // Skip in browser if ever leaks
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true })
    }
    const data = { concepts, questions, progress }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2))
  } catch (e) {
    console.error('Failed to save DB', e)
  }
}

function loadDB() {
  if (typeof window !== 'undefined') return
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'))

      concepts.length = 0
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.concepts.forEach((c: any) => {
        concepts.push({
          ...c,
          createdAt: new Date(c.createdAt),
          updatedAt: new Date(c.updatedAt),
          nextReview: c.nextReview ? new Date(c.nextReview) : undefined,
        })
      })

      questions.length = 0
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.questions.forEach((q: any) => {
        questions.push({
          ...q,
          createdAt: new Date(q.createdAt),
          updatedAt: new Date(q.updatedAt),
        })
      })

      progress.length = 0
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.progress.forEach((p: any) => {
        progress.push({
          ...p,
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt),
          nextReview: new Date(p.nextReview),
          lastReview: p.lastReview ? new Date(p.lastReview) : undefined,
        })
      })
    }
  } catch (e) {
    console.error('Failed to load DB', e)
  }
}

// Load initially
loadDB()

// Concept Repository Implementation
export class InMemoryConceptRepository implements ConceptRepository {
  async findById(id: string): Promise<Concept | null> {
    return concepts.find((c) => c.id === id) || null
  }

  async findAll(): Promise<Concept[]> {
    return concepts
  }

  async findAllByUserId(userId: string): Promise<Concept[]> {
    return concepts.filter((c) => c.userId === userId)
  }

  async findByCategory(category: string): Promise<Concept[]> {
    return concepts.filter((c) => c.category === category)
  }

  async create(
    data: Omit<Concept, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Concept> {
    const now = new Date()
    const concept: Concept = {
      ...data,
      id: Math.random().toString(36).substring(7),
      createdAt: now,
      updatedAt: now,
    }
    concepts.push(concept)
    saveDB()
    return concept
  }

  async update(id: string, data: Partial<Concept>): Promise<Concept> {
    const index = concepts.findIndex((c) => c.id === id)
    if (index === -1) throw new Error('Concept not found')

    concepts[index] = {
      ...concepts[index],
      ...data,
      updatedAt: new Date(),
    }
    saveDB()
    return concepts[index]
  }

  async delete(id: string): Promise<void> {
    const index = concepts.findIndex((c) => c.id === id)
    if (index !== -1) {
      concepts.splice(index, 1)
      saveDB()
    }
  }
}

// Concept Progress Repository Implementation
export class InMemoryConceptProgressRepository implements ConceptProgressRepository {
  async findConceptsWithStatus(userId: string): Promise<ConceptWithStatus[]> {
    return concepts.map((concept) => {
      const userProgress = progress.find(
        (p) => p.userId === userId && p.conceptId === concept.id,
      )

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

// Question Repository Implementation
export class InMemoryQuestionRepository implements QuestionRepository {
  async findById(id: string): Promise<Question | null> {
    return questions.find((q) => q.id === id) || null
  }

  async findAll(): Promise<Question[]> {
    return questions
  }

  async findByConceptId(conceptId: string): Promise<Question[]> {
    return questions.filter((q) => q.conceptId === conceptId)
  }

  async findDueQuestions(userId: string): Promise<Question[]> {
    const now = new Date()

    // 1. Get IDs of concepts that are due for review
    const dueProgress = progress.filter(
      (p) => p.userId === userId && p.nextReview <= now,
    )
    const targetConceptIds = new Set(dueProgress.map((p) => p.conceptId))

    // 2. Get IDs of concepts that are new (no progress)
    const learnedConceptIds = new Set(
      progress.filter((p) => p.userId === userId).map((p) => p.conceptId),
    )
    const newConcepts = concepts.filter((c) => !learnedConceptIds.has(c.id))
    newConcepts.forEach((c) => targetConceptIds.add(c.id))

    // 3. Return questions for these concepts
    return questions.filter((q) => targetConceptIds.has(q.conceptId))
  }

  async create(
    data: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Question> {
    const now = new Date()
    const question: Question = {
      ...data,
      id: Math.random().toString(36).substring(7),
      createdAt: now,
      updatedAt: now,
    }
    questions.push(question)
    saveDB()
    return question
  }

  async update(id: string, data: Partial<Question>): Promise<Question> {
    const index = questions.findIndex((q) => q.id === id)
    if (index === -1) throw new Error('Question not found')

    questions[index] = {
      ...questions[index],
      ...data,
      updatedAt: new Date(),
    }
    saveDB()
    return questions[index]
  }

  async delete(id: string): Promise<void> {
    const index = questions.findIndex((q) => q.id === id)
    if (index !== -1) {
      questions.splice(index, 1)
      saveDB()
    }
  }
}

// Progress Repository Implementation
export class InMemoryProgressRepository implements ProgressRepository {
  async findByUserAndConcept(
    userId: string,
    conceptId: string,
  ): Promise<UserProgress | null> {
    return (
      progress.find((p) => p.userId === userId && p.conceptId === conceptId) ||
      null
    )
  }

  async findByUserId(userId: string): Promise<UserProgress[]> {
    return progress.filter((p) => p.userId === userId)
  }

  async create(
    data: Omit<UserProgress, 'createdAt' | 'updatedAt'>,
  ): Promise<UserProgress> {
    const now = new Date()
    const userProgress: UserProgress = {
      ...data,
      createdAt: now,
      updatedAt: now,
    }
    progress.push(userProgress)
    saveDB()
    return userProgress
  }

  async update(
    userId: string,
    conceptId: string,
    data: Partial<UserProgress>,
  ): Promise<UserProgress> {
    const index = progress.findIndex(
      (p) => p.userId === userId && p.conceptId === conceptId,
    )
    if (index === -1) throw new Error('Progress not found')

    progress[index] = {
      ...progress[index],
      ...data,
      updatedAt: new Date(),
    }
    saveDB()
    return progress[index]
  }

  async delete(userId: string, conceptId: string): Promise<void> {
    const index = progress.findIndex(
      (p) => p.userId === userId && p.conceptId === conceptId,
    )
    if (index !== -1) {
      progress.splice(index, 1)
      saveDB()
    }
  }
}

// Export singleton instances for MVP
export const conceptRepository = new InMemoryConceptRepository()
export const conceptProgressRepository = new InMemoryConceptProgressRepository()
export const questionRepository = new InMemoryQuestionRepository()
export const progressRepository = new InMemoryProgressRepository()

// Test helpers - reset all data for test isolation
export function resetAllRepositories() {
  concepts.length = 0
  questions.length = 0
  progress.length = 0
}

export function resetConcepts() {
  concepts.length = 0
}

export function resetQuestions() {
  questions.length = 0
}

export function resetProgress() {
  progress.length = 0
  saveDB()
}
