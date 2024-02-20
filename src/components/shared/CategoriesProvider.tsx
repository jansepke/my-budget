import { Category } from "@/domain";
import React, { createContext, useContext } from "react";

interface CategoriesContext {
  categories: Category[];
}

const Context = createContext<CategoriesContext | undefined>(undefined);

export const useCategories = () => {
  const value = useContext(Context);

  if (value === undefined) {
    throw new Error("must be used inside of a CategoriesProvider");
  }

  return value;
};

export const CategoriesProvider: React.FC<CategoriesContext & React.PropsWithChildren> = ({ categories, children }) => (
  <Context.Provider value={{ categories: categories }}>{children}</Context.Provider>
);
