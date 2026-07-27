import { describe, expect, it } from "vitest";
import {
  appreciationPhrases,
  getRandomAppreciationPhrase,
} from "../data/appreciationPhrases";

describe("appreciation phrases", () => {
  it("provides a long editable list without duplicates", () => {
    expect(appreciationPhrases.length).toBeGreaterThanOrEqual(50);
    expect(new Set(appreciationPhrases).size).toBe(appreciationPhrases.length);
  });

  it("selects a phrase using the supplied random value", () => {
    expect(getRandomAppreciationPhrase(() => 0)).toBe(appreciationPhrases[0]);
    expect(getRandomAppreciationPhrase(() => 0.999999)).toBe(
      appreciationPhrases[appreciationPhrases.length - 1],
    );
  });
});
