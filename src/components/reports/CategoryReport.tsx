import { CategoryStats } from "@/domain";
import { currencyColor, formatCurrency } from "@/utils";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import React from "react";

interface CategoryReportProps {
  categoryStats: CategoryStats[];
}

export const CategoryReport: React.FC<CategoryReportProps> = ({ categoryStats }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell width={75}>value</TableCell>
            <TableCell>label</TableCell>
            <TableCell width={90} align="right">
              yearAverage
            </TableCell>
            <TableCell width={90} align="right">
              currentSum
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {categoryStats.map((stat, idx) => (
            <TableRow key={idx} hover>
              <TableCell>{stat.value}</TableCell>
              <TableCell sx={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
                {stat.label}
              </TableCell>
              <TableCell align="right" sx={{ color: currencyColor(stat.yearAverage) }}>
                {formatCurrency(stat.yearAverage)}
              </TableCell>
              <TableCell align="right" sx={{ color: currencyColor(stat.currentSum) }}>
                {formatCurrency(stat.currentSum)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
