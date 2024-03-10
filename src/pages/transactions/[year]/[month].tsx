import { getAllCategories } from "@/backend/categories";
import { getAllTransactions } from "@/backend/transactions";
import { Toolbar } from "@/components/transactions/Toolbar";
import { TransactionList } from "@/components/transactions/TransactionList";
import { TransactionStats } from "@/components/transactions/TransactionStats";
import { PageProps, TransactionWithRowDTO } from "@/domain";
import { getSession } from "@/pages/api/auth/[...nextauth]";
import { filterByMonth, filterForMainAccount, parseDTOs } from "@/utils";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import MuiToolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useState } from "react";

interface TransactionsPageProps {
  year: number;
  month: number;
  transactions: TransactionWithRowDTO[];
}

const TransactionsPage: React.FC<TransactionsPageProps> = (props) => {
  const router = useRouter();
  const filterCategory = router.query.category as string | undefined;

  const [showFilter, setShowFilter] = useState(Boolean(filterCategory));
  const [showPicker, setShowPicker] = useState(false);

  const monthDate = new Date();
  monthDate.setMonth(props.month - 1);

  const parsedTransactions = parseDTOs(props.transactions);

  const filteredTransactions = parsedTransactions.filter(
    (t) =>
      filterCategory == null ||
      t.category.startsWith(filterCategory) ||
      (filterCategory === "none" && t.category === ""),
  );

  return (
    <>
      <AppBar position="relative">
        <MuiToolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {monthDate.toLocaleDateString(undefined, { month: "long" })} {props.year}
          </Typography>
          <IconButton onClick={() => setShowPicker(!showPicker)}>
            <CalendarMonthIcon />
          </IconButton>
          <IconButton onClick={() => setShowFilter(!showFilter)}>
            <FilterAltIcon />
          </IconButton>
        </MuiToolbar>
      </AppBar>
      <Container maxWidth="md">
        <Toolbar
          year={props.year}
          month={props.month}
          filteredTransactions={filteredTransactions}
          showFilter={showFilter}
          showPicker={showPicker}
        />
        <TransactionStats accountId={1} transactions={parsedTransactions} showFixedSum />

        <TransactionList accountId={1} transactions={filteredTransactions} />
      </Container>
    </>
  );
};

export default TransactionsPage;

export const getServerSideProps: GetServerSideProps<TransactionsPageProps & PageProps> = async (context) => {
  const session = await getSession(context);

  const yearString = context.params?.year as string;
  const year = Number(yearString === "current" ? new Date().getUTCFullYear() : yearString);
  const monthString = context.params?.month as string;
  const month = Number(monthString === "current" ? new Date().getUTCMonth() + 1 : monthString);

  const categories = await getAllCategories(session);

  return {
    props: {
      session: session,
      year,
      month,
      transactions: (await getAllTransactions(session)).filter(filterByMonth(year, month)).filter(filterForMainAccount),
      categories,
    },
  };
};
