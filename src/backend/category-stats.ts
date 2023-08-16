import { Category, CategoryStat, Transaction } from "@/domain";
import { filterByCategory, parseGoogleSheetsDate, sum } from "@/utils";

const calculateSumsForCategory = (category: string, transactionsByMonth: Transaction[][]): number[] =>
  transactionsByMonth.map((transactions) => sum(transactions.filter(filterByCategory(category))));

export const calculateCategoryStats = (categories: Category[], transactions: Transaction[]): CategoryStat[] => {
  const transactionsByMonth = transactions.reduce((all, transaction) => {
    const date = parseGoogleSheetsDate(transaction.date);
    const month = date.getMonth();
    if (all[month] === undefined) {
      all[month] = [];
    }

    all[month].push(transaction);

    return all;
  }, [] as Transaction[][]);

  return categories.map((c) => ({
    ...c,
    sums: calculateSumsForCategory(c.value, transactionsByMonth),
  }));
};
