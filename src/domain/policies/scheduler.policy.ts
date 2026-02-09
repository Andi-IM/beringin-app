// Domain Policy: Adaptive Scheduler
// Calculates next review interval based on performance
// Pure business logic - no framework dependencies

import type { ConceptStatus } from "../entities/concept.entity";

export interface SchedulerInput {
  previousInterval: number; // in days
  easeFactor: number;
  result: boolean; // correct or incorrect
  confidence: "high" | "low" | "none";
}

export interface SchedulerOutput {
  nextInterval: number; // in days
  status: ConceptStatus;
  easeFactor: number;
}

const MIN_INTERVAL = 0.007; // ~10 minutes
const GRADUATING_INTERVAL = 1.0; // 1 day
const STABLE_THRESHOLD = 21; // days

export class AdaptiveScheduler {
  static calculateNextInterval(input: SchedulerInput): SchedulerOutput {
    const { previousInterval, easeFactor, result, confidence } = input;

    // Incorrect answer: Reset to minimum
    if (!result) {
      const newEF = Math.max(1.3, easeFactor - 0.2);
      return {
        nextInterval: MIN_INTERVAL,
        status: previousInterval > STABLE_THRESHOLD ? "lapsed" : "learning",
        easeFactor: newEF,
      };
    }

    // Correct answer: Adjust based on confidence
    if (confidence === "high") {
      const newEF = easeFactor + 0.1;
      const nextInt = previousInterval * newEF;
      return {
        nextInterval: nextInt,
        status: nextInt > STABLE_THRESHOLD ? "stable" : "reviewing",
        easeFactor: newEF,
      };
    }

    if (confidence === "low") {
      const newEF = Math.max(1.3, easeFactor - 0.15);
      const nextInt = previousInterval * 1.2; // Small bump
      return {
        nextInterval: nextInt,
        status: "fragile",
        easeFactor: newEF,
      };
    }

    // confidence === 'none' (guessed)
    const newEF = Math.max(1.3, easeFactor - 0.2);
    const nextInt = previousInterval * 0.5; // Shrink interval
    return {
      nextInterval: nextInt,
      status: "fragile",
      easeFactor: newEF,
    };
  }
}
