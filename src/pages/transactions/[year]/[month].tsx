import { getAllCategories } from "@/backend/categories";
import { getAllTransactions } from "@/backend/transactions";
import { filterByMonth, filterForMainAccount } from "@/backend/utils";
import ProtectedPage from "@/components/shared/ProtectedPage";
import { Toolbar } from "@/components/transactions/Toolbar";
import { TransactionList } from "@/components/transactions/TransactionList";
import { TransactionStats } from "@/components/transactions/TransactionStats";
import { Category, Transaction } from "@/domain";
import { getSession } from "@/pages/api/auth/[...nextauth]";
import Container from "@mui/material/Container";
import { GetServerSideProps } from "next";

interface TransactionsPageProps {
  year: number;
  month: number;
  categories: Category[];
  transactions: Transaction[];
}

const TransactionsPage: React.FC<TransactionsPageProps> = ({ year, month, transactions }) => (
  <ProtectedPage headline="My Budget">
    <Container maxWidth="md" sx={{ marginTop: 3 }}>
      <Toolbar year={year} month={month} />
      <TransactionStats accountId={1} transactions={transactions} showFixedSum />
      <TransactionList transactions={transactions} />
    </Container>
  </ProtectedPage>
);

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
      categories: await getAllCategories(session),
      transactions: (await getAllTransactions(session)).filter(filterByMonth(year, month)).filter(filterForMainAccount),
    },
  };
};
