import { createClient } from '@/infrastructure/auth/supabase-client'
import { logger } from '@/lib/logger'
import type {
  Concept,
  ConceptStatus,
  ConceptWithStatus,
} from '@/domain/entities/concept.entity'
import type { Question } from '@/domain/entities/question.entity'
import type {
  UserProgress,
  ProgressHistory,
} from '@/domain/entities/user-progress.entity'
import type {
  ConceptRepository,
  ConceptProgressRepository,
} from './concept.repository'
import type { QuestionRepository } from './question.repository'
import type { ProgressRepository } from './progress.repository'

export class SupabaseConceptRepository implements ConceptRepository {
  async findById(id: string): Promise<Concept | null> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('concepts')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) return null
    return this.mapToEntity(data)
  }

  async findAll(): Promise<Concept[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('concepts')
      .select('*')
      .order('created_at', { ascending: true })

    if (error || !data) return []
    return data.map(this.mapToEntity)
  }

  async findByCategory(category: string): Promise<Concept[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('concepts')
      .select('*')
      .eq('category', category)

    if (error || !data) return []
    return data.map(this.mapToEntity)
  }

  async create(
    data: Omit<Concept, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Concept> {
    const supabase = await createClient()
    const { data: created, error } = await supabase
      .from('concepts')
      .insert({
        title: data.title,
        description: data.description,
        category: data.category,
        parent_id: data.parentId,
      })
      .select()
      .single()

    if (error || !created)
      throw new Error(`Failed to create concept: ${error?.message}`)
    return this.mapToEntity(created)
  }

  async update(id: string, data: Partial<Concept>): Promise<Concept> {
    const supabase = await createClient()
    const { data: updated, error } = await supabase
      .from('concepts')
      .update({
        title: data.title,
        description: data.description,
        category: data.category,
        parent_id: data.parentId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error || !updated)
      throw new Error(`Failed to update concept: ${error?.message}`)
    return this.mapToEntity(updated)
  }

  async delete(id: string): Promise<void> {
    const supabase = await createClient()
    const { error } = await supabase.from('concepts').delete().eq('id', id)
    if (error) throw new Error(`Failed to delete concept: ${error.message}`)
  }

  private mapToEntity(data: {
    id: string
    title: string
    description: string
    category: string
    parent_id: string | null
    created_at: string
    updated_at: string
  }): Concept {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      category: data.category,
      parentId: data.parent_id || undefined,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    }
  }
}

export class SupabaseConceptProgressRepository implements ConceptProgressRepository {
  async findConceptsWithStatus(userId: string): Promise<ConceptWithStatus[]> {
    const supabase = await createClient()

    // Join concepts with user_progress for the specific user
    const { data, error } = await supabase
      .from('concepts')
      .select(
        `
        *,
        user_progress!left (
          status,
          next_review,
          last_interval,
          ease_factor
        )
      `,
      )
      .or(`user_id.eq.${userId},user_id.is.null`, {
        foreignTable: 'user_progress',
      })

    if (error || !data) return []

    return data.map(
      (item: {
        id: string
        title: string
        description: string
        category: string
        parent_id: string | null
        created_at: string
        updated_at: string
        user_progress: Array<{
          status: string
          next_review: string
          last_interval: number
          ease_factor: number
        }>
      }) => {
        const prog = item.user_progress?.[0]
        return {
          id: item.id,
          title: item.title,
          description: item.description,
          category: item.category,
          parentId: item.parent_id || undefined,
          createdAt: new Date(item.created_at),
          updatedAt: new Date(item.updated_at),
          status: (prog?.status as ConceptStatus) || 'new',
          nextReview: prog?.next_review
            ? new Date(prog.next_review)
            : undefined,
          lastInterval: prog?.last_interval || 0,
          easeFactor: prog?.ease_factor || 2.5,
        }
      },
    )
  }

  async findDueConcepts(userId: string): Promise<ConceptWithStatus[]> {
    const all = await this.findConceptsWithStatus(userId)
    const now = new Date()
    return all.filter((c) => !c.nextReview || c.nextReview <= now)
  }
}

