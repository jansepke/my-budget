import { getAllCategories } from "@/backend/categories";
import { getTransactionsForMonth } from "@/backend/transactions";
import ProtectedPage from "@/components/shared/ProtectedPage";
import { AddForm } from "@/components/transactions/AddForm";
import { TransactionList } from "@/components/transactions/TransactionList";
import { TransactionStats } from "@/components/transactions/TransactionStats";
import { Category, Transaction } from "@/domain";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import NorthEastIcon from "@mui/icons-material/NorthEast";
import { Link as MuiLink } from "@mui/material";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import Link from "next/link";

interface IndexPageProps {
  categories: Category[];
  transactions: Transaction[];
}

const IndexPage: React.FC<IndexPageProps> = ({ categories, transactions }) => (
  <ProtectedPage headline="My Budget">
    <Container maxWidth="md" sx={{ marginTop: 3 }}>
      <AddForm categories={categories} />
      <Typography variant="h5">
        <MuiLink component={Link} href="/transactions/current/current" color="inherit" underline="hover">
          Current Month <NorthEastIcon />
        </MuiLink>
      </Typography>
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
