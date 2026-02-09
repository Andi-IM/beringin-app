// Application Use Case: Get Concept Status
// Retrieves dashboard data for all concepts
// WAJIB: No UI logic

import type { ConceptWithStatus } from "@/domain/entities/concept.entity";
import type { ConceptProgressRepository } from "@/infrastructure/repositories/concept.repository";

export interface GetConceptStatusInput {
  userId: string;
}

export interface GetConceptStatusOutput {
  concepts: ConceptWithStatus[];
  stats: {
    total: number;
    stable: number;
    fragile: number;
    learning: number;
    lapsed: number;
  };
}

export async function getConceptStatus(
  input: GetConceptStatusInput,
  conceptProgressRepo: ConceptProgressRepository,
): Promise<GetConceptStatusOutput> {
  const concepts = await conceptProgressRepo.findConceptsWithStatus(
    input.userId,
  );

  const stats = {
    total: concepts.length,
    stable: concepts.filter((c) => c.status === "stable").length,
    fragile: concepts.filter((c) => c.status === "fragile").length,
    learning: concepts.filter((c) => c.status === "learning").length,
    lapsed: concepts.filter((c) => c.status === "lapsed").length,
  };

  return {
    concepts,
    stats,
  };
}
