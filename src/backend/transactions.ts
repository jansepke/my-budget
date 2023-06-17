import { SPREADSHEET_ID, TRANSACTIONS_RANGE, createSheetsClient, getValues } from "@/backend/google-sheets";
import { Transaction, TransactionBackend } from "@/domain";
import { Session } from "next-auth";
import { parseGoogleSheetsDate } from "./utils";
import dayjs from "dayjs";

export const getAllTransactions = async (session: Session): Promise<TransactionBackend[]> => {
  try {
    const rows = await getValues(session, TRANSACTIONS_RANGE);

    return rows.map(([from, to, date, description, amount, category = null]) => ({
      from,
      to,
      date,
      description,
      amount: Number(amount),
      category,
    }));
  } catch (error) {
    console.error(error);

    return [];
  }
};

export const filterByMonth = (year: number, month: number) => {
  const startDate = dayjs(`${year}-${month}-1`);
  const endDate = startDate.endOf("month");

  return (t: TransactionBackend) => {
    const date = parseGoogleSheetsDate(t.date);
    return date > startDate.toDate() && date < endDate.toDate();
  };
};

export const filterForMainAccount = (t: TransactionBackend) => t.from || t.to === 1;

export const createTransaction = async (session: Session, newTransaction: Transaction) => {
  const sheets = createSheetsClient(session);

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    valueInputOption: "USER_ENTERED",
    range: TRANSACTIONS_RANGE,
    requestBody: {
      values: [[newTransaction.date, newTransaction.description, newTransaction.amount, newTransaction.category]],
    },
  });
};
