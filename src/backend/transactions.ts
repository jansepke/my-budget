import { SPREADSHEET_ID, TRANSACTIONS_RANGE, createSheetsClient } from "@/backend/google-sheets";
import { Transaction } from "@/domain";
import { Session } from "next-auth";

export const getAllTransactions = async (session: Session) => {
  try {
    const sheets = createSheetsClient(session);

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: TRANSACTIONS_RANGE,
      valueRenderOption: "UNFORMATTED_VALUE",
    });

    return response.data.values?.map((row) => ({
      date: row[0],
      description: row[1],
      amount: Number(row[2]),
      category: row[3] ?? null,
    }));
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
