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
  // https://github.com/testing-library/jest-dom/issues/376#issuecomment-885012111
  const fixResult = (result: string) => result.replace(/\u00a0/g, " ");

  it("formats in EUR", () => {
    const result = formatCurrency(123.12);

    expect(fixResult(result)).toBe("123,12 €");
  });

  it("formats without decimals", () => {
    const result = formatCurrency(123.12, false);

    expect(fixResult(result)).toBe("123 €");
  });
});
