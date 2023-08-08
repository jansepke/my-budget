import { getAllTransactions } from "@/backend/transactions";
import { AddTransactionButton } from "@/components/dashboard/AddTransactionButton";
import ProtectedPage from "@/components/shared/ProtectedPage";
import { Toolbar } from "@/components/transactions/Toolbar";
import { TransactionList } from "@/components/transactions/TransactionList";
import { TransactionStats } from "@/components/transactions/TransactionStats";
import { Transaction } from "@/domain";
import { getSession } from "@/pages/api/auth/[...nextauth]";
import { filterByMonth, filterForMainAccount } from "@/utils";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { GetServerSideProps } from "next";
import { useSearchParams } from "next/navigation";

interface TransactionsPageProps {
  year: number;
  month: number;
  transactions: Transaction[];
}

const TransactionsPage: React.FC<TransactionsPageProps> = ({ year, month, transactions }) => {
  const searchParams = useSearchParams();
  const filterCategory = searchParams.get("category");

  const filteredTransactions = transactions.filter((t) => filterCategory === null || t.category === filterCategory);

  return (
    <ProtectedPage headline="My Budget">
      <Container maxWidth="md" sx={{ marginTop: 3 }}>
        <Toolbar year={year} month={month} />
        <TransactionStats accountId={1} transactions={transactions} showFixedSum />
        <Box mb={10}>
          <TransactionList accountId={1} transactions={filteredTransactions} />
        </Box>

        <AddTransactionButton />
      </Container>
    </ProtectedPage>
  );
};

export default TransactionsPage;

export const getServerSideProps: GetServerSideProps<TransactionsPageProps> = async (context) => {
  const session = await getSession(context);

  const yearString = context.params?.year as string;
  const year = Number(yearString === "current" ? new Date().getUTCFullYear() : yearString);
  const monthString = context.params?.month as string;
  const month = Number(monthString === "current" ? new Date().getUTCMonth() + 1 : monthString);

  return {
    props: {
      session: session,
      year,
      month,
      transactions: (await getAllTransactions(session)).filter(filterByMonth(year, month)).filter(filterForMainAccount),
    },
  };
};
