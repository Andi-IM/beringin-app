// Application Use Case: Submit Answer
// Processes user answer and updates schedule
// WAJIB: All business logic here, not in UI

import { AdaptiveScheduler } from "@/domain/policies/scheduler.policy";
import type { ProgressRepository } from "@/infrastructure/repositories/progress.repository";
import type {
  UserProgress,
  ProgressHistory,
} from "@/domain/entities/user-progress.entity";

export interface SubmitAnswerInput {
  userId: string;
  conceptId: string;
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
  confidence: "high" | "low" | "none";
  responseTime: number; // seconds
}

export interface SubmitAnswerOutput {
  nextReviewDate: Date;
  newStatus: string;
  intervalDays: number;
}

export async function submitAnswer(
  input: SubmitAnswerInput,
  progressRepo: ProgressRepository,
): Promise<SubmitAnswerOutput> {
  const { userId, conceptId, isCorrect, confidence, responseTime } = input;

  // Get existing progress or create new
  let progress = await progressRepo.findByUserAndConcept(userId, conceptId);

  if (!progress) {
    // First attempt - initialize with default values
    progress = {
      userId,
      conceptId,
      status: "new",
      nextReview: new Date(),
      lastInterval: 0.007, // 10 minutes
      easeFactor: 2.5,
      history: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  // Calculate next interval using Scheduler policy
  const schedulerOutput = AdaptiveScheduler.calculateNextInterval({
    previousInterval: progress.lastInterval,
    easeFactor: progress.easeFactor,
    result: isCorrect,
    confidence,
  });

  // Update progress
  const newHistory: ProgressHistory = {
    date: new Date(),
    result: isCorrect,
    confidence,
    interval: schedulerOutput.nextInterval,
    responseTime,
  };

  const nextReviewDate = new Date();
  nextReviewDate.setTime(
    nextReviewDate.getTime() +
      schedulerOutput.nextInterval * 24 * 60 * 60 * 1000,
  );

  const updatedProgress: UserProgress = {
    ...progress,
    status: schedulerOutput.status,
    nextReview: nextReviewDate,
    lastInterval: schedulerOutput.nextInterval,
    easeFactor: schedulerOutput.easeFactor,
    history: [...progress.history, newHistory],
    updatedAt: new Date(),
  };

  // Save to repository
  if (!progress.createdAt) {
    await progressRepo.create(updatedProgress);
  } else {
    await progressRepo.update(userId, conceptId, updatedProgress);
  }

  return {
    nextReviewDate,
    newStatus: schedulerOutput.status,
    intervalDays: schedulerOutput.nextInterval,
  };
}
