import { ACCOUNTS_RANGE, getValues } from "@/backend/google-sheets";
import { Account } from "@/domain";
import { Session } from "next-auth";

export const getAllAccounts = async (session: Session): Promise<Account[]> => {
  const rows = await getValues(session, ACCOUNTS_RANGE);

  return rows.map(([id, label]) => ({ id, label }));
};
