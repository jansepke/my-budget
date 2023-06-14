import { SPREADSHEET_ID, TRANSACTIONS_RANGE, createSheetsClient } from "@/backend/google-sheets";
import { Transaction } from "@/domain";
import { Session } from "next-auth";
import { parseGoogleSheetsDate } from "./utils";
import dayjs from "dayjs";

export const getTransactionsForMonth = async (session: Session, year: number, month: number) => {
  try {
    const startDate = dayjs(`${year}-${month}-1`);
    const endDate = startDate.endOf("month");

    const sheets = createSheetsClient(session);

    const { data } = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: TRANSACTIONS_RANGE,
      valueRenderOption: "UNFORMATTED_VALUE",
    });

    if (!data.values) {
      throw new Error("no values");
    }

    const transactions = data.values.map((row) => ({
      date: row[0],
      description: row[1],
      amount: Number(row[2]),
      category: row[3] ?? null,
    }));

    return transactions.filter((t) => {
      const date = parseGoogleSheetsDate(t.date);
      return date > startDate.toDate() && date < endDate.toDate();
    });
  } catch (error) {
    console.error(error);

    return [];
  }
};

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
