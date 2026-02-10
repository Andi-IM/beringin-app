// Infrastructure: Question Repository Interface

import type { Question } from '@/domain/entities/question.entity'

export interface QuestionRepository {
  findById(id: string): Promise<Question | null>
  findAll(): Promise<Question[]>
  findByConceptId(conceptId: string): Promise<Question[]>
  findDueQuestions(userId: string): Promise<Question[]>
  create(
    question: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Question>
  update(id: string, data: Partial<Question>): Promise<Question>
  delete(id: string): Promise<void>
}
