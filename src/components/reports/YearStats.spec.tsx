import { YearStats } from "@/components/reports/YearStats";
import { createCustomRender, mockCategoryStats, mockTransactions } from "@/test-utils";
import { screen } from "@testing-library/react";
import { expect, it } from "vitest";

const renderYearStats = createCustomRender(YearStats, { categoryStats: [], templateTransactions: [] });

it("shows 0 sums without transactions", () => {
  renderYearStats();

  expect(screen.getByText(/next fix Σ/)).toHaveTextContent("0,00 €");
  expect(screen.getByText(/var. Ø/)).toHaveTextContent("0,00 €");
  expect(screen.getByText(/=/)).toHaveTextContent("0,00 €");
});

it("calculates next fix sum", () => {
  renderYearStats({
    templateTransactions: mockTransactions(
      { amount: 1.23, category: "Ma" },
      { amount: 3.21, category: "Mb" },
      { amount: 5, category: "Xx" },
    ),
  });

  expect(screen.getByText(/next fix Σ/)).toHaveTextContent("4,44 €");
});

it("calculates variable average", () => {
  renderYearStats({
    categoryStats: mockCategoryStats(
      { value: "I", yearAverage: 4 },
      { value: "Ma", yearAverage: 5 },
      { value: "Mb", yearAverage: 6 },
      { value: "Fa", yearAverage: 1.23 },
      { value: "Ga", yearAverage: 3.21 },
    ),
  });

  expect(screen.getByText(/var. Ø/)).toHaveTextContent("4,44 €");
});

it("calculates sum", () => {
  renderYearStats({
    categoryStats: mockCategoryStats({ value: "Fa", yearAverage: 1.23 }),
    templateTransactions: mockTransactions({ amount: 3.21, category: "Mb" }),
  });

  expect(screen.getByText(/=/)).toHaveTextContent("4,44 €");
});
