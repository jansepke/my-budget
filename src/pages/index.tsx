import { getTransactionsForMonth } from "@/backend/transactions";
import ProtectedPage from "@/components/shared/ProtectedPage";
import { AddTransactionButton } from "@/components/dashboard/AddTransactionButton";
import { TransactionList } from "@/components/transactions/TransactionList";
import { TransactionStats } from "@/components/transactions/TransactionStats";
import { Transaction } from "@/domain";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import NorthEastIcon from "@mui/icons-material/NorthEast";
import { Link as MuiLink } from "@mui/material";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import Link from "next/link";

interface IndexPageProps {
  transactions: Transaction[];
}

const IndexPage: React.FC<IndexPageProps> = ({ transactions }) => (
  <ProtectedPage headline="My Budget">
    <Container maxWidth="md" sx={{ marginTop: 3 }}>
      <Typography variant="h5">
        <MuiLink component={Link} href="/transactions/current/current" color="inherit" underline="hover">
          Current Month <NorthEastIcon />
        </MuiLink>
      </Typography>
      <TransactionStats transactions={transactions} />
      <TransactionList transactions={transactions.slice(-5)} />

      <AddTransactionButton />
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
      transactions: session ? await getTransactionsForMonth(session, now.getUTCFullYear(), now.getUTCMonth() + 1) : [],
    },
  };
};
