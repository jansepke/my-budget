import { describe, expect, it } from "vitest";
import { sum } from "./utils";

describe("sum", () => {
  it("sums transactions", () => {
    const transactions = [{ amount: 1 }, { amount: 2.2 }];

    const result = sum(transactions);

    expect(result).toBe(3.2);
  });
});
