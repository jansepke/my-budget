import { currencyColor, formatCurrency } from "@/utils";
import { CategoryStats } from "@/domain";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import React from "react";

interface CategoryReportProps {
  categoryStats: CategoryStats[];
}

const renderCurrency = (params: GridRenderCellParams<CategoryStats, number>) =>
  params.value === undefined ? (
    "-"
  ) : (
    <Box sx={{ color: currencyColor(params.value) }}>{formatCurrency(params.value)}</Box>
  );

const columns: GridColDef<CategoryStats>[] = [
  {
    field: "value",
  },
  { field: "label", flex: 1 },
  {
    field: "yearAverage",
    type: "number",
    width: 90,
    renderCell: renderCurrency,
  },
  {
    field: "currentSum",
    type: "number",
    width: 90,
    renderCell: renderCurrency,
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
