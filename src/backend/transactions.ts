import {
  SPREADSHEET_ID,
  TEMPLATE_RANGE,
  TRANSACTIONS_RANGE,
  createSheetsClient,
  getValues,
} from "@/backend/google-sheets";
import { NewTransactionBackend, Transaction, TransactionWithRow, UpdateTransactionBackend } from "@/domain";
import { formatDate } from "@/utils";
import { Session } from "next-auth";

const rowsToTransactions = ([from, to, date, description, amount, category = null]: (
  | string
  | number
  | null
)[]): Transaction => ({
  from: Number(from),
  to: Number(to),
  date: date as number,
  description: description as string,
  amount: Number(amount),
  category: (category as string | null) ?? "",
});

export const getAllTransactions = async (session: Session): Promise<TransactionWithRow[]> => {
  try {
    const rows = await getValues(session, TRANSACTIONS_RANGE, false);

    const transactions = rows.map(rowsToTransactions);
    const transactionsWithRow = transactions.map((t, idx) => ({ ...t, row: idx + 1 }));
    return transactionsWithRow.sort((a, b) => a.date - b.date);
  } catch (error) {
    console.error(error);

    return [];
  }
};

export const getTemplateTransactions = async (session: Session): Promise<Transaction[]> => {
  try {
    const rows = await getValues(session, TEMPLATE_RANGE);

    return rows.map(rowsToTransactions);
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

    console.log("appended transaction", row);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateTransaction = async (session: Session, row: string, transaction: UpdateTransactionBackend) => {
  const sheets = createSheetsClient(session);

  const date = formatDate(new Date(transaction.date));

  const updateRow = [
    transaction.from > 0 ? transaction.from : "",
    transaction.to > 0 ? transaction.to : "",
    date,
    transaction.description,
    transaction.amount,
    transaction.category,
  ];

  const range = TRANSACTIONS_RANGE.replace("1", row) + row;

  console.log("updating transaction", range, updateRow);

  try {
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      valueInputOption: "USER_ENTERED",
      range: range,
      requestBody: {
        values: [updateRow],
      },
    });

    console.log("updated transaction", range);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
