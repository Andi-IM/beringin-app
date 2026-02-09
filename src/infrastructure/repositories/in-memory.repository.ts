// Infrastructure: In-Memory Implementation (for MVP)
// Will be replaced with Supabase/Firebase later

import type {
  Concept,
  ConceptWithStatus,
} from "@/domain/entities/concept.entity";
import type { Question } from "@/domain/entities/question.entity";
import type { UserProgress } from "@/domain/entities/user-progress.entity";
import type {
  ConceptRepository,
  ConceptProgressRepository,
} from "./concept.repository";
import type { QuestionRepository } from "./question.repository";
import type { ProgressRepository } from "./progress.repository";

// Mock data storage
const concepts: Concept[] = [];
const questions: Question[] = [];
const progress: UserProgress[] = [];

// Concept Repository Implementation
export class InMemoryConceptRepository implements ConceptRepository {
  async findById(id: string): Promise<Concept | null> {
    return concepts.find((c) => c.id === id) || null;
  }

  async findAll(): Promise<Concept[]> {
    return concepts;
  }

  async findByCategory(category: string): Promise<Concept[]> {
    return concepts.filter((c) => c.category === category);
  }

  async create(
    data: Omit<Concept, "id" | "createdAt" | "updatedAt">,
  ): Promise<Concept> {
    const concept: Concept = {
      ...data,
      id: Math.random().toString(36).substring(7),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    concepts.push(concept);
    return concept;
  }

  async update(id: string, data: Partial<Concept>): Promise<Concept> {
    const index = concepts.findIndex((c) => c.id === id);
    if (index === -1) throw new Error("Concept not found");

    concepts[index] = {
      ...concepts[index],
      ...data,
      updatedAt: new Date(),
    };
    return concepts[index];
  }

  async delete(id: string): Promise<void> {
    const index = concepts.findIndex((c) => c.id === id);
    if (index !== -1) concepts.splice(index, 1);
  }
}

// Concept Progress Repository Implementation
export class InMemoryConceptProgressRepository implements ConceptProgressRepository {
  async findConceptsWithStatus(userId: string): Promise<ConceptWithStatus[]> {
    return concepts.map((concept) => {
      const userProgress = progress.find(
        (p) => p.userId === userId && p.conceptId === concept.id,
      );

      return {
        ...concept,
        status: userProgress?.status || "new",
        nextReview: userProgress?.nextReview,
        lastInterval: userProgress?.lastInterval,
        easeFactor: userProgress?.easeFactor || 2.5,
      };
    });
  }

  async findDueConcepts(userId: string): Promise<ConceptWithStatus[]> {
    const now = new Date();
    const allConcepts = await this.findConceptsWithStatus(userId);

    return allConcepts.filter((c) => !c.nextReview || c.nextReview <= now);
  }
}

// Question Repository Implementation
export class InMemoryQuestionRepository implements QuestionRepository {
  async findById(id: string): Promise<Question | null> {
    return questions.find((q) => q.id === id) || null;
  }

  async findAll(): Promise<Question[]> {
    return questions;
  }

  async findByConceptId(conceptId: string): Promise<Question[]> {
    return questions.filter((q) => q.conceptId === conceptId);
  }

  async findDueQuestions(userId: string): Promise<Question[]> {
    const now = new Date();
    const dueProgress = progress.filter(
      (p) => p.userId === userId && p.nextReview <= now,
    );

    const dueConceptIds = dueProgress.map((p) => p.conceptId);
    return questions.filter((q) => dueConceptIds.includes(q.conceptId));
  }

  async create(
    data: Omit<Question, "id" | "createdAt" | "updatedAt">,
  ): Promise<Question> {
    const question: Question = {
      ...data,
      id: Math.random().toString(36).substring(7),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    questions.push(question);
    return question;
  }

  async update(id: string, data: Partial<Question>): Promise<Question> {
    const index = questions.findIndex((q) => q.id === id);
    if (index === -1) throw new Error("Question not found");

    questions[index] = {
      ...questions[index],
      ...data,
      updatedAt: new Date(),
    };
    return questions[index];
  }

  async delete(id: string): Promise<void> {
    const index = questions.findIndex((q) => q.id === id);
    if (index !== -1) questions.splice(index, 1);
  }
}

// Progress Repository Implementation
export class InMemoryProgressRepository implements ProgressRepository {
  async findByUserAndConcept(
    userId: string,
    conceptId: string,
  ): Promise<UserProgress | null> {
    return (
      progress.find((p) => p.userId === userId && p.conceptId === conceptId) ||
      null
    );
  }

  async findByUserId(userId: string): Promise<UserProgress[]> {
    return progress.filter((p) => p.userId === userId);
  }

  async create(
    data: Omit<UserProgress, "createdAt" | "updatedAt">,
  ): Promise<UserProgress> {
    const userProgress: UserProgress = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    progress.push(userProgress);
    return userProgress;
  }

  async update(
    userId: string,
    conceptId: string,
    data: Partial<UserProgress>,
  ): Promise<UserProgress> {
    const index = progress.findIndex(
      (p) => p.userId === userId && p.conceptId === conceptId,
    );
    if (index === -1) throw new Error("Progress not found");

    progress[index] = {
      ...progress[index],
      ...data,
      updatedAt: new Date(),
    };
    return progress[index];
  }

  async delete(userId: string, conceptId: string): Promise<void> {
    const index = progress.findIndex(
      (p) => p.userId === userId && p.conceptId === conceptId,
    );
    if (index !== -1) progress.splice(index, 1);
  }
}

// Export singleton instances for MVP
export const conceptRepository = new InMemoryConceptRepository();
export const conceptProgressRepository =
  new InMemoryConceptProgressRepository();
export const questionRepository = new InMemoryQuestionRepository();
export const progressRepository = new InMemoryProgressRepository();

// Test helpers - reset all data for test isolation
export function resetAllRepositories() {
  concepts.length = 0;
  questions.length = 0;
  progress.length = 0;
}

export function resetConcepts() {
  concepts.length = 0;
}

export function resetQuestions() {
  questions.length = 0;
}

export function resetProgress() {
  progress.length = 0;
}
