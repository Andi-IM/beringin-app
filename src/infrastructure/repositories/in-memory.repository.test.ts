import {
  InMemoryConceptRepository,
  resetConcepts,
} from "./in-memory.repository";
import type { Concept } from "@/domain/entities/concept.entity";

describe("InMemoryConceptRepository", () => {
  let repository: InMemoryConceptRepository;

  beforeEach(() => {
    // Clear all concepts before each test
    resetConcepts();
    repository = new InMemoryConceptRepository();
  });

  afterEach(() => {
    // Clean up after each test
    resetConcepts();
  });

  describe("findById", () => {
    it("should return null when concept is not found", async () => {
      const result = await repository.findById("non-existent-id");
      expect(result).toBeNull();
    });

    it("should return concept when found", async () => {
      const concept = await repository.create({
        title: "Test Concept",
        description: "Test Description",
        category: "test",
      });

      const result = await repository.findById(concept.id);
      expect(result).toEqual(concept);
    });
  });

  describe("findAll", () => {
    it("should return empty array when no concepts exist", async () => {
      const result = await repository.findAll();
      expect(result).toEqual([]);
    });

    it("should return all concepts", async () => {
      const concept1 = await repository.create({
        title: "Concept 1",
        description: "Description 1",
        category: "category1",
      });
      const concept2 = await repository.create({
        title: "Concept 2",
        description: "Description 2",
        category: "category2",
      });

      const result = await repository.findAll();
      expect(result).toHaveLength(2);
      expect(result).toEqual(expect.arrayContaining([concept1, concept2]));
    });
  });

  describe("findByCategory", () => {
    it("should return empty array for non-existent category", async () => {
      const result = await repository.findByCategory("non-existent");
      expect(result).toEqual([]);
    });

    it("should return concepts in specified category", async () => {
      await repository.create({
        title: "Concept 1",
        description: "Description 1",
        category: "math",
      });
      await repository.create({
        title: "Concept 2",
        description: "Description 2",
        category: "science",
      });
      await repository.create({
        title: "Concept 3",
        description: "Description 3",
        category: "math",
      });

      const mathConcepts = await repository.findByCategory("math");
      expect(mathConcepts).toHaveLength(2);
      mathConcepts.forEach((concept) => {
        expect(concept.category).toBe("math");
      });
    });
  });

  describe("create", () => {
    it("should create concept with generated id and timestamps", async () => {
      const data = {
        title: "New Concept",
        description: "New Description",
        category: "new",
      };

      const result = await repository.create(data);

      expect(result.id).toBeDefined();
      expect(result.id).toMatch(/^[a-z0-9]+$/);
      expect(result.title).toBe(data.title);
      expect(result.description).toBe(data.description);
      expect(result.category).toBe(data.category);
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
      expect(result.createdAt).toEqual(result.updatedAt);
    });
  });

  describe("update", () => {
    it("should throw error when concept not found", async () => {
      await expect(
        repository.update("non-existent-id", { title: "Updated" }),
      ).rejects.toThrow("Concept not found");
    });

    it("should update concept and set new updatedAt timestamp", async () => {
      const concept = await repository.create({
        title: "Original Title",
        description: "Original Description",
        category: "original",
      });

      const originalUpdatedAt = concept.updatedAt;
      await new Promise((resolve) => setTimeout(resolve, 10)); // Small delay

      const updateData = {
        title: "Updated Title",
        description: "Updated Description",
      };

      const result = await repository.update(concept.id, updateData);

      expect(result.id).toBe(concept.id);
      expect(result.title).toBe(updateData.title);
      expect(result.description).toBe(updateData.description);
      expect(result.category).toBe(concept.category); // unchanged
      expect(result.createdAt).toEqual(concept.createdAt); // unchanged
      expect(result.updatedAt).not.toEqual(originalUpdatedAt);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe("delete", () => {
    it("should not throw error when deleting non-existent concept", async () => {
      await expect(repository.delete("non-existent-id")).resolves.not.toThrow();
    });

    it("should delete existing concept", async () => {
      const concept = await repository.create({
        title: "To Delete",
        description: "Delete Me",
        category: "delete",
      });

      await repository.delete(concept.id);

      const found = await repository.findById(concept.id);
      expect(found).toBeNull();
    });
  });
});
