import { CategorySelector } from "@/components/transactions/CategorySelector";
import { Category, Transaction } from "@/domain";
import { formatCurrency, sum } from "@/utils";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

interface ToolbarProps {
  year: number;
  month: number;
  categories: Category[];
  filteredTransactions: Transaction[];
}

export const Toolbar: React.FC<ToolbarProps> = ({ year, month, categories, filteredTransactions }) => {
  const router = useRouter();
  const filterCategory = router.query.category as string | undefined;

  const [showFilter, setShowFilter] = useState(Boolean(filterCategory));

  const date = dayjs(`${year}-${month}-1`);
  const prevMonth = date.subtract(1, "month");
  const nextMonth = date.add(1, "month");

  const path = router.asPath.split("?")[0];
  const handleFilterCategory = (c: Category | null) =>
    router.push(`${path}${c == undefined ? "" : `?category=${c.value}`}`);

  return (
    <>
      <Box display="flex" justifyContent="space-between" m={2} gap={1}>
        <Button component={Link} variant="contained" href={buildHref(prevMonth)}>
          <NavigateBeforeIcon />
        </Button>

        <DatePicker
          label="month"
          views={["year", "month"]}
          openTo="month"
          value={date}
          disableFuture
          onChange={(value) => value && router.push(buildHref(value))}
        />

        <Button component={Link} variant="contained" href={buildHref(nextMonth)} disabled={dayjs() < nextMonth}>
          <NavigateNextIcon />
        </Button>
        <Button variant="text" onClick={() => setShowFilter(!showFilter)}>
          <FilterAltIcon />
        </Button>
      </Box>
      {showFilter && (
        <Box display="flex" justifyContent="center" alignItems="center" gap={2} m={2}>
          <CategorySelector value={filterCategory} onChange={handleFilterCategory} categories={categories} />
          {Boolean(filterCategory) && (
            <Typography color="text.secondary">{formatCurrency(sum(filteredTransactions))} (filtered)</Typography>
          )}
        </Box>
      )}
    </>
  );
};

function buildHref(date: dayjs.Dayjs) {
  return `/transactions/${date.year()}/` + (date.month() + 1).toString().padStart(2, "0");
}
