import { currencyColor, formatCurrency, formatDate, parseGoogleSheetsDate } from "@/backend/utils";
import { Transaction } from "@/domain";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import React from "react";

interface TransactionListProps {
  accountId: number;
  transactions: Transaction[];
}

export const TransactionList: React.FC<TransactionListProps> = ({ accountId, transactions }) => {
  const columns: GridColDef[] = [
    {
      field: "date",
      type: "date",
      valueGetter: ({ value }: { value: number }) => parseGoogleSheetsDate(value),
      valueFormatter: ({ value }: { value: Date }) => formatDate(value),
    },
    {
      field: "description",
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
          {params.value}
          {params.row.from !== 0 && params.row.from !== accountId && <Chip label="X" color="primary" size="small" />}
        </Box>
      ),
    },
    {
      field: "amount",
      type: "number",
      width: 90,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ color: currencyColor(params.value) }}>{formatCurrency(params.value)}</Box>
      ),
    },
    { field: "category", headerName: "cat.", width: 50 },
  ].map((cd) => ({ ...cd, sortable: false }));

  return (
    <DataGrid
      rows={transactions.map((t, idx) => ({ id: idx, ...t }))}
      columns={columns}
      autoHeight
      disableColumnMenu
      // density="compact"
    />
  );
};
