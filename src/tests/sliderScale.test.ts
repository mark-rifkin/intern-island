import { describe, expect, it } from "vitest";
import { positionToAmountCents, snapCustomAmountCents } from "../utils/sliderScale";
describe("slider scale", () => {
  it("maps the endpoints and increases monotonically", () => { expect(positionToAmountCents(0)).toBe(0); expect(positionToAmountCents(1000)).toBe(100000000); let previous = 0; for (let position = 1; position <= 1000; position += 1) { const value = positionToAmountCents(position); expect(value).toBeGreaterThanOrEqual(previous); previous = value; } });
  it("snaps to readable increments", () => { expect(snapCustomAmountCents(12345)).toBe(12500); });
});
