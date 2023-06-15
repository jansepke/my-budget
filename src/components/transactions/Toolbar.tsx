import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/router";

interface ToolbarProps {
  year: number;
  month: number;
}

export const Toolbar: React.FC<ToolbarProps> = ({ year, month }) => {
  const router = useRouter();

  const date = dayjs(`${year}-${month}-1`);
  const prevMonth = date.subtract(1, "month");
  const nextMonth = date.add(1, "month");

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        m: 1,
      }}
    >
      <Button component={Link} variant="contained" href={buildHref(prevMonth)}>
        <NavigateBeforeIcon />
      </Button>

      <DatePicker
        label="month"
        views={["year", "month"]}
        openTo="month"
        defaultValue={date}
        disableFuture
        onChange={(value) => value && router.push(buildHref(value))}
      />

      <Button component={Link} variant="contained" href={buildHref(nextMonth)} disabled={dayjs() < nextMonth}>
        <NavigateNextIcon />
      </Button>
    </Box>
  );
};

function buildHref(date: dayjs.Dayjs) {
  return `/transactions/${date.year()}/` + (date.month() + 1).toString().padStart(2, "0");
}
