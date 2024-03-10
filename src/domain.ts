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

export interface TransactionBase {
  from: number;
  to: number;
  description: string;
  amount: number;
  category: string;
}

export interface Transaction extends TransactionBase {
  date: Dayjs;
}

export interface TransactionDTO extends Omit<Transaction, "date"> {
  date: number;
}

export interface TransactionWithRow extends Transaction {
  row: number;
}

export interface TransactionWithRowDTO extends TransactionDTO {
  row: number;
}

// TODO: use number date for backend
export interface TransactionBackend extends Omit<Transaction, "date"> {
  date: string;
}

export interface PageProps {
  session: Session;
  categories: Category[];
}
