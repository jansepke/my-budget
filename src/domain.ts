import { Dayjs } from "dayjs";

export interface Transaction {
  date: Dayjs;
  description: string;
  amount: number;
  category: string;
}
