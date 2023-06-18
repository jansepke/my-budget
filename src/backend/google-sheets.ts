/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as google from "@googleapis/sheets";
import assert from "node:assert/strict";
import { Session } from "next-auth";

export const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
assert(SPREADSHEET_ID, "SPREADSHEET_ID missing");
export const ACCOUNTS_RANGE = process.env.ACCOUNTS_RANGE!;
assert(ACCOUNTS_RANGE, "ACCOUNTS_RANGE missing");
export const CATEGORIES_RANGE = process.env.CATEGORIES_RANGE!;
assert(CATEGORIES_RANGE, "CATEGORIES_RANGE missing");
export const TRANSACTIONS_RANGE = process.env.TRANSACTIONS_RANGE!;
assert(TRANSACTIONS_RANGE, "TRANSACTIONS_RANGE missing");

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

export const getValues = async (session: Session, range: string) => {
  try {
    const sheets = createSheetsClient(session);

    const { data } = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: range,
      valueRenderOption: "UNFORMATTED_VALUE",
    });

    if (!data.values) {
      throw new Error("no values");
    }

    return data.values;
  } catch (error) {
    console.error(error);

    return [];
  }
};
