import { describe, expect, it } from "vitest";
import { formatCurrency } from "../utils/currency";

describe("formatCurrency", () => {
  it.each([[200, "$2"], [2550, "$25.50"], [100000, "$1,000"], [100000000, "$1,000,000"]])("formats %i", (value, expected) => expect(formatCurrency(value)).toBe(expected));
});
