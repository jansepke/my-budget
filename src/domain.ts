import { Dayjs } from "dayjs";
import { Session } from "next-auth";

export interface Account {
  id: number;
  label: string;
}

export interface Category {
  value: string;
  label: string;
  icon?: string;
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

export interface UpdateTransaction extends Omit<TransactionWithRow, "date"> {
  date: Dayjs;
}

export interface UpdateTransactionBackend extends Omit<TransactionWithRow, "date"> {
  date: string;
}

export interface PageProps {
  session: Session;
  categories: Category[];
}
