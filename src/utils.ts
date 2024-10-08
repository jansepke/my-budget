import { TransactionBase, TransactionDTO } from "@/domain";
import { green, red } from "@mui/material/colors";
import dayjs from "dayjs";

export const INCOME_CATEGORY = "I";
export const FIXED_GROUP = "M";

// https://stackoverflow.com/a/53107408/1453662
export const parseGoogleSheetsDate = (value: number) => new Date(value * 86400000 - 2209132800000);
export const formatDate = (value: Date) => value.toLocaleDateString("de-DE", { dateStyle: "medium" });
export const parseDTOs = <T extends { date: number }>(ts: T[]) =>
  ts.map((t) => ({ ...t, date: dayjs(parseGoogleSheetsDate(t.date)) }));

const numberFormat = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });
const numberFormatNoDecimal = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});
export const formatCurrency = (value: number, decimals = true) =>
  (decimals ? numberFormat : numberFormatNoDecimal).format(value);

export const currencyColor = (value: number) => currencyDiffColor(value, 0);
export const currencyDiffColor = (value: number, to: number) => (value < to ? red[400] : green[700]);

export const sum = (transactions: Pick<TransactionBase, "amount">[]) =>
  transactions.reduce((sum, t) => sum + t.amount, 0);
export const average = (values: number[]) => values.reduce((sum, v) => sum + v, 0) / values.length;

export const filterBetweenDates = (startDate: dayjs.Dayjs, endDate: dayjs.Dayjs) => (t: TransactionDTO) => {
  const date = parseGoogleSheetsDate(t.date);
  return date > startDate.toDate() && date < endDate.toDate();
};

export const filterByMonth = (year: number, month: number) => {
  const startDate = dayjs(`${year}-${month}-1`);
  const endDate = startDate.endOf("month");

  return filterBetweenDates(startDate, endDate);
};

export const filterForMainAccount = (t: TransactionBase) =>
  (t.from && !t.to) || (!t.from && (t.to === 1 || t.category !== undefined));

export const filterForOtherAccounts = (t: TransactionBase) => t.from !== 1 || t.to !== 1;

export const filterForOtherAccount = (accountId: number) => (t: TransactionBase) =>
  t.from === accountId || t.to === accountId;

export const filterByCategory = (category: string) => (t: TransactionBase) => t.category === category;
export const filterByGroup = (group: string) => (t: TransactionBase) => t.category?.startsWith(group);
export const filterVariable = (t: TransactionBase) =>
  !t.category.startsWith(INCOME_CATEGORY) && !t.category.startsWith(FIXED_GROUP);

export const customFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const response = await fetch(input, init);

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`HTTP error ${response.status} with body ${body}`);
  }

  return response;
};

export const customFetchJson = async <T>(input: RequestInfo | URL, init?: RequestInit) => {
  const response = await customFetch(input, init);

  return (await response.json()) as T;
};
