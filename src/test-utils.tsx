import { CategoryStats, Transaction } from "@/domain";
import { render } from "@testing-library/react";

export const createCustomRender =
  <T,>(Comp: React.FC<T>, defaultProps: T) =>
  (props: Partial<T> = {}) => {
    const mergedProps = { ...defaultProps, ...props };

    const { unmount } = render(<Comp {...mergedProps} />);

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

export const mockCategoryStat = (categoryStat: Partial<CategoryStats>): CategoryStats => ({
  value: "",
  label: "",
  sums: [],
  yearAverage: 0,
  ...categoryStat,
});

export const mockCategoryStats = (...categoryStats: Partial<CategoryStats>[]): CategoryStats[] =>
  categoryStats.map(mockCategoryStat);
