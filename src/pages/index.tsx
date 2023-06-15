import { getAllCategories } from "@/backend/categories";
import { getTransactionsForMonth } from "@/backend/transactions";
import ProtectedPage from "@/components/shared/ProtectedPage";
import { AddForm } from "@/components/transactions/AddForm";
import { TransactionList } from "@/components/transactions/TransactionList";
import { TransactionStats } from "@/components/transactions/TransactionStats";
import { Category, Transaction } from "@/domain";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";

interface IndexPageProps {
  categories: Category[];
  transactions: Transaction[];
}

const IndexPage: React.FC<IndexPageProps> = ({ categories, transactions }) => (
  <ProtectedPage headline="My Budget">
    <Container maxWidth="md" sx={{ marginTop: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Budget
      </Typography>

      <AddForm categories={categories} />
      <Typography variant="h5">Current Month</Typography>
      <TransactionStats transactions={transactions} />
      <TransactionList transactions={transactions.slice(-5)} />
    </Container>
  </ProtectedPage>
);

export default IndexPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  const now = new Date();

  return {
    props: {
      session: session,
      categories: session ? await getAllCategories(session) : [],
      transactions: session ? await getTransactionsForMonth(session, now.getUTCFullYear(), now.getUTCMonth() + 1) : [],
    },
  };
};