export class SupabaseQuestionRepository implements QuestionRepository {
  async findById(id: string): Promise<Question | null> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) return null
    return this.mapToEntity(data)
  }

  async findAll(): Promise<Question[]> {
    const supabase = await createClient()
    const { data, error } = await supabase.from('questions').select('*')
    if (error || !data) return []
    return data.map(this.mapToEntity)
  }

  async findByConceptId(conceptId: string): Promise<Question[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('concept_id', conceptId)

    if (error || !data) return []
    return data.map(this.mapToEntity)
  }

  async findDueQuestions(userId: string): Promise<Question[]> {
    const supabase = await createClient()

    // 1. Get all concepts with their progress for this user
    // We reuse the logic from SupabaseConceptProgressRepository if possible,
    // but here we need questions. Let's do a join.

    // We want questions for concepts that:
    // a) Have no user_progress entry for this user
    // b) Have a user_progress entry with next_review <= now

    const { data, error } = await supabase
      .from('questions')
      .select('*, concepts!inner(*, user_progress!left(*))')

    if (error || !data) {
      logger.error('Error fetching due questions:', error)
      return []
    }

    // Filter in-memory for the current user's progress and due date
    const nowTime = new Date().getTime()
    return data
      .filter(
        (item: {
          concepts: {
            user_progress: Array<{
              user_id: string
              next_review: string
            }> | null
          }
        }) => {
          // Find progress record for THIS user if it exists
          const progress = item.concepts.user_progress?.find(
            (p: { user_id: string }) => p.user_id === userId,
          )
          if (!progress) return true // No progress for this user = New = Due
          return new Date(progress.next_review).getTime() <= nowTime
        },
      )
      .map(this.mapToEntity)
  }

  async create(
    data: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Question> {
    const supabase = await createClient()
    const { data: created, error } = await supabase
      .from('questions')
      .insert({
        concept_id: data.conceptId,
        prompt: data.prompt,
        answer_criteria: data.answerCriteria,
        type: data.type,
      })
      .select()
      .single()

    if (error || !created)
      throw new Error(`Failed to create question: ${error?.message}`)
    return this.mapToEntity(created)
  }

  async update(id: string, data: Partial<Question>): Promise<Question> {
    const supabase = await createClient()
    const { data: updated, error } = await supabase
      .from('questions')
      .update({
        concept_id: data.conceptId,
        prompt: data.prompt,
        answer_criteria: data.answerCriteria,
        type: data.type,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error || !updated)
      throw new Error(`Failed to update question: ${error?.message}`)
    return this.mapToEntity(updated)
  }

  async delete(id: string): Promise<void> {
    const supabase = await createClient()
    const { error } = await supabase.from('questions').delete().eq('id', id)
    if (error) throw new Error(`Failed to delete question: ${error.message}`)
  }

  private mapToEntity(data: {
    id: string
    concept_id: string
    prompt: string
    answer_criteria: string
    type: string
    created_at: string
    updated_at: string
  }): Question {
    return {
      id: data.id,
      conceptId: data.concept_id,
      prompt: data.prompt,
      answerCriteria: data.answer_criteria,
      type: data.type as Question['type'],
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    }
  }
}

export class SupabaseProgressRepository implements ProgressRepository {
  async findByUserAndConcept(
    userId: string,
    conceptId: string,
  ): Promise<UserProgress | null> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('concept_id', conceptId)
      .single()

    if (error || !data) return null
    return this.mapToEntity(data)
  }

  async findByUserId(userId: string): Promise<UserProgress[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)

    if (error || !data) return []
    return data.map(this.mapToEntity)
  }

  async create(
    data: Omit<UserProgress, 'createdAt' | 'updatedAt'>,
  ): Promise<UserProgress> {
    const supabase = await createClient()
    const { data: created, error } = await supabase
      .from('user_progress')
      .insert({
        user_id: data.userId,
        concept_id: data.conceptId,
        status: data.status,
        next_review: data.nextReview.toISOString(),
        last_interval: data.lastInterval,
        ease_factor: data.easeFactor,
        history: data.history,
      })
      .select()
      .single()

    if (error || !created)
      throw new Error(`Failed to create progress: ${error?.message}`)
    return this.mapToEntity(created)
  }

  async update(
    userId: string,
    conceptId: string,
    data: Partial<UserProgress>,
  ): Promise<UserProgress> {
    const supabase = await createClient()
    const updateData: Partial<{
      status: string
      next_review: string
      last_interval: number
      ease_factor: number
      history: ProgressHistory[]
      updated_at: string
    }> = {
      updated_at: new Date().toISOString(),
    }
    if (data.status) updateData.status = data.status
    if (data.nextReview) updateData.next_review = data.nextReview.toISOString()
    if (data.lastInterval !== undefined)
      updateData.last_interval = data.lastInterval
    if (data.easeFactor !== undefined) updateData.ease_factor = data.easeFactor
    if (data.history) updateData.history = data.history

    const { data: updated, error } = await supabase
      .from('user_progress')
      .update(updateData)
      .eq('user_id', userId)
      .eq('concept_id', conceptId)
      .select()
      .single()

    if (error || !updated)
      throw new Error(`Failed to update progress: ${error?.message}`)
    return this.mapToEntity(updated)
  }

  async delete(userId: string, conceptId: string): Promise<void> {
    const supabase = await createClient()
    const { error } = await supabase
      .from('user_progress')
      .delete()
      .eq('user_id', userId)
      .eq('concept_id', conceptId)
    if (error) throw new Error(`Failed to delete progress: ${error.message}`)
  }

  private mapToEntity(data: {
    user_id: string
    concept_id: string
    status: string
    next_review: string
    last_interval: number
    ease_factor: number
    history: ProgressHistory[]
    created_at: string
    updated_at: string
  }): UserProgress {
    return {
      userId: data.user_id,
      conceptId: data.concept_id,
      status: data.status as UserProgress['status'],
      nextReview: new Date(data.next_review),
      lastInterval: data.last_interval,
      easeFactor: data.ease_factor,
      history: data.history,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    }
  }
}
