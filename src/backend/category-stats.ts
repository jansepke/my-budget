import { Category, CategoryStat, Transaction } from "@/domain";
import { filterBetweenDates, filterByCategory, parseGoogleSheetsDate, sum } from "@/utils";
import dayjs from "dayjs";

const calculateSumsForCategory = (category: string, transactionsByMonth: Transaction[][]): number[] =>
  transactionsByMonth.map((transactions) => sum(transactions.filter(filterByCategory(category))));

export const calculateCategoryStats = (categories: Category[], transactions: Transaction[]): CategoryStat[] => {
  const today = dayjs();
  const startOfYear = today.startOf("year");
  const endOfLastMonth = today.subtract(1, "month").endOf("month");

  const currentYear = transactions.filter(filterBetweenDates(startOfYear, endOfLastMonth));

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
    yearAverage: sum(currentYear.filter(filterByCategory(c.value))) / (endOfLastMonth.month() + 1),
    sums: calculateSumsForCategory(c.value, transactionsByMonth),
  }));
};
