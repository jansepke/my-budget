import { CategoryStats } from "@/domain";
import { FIXED_CATEGORY, INCOME_CATEGORY, formatCurrency } from "@/utils";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React from "react";

interface YearStatsProps {
  categoryStats: CategoryStats[];
}

export const YearStats: React.FC<YearStatsProps> = ({ categoryStats }) => {
  const averageVariable = categoryStats
    .filter((cs) => !cs.value.startsWith(INCOME_CATEGORY) && !cs.value.startsWith(FIXED_CATEGORY))
    .reduce((all, cs) => all + cs.yearAverage, 0);
  const lastFix = categoryStats
    .filter((cs) => cs.value.startsWith(FIXED_CATEGORY))
    .reduce((all, cs) => all + cs.sums.at(-1)!, 0);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        m: 1,
      }}
    >
      <Typography color="text.secondary">{formatCurrency(averageVariable)} (var.&nbsp;Ø)</Typography>
      <Typography color="text.secondary">{formatCurrency(lastFix)} (last&nbsp;fix&nbsp;Σ)</Typography>
      <Typography color="text.secondary">=&nbsp;{formatCurrency(averageVariable + lastFix)}</Typography>
    </Box>
  );
};
