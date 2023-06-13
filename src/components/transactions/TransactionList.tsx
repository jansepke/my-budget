import { Transaction } from "@/domain";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React from "react";

interface TransactionListProps {
  transactions: Transaction[];
}

const columns: GridColDef[] = [
  {
    field: "date",
    type: "date",
    valueGetter: ({ value }) => new Date(value),
    valueFormatter: ({ value }) => value?.toLocaleDateString("de-DE"),
  },
  { field: "description" },
  { field: "amount", type: "number" },
];

export const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => (
  <DataGrid
    rows={transactions.map((t, idx) => ({ id: idx, ...t }))}
    columns={columns}
    hideFooter
    autoHeight
    disableColumnMenu
  />
);
