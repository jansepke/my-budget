import { Dayjs } from "dayjs";

export interface Account {
  id: number;
  label: string;
}

export interface Category {
  value: string;
  label: string;
}

export interface CategoryStats extends Category {
  yearAverage: number;
  currentSum: number;
}

export interface Transaction {
  from: number;
  to: number;
  date: number;
  description: string;
  amount: number;
  category: string;
}

export interface NewTransaction extends Omit<Transaction, "date"> {
  date: Dayjs;
}

export interface NewTransactionBackend extends Omit<NewTransaction, "date"> {
  date: string;
}
