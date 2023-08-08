import { ExpandableTableRow } from "@/components/reports/ExpandableTableRow";
import { CategoryStats, GroupStats } from "@/domain";
import { FIXED_CATEGORY, INCOME_CATEGORY, currencyDiffColor, formatCurrency } from "@/utils";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import dayjs from "dayjs";
import React from "react";

const monthArray = Array.from(Array(dayjs().month() + 1).keys()).reverse();

const TableRowCells: React.FC<{ stat: CategoryStats }> = ({ stat }) => (
  <>
    <TableCell sx={{ fontWeight: 500 }} width="100%">
      {stat.value ? stat.value + " - " : ""}
      {stat.label}
    </TableCell>
    <TableCell align="right" sx={{ color: "text.secondary" }}>
      {formatCurrency(stat.yearAverage)}
    </TableCell>
    {monthArray.map((month) => (
      <TableCell align="right" sx={{ color: currencyDiffColor(stat.sums.at(month)!, stat.yearAverage) }} key={month}>
        {formatCurrency(stat.sums.at(month)!)}
      </TableCell>
    ))}
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
// TODO: next fixed costs
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
            {monthArray.map((month) => (
              <TableCell width={90} align="right" key={month}>
                {getMonthName(month)}. Σ
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {groupStats
            .filter((g) => g.value)
            .map((stat) => (
              <GroupStatsRows key={stat.value} stat={stat} />
            ))}
          <GroupStatsRows stat={groupStats.find((g) => g.value === "")!} />
        </TableBody>
      </Table>
    </TableContainer>
  );
};

function calculateGroupStats(categoryStats: CategoryStats[]) {
  return categoryStats.reduce<GroupStats[]>(
    (all, stat) => {
      if (!stat.value.startsWith(INCOME_CATEGORY) && !stat.value.startsWith(FIXED_CATEGORY)) {
        const varAverage = all.find((g) => g.value === "")!;
        varAverage.yearAverage += stat.yearAverage;
        varAverage.sums = varAverage.sums.map((sum, idx) => sum + stat.sums[idx]);
      }

      if (stat.value.length < 2) {
        return [...all, { ...stat, categories: [] }];
      }

      const group = all.find((g) => g.value === stat.value[0])!;

      group.yearAverage += stat.yearAverage;
      group.sums = group.sums.map((sum, idx) => sum + stat.sums[idx]);
      group.categories.push(stat);

      return all;
    },
    [{ label: "var. Σ", value: "", sums: monthArray.map(() => 0), yearAverage: 0, categories: [] }],
  );
}

function getMonthName(month: number) {
  const date = new Date();
  date.setMonth(month);

  return date.toLocaleString(undefined, { month: "short" });
}
