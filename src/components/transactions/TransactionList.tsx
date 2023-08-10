import { Transaction } from "@/domain";
import { currencyColor, formatCurrency, formatDate, parseGoogleSheetsDate } from "@/utils";
import Box from "@mui/material/Box";
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
        {transactions.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} align="center">
              no transactions
            </TableCell>
          </TableRow>
        ) : (
          transactions.map((t, idx) => (
            <TableRow key={idx} hover>
              <TableCell>{formatDate(parseGoogleSheetsDate(t.date))}</TableCell>
              <TableCell>
                <Box display="flex" justifyContent="space-between">
                  {t.description}{" "}
                  {t.from !== 0 && t.from !== accountId && <Chip label="X" color="primary" size="small" />}
                </Box>
              </TableCell>
              <TableCell align="right" sx={{ color: currencyColor(t.amount) }}>
                {formatCurrency(t.amount)}
              </TableCell>
              <TableCell>{t.category}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  </TableContainer>
);
