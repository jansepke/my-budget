import { parseGoogleSheetsDate } from "@/backend/utils";
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
    valueGetter: ({ value }: { value: number }) => parseGoogleSheetsDate(value),
    valueFormatter: ({ value }: { value: Date }) => value.toLocaleDateString("de-DE", { dateStyle: "medium" }),
  },
  { field: "description", flex: 1 },
  {
    field: "amount",
    type: "number",
    width: 90,
    valueFormatter: ({ value }: { value: number }) =>
      new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(value),
  },
  { field: "category", headerName: "cat.", width: 50 },
].map((cd) => ({ ...cd, sortable: false }));

export const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => (
  <DataGrid
    rows={transactions.map((t, idx) => ({ id: idx, ...t }))}
    columns={columns}
    hideFooter
    autoHeight
    disableColumnMenu
    // density="compact"
  />
);
