import { Dayjs } from "dayjs";

export interface Category {
  value: string;
  label: string;
}

export interface Transaction {
  date: Dayjs;
  description: string;
  amount: number;
  category: string;
}
