import { describe, expect, it } from "vitest";
import { getDeclineMessage } from "../utils/declineCopy";
describe("decline copy", () => { it("changes over fifty dollars", () => { expect(getDeclineMessage(5000)).toBe("Your payment could not be authorized."); expect(getDeclineMessage(5001)).toBe("Tip amount exceeds the approved intern appreciation budget."); }); });
