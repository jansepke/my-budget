import { getAllCategories } from "@/backend/categories";
import { getTransactionsForMonth } from "@/backend/transactions";
import ProtectedPage from "@/components/shared/ProtectedPage";
import { AddForm } from "@/components/transactions/AddForm";
import { Toolbar } from "@/components/transactions/Toolbar";
import { TransactionList } from "@/components/transactions/TransactionList";
import { Category, Transaction } from "@/domain";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";

interface TransactionsPageProps {
  categories: Category[];
  transactions: Transaction[];
}

const TransactionsPage: React.FC<TransactionsPageProps> = ({ categories, transactions }) => (
  <ProtectedPage headline="My Budget">
    <Container maxWidth="md" sx={{ marginTop: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Budget
      </Typography>

      <AddForm categories={categories} />
      <Toolbar />
      <TransactionList transactions={transactions} />
    </Container>
  </ProtectedPage>
);

export default TransactionsPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  const year = Number(context.params?.year as string);
  const month = Number(context.params?.month as string);

  return {
    props: {
      session: session,
      categories: session ? await getAllCategories(session) : [],
      transactions: session ? await getTransactionsForMonth(session, year, month) : [],
    },
  };
};
