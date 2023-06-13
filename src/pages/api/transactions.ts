import { Transaction } from "@/domain";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import * as google from "@googleapis/sheets";
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import { getServerSession } from "next-auth/next";

const post = async (sheets: google.sheets_v4.Sheets, req: NextApiRequest, res: NextApiResponse) => {
  const newTransaction = JSON.parse(req.body) as Transaction;
  console.log(newTransaction);

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.SPREADSHEET_ID,
    valueInputOption: "USER_ENTERED",
    range: process.env.TRANSACTIONS_RANGE,
    requestBody: { values: [[newTransaction.date, newTransaction.description, newTransaction.amount]] },
  });

  res.end();
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).end();
  }

  const sheets = createSheetsClient(session);

  if (req.method === "POST") {
    return post(sheets, req, res);
  } else {
    return res.status(404).end();
  }
};

export default handler;

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
