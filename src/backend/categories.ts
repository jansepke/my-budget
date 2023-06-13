import { CATEGORIES_RANGE, SPREADSHEET_ID, createSheetsClient } from "@/backend/google-sheets";
import { Session } from "next-auth";

export const getAllCategories = async (session: Session) => {
  try {
    const sheets = createSheetsClient(session);

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: CATEGORIES_RANGE,
      valueRenderOption: "UNFORMATTED_VALUE",
    });

    return response.data.values
      ?.map((row) => ({
        value: row[0],
        label: row[1],
      }))
      .filter(({ value }) => value);
  } catch (error) {
    console.error(error);

    return [];
  }
};
