import { getAllTransactions } from "@/backend/transactions";
import ProtectedPage from "@/components/shared/ProtectedPage";
import { AddForm } from "@/components/transactions/AddForm";
import { TransactionList } from "@/components/transactions/TransactionList";
import { Transaction } from "@/domain";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";

interface IndexProps {
  transactions: Transaction[];
}

const Index: React.FC<IndexProps> = ({ transactions }) => (
  <ProtectedPage headline="My Budget">
    <Container maxWidth="md" sx={{ marginTop: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Budget
      </Typography>

      <AddForm />
      <TransactionList transactions={transactions} />
    </Container>
  </ProtectedPage>
);

export default Index;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  return {
    props: {
      session: session,
      transactions: session ? await getAllTransactions(session) : [],
    },
  };
};
