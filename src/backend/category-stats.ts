import { Category, CategoryStat, TransactionDTO } from "@/domain";
import { filterByCategory, filterByGroup, parseGoogleSheetsDate, sum } from "@/utils";

const calculateSumsForCategory = (category: string, transactionsByMonth: TransactionDTO[][]): number[] =>
  transactionsByMonth.map((transactions) => sum(transactions.filter(filterByCategory(category))));

export const calculateCategoryStats = (categories: Category[], transactions: TransactionDTO[]): CategoryStat[] => {
  const transactionsByMonth = transactions.reduce((all, transaction) => {
    const date = parseGoogleSheetsDate(transaction.date);
    const month = date.getMonth();
    if (all[month] === undefined) {
      all[month] = [];
    }

    all[month].push(transaction);

    return all;
  }, [] as TransactionDTO[][]);

  return categories.map((c) => ({
    ...c,
    sums: calculateSumsForCategory(c.value, transactionsByMonth),
  }));
};

const calculateSumsForGroup = (category: string, transactionsByMonth: TransactionDTO[][]): number[] =>
  transactionsByMonth.map((transactions) => sum(transactions.filter(filterByGroup(category))));

export const calculateGroupStats = (categories: Category[], transactions: TransactionDTO[]): CategoryStat[] => {
  const transactionsByMonth = transactions.reduce((all, transaction) => {
    const date = parseGoogleSheetsDate(transaction.date);
    const month = date.getMonth();
    if (all[month] === undefined) {
      all[month] = [];
    }

    all[month].push(transaction);

    return all;
  }, [] as TransactionDTO[][]);

  return categories
    .filter((c) => c.value.length === 1)
    .map((c) => ({
      ...c,
      sums: calculateSumsForGroup(c.value, transactionsByMonth),
    }));
};
