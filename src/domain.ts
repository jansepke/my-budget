import { Dayjs } from "dayjs";

export interface Account {
  id: number;
  label: string;
}

export interface Category {
  value: string;
  label: string;
}

export interface CategoryStat extends Category {
  sums: number[];
}

export interface GroupStat extends CategoryStat {
  categories: CategoryStat[];
}

export interface Transaction {
  from: number;
  to: number;
  date: number;
  description: string;
  amount: number;
  category: string;
}

export interface TransactionWithRow extends Transaction {
  row: number;
}

export interface NewTransaction extends Omit<Transaction, "date"> {
  date: Dayjs;
}

export interface NewTransactionBackend extends Omit<NewTransaction, "date"> {
  date: string;
}
