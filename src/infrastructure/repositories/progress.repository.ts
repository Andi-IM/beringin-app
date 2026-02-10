// Infrastructure: UserProgress Repository Interface

import type { UserProgress } from '@/domain/entities/user-progress.entity'

export interface ProgressRepository {
  findByUserAndConcept(
    userId: string,
    conceptId: string,
  ): Promise<UserProgress | null>
  findByUserId(userId: string): Promise<UserProgress[]>
  create(
    progress: Omit<UserProgress, 'createdAt' | 'updatedAt'>,
  ): Promise<UserProgress>
  update(
    userId: string,
    conceptId: string,
    data: Partial<UserProgress>,
  ): Promise<UserProgress>
  delete(userId: string, conceptId: string): Promise<void>
}
