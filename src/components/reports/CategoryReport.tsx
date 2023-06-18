import { currencyColor, formatCurrency } from "@/backend/utils";
import { CategoryStats } from "@/domain";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import React from "react";

interface CategoryReportProps {
  categoryStats: CategoryStats[];
}

const columns: GridColDef[] = [
  {
    field: "value",
  },
  { field: "label", flex: 1 },
  {
    field: "sum",
    type: "number",
    width: 90,
    renderCell: (params: GridRenderCellParams) => (
      <Box sx={{ color: currencyColor(params.value) }}>{formatCurrency(params.value)}</Box>
    ),
  },
].map((cd) => ({ ...cd, sortable: false }));

export const CategoryReport: React.FC<CategoryReportProps> = ({ categoryStats }) => (
  <DataGrid
    rows={categoryStats.map((t) => ({ id: t.value, ...t }))}
    columns={columns}
    hideFooter
    autoHeight
    disableColumnMenu
  />
);
