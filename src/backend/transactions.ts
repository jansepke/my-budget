import { SPREADSHEET_ID, TRANSACTIONS_RANGE, createSheetsClient, getValues } from "@/backend/google-sheets";
import { NewTransaction, Transaction } from "@/domain";
import { Session } from "next-auth";

export const getAllTransactions = async (session: Session): Promise<Transaction[]> => {
  try {
    const rows = await getValues(session, TRANSACTIONS_RANGE);

    return rows.map(([from, to, date, description, amount, category = null]) => ({
      from: Number(from),
      to: Number(to),
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

export const createTransaction = async (session: Session, newTransaction: NewTransaction) => {
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
