import { getAllCategories } from "@/backend/categories";
import { getAllTransactions } from "@/backend/transactions";
import { filterForOtherAccount } from "@/utils";
import ProtectedPage from "@/components/shared/ProtectedPage";
import { TransactionList } from "@/components/transactions/TransactionList";
import { TransactionStats } from "@/components/transactions/TransactionStats";
import { Category, Transaction } from "@/domain";
import { getSession } from "@/pages/api/auth/[...nextauth]";
import Container from "@mui/material/Container";
import { GetServerSideProps } from "next";

interface TransactionsPageProps {
  accountId: number;
  categories: Category[];
  transactions: Transaction[];
}

const TransactionsPage: React.FC<TransactionsPageProps> = ({ accountId, transactions }) => (
  <ProtectedPage headline="My Budget">
    <Container maxWidth="md" sx={{ marginTop: 3 }}>
      <TransactionStats accountId={accountId} transactions={transactions} />
      <TransactionList accountId={accountId} transactions={transactions} />
    </Container>
  </ProtectedPage>
);

export default TransactionsPage;

export const getServerSideProps: GetServerSideProps<TransactionsPageProps> = async (context) => {
  const session = await getSession(context);

  const accountId = Number(context.params?.accountId as string);

  return {
    props: {
      session: session,
      accountId: accountId,
      categories: await getAllCategories(session),
      transactions: (await getAllTransactions(session)).filter(filterForOtherAccount(accountId)),
    },
  };
};
