import { CATEGORIES_RANGE, getValues } from "@/backend/google-sheets";
import { Category } from "@/domain";
import { Session } from "next-auth";

export const getAllCategories = async (session: Session): Promise<Category[]> => {
  const rows = await getValues(session, CATEGORIES_RANGE);

  return rows
    .map(([value, label, icon]) => ({ value: value as string, label: label as string, icon: (icon as string) ?? "" }))
    .filter(({ value }) => value);
};

export const getSelectableCategories = async (session: Session): Promise<Category[]> => {
  const rows = await getValues(session, CATEGORIES_RANGE);

  return rows
    .filter(([, , , hidden]) => hidden !== "x")
    .map(([value, label]) => ({ value: value as string, label: label as string }))
    .filter(({ value }) => value);
};
