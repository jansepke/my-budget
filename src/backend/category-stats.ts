import { Category, CategoryStats, Transaction } from "@/domain";
import { filterBetweenDates, filterByCategory, sum } from "@/utils";
import dayjs from "dayjs";

export const calculateCategoryStats = (categories: Category[], transactions: Transaction[]): CategoryStats[] => {
  const today = dayjs();
  const startOfYear = today.startOf("year");
  const startOfLastMonth = today.subtract(1, "month").startOf("month");
  const endOfLastMonth = today.subtract(1, "month").endOf("month");
  const startOfCurrentMonth = today.startOf("month");

  const currentYear = transactions.filter(filterBetweenDates(startOfYear, endOfLastMonth));
  const lastMonth = transactions.filter(filterBetweenDates(startOfLastMonth, endOfLastMonth));
  const currentMonth = transactions.filter(filterBetweenDates(startOfCurrentMonth, today));

  return categories.map((c) => ({
    ...c,
    yearAverage: sum(currentYear.filter(filterByCategory(c.value))) / (endOfLastMonth.month() + 1),
    lastSum: sum(lastMonth.filter(filterByCategory(c.value))),
    currentSum: sum(currentMonth.filter(filterByCategory(c.value))),
  }));
};
