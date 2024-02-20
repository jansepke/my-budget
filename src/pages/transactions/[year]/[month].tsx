import { getAllCategories } from "@/backend/categories";
import { getAllTransactions } from "@/backend/transactions";
import { AddTransactionButton } from "@/components/dashboard/AddTransactionButton";
import ProtectedPage from "@/components/shared/ProtectedPage";
import { Toolbar } from "@/components/transactions/Toolbar";
import { TransactionList } from "@/components/transactions/TransactionList";
import { TransactionStats } from "@/components/transactions/TransactionStats";
import { PageProps, Transaction } from "@/domain";
import { getSession } from "@/pages/api/auth/[...nextauth]";
import { filterByMonth, filterForMainAccount } from "@/utils";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

interface TransactionsPageProps {
  year: number;
  month: number;
  transactions: Transaction[];
}

const TransactionsPage: React.FC<TransactionsPageProps> = (props) => {
  const router = useRouter();
  const filterCategory = router.query.category as string | undefined;

  const filteredTransactions = props.transactions.filter(
    (t) =>
      filterCategory == null ||
      t.category.startsWith(filterCategory) ||
      (filterCategory === "none" && t.category === ""),
  );

  return (
    <ProtectedPage headline="My Budget">
      <Container maxWidth="md" sx={{ marginTop: 3 }}>
        <Toolbar year={props.year} month={props.month} filteredTransactions={filteredTransactions} />
        <TransactionStats accountId={1} transactions={props.transactions} showFixedSum />

        <Box mb={10}>
          <TransactionList accountId={1} transactions={filteredTransactions} />
        </Box>

        <AddTransactionButton />
      </Container>
    </ProtectedPage>
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
