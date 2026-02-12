// DI Registry (Composition Root)
// Connects Infrastructure to Application/Domain

import { deleteConcept } from '@/application/usecases/deleteConcept.usecase'
import type { ConceptRepository } from '@/infrastructure/repositories/concept.repository'
import type { QuestionRepository } from '@/infrastructure/repositories/question.repository'
import type { ProgressRepository } from '@/infrastructure/repositories/progress.repository'

/**
 * Registry handles dependency injection and service discovery.
 * It detects the environment and provides the appropriate repository implementations.
 */
export const Registry = {
  /**
   * Internal helper to determine which repositories to use.
   * In EdgeOne runtime, it uses KV repositories.
   * Otherwise, it defaults to in-memory repositories.
   */
  async getRepositories() {
    // Detect if we are in an environment with EdgeOne KV support
    const isEdgeOne =
      typeof (globalThis as unknown as Record<string, unknown>).KV !==
      'undefined'

    // Detect if we should use Supabase (checks for URL and Key)
    const useSupabase =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY

    // Detect if we should use the KV HTTP API
    const useKvApi = process.env.NEXT_PUBLIC_USE_KV_API === 'true'

    if (isEdgeOne || useKvApi) {
      console.log(
        '[Registry] Using KV Repository strategy (EdgeOne: ' +
          isEdgeOne +
          ', Env: ' +
          useKvApi +
          ')',
      )
      const { KVConceptRepository, KVConceptProgressRepository } =
        await import('@/infrastructure/kv/kv-concept.repository')
      const { KVQuestionRepository } =
        await import('@/infrastructure/kv/kv-question.repository')
      const { KVProgressRepository } =
        await import('@/infrastructure/kv/kv-progress.repository')

      const progressRepo = new KVProgressRepository()
      const conceptRepo = new KVConceptRepository()
      const questionRepo = new KVQuestionRepository(progressRepo)
      const conceptProgressRepo = new KVConceptProgressRepository(
        conceptRepo,
        progressRepo,
      )

      return {
        conceptRepo,
        conceptProgressRepo,
        questionRepo,
        progressRepo,
      }
    }

    if (useSupabase) {
      console.log('[Registry] Using Supabase Repository strategy')
      const {
        SupabaseConceptRepository,
        SupabaseConceptProgressRepository,
        SupabaseQuestionRepository,
        SupabaseProgressRepository,
      } = await import('@/infrastructure/repositories/supabase.repository')

      const conceptRepo = new SupabaseConceptRepository()
      const conceptProgressRepo = new SupabaseConceptProgressRepository()
      const questionRepo = new SupabaseQuestionRepository()
      const progressRepo = new SupabaseProgressRepository()

      return {
        conceptRepo,
        conceptProgressRepo,
        questionRepo,
        progressRepo,
      }
    }

    console.error(
      '[Registry] No valid storage configuration found (KV/EdgeOne or Supabase).',
    )
    throw new Error(
      'No valid storage configuration found. Set NEXT_PUBLIC_USE_KV_API=true or configure Supabase.',
    )
  },

  async seedInitialData() {
    const { seedData } = await import('@/infrastructure/repositories/seed')
    const repos = await this.getRepositories()

    return seedData(
      repos as {
        conceptRepo: ConceptRepository
        questionRepo: QuestionRepository
        progressRepo: ProgressRepository
      },
    )
  },

  async ensureUserOnboarded(userId: string) {
    const { seedInitialData } =
      await import('@/application/usecases/seedInitialData.usecase')
    const { conceptRepo, questionRepo } = await this.getRepositories()
    return seedInitialData(userId, conceptRepo, questionRepo)
  },

  async getDashboardData(userId: string) {
    const { getConceptStatus } =
      await import('@/application/usecases/getConceptStatus.usecase')
    const { conceptProgressRepo } = await this.getRepositories()
    return getConceptStatus({ userId }, conceptProgressRepo)
  },

  async getNextQuestion(userId: string) {
    const { getNextQuestion } =
      await import('@/application/usecases/getNextQuestion.usecase')
    const { questionRepo } = await this.getRepositories()
    return getNextQuestion({ userId }, questionRepo)
  },

  async submitAnswer(data: {
    userId: string
    conceptId: string
    questionId: string
    userAnswer: string
    isCorrect: boolean
    confidence: 'high' | 'low' | 'none'
    responseTime: number
  }) {
    const { submitAnswer } =
      await import('@/application/usecases/submitAnswer.usecase')
    const { progressRepo } = await this.getRepositories()
    return submitAnswer(data, progressRepo)
  },

  // --- Authentication Methods ---

  async getCurrentUser() {
    const { getCurrentUser } =
      await import('@/application/usecases/getCurrentUser.usecase')
    return getCurrentUser()
  },

  async signIn(data: { email: string; password: string }) {
    const { signIn } = await import('@/application/usecases/signIn.usecase')
    return signIn(data)
  },

  async signUp(data: { email: string; password: string }) {
    const { signUp } = await import('@/application/usecases/signUp.usecase')
    return signUp(data)
  },

  async signOut() {
    const { createClient } =
      await import('@/infrastructure/auth/supabase-client')
    const supabase = await createClient()
    return supabase.auth.signOut()
  },

  // --- Admin Methods ---

  async getAllConcepts() {
    // const { getAllConcepts } =
    //   await import('@/application/usecases/getAllConcepts.usecase')
    // We need to get the current user here to filter concepts
    // However, Registry is a mix of Server/Client logic.
    // Ideally, the Caller (Server Action) should pass the UserId.
    // For now, let's assume the Server Action will pass it, OR we fetch it here.
    // BUT getAllConcepts usecase NOW requires userId.
    // Let's change the signature of this registry method to accept userId.
    throw new Error(
      'Registry.getAllConcepts requires userId. Use getAllConcepts(userId) instead.',
    )
  },

  async getAllConceptsForUser(userId: string) {
    const { getAllConcepts } =
      await import('@/application/usecases/getAllConcepts.usecase')
    const { conceptRepo } = await this.getRepositories()
    return getAllConcepts(userId, conceptRepo)
  },

  async getConceptById(id: string) {
    const { conceptRepo } = await this.getRepositories()
    return conceptRepo.findById(id)
  },

  async createConcept(
    data: import('@/application/usecases/createConcept.usecase').CreateConceptData,
  ) {
    const { createConcept } =
      await import('@/application/usecases/createConcept.usecase')
    const { conceptRepo } = await this.getRepositories()
    return createConcept(data, conceptRepo)
  },

  async updateConcept(
    id: string,
    data: import('@/application/usecases/updateConcept.usecase').UpdateConceptData,
  ) {
    const { updateConcept } =
      await import('@/application/usecases/updateConcept.usecase')
    const { conceptRepo } = await this.getRepositories()
    return updateConcept(id, data, conceptRepo)
  },

  async deleteConcept(id: string) {
    const { conceptRepo } = await this.getRepositories()
    return deleteConcept(id, conceptRepo)
  },

  async getQuestionsByConceptId(conceptId: string) {
    const { questionRepo } = await this.getRepositories()
    return questionRepo.findByConceptId(conceptId)
  },
}
