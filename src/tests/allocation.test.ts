import { describe, expect, it } from "vitest";
import { createEvenAllocation, updateAllocation } from "../utils/allocation";

const sum = (values: number[]) => values.reduce((a, b) => a + b, 0);
describe("allocation", () => {
  it("creates an even exact allocation", () => { const result = createEvenAllocation(1000, 6); expect(result).toHaveLength(6); expect(sum(result)).toBe(1000); expect(Math.max(...result) - Math.min(...result)).toBeLessThanOrEqual(1); });
  it("redistributes increases with a zero floor", () => { const result = updateAllocation([100, 100, 100, 100, 100, 100], 0, 600, 600); expect(result).toEqual([600, 0, 0, 0, 0, 0]); });
  it("redistributes decreases evenly", () => { const result = updateAllocation([500, 100, 100, 100, 100, 100], 0, 250, 1000); expect(sum(result)).toBe(1000); expect(result[0]).toBe(250); expect(Math.max(...result.slice(1)) - Math.min(...result.slice(1))).toBeLessThanOrEqual(1); });
  it("preserves invariants across requested values", () => { for (let requested = -100; requested <= 1200; requested += 37) { const result = updateAllocation([167, 167, 167, 167, 166, 166], 2, requested, 1000); expect(sum(result)).toBe(1000); expect(result.every((value) => value >= 0)).toBe(true); expect(result[2]).toBe(Math.max(0, Math.min(requested, 1000))); } });
  it("keeps the other interns even during repeated one-cent updates", () => {
    const baseline = createEvenAllocation(1000, 6);

    for (let requested = baseline[0] + 1; requested <= 350; requested += 1) {
      const result = updateAllocation(baseline, 0, requested, 1000);
      const others = result.slice(1);
      expect(sum(result)).toBe(1000);
      expect(result[0]).toBe(requested);
      expect(Math.max(...others) - Math.min(...others)).toBeLessThanOrEqual(1);
    }
  });
  it("applies equal absolute changes after a previous slider adjustment", () => {
    const initial = createEvenAllocation(1000, 6);
    const afterFirstDrag = updateAllocation(initial, 0, 300, 1000);
    const afterSecondDrag = updateAllocation(afterFirstDrag, 1, 200, 1000);
    const nonLiveIndexes = [0, 2, 3, 4, 5];
    const reductions = nonLiveIndexes.map(
      (index) => afterFirstDrag[index] - afterSecondDrag[index],
    );

    expect(afterSecondDrag[1]).toBe(200);
    expect(sum(afterSecondDrag)).toBe(1000);
    expect(Math.max(...reductions) - Math.min(...reductions)).toBeLessThanOrEqual(1);
  });
  it("keeps cumulative non-live changes within one cent throughout a later drag", () => {
    const initial = createEvenAllocation(1000, 6);
    const baseline = updateAllocation(initial, 0, 300, 1000);
    const changedIndex = 1;

    for (let requested = baseline[changedIndex] + 1; requested <= 300; requested += 1) {
      const result = updateAllocation(baseline, changedIndex, requested, 1000);
      const changes = baseline
        .map((value, index) => value - result[index])
        .filter((_, index) => index !== changedIndex);

      expect(sum(result)).toBe(1000);
      expect(result[changedIndex]).toBe(requested);
      expect(Math.max(...changes) - Math.min(...changes)).toBeLessThanOrEqual(1);
    }
  });
  it("preserves prior differences in the reported ten-dollar sequence", () => {
    const afterFirstDrag = [117, 415, 117, 117, 117, 117];
    const afterSecondDrag = updateAllocation(afterFirstDrag, 2, 251, 1000);
    const nonLiveChanges = [0, 1, 3, 4, 5].map(
      (index) => afterFirstDrag[index] - afterSecondDrag[index],
    );

    expect(afterSecondDrag).toEqual([90, 388, 251, 90, 90, 91]);
    expect(sum(afterSecondDrag)).toBe(1000);
    expect(Math.max(...nonLiveChanges) - Math.min(...nonLiveChanges)).toBe(1);
  });
});
