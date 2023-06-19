import { SPREADSHEET_ID, TRANSACTIONS_RANGE, createSheetsClient, getValues } from "@/backend/google-sheets";
import { NewTransactionBackend, Transaction } from "@/domain";
import { Session } from "next-auth";
import { formatDate } from "@/utils";

export const getAllTransactions = async (session: Session): Promise<Transaction[]> => {
  try {
    const rows = await getValues(session, TRANSACTIONS_RANGE);

    return rows
      .map(([from, to, date, description, amount, category = null]) => ({
        from: Number(from),
        to: Number(to),
        date,
        description,
        amount: Number(amount),
        category,
      }))
      .sort((a, b) => a.date - b.date);
  } catch (error) {
    console.error(error);

    return [];
  }
};

export const createTransaction = async (session: Session, newTransaction: NewTransactionBackend) => {
  const sheets = createSheetsClient(session);

  const date = formatDate(new Date(newTransaction.date));

  const row = [
    newTransaction.from,
    newTransaction.to,
    date,
    newTransaction.description,
    newTransaction.amount,
    newTransaction.category,
  ];

  console.log("appending transaction", row);

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      valueInputOption: "USER_ENTERED",
      range: TRANSACTIONS_RANGE,
      requestBody: {
        values: [row],
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};
