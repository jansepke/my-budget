import { ExpandableTableRow } from "@/components/reports/ExpandableTableRow";
import { CategoryStats, GroupStats } from "@/domain";
import { currencyColor, formatCurrency } from "@/utils";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import React from "react";

const TableRowCells: React.FC<{ stat: CategoryStats }> = ({ stat }) => (
  <>
    <TableCell width="100%">
      {stat.value} - {stat.label}
    </TableCell>
    <TableCell align="right" sx={{ color: currencyColor(stat.yearAverage) }}>
      {formatCurrency(stat.yearAverage)}
    </TableCell>
    <TableCell align="right" sx={{ color: currencyColor(stat.lastSum) }}>
      {formatCurrency(stat.lastSum)}
    </TableCell>
    <TableCell align="right" sx={{ color: currencyColor(stat.currentSum) }}>
      {formatCurrency(stat.currentSum)}
    </TableCell>
  </>
);

const GroupStatsRows: React.FC<{ stat: GroupStats }> = ({ stat }) =>
  stat.categories.length > 0 ? (
    <ExpandableTableRow
      expandComponent={
        <>
          {stat.categories.map((subStat) => (
            <TableRow key={subStat.value}>
              <TableCell />
              <TableRowCells stat={subStat} />
            </TableRow>
          ))}
        </>
      }
    >
      <TableRowCells stat={stat} />
    </ExpandableTableRow>
  ) : (
    <TableRow>
      <TableCell />
      <TableRowCells stat={stat} />
    </TableRow>
  );

interface CategoryReportProps {
  categoryStats: CategoryStats[];
}

// TODO: drill down
// TODO: colorcoding compared to average
export const CategoryReport: React.FC<CategoryReportProps> = ({ categoryStats }) => {
  const groupStats = calculateGroupStats(categoryStats);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell width="100%">Category</TableCell>
            <TableCell width={90} align="right">
              Year Ø
            </TableCell>
            <TableCell width={90} align="right">
              last. Σ
            </TableCell>
            <TableCell width={90} align="right">
              curr. Σ
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {groupStats.map((stat) => (
            <GroupStatsRows key={stat.value} stat={stat} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

function calculateGroupStats(categoryStats: CategoryStats[]) {
  return categoryStats.reduce<GroupStats[]>((all, stat) => {
    if (stat.value.length < 2) {
      return [...all, { ...stat, categories: [] }];
    }

    const group = all.find((g) => g.value === stat.value[0])!;

    group.yearAverage += stat.yearAverage;
    group.lastSum += stat.lastSum;
    group.currentSum += stat.currentSum;
    group.categories.push(stat);

    return all;
  }, []);
}
