import { getAllCategories } from "@/backend/categories";
import { filterForOtherAccount, getAllTransactions } from "@/backend/transactions";
import ProtectedPage from "@/components/shared/ProtectedPage";
import { TransactionList } from "@/components/transactions/TransactionList";
import { TransactionStats } from "@/components/transactions/TransactionStats";
import { Category, Transaction } from "@/domain";
import { getSession } from "@/pages/api/auth/[...nextauth]";
import Container from "@mui/material/Container";
import { GetServerSideProps } from "next";

interface TransactionsPageProps {
  categories: Category[];
  transactions: Transaction[];
}

const TransactionsPage: React.FC<TransactionsPageProps> = ({ transactions }) => (
  <ProtectedPage headline="My Budget">
    <Container maxWidth="md" sx={{ marginTop: 3 }}>
      <TransactionStats transactions={transactions} />
      <TransactionList transactions={transactions} />
    </Container>
  </ProtectedPage>
);

export default TransactionsPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  const accountId = Number(context.params?.accountId as string);

  return {
    props: {
      session: session,
      categories: await getAllCategories(session),
      transactions: (await getAllTransactions(session)).filter(filterForOtherAccount(accountId)),
    },
  };
};
