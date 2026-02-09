import {
  InMemoryQuestionRepository,
  resetQuestions,
  resetProgress,
} from "./in-memory.repository";
import type { Question } from "@/domain/entities/question.entity";

describe("InMemoryQuestionRepository", () => {
  let repository: InMemoryQuestionRepository;

  beforeEach(() => {
    // Clear all questions and progress before each test
    resetQuestions();
    resetProgress();
    repository = new InMemoryQuestionRepository();
  });

  afterEach(() => {
    // Clean up after each test
    resetQuestions();
    resetProgress();
  });

  describe("findById", () => {
    it("should return null when question is not found", async () => {
      const result = await repository.findById("non-existent-id");
      expect(result).toBeNull();
    });

    it("should return question when found", async () => {
      const question = await repository.create({
        conceptId: "concept-1",
        prompt: "Test question",
        answerCriteria: "test answer",
        type: "text",
      });

      const result = await repository.findById(question.id);
      expect(result).toEqual(question);
    });
  });

  describe("findByConceptId", () => {
    it("should return empty array for non-existent concept", async () => {
      const result = await repository.findByConceptId("non-existent-concept");
      expect(result).toEqual([]);
    });

    it("should return questions for specific concept", async () => {
      await repository.create({
        conceptId: "concept-1",
        prompt: "Question 1",
        answerCriteria: "Answer 1",
        type: "text",
      });
      await repository.create({
        conceptId: "concept-2",
        prompt: "Question 2",
        answerCriteria: "Answer 2",
        type: "voice",
      });
      await repository.create({
        conceptId: "concept-1",
        prompt: "Question 3",
        answerCriteria: "Answer 3",
        type: "cloze",
      });

      const concept1Questions = await repository.findByConceptId("concept-1");
      expect(concept1Questions).toHaveLength(2);
      concept1Questions.forEach((question) => {
        expect(question.conceptId).toBe("concept-1");
      });

      const concept2Questions = await repository.findByConceptId("concept-2");
      expect(concept2Questions).toHaveLength(1);
      expect(concept2Questions[0].conceptId).toBe("concept-2");
    });
  });

  describe("findDueQuestions", () => {
    it("should return empty array when no due questions", async () => {
      const now = new Date("2024-01-05");
      const futureDate = new Date("2024-01-10");

      // Mock progress for user with future due dates
      const mockProgress = [
        {
          userId: "user-1",
          conceptId: "concept-1",
          nextReview: futureDate,
        },
      ];

      const originalProgress = (global as any).progress || [];
      (global as any).progress = mockProgress;

      try {
        const result = await repository.findDueQuestions("user-1");
        expect(result).toEqual([]);
      } finally {
        (global as any).progress = originalProgress;
      }
    });

    it("should return questions that are due for review", async () => {
      const now = new Date("2024-01-05");
      const pastDate = new Date("2024-01-03");
      const futureDate = new Date("2024-01-10");

      // Create test questions
      await repository.create({
        conceptId: "concept-due",
        prompt: "Due Question",
        answerCriteria: "Due Answer",
        type: "text",
      });
      await repository.create({
        conceptId: "concept-future",
        prompt: "Future Question",
        answerCriteria: "Future Answer",
        type: "voice",
      });

      // Mock progress for user
      const mockProgress = [
        {
          userId: "user-1",
          conceptId: "concept-due",
          nextReview: pastDate,
        },
        {
          userId: "user-1",
          conceptId: "concept-future",
          nextReview: futureDate,
        },
      ];

      const originalProgress = (global as any).progress || [];
      (global as any).progress = mockProgress;

      try {
        // Mock current time
        const originalDate = global.Date;
        const mockDate = jest.fn(() => now) as any;
        mockDate.now = jest.fn(() => now.getTime());
        global.Date = mockDate;

        const result = await repository.findDueQuestions("user-1");

        expect(result).toHaveLength(1);
        expect(result[0].conceptId).toBe("concept-due");

        global.Date = originalDate;
      } finally {
        (global as any).progress = originalProgress;
      }
    });

    it("should return empty array for user with no progress", async () => {
      const mockProgress = [
        {
          userId: "user-2",
          conceptId: "concept-1",
          nextReview: new Date("2024-01-01"),
        },
      ];

      const originalProgress = (global as any).progress || [];
      (global as any).progress = mockProgress;

      try {
        const result = await repository.findDueQuestions("user-1");
        expect(result).toEqual([]);
      } finally {
        (global as any).progress = originalProgress;
      }
    });
  });

  describe("create", () => {
    it("should create question with generated id and timestamps", async () => {
      const data = {
        conceptId: "concept-1",
        prompt: "New Question",
        answerCriteria: "New Answer",
        type: "cloze" as const,
      };

      const result = await repository.create(data);

      expect(result.id).toBeDefined();
      expect(result.id).toMatch(/^[a-z0-9]+$/);
      expect(result.conceptId).toBe(data.conceptId);
      expect(result.prompt).toBe(data.prompt);
      expect(result.answerCriteria).toBe(data.answerCriteria);
      expect(result.type).toBe(data.type);
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
      expect(result.createdAt).toEqual(result.updatedAt);
    });

    it("should create different question types", async () => {
      const textQuestion = await repository.create({
        conceptId: "concept-1",
        prompt: "Text question",
        answerCriteria: "text answer",
        type: "text",
      });

      const voiceQuestion = await repository.create({
        conceptId: "concept-2",
        prompt: "Voice question",
        answerCriteria: "voice answer",
        type: "voice",
      });

      const clozeQuestion = await repository.create({
        conceptId: "concept-3",
        prompt: "Cloze question",
        answerCriteria: "cloze answer",
        type: "cloze",
      });

      expect(textQuestion.type).toBe("text");
      expect(voiceQuestion.type).toBe("voice");
      expect(clozeQuestion.type).toBe("cloze");
    });
  });

  describe("update", () => {
    it("should throw error when question not found", async () => {
      await expect(
        repository.update("non-existent-id", { prompt: "Updated" }),
      ).rejects.toThrow("Question not found");
    });

    it("should update question and set new updatedAt timestamp", async () => {
      const question = await repository.create({
        conceptId: "concept-1",
        prompt: "Original Question",
        answerCriteria: "Original Answer",
        type: "text",
      });

      const originalUpdatedAt = question.updatedAt;
      await new Promise((resolve) => setTimeout(resolve, 10)); // Small delay

      const updateData = {
        prompt: "Updated Question",
        answerCriteria: "Updated Answer",
      };

      const result = await repository.update(question.id, updateData);

      expect(result.id).toBe(question.id);
      expect(result.conceptId).toBe(question.conceptId); // unchanged
      expect(result.prompt).toBe(updateData.prompt);
      expect(result.answerCriteria).toBe(updateData.answerCriteria);
      expect(result.type).toBe(question.type); // unchanged
      expect(result.createdAt).toEqual(question.createdAt); // unchanged
      expect(result.updatedAt).not.toEqual(originalUpdatedAt);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe("delete", () => {
    it("should not throw error when deleting non-existent question", async () => {
      await expect(repository.delete("non-existent-id")).resolves.not.toThrow();
    });

    it("should delete existing question", async () => {
      const question = await repository.create({
        conceptId: "concept-1",
        prompt: "To Delete",
        answerCriteria: "Delete Me",
        type: "text",
      });

      await repository.delete(question.id);

      const found = await repository.findById(question.id);
      expect(found).toBeNull();
    });
  });
});
