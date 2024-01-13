import { ExpandableTableRow } from "@/components/reports/ExpandableTableRow";
import Link from "@/components/shared/Link";
import { CategoryStat, GroupStat } from "@/domain";
import { FIXED_GROUP, INCOME_CATEGORY, average, currencyDiffColor, formatCurrency } from "@/utils";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import React from "react";

const monthArray = (categoryStat: CategoryStat) => Array.from(Array(categoryStat.sums.length).keys()).reverse();

const formatReportCurrency = (value: number) => (value === 0 ? "-" : formatCurrency(value, false));

interface TableRowCellsProps {
  stat: CategoryStat;
  drilldown?: boolean;
}

const TableRowCells: React.FC<TableRowCellsProps> = ({ stat, drilldown }) => (
  <>
    <TableCell sx={{ fontWeight: 500 }} width="100%">
      {stat.value ? stat.value + " - " : ""}
      {stat.label}
    </TableCell>
    <TableCell align="right" sx={{ color: "text.secondary" }}>
      {formatReportCurrency(average(stat.sums))}
    </TableCell>
    {monthArray(stat).map((month) => (
      <TableCell align="right" sx={{ color: currencyDiffColor(stat.sums.at(month)!, average(stat.sums)) }} key={month}>
        {drilldown ? (
          <Link
            href={`/transactions/2023/${String(month + 1).padStart(2, "0")}?category=${stat.value}`}
            color="inherit"
            underline="hover"
          >
            {formatReportCurrency(stat.sums.at(month)!)}
          </Link>
        ) : (
          formatReportCurrency(stat.sums.at(month)!)
        )}
      </TableCell>
    ))}
  </>
);

interface GroupStatsRowsProps {
  stat: GroupStat;
}

const GroupStatsRows: React.FC<GroupStatsRowsProps> = ({ stat }) =>
  stat.categories.length > 0 ? (
    <ExpandableTableRow
      expandComponent={
        <>
          {stat.categories.map((subStat) => (
            <TableRow key={subStat.value}>
              <TableCell />
              <TableRowCells stat={subStat} drilldown />
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
      <TableRowCells stat={stat} drilldown />
    </TableRow>
  );

interface CategoryReportProps {
  categoryStats: CategoryStat[];
}

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
            {monthArray(categoryStats[0]).map((month) => (
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

function calculateGroupStats(categoryStats: CategoryStat[]) {
  return categoryStats.reduce<GroupStat[]>(
    (all, stat) => {
      if (!stat.value.startsWith(INCOME_CATEGORY) && !stat.value.startsWith(FIXED_GROUP)) {
        const varAverage = all.find((g) => g.value === "")!;
        varAverage.sums = varAverage.sums.map((sum, idx) => sum + stat.sums[idx]);
      }

      if (stat.value.length < 2) {
        return [...all, { ...stat, categories: [] }];
      }

      const group = all.find((g) => g.value === stat.value[0])!;

      group.sums = group.sums.map((sum, idx) => sum + stat.sums[idx]);
      group.categories.push(stat);

      return all;
    },
    [{ label: "var. Σ", value: "", sums: monthArray(categoryStats[0]).map(() => 0), categories: [] }],
  );
}

function getMonthName(month: number) {
  const date = new Date();
  date.setMonth(month);

  return date.toLocaleString(undefined, { month: "short" });
}
