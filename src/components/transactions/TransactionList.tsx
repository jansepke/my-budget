import { Transaction } from "@/domain";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React from "react";

// https://stackoverflow.com/a/53107408/1453662
const parseGoogleSheetsDate = ({ value }: { value: number }) => new Date(value * 86400000 - 2209132800000);
const formatDate = ({ value }: { value: Date }) => value.toLocaleDateString("de-DE", { dateStyle: "medium" });
const formatMoney = ({ value }: { value: number }) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(value);

interface TransactionListProps {
  transactions: Transaction[];
}

const columns: GridColDef[] = [
  { field: "date", type: "date", valueGetter: parseGoogleSheetsDate, valueFormatter: formatDate },
  { field: "description", flex: 1 },
  { field: "amount", type: "number", width: 90, valueFormatter: formatMoney },
  { field: "category", headerName: "cat.", width: 50 },
].map((cd) => ({ ...cd, sortable: false }));

export const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => (
  <DataGrid
    rows={transactions.map((t, idx) => ({ id: idx, ...t }))}
    columns={columns}
    hideFooter
    autoHeight
    disableColumnMenu
  />
);
