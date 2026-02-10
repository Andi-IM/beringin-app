// Application Use Case: Get Next Question
// Retrieves the next due question for a user
// WAJIB: No UI logic, no fetch, pure orchestration

import type { Question } from '@/domain/entities/question.entity'
import type { QuestionRepository } from '@/infrastructure/repositories/question.repository'

export interface GetNextQuestionInput {
  userId: string
}

export interface GetNextQuestionOutput {
  question: Question | null
  totalDue: number
}

export async function getNextQuestion(
  input: GetNextQuestionInput,
  questionRepo: QuestionRepository,
): Promise<GetNextQuestionOutput> {
  const dueQuestions = await questionRepo.findDueQuestions(input.userId)

  if (dueQuestions.length === 0) {
    return {
      question: null,
      totalDue: 0,
    }
  }

  // Return first due question (can be randomized later)
  return {
    question: dueQuestions[0],
    totalDue: dueQuestions.length,
  }
}
