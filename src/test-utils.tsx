import { CategoryStat, Transaction } from "@/domain";
import { render } from "@testing-library/react";
import { MemoryRouterProvider } from "next-router-mock/MemoryRouterProvider";

export const createCustomRender =
  <T,>(Comp: React.FC<T>, defaultProps: T) =>
  (props: Partial<T> = {}) => {
    const mergedProps = { ...defaultProps, ...props };

    const { unmount } = render(<Comp {...mergedProps} />, { wrapper: MemoryRouterProvider });

    return { unmount, ...mergedProps };
  };

export const mockTransaction = (transaction: Partial<Transaction>): Transaction => ({
  amount: 0,
  category: "",
  date: 1,
  description: "",
  from: 1,
  to: 0,
  ...transaction,
});

export const mockTransactions = (...transactions: Partial<Transaction>[]): Transaction[] =>
  transactions.map(mockTransaction);

export const mockCategoryStat = (categoryStat: Partial<CategoryStat>): CategoryStat => ({
  value: "",
  label: "",
  sums: [],
  ...categoryStat,
});

export const mockCategoryStats = (...categoryStats: Partial<CategoryStat>[]): CategoryStat[] =>
  categoryStats.map(mockCategoryStat);
