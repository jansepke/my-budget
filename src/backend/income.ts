import { INCOME_RANGE, getValues } from "@/backend/google-sheets";
import { Session } from "next-auth";

export const getAverageIncome = async (session: Session): Promise<number> => {
  const rows = await getValues(session, INCOME_RANGE);

  return Number(rows[0][0]);
};
