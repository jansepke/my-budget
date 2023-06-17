import { Dayjs } from "dayjs";

export interface Account {
  id: number;
  label: string;
}

export interface Category {
  value: string;
  label: string;
}

export interface Transaction {
  from: number;
  date: Dayjs;
  description: string;
  amount: number;
  category: string;
}
