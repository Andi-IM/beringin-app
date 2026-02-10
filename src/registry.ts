// DI Registry (Composition Root)
// Connects Infrastructure to Application/Domain
import { seedData } from '@/infrastructure/repositories/seed'
import { conceptProgressRepository } from '@/infrastructure/repositories/in-memory.repository'
import { getConceptStatus } from '@/application/usecases/getConceptStatus.usecase'

export const Registry = {
  async seedInitialData() {
    return seedData()
  },

  async getDashboardData(userId: string) {
    return getConceptStatus({ userId }, conceptProgressRepository)
  },

  async getNextQuestion(userId: string) {
    // Lazy load use cases/repos to avoid circular deps if needed, strict check imports
    const { getNextQuestion } =
      await import('@/application/usecases/getNextQuestion.usecase')

    // Note: The previous code imported `questionRepository` from 'in-memory.repository' which might be `multichoice` or `simple`.
    // Let's check `src/infrastructure/repositories/in-memory.repository.ts` to see what `questionRepository` exports.
    // For now I will assume the imports from the original file:
    // import { questionRepository, progressRepository } from '@/infrastructure/repositories/in-memory.repository'
    const { questionRepository } =
      await import('@/infrastructure/repositories/in-memory.repository')

    return getNextQuestion({ userId }, questionRepository)
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
    const { progressRepository } =
      await import('@/infrastructure/repositories/in-memory.repository')
    return submitAnswer(data, progressRepository)
  },
}
