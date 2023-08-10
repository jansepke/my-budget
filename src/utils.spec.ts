import { describe, expect, it } from "vitest";
import { formatCurrency, sum } from "./utils";

describe("sum", () => {
  it("sums transactions", () => {
    const transactions = [{ amount: 1 }, { amount: 2.2 }];

    const result = sum(transactions);

    expect(result).toBe(3.2);
  });
});

describe("formatCurrency", () => {
  it("formats in EUR", () => {
    const result = formatCurrency(123);

    // https://github.com/testing-library/jest-dom/issues/376#issuecomment-885012111
    expect(result.replace(/\u00a0/g, " ")).toBe("123,00 €");
  });
});
