import { AdaptiveSchedulerPolicy } from "@/domain/policies/scheduler.policy";
import type { ProgressRepository } from "@/infrastructure/repositories/progress.repository";
import type {
  UserProgress,
  ProgressHistory,
} from "@/domain/entities/user-progress.entity";
import {
  submitAnswer,
  type SubmitAnswerInput,
  type SubmitAnswerOutput,
} from "./submitAnswer.usecase";

describe("submitAnswer Use Case", () => {
  const mockProgressRepo: jest.Mocked<ProgressRepository> = {
    findByUserAndConcept: jest.fn(),
    findByUserId: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest
      .spyOn(AdaptiveSchedulerPolicy, "calculateNextInterval")
      .mockImplementation((input) => ({
        nextInterval: input.result ? input.previousInterval * 2 : 1,
        easeFactor: input.result
          ? Math.min(input.easeFactor + 0.1, 3.0)
          : Math.max(input.easeFactor - 0.2, 1.3),
        status: input.result ? "learning" : "new",
      }));
  });

  it("should create new progress for first-time user", async () => {
    const input: SubmitAnswerInput = {
      userId: "user-1",
      conceptId: "concept-1",
      questionId: "q1",
      userAnswer: "4",
      isCorrect: true,
      confidence: "high",
      responseTime: 15,
    };

    // Create a mock progress object without createdAt to simulate new user
    const mockProgress = {
      userId: "user-1",
      conceptId: "concept-1",
      status: "new" as const,
      nextReview: new Date(),
      lastInterval: 0.007,
      easeFactor: 2.5,
      history: [],
    };

    mockProgressRepo.findByUserAndConcept.mockResolvedValue(
      mockProgress as any,
    );
    mockProgressRepo.create.mockResolvedValue({} as UserProgress);

    const result = await submitAnswer(input, mockProgressRepo);

    expect(mockProgressRepo.findByUserAndConcept).toHaveBeenCalledWith(
      "user-1",
      "concept-1",
    );
    expect(mockProgressRepo.create).toHaveBeenCalledTimes(1);
    expect(mockProgressRepo.update).not.toHaveBeenCalled();
    expect(result.newStatus).toBe("learning");
    expect(result.intervalDays).toBeGreaterThan(0);
  });

  it("should update existing progress for returning user", async () => {
    const input: SubmitAnswerInput = {
      userId: "user-1",
      conceptId: "concept-1",
      questionId: "q1",
      userAnswer: "4",
      isCorrect: true,
      confidence: "high",
      responseTime: 15,
    };

    const existingProgress: UserProgress = {
      userId: "user-1",
      conceptId: "concept-1",
      status: "learning",
      nextReview: new Date("2024-01-10"),
      lastInterval: 3,
      easeFactor: 2.6,
      history: [
        {
          date: new Date("2024-01-01"),
          result: true,
          confidence: "high",
          interval: 1,
          responseTime: 10,
        },
      ],
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-07"),
    };

    mockProgressRepo.findByUserAndConcept.mockResolvedValue(existingProgress);
    mockProgressRepo.update.mockResolvedValue({} as UserProgress);

    const result = await submitAnswer(input, mockProgressRepo);

    expect(mockProgressRepo.findByUserAndConcept).toHaveBeenCalledWith(
      "user-1",
      "concept-1",
    );
    expect(mockProgressRepo.update).toHaveBeenCalledTimes(1);
    expect(mockProgressRepo.create).not.toHaveBeenCalled();
    expect(result.newStatus).toBe("learning");
  });

  it("should handle correct answer with high confidence", async () => {
    const input: SubmitAnswerInput = {
      userId: "user-1",
      conceptId: "concept-1",
      questionId: "q1",
      userAnswer: "correct answer",
      isCorrect: true,
      confidence: "high",
      responseTime: 10,
    };

    const existingProgress: UserProgress = {
      userId: "user-1",
      conceptId: "concept-1",
      status: "learning",
      nextReview: new Date("2024-01-10"),
      lastInterval: 3,
      easeFactor: 2.6,
      history: [],
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-07"),
    };

    mockProgressRepo.findByUserAndConcept.mockResolvedValue(existingProgress);
    mockProgressRepo.update.mockResolvedValue({} as UserProgress);

    await submitAnswer(input, mockProgressRepo);

    expect(AdaptiveSchedulerPolicy.calculateNextInterval).toHaveBeenCalledWith({
      previousInterval: 3,
      easeFactor: 2.6,
      result: true,
      confidence: "high",
    });

    expect(mockProgressRepo.update).toHaveBeenCalledWith(
      "user-1",
      "concept-1",
      expect.objectContaining({
        lastInterval: 6, // 3 * 2
        easeFactor: 2.7, // 2.6 + 0.1
        status: "learning",
        history: expect.arrayContaining([
          expect.objectContaining({
            result: true,
            confidence: "high",
            responseTime: 10,
          }),
        ]),
      }),
    );
  });

  it("should handle incorrect answer with low confidence", async () => {
    const input: SubmitAnswerInput = {
      userId: "user-1",
      conceptId: "concept-1",
      questionId: "q1",
      userAnswer: "wrong answer",
      isCorrect: false,
      confidence: "low",
      responseTime: 45,
    };

    const existingProgress: UserProgress = {
      userId: "user-1",
      conceptId: "concept-1",
      status: "learning",
      nextReview: new Date("2024-01-10"),
      lastInterval: 5,
      easeFactor: 2.5,
      history: [],
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-07"),
    };

    mockProgressRepo.findByUserAndConcept.mockResolvedValue(existingProgress);
    mockProgressRepo.update.mockResolvedValue({} as UserProgress);

    await submitAnswer(input, mockProgressRepo);

    expect(AdaptiveSchedulerPolicy.calculateNextInterval).toHaveBeenCalledWith({
      previousInterval: 5,
      easeFactor: 2.5,
      result: false,
      confidence: "low",
    });

    expect(mockProgressRepo.update).toHaveBeenCalledWith(
      "user-1",
      "concept-1",
      expect.objectContaining({
        lastInterval: 1, // reset to 1
        easeFactor: 2.3, // 2.5 - 0.2
        status: "new",
        history: expect.arrayContaining([
          expect.objectContaining({
            result: false,
            confidence: "low",
            responseTime: 45,
          }),
        ]),
      }),
    );
  });

  it("should calculate next review date correctly", async () => {
    const input: SubmitAnswerInput = {
      userId: "user-1",
      conceptId: "concept-1",
      questionId: "q1",
      userAnswer: "answer",
      isCorrect: true,
      confidence: "high",
      responseTime: 15,
    };

    mockProgressRepo.findByUserAndConcept.mockResolvedValue(null);
    mockProgressRepo.create.mockResolvedValue({} as UserProgress);

    const result = await submitAnswer(input, mockProgressRepo);

    const expectedNextReview = new Date();
    expectedNextReview.setTime(
      expectedNextReview.getTime() + 0.007 * 2 * 24 * 60 * 60 * 1000,
    );

    expect(result.nextReviewDate).toBeInstanceOf(Date);
    expect(result.intervalDays).toBe(0.014); // 0.007 * 2
  });

  it("should append to existing history", async () => {
    const input: SubmitAnswerInput = {
      userId: "user-1",
      conceptId: "concept-1",
      questionId: "q1",
      userAnswer: "answer",
      isCorrect: true,
      confidence: "high",
      responseTime: 15,
    };

    const existingHistory: ProgressHistory[] = [
      {
        date: new Date("2024-01-01"),
        result: true,
        confidence: "high",
        interval: 1,
        responseTime: 10,
      },
    ];

    const existingProgress: UserProgress = {
      userId: "user-1",
      conceptId: "concept-1",
      status: "learning",
      nextReview: new Date("2024-01-10"),
      lastInterval: 1,
      easeFactor: 2.6,
      history: existingHistory,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-07"),
    };

    mockProgressRepo.findByUserAndConcept.mockResolvedValue(existingProgress);
    mockProgressRepo.update.mockResolvedValue({} as UserProgress);

    await submitAnswer(input, mockProgressRepo);

    expect(mockProgressRepo.update).toHaveBeenCalledWith(
      "user-1",
      "concept-1",
      expect.objectContaining({
        history: expect.arrayContaining([
          ...existingHistory,
          expect.objectContaining({
            result: true,
            confidence: "high",
            responseTime: 15,
          }),
        ]),
      }),
    );
  });

  it("should handle none confidence", async () => {
    const input: SubmitAnswerInput = {
      userId: "user-1",
      conceptId: "concept-1",
      questionId: "q1",
      userAnswer: "answer",
      isCorrect: false,
      confidence: "none",
      responseTime: 30,
    };

    mockProgressRepo.findByUserAndConcept.mockResolvedValue(null);
    mockProgressRepo.create.mockResolvedValue({} as UserProgress);

    await submitAnswer(input, mockProgressRepo);

    expect(AdaptiveSchedulerPolicy.calculateNextInterval).toHaveBeenCalledWith({
      previousInterval: 0.007,
      easeFactor: 2.5,
      result: false,
      confidence: "none",
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
