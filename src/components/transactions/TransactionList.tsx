import { useCategories } from "@/components/shared/CategoriesProvider";
import { CategoryIcon } from "@/components/transactions/CategoryIcon";
import { EditForm } from "@/components/transactions/EditForm";
import { TransactionWithRow } from "@/domain";
import { currencyColor, formatCurrency, formatDate, parseGoogleSheetsDate } from "@/utils";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import React, { useState } from "react";

interface TransactionListProps {
  accountId: number;
  transactions: TransactionWithRow[];
}

export const TransactionList: React.FC<TransactionListProps> = ({ accountId, transactions }) => {
  const { categories } = useCategories();
  const [editRow, setEditRow] = useState<number | undefined>(undefined);

  const transactionsByDate = transactions.reduce(
    (all, t) => {
      if (!all[t.date]) {
        all[t.date] = [];
      }
      all[t.date].push(t);
      return all;
    },
    {} as Record<number, TransactionWithRow[]>,
  );

  const editTransaction = transactions.find((t) => t.row === editRow);

  return (
    <>
      {editTransaction === undefined ? (
        <List dense>
          {Object.entries(transactionsByDate).map(([date, trans]) => (
            <React.Fragment key={`item-${date}`}>
              <ListSubheader disableGutters>{formatDate(parseGoogleSheetsDate(Number(date)))}</ListSubheader>
              {trans.map((t, idx) => {
                const category = categories.find((c) => c.value === t.category);

                return (
                  <ListItem disableGutters key={`item-${date}-${idx}`}>
                    <ListItemButton onClick={() => setEditRow(t.row)}>
                      <ListItemAvatar>
                        <CategoryIcon category={category} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box display="flex" justifyContent="space-between">
                            {t.description}{" "}
                            <Box sx={{ color: currencyColor(t.amount) }}>{formatCurrency(t.amount)}</Box>
                          </Box>
                        }
                        secondary={
                          <>
                            {category?.label} {t.from !== 0 && t.from !== accountId && "X"}
                          </>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </React.Fragment>
          ))}
        </List>
      ) : (
        <EditForm transaction={editTransaction} />
      )}
    </>
  );
};
