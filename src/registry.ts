// DI Registry (Composition Root)
// Connects Infrastructure to Application/Domain

import type { EdgeOneKV } from '@/infrastructure/kv/edgeone-kv.types'

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
    // Global 'KV' is injected by EdgeOne runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isEdgeOne = typeof (globalThis as any).KV !== 'undefined'

    if (isEdgeOne) {
      const { KVConceptRepository, KVConceptProgressRepository } =
        await import('@/infrastructure/kv/kv-concept.repository')
      const { KVQuestionRepository } =
        await import('@/infrastructure/kv/kv-question.repository')
      const { KVProgressRepository } =
        await import('@/infrastructure/kv/kv-progress.repository')

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const kv = (globalThis as any).KV as EdgeOneKV

      const progressRepo = new KVProgressRepository(kv)
      const conceptRepo = new KVConceptRepository(kv)
      const questionRepo = new KVQuestionRepository(kv, progressRepo)
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

    // Default to in-memory repositories
    const {
      conceptRepository,
      conceptProgressRepository,
      questionRepository,
      progressRepository,
    } = await import('@/infrastructure/repositories/in-memory.repository')

    return {
      conceptRepo: conceptRepository,
      conceptProgressRepo: conceptProgressRepository,
      questionRepo: questionRepository,
      progressRepo: progressRepository,
    }
  },

  async seedInitialData() {
    const { seedData } = await import('@/infrastructure/repositories/seed')
    const repos = await this.getRepositories()

    // The existing seedData assumes global exported repos, we need to adapt it
    // or provide repos as arguments. For now, let's keep it simple and
    // let seedData handle the injection if we refactor it, or just use it as is if it's fine.
    // Actually, seedData currently imports from in-memory directly.
    // I should refactor seedData to accept repos.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return seedData(repos as any)
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
    const { getAllConcepts } =
      await import('@/application/usecases/getAllConcepts.usecase')
    const { conceptRepo } = await this.getRepositories()
    return getAllConcepts(conceptRepo)
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
    const { deleteConcept } =
      await import('@/application/usecases/deleteConcept.usecase')
    const { conceptRepo } = await this.getRepositories()
    return deleteConcept(id, conceptRepo)
  },
}
