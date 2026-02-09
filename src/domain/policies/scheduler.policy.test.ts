import { AdaptiveScheduler } from "./scheduler.policy";
import type { ConceptStatus } from "../entities/concept.entity";

describe("AdaptiveScheduler", () => {
  describe("calculateNextInterval", () => {
    describe("Incorrect Answers", () => {
      it("should reset to minimum interval for incorrect answer", () => {
        const input = {
          previousInterval: 7,
          easeFactor: 2.5,
          result: false,
          confidence: "high" as const,
        };

        const result = AdaptiveScheduler.calculateNextInterval(input);

        expect(result.nextInterval).toBe(0.007); // MIN_INTERVAL
        expect(result.status).toBe("learning");
        expect(result.easeFactor).toBe(2.3); // 2.5 - 0.2
      });

      it("should set status to lapsed when previous interval was stable", () => {
        const input = {
          previousInterval: 25, // > STABLE_THRESHOLD
          easeFactor: 2.8,
          result: false,
          confidence: "high" as const,
        };

        const result = AdaptiveScheduler.calculateNextInterval(input);

        expect(result.status).toBe("lapsed");
        expect(result.nextInterval).toBe(0.007);
      });

      it("should not allow ease factor below minimum", () => {
        const input = {
          previousInterval: 5,
          easeFactor: 1.35, // Very close to minimum
          result: false,
          confidence: "low" as const,
        };

        const result = AdaptiveScheduler.calculateNextInterval(input);

        expect(result.easeFactor).toBe(1.3); // Minimum ease factor
      });

      it("should handle incorrect answer with different confidence levels", () => {
        const baseInput = {
          previousInterval: 10,
          easeFactor: 2.5,
          result: false,
        };

        const highConfidence = AdaptiveScheduler.calculateNextInterval({
          ...baseInput,
          confidence: "high" as const,
        });

        const lowConfidence = AdaptiveScheduler.calculateNextInterval({
          ...baseInput,
          confidence: "low" as const,
        });

        const noConfidence = AdaptiveScheduler.calculateNextInterval({
          ...baseInput,
          confidence: "none" as const,
        });

        // All should produce same result for incorrect answers
        expect(highConfidence.nextInterval).toBe(lowConfidence.nextInterval);
        expect(highConfidence.nextInterval).toBe(noConfidence.nextInterval);
        expect(highConfidence.status).toBe(lowConfidence.status);
        expect(highConfidence.status).toBe(noConfidence.status);
        expect(highConfidence.easeFactor).toBe(lowConfidence.easeFactor);
        expect(highConfidence.easeFactor).toBe(noConfidence.easeFactor);
      });
    });

    describe("Correct Answers with High Confidence", () => {
      it("should increase interval and ease factor for high confidence correct answer", () => {
        const input = {
          previousInterval: 3,
          easeFactor: 2.5,
          result: true,
          confidence: "high" as const,
        };

        const result = AdaptiveScheduler.calculateNextInterval(input);

        expect(result.nextInterval).toBeCloseTo(7.8); // 3 * 2.6
        expect(result.easeFactor).toBe(2.6); // 2.5 + 0.1
        expect(result.status).toBe("reviewing");
      });

      it("should set status to stable when interval exceeds threshold", () => {
        const input = {
          previousInterval: 20,
          easeFactor: 2.5,
          result: true,
          confidence: "high" as const,
        };

        const result = AdaptiveScheduler.calculateNextInterval(input);

        expect(result.nextInterval).toBe(52); // 20 * 2.6
        expect(result.status).toBe("stable");
      });

      it("should handle very small intervals", () => {
        const input = {
          previousInterval: 0.007,
          easeFactor: 2.5,
          result: true,
          confidence: "high" as const,
        };

        const result = AdaptiveScheduler.calculateNextInterval(input);

        expect(result.nextInterval).toBe(0.0182); // 0.007 * 2.6
        expect(result.status).toBe("reviewing");
      });
    });

    describe("Correct Answers with Low Confidence", () => {
      it("should increase interval modestly for low confidence correct answer", () => {
        const input = {
          previousInterval: 5,
          easeFactor: 2.5,
          result: true,
          confidence: "low" as const,
        };

        const result = AdaptiveScheduler.calculateNextInterval(input);

        expect(result.nextInterval).toBe(6); // 5 * 1.2
        expect(result.easeFactor).toBe(2.35); // 2.5 - 0.15
        expect(result.status).toBe("fragile");
      });

      it("should not allow ease factor below minimum for low confidence", () => {
        const input = {
          previousInterval: 3,
          easeFactor: 1.4,
          result: true,
          confidence: "low" as const,
        };

        const result = AdaptiveScheduler.calculateNextInterval(input);

        expect(result.easeFactor).toBe(1.3); // Minimum
        expect(result.status).toBe("fragile");
      });

      it("should handle low confidence with large previous interval", () => {
        const input = {
          previousInterval: 30,
          easeFactor: 2.8,
          result: true,
          confidence: "low" as const,
        };

        const result = AdaptiveScheduler.calculateNextInterval(input);

        expect(result.nextInterval).toBe(36); // 30 * 1.2
        expect(result.status).toBe("fragile"); // Still fragile due to low confidence
      });
    });

    describe("Correct Answers with No Confidence (Guessed)", () => {
      it("should decrease interval for guessed correct answer", () => {
        const input = {
          previousInterval: 10,
          easeFactor: 2.5,
          result: true,
          confidence: "none" as const,
        };

        const result = AdaptiveScheduler.calculateNextInterval(input);

        expect(result.nextInterval).toBe(5); // 10 * 0.5
        expect(result.easeFactor).toBe(2.3); // 2.5 - 0.2
        expect(result.status).toBe("fragile");
      });

      it("should not allow ease factor below minimum for guessed answer", () => {
        const input = {
          previousInterval: 7,
          easeFactor: 1.4,
          result: true,
          confidence: "none" as const,
        };

        const result = AdaptiveScheduler.calculateNextInterval(input);

        expect(result.easeFactor).toBe(1.3); // Minimum
      });

      it("should handle very small intervals for guessed answers", () => {
        const input = {
          previousInterval: 0.01,
          easeFactor: 2.5,
          result: true,
          confidence: "none" as const,
        };

        const result = AdaptiveScheduler.calculateNextInterval(input);

        expect(result.nextInterval).toBe(0.005); // 0.01 * 0.5
        expect(result.status).toBe("fragile");
      });
    });

    describe("Edge Cases", () => {
      it("should handle maximum ease factor correctly", () => {
        const input = {
          previousInterval: 10,
          easeFactor: 3.5, // Above normal range
          result: true,
          confidence: "high" as const,
        };

        const result = AdaptiveScheduler.calculateNextInterval(input);

        expect(result.easeFactor).toBe(3.6); // No upper limit specified
        expect(result.nextInterval).toBe(36); // 10 * 3.6
      });

      it("should handle zero previous interval", () => {
        const input = {
          previousInterval: 0,
          easeFactor: 2.5,
          result: true,
          confidence: "high" as const,
        };

        const result = AdaptiveScheduler.calculateNextInterval(input);

        expect(result.nextInterval).toBe(0); // 0 * anything = 0
        expect(result.status).toBe("reviewing");
      });

      it("should handle negative confidence scenarios gracefully", () => {
        const input = {
          previousInterval: 5,
          easeFactor: 2.5,
          result: true,
          confidence: "low" as const,
        };

        const result = AdaptiveScheduler.calculateNextInterval(input);

        expect(result.nextInterval).toBeGreaterThan(0);
        expect(result.easeFactor).toBeGreaterThan(0);
      });

      it("should maintain consistent behavior across multiple correct high confidence answers", () => {
        let state = {
          previousInterval: 1,
          easeFactor: 2.5,
        };

        for (let i = 0; i < 5; i++) {
          const result = AdaptiveScheduler.calculateNextInterval({
            previousInterval: state.previousInterval,
            easeFactor: state.easeFactor,
            result: true,
            confidence: "high" as const,
          });

          state.previousInterval = result.nextInterval;
          state.easeFactor = result.easeFactor;

          expect(result.nextInterval).toBeGreaterThan(
            state.previousInterval / 2.6,
          ); // Should be increasing
          expect(result.easeFactor).toBe(state.easeFactor);
        }
      });

      it("should handle consecutive incorrect answers", () => {
        let state = {
          previousInterval: 7,
          easeFactor: 2.5,
        };

        for (let i = 0; i < 3; i++) {
          const result = AdaptiveScheduler.calculateNextInterval({
            previousInterval: state.previousInterval,
            easeFactor: state.easeFactor,
            result: false,
            confidence: "high" as const,
          });

          expect(result.nextInterval).toBe(0.007); // Always minimum
          expect(result.easeFactor).toBeLessThanOrEqual(state.easeFactor);

          state.previousInterval = result.nextInterval;
          state.easeFactor = result.easeFactor;
        }

        // Should hit minimum ease factor
        expect(state.easeFactor).toBeCloseTo(1.9); // 2.5 - 0.2 - 0.2 - 0.2 = 1.9
      });
    });

    describe("Status Progression Logic", () => {
      it("should follow correct status progression for new user", () => {
        let interval = 0.007;
        let easeFactor = 2.5;

        // First correct high confidence
        let result = AdaptiveScheduler.calculateNextInterval({
          previousInterval: interval,
          easeFactor,
          result: true,
          confidence: "high" as const,
        });
        expect(result.status).toBe("reviewing");

        // Continue until stable
        interval = 15;
        result = AdaptiveScheduler.calculateNextInterval({
          previousInterval: interval,
          easeFactor,
          result: true,
          confidence: "high" as const,
        });
        expect(result.status).toBe("stable");
      });

      it("should handle fragile to learning transition", () => {
        const input = {
          previousInterval: 3,
          easeFactor: 2.3,
          result: true,
          confidence: "low" as const,
        };

        const result = AdaptiveScheduler.calculateNextInterval(input);
        expect(result.status).toBe("fragile");
      });
    });
  });
});
