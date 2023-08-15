import { CategoryReport } from "@/components/reports/CategoryReport";
import { createCustomRender, mockCategoryStats } from "@/test-utils";
import { screen, within } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";

const renderCategoryReport = createCustomRender(CategoryReport, {
  categoryStats: [],
});

const getRow = (category: string) => within(screen.getByRole("cell", { name: category }).closest("tr")!);

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2000, 1, 1));
});

afterEach(() => {
  vi.useRealTimers();
});

it("shows default column headers", () => {
  renderCategoryReport();

  const columns = screen.getAllByRole("columnheader");
  expect(columns[0]).toBeEmptyDOMElement();
  expect(columns[1]).toHaveTextContent("Category");
  expect(columns[2]).toHaveTextContent("Year Ø");
});

it("shows column per month of current year", () => {
  renderCategoryReport();

  const columns = screen.getAllByRole("columnheader");
  expect(columns).toHaveLength(5);
  expect(columns.at(3)).toHaveTextContent("Feb. Σ");
  expect(columns.at(-1)).toHaveTextContent("Jan. Σ");
});

it("shows year average per category", () => {
  renderCategoryReport({
    categoryStats: mockCategoryStats(
      { value: "A", label: "CatA", yearAverage: 1.23 },
      { value: "B", label: "CatB", yearAverage: 3.51 },
    ),
  });

  expect(getRow("A - CatA").getAllByRole("cell")[2]).toHaveTextContent("1 €");
  expect(getRow("B - CatB").getAllByRole("cell")[2]).toHaveTextContent("4 €");
});

it("shows sums per month per category", () => {
  renderCategoryReport({
    categoryStats: mockCategoryStats(
      { value: "A", label: "CatA", sums: [1.23, 4.56] },
      { value: "B", label: "CatB", sums: [2.34, 6.78] },
    ),
  });

  const rowA = getRow("A - CatA");
  expect(rowA.getAllByRole("cell")[3]).toHaveTextContent("5 €");
  expect(rowA.getAllByRole("cell")[4]).toHaveTextContent("1 €");

  const rowB = getRow("B - CatB");
  expect(rowB.getAllByRole("cell")[3]).toHaveTextContent("7 €");
  expect(rowB.getAllByRole("cell")[4]).toHaveTextContent("2 €");
});
