import { Category, CategoryStat, Transaction, TransactionBase, TransactionDTO } from "@/domain";
import { filterByCategory, filterByGroup, parseGoogleSheetsDate, sum } from "@/utils";

const calculateSumsForCategory = (category: string, transactionsByMonth: TransactionBase[][]): number[] =>
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

const calculateSumsForGroup = (category: string, transactionsByMonth: Transaction[][]): number[] =>
  transactionsByMonth.map((transactions) => sum(transactions.filter(filterByGroup(category))));

export const calculateGroupStats = (categories: Category[], transactions: Transaction[]): CategoryStat[] => {
  const transactionsByMonth = transactions.reduce((all, transaction) => {
    const month = transaction.date.month();
    if (all[month] === undefined) {
      all[month] = [];
    }

    all[month].push(transaction);

    return all;
  }, [] as Transaction[][]);

  return categories
    .filter((c) => c.value.length === 1)
    .map((c) => ({
      ...c,
      sums: calculateSumsForGroup(c.value, transactionsByMonth),
    }));
};
