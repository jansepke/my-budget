import { Transaction } from "@/domain";
import * as google from "@googleapis/sheets";
import { Session } from "next-auth";

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const TRANSACTIONS_RANGE = process.env.TRANSACTIONS_RANGE;

export const getAllTransactions = async (session: Session) => {
  try {
    const sheets = createSheetsClient(session);

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: TRANSACTIONS_RANGE,
    });

    return response.data.values?.map((row) => ({ date: row[0], description: row[1], amount: Number(row[2]) }));
  } catch (error) {
    return [];
  }
};

export const createTransaction = async (session: Session, newTransaction: Transaction) => {
  const sheets = createSheetsClient(session);

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    valueInputOption: "USER_ENTERED",
    range: TRANSACTIONS_RANGE,
    requestBody: { values: [[newTransaction.date, newTransaction.description, newTransaction.amount]] },
  });
};

function createSheetsClient(session: Session) {
  const auth = new google.auth.OAuth2({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  });
  auth.setCredentials({
    access_token: session.accessToken,
  });

  return google.sheets({ version: "v4", auth });
}
