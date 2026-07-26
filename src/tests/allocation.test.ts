import { describe, expect, it } from "vitest";
import { createEvenAllocation, updateAllocation } from "../utils/allocation";

const sum = (values: number[]) => values.reduce((a, b) => a + b, 0);
describe("allocation", () => {
  it("creates an even exact allocation", () => { const result = createEvenAllocation(1000, 6); expect(result).toHaveLength(6); expect(sum(result)).toBe(1000); expect(Math.max(...result) - Math.min(...result)).toBeLessThanOrEqual(1); });
  it("redistributes increases with a zero floor", () => { const result = updateAllocation([100, 100, 100, 100, 100, 100], 0, 600, 600); expect(result).toEqual([600, 0, 0, 0, 0, 0]); });
  it("redistributes decreases evenly", () => { const result = updateAllocation([500, 100, 100, 100, 100, 100], 0, 250, 1000); expect(sum(result)).toBe(1000); expect(result[0]).toBe(250); expect(Math.max(...result.slice(1)) - Math.min(...result.slice(1))).toBeLessThanOrEqual(1); });
  it("preserves invariants across requested values", () => { for (let requested = -100; requested <= 1200; requested += 37) { const result = updateAllocation([167, 167, 167, 167, 166, 166], 2, requested, 1000); expect(sum(result)).toBe(1000); expect(result.every((value) => value >= 0)).toBe(true); expect(result[2]).toBe(Math.max(0, Math.min(requested, 1000))); } });
});
