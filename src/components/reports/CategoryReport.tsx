import { CategoryStats } from "@/domain";
import { currencyColor, formatCurrency } from "@/utils";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import React, { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

interface ExpandableTableRowProps extends React.PropsWithChildren {
  expandComponent: React.ReactNode;
}

const ExpandableTableRow: React.FC<ExpandableTableRowProps> = ({ children, expandComponent }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <TableRow hover>
        <TableCell>
          <IconButton onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        {children}
      </TableRow>
      {isExpanded && expandComponent}
    </>
  );
};

interface CategoryReportProps {
  categoryStats: CategoryStats[];
}

export const CategoryReport: React.FC<CategoryReportProps> = ({ categoryStats }) => {
  const topCategoryStats = calculateTopCategoryStats(categoryStats);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell width={75}>value</TableCell>
            <TableCell width="100%">label</TableCell>
            <TableCell width={90} align="right">
              yearAverage
            </TableCell>
            <TableCell width={90} align="right">
              currentSum
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {topCategoryStats.map((stat, idx) => (
            <ExpandableTableRow
              key={idx}
              expandComponent={
                <>
                  {categoryStats
                    .filter((subStat) => subStat.value.length > 1 && subStat.value.startsWith(stat.value))
                    .map((subStat, idx) => (
                      <TableRow key={idx}>
                        <TableCell />
                        <TableCell>{subStat.value}</TableCell>
                        <TableCell width="100%">{subStat.label}</TableCell>
                        <TableCell align="right" sx={{ color: currencyColor(subStat.yearAverage) }}>
                          {formatCurrency(subStat.yearAverage)}
                        </TableCell>
                        <TableCell align="right" sx={{ color: currencyColor(subStat.currentSum) }}>
                          {formatCurrency(subStat.currentSum)}
                        </TableCell>
                      </TableRow>
                    ))}
                </>
              }
            >
              <TableCell>{stat.value}</TableCell>
              <TableCell width="100%">{stat.label}</TableCell>
              <TableCell align="right" sx={{ color: currencyColor(stat.yearAverage) }}>
                {formatCurrency(stat.yearAverage)}
              </TableCell>
              <TableCell align="right" sx={{ color: currencyColor(stat.currentSum) }}>
                {formatCurrency(stat.currentSum)}
              </TableCell>
            </ExpandableTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

function calculateTopCategoryStats(categoryStats: CategoryStats[]) {
  return categoryStats.reduce((all, stat) => {
    if (stat.value.length < 2) {
      return [...all, { ...stat }];
    }

    const group = all.find((g) => g.value === stat.value[0])!;

    group.yearAverage += stat.yearAverage;
    group.currentSum += stat.currentSum;

    return all;
  }, [] as CategoryStats[]);
}
