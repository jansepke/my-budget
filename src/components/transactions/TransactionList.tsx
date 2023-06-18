import { currencyColor, formatCurrency, formatDate, parseGoogleSheetsDate } from "@/backend/utils";
import { Transaction } from "@/domain";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import React from "react";

interface TransactionListProps {
  accountId: number;
  transactions: Transaction[];
}

export const TransactionList: React.FC<TransactionListProps> = ({ accountId, transactions }) => (
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell width={75}>date</TableCell>
          <TableCell>description</TableCell>
          <TableCell width={90} align="right">
            amount
          </TableCell>
          <TableCell width={50}>cat.</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {transactions.map((t, idx) => (
          <TableRow key={idx} hover>
            <TableCell>{formatDate(parseGoogleSheetsDate(t.date))}</TableCell>
            <TableCell sx={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
              {t.description} {t.from !== 0 && t.from !== accountId && <Chip label="X" color="primary" size="small" />}
            </TableCell>
            <TableCell align="right" sx={{ color: currencyColor(t.amount) }}>
              {formatCurrency(t.amount)}
            </TableCell>
            <TableCell>{t.category}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);
