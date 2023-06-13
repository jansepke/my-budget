import * as google from "@googleapis/sheets";
import { Session } from "next-auth";

export const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
export const TRANSACTIONS_RANGE = process.env.TRANSACTIONS_RANGE;
export const CATEGORIES_RANGE = process.env.CATEGORIES_RANGE;

export const createSheetsClient = (session: Session) => {
  const auth = new google.auth.OAuth2({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  });
  auth.setCredentials({
    access_token: session.accessToken,
  });

  return google.sheets({ version: "v4", auth });
};
