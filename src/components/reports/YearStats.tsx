import { CategoryStats, Transaction } from "@/domain";
import { FIXED_GROUP, INCOME_CATEGORY, formatCurrency, sum } from "@/utils";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React from "react";

interface YearStatsProps {
  categoryStats: CategoryStats[];
  templateTransactions: Transaction[];
}

export const YearStats: React.FC<YearStatsProps> = ({ categoryStats, templateTransactions }) => {
  const averageVariable = categoryStats
    .filter((cs) => !cs.value.startsWith(INCOME_CATEGORY) && !cs.value.startsWith(FIXED_GROUP))
    .reduce((all, cs) => all + cs.yearAverage, 0);
  const nextFixed = sum(templateTransactions);

  return (
    <Box display="flex" justifyContent="space-between" m={2}>
      <Typography color="text.secondary">{formatCurrency(nextFixed)} (next&nbsp;fix&nbsp;Σ)</Typography>
      <Typography color="text.secondary">{formatCurrency(averageVariable)} (var.&nbsp;Ø)</Typography>
      <Typography color="text.secondary">=&nbsp;{formatCurrency(averageVariable + nextFixed)}</Typography>
    </Box>
  );
};
