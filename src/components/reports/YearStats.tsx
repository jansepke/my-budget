import Link from "@/components/shared/Link";
import { CategoryStat, TransactionDTO } from "@/domain";
import { FIXED_GROUP, INCOME_CATEGORY, average, filterByGroup, formatCurrency, sum } from "@/utils";
import NorthEastIcon from "@mui/icons-material/NorthEast";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React from "react";

interface YearStatsProps {
  categoryStats: CategoryStat[];
  templateTransactions: TransactionDTO[];
  averageIncome: number;
}

export const YearStats: React.FC<YearStatsProps> = ({ categoryStats, templateTransactions, averageIncome }) => {
  const averageVariable = categoryStats
    .filter((cs) => !cs.value.startsWith(INCOME_CATEGORY) && !cs.value.startsWith(FIXED_GROUP))
    .reduce((all, cs) => all + average(cs.sums), 0);
  const nextFixed = sum(templateTransactions.filter(filterByGroup(FIXED_GROUP)));

  return (
    <Box m={2}>
      <Typography variant="h6">
        <Link href="/reports/categories/current" color="inherit" underline="hover">
          Year Stats <NorthEastIcon />
        </Link>
      </Typography>
      <Box display="flex" justifyContent="space-between">
        <Typography color="text.secondary">{formatCurrency(averageIncome)} (Income&nbsp;Ø)</Typography>
        <Typography color="text.secondary">{formatCurrency(nextFixed)} (next&nbsp;fix&nbsp;Σ)</Typography>
        <Typography color="text.secondary">{formatCurrency(averageVariable)} (var.&nbsp;Ø)</Typography>
        <Typography color="text.secondary">
          =&nbsp;{formatCurrency(averageIncome + averageVariable + nextFixed)}
        </Typography>
      </Box>
    </Box>
  );
};
