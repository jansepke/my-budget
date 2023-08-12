import { YearStats } from "@/components/reports/YearStats";
import { createCustomRender, mockTransactions } from "@/test-utils";
import { screen } from "@testing-library/react";
import { expect, it } from "vitest";

const renderYearStats = createCustomRender(YearStats, { categoryStats: [], templateTransactions: [] });

it("should show 0 sums without transactions", () => {
  renderYearStats();

  expect(screen.getByText(/next fix Σ/)).toHaveTextContent("0,00 €");
  expect(screen.getByText(/var. Ø/)).toHaveTextContent("0,00 €");
  expect(screen.getByText(/=/)).toHaveTextContent("0,00 €");
});

it("should calculate next fix sum", () => {
  renderYearStats({
    templateTransactions: mockTransactions(
      { amount: 1.23, category: "Ma" },
      { amount: 3.21, category: "Mb" },
      { amount: 5, category: "Xx" },
    ),
  });

  expect(screen.getByText(/next fix Σ/)).toHaveTextContent("4,44 €");
});
