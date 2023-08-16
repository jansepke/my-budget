import { YearStats } from "@/components/reports/YearStats";
import { createCustomRender, mockCategoryStats, mockTransactions } from "@/test-utils";
import { screen } from "@testing-library/react";
import { expect, it } from "vitest";

const renderYearStats = createCustomRender(YearStats, {
  categoryStats: [],
  templateTransactions: [],
  averageIncome: 0,
});

it("shows 0 sums without transactions", () => {
  renderYearStats();

  expect(screen.getByText(/next fix Σ/)).toHaveTextContent("0,00 €");
  expect(screen.getByText(/var. Ø/)).toHaveTextContent("0,00 €");
  expect(screen.getByText(/=/)).toHaveTextContent("0,00 €");
});

it("shows average income", () => {
  renderYearStats({ averageIncome: 3.21 });

  expect(screen.getByText(/Income Ø/)).toHaveTextContent("3,21 €");
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
      { value: "I", sums: [4] },
      { value: "Ma", sums: [5] },
      { value: "Mb", sums: [6] },
      { value: "Fa", sums: [1.23] },
      { value: "Ga", sums: [3.21] },
    ),
  });

  expect(screen.getByText(/var. Ø/)).toHaveTextContent("4,44 €");
});

it("calculates sum", () => {
  renderYearStats({
    averageIncome: 5.32,
    categoryStats: mockCategoryStats({ value: "Fa", sums: [-1.23] }),
    templateTransactions: mockTransactions({ amount: -3.21, category: "Mb" }),
  });

  expect(screen.getByText(/=/)).toHaveTextContent("0,88 €");
});
