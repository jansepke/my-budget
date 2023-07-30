import { CategoryStats } from "@/domain";
import { FIXED_CATEGORY, INCOME_CATEGORY, formatCurrency } from "@/utils";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React from "react";

interface YearStatsProps {
  categoryStats: CategoryStats[];
}

export const YearStats: React.FC<YearStatsProps> = ({ categoryStats }) => {
  const variableAverage = categoryStats
    .filter((cs) => !cs.value.startsWith(INCOME_CATEGORY) && !cs.value.startsWith(FIXED_CATEGORY))
    .reduce((all, cs) => all + cs.yearAverage, 0);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        m: 1,
      }}
    >
      <Typography color="text.secondary">{formatCurrency(variableAverage)} (var. Ø)</Typography>
    </Box>
  );
};
