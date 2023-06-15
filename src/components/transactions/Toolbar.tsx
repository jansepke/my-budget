import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/router";

export const Toolbar: React.FC = () => {
  const { query } = useRouter();

  const date = dayjs(`${query.year}-${query.month}-1`);
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
      <Button component={Link} variant="contained" href={`/transactions/${prevMonth.year()}/${padMonth(prevMonth)}`}>
        <NavigateBeforeIcon />
      </Button>

      <Button
        component={Link}
        variant="contained"
        href={`/transactions/${nextMonth.year()}/${padMonth(nextMonth)}`}
        disabled={dayjs() < nextMonth}
      >
        <NavigateNextIcon />
      </Button>
    </Box>
  );
};

function padMonth(prevMonth: dayjs.Dayjs) {
  return (prevMonth.month() + 1).toString().padStart(2, "0");
}
