import { describe, expect, it } from "vitest";
import {
  createProcessingSequence,
  processingMessagePools,
} from "../data/processingMessages";

describe("processing messages", () => {
  it("provides five substantial, non-overlapping message pools", () => {
    expect(processingMessagePools).toHaveLength(5);
    processingMessagePools.forEach((pool) => {
      expect(pool.length).toBeGreaterThanOrEqual(10);
    });

    const allMessages = processingMessagePools.flat();
    expect(new Set(allMessages).size).toBe(allMessages.length);
  });

  it("selects one message from each pool", () => {
    const firstSequence = createProcessingSequence(() => 0);
    const lastSequence = createProcessingSequence(() => 0.999999);

    expect(firstSequence).toHaveLength(5);
    expect(lastSequence).toHaveLength(5);
    processingMessagePools.forEach((pool, index) => {
      expect(firstSequence[index]).toBe(pool[0]);
      expect(lastSequence[index]).toBe(pool[pool.length - 1]);
    });
  });
});
