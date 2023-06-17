import { filterByMonth, getAllTransactions } from "@/backend/transactions";
import { AddTransactionButton } from "@/components/dashboard/AddTransactionButton";
import { CurrentMonthTile } from "@/components/dashboard/CurrentMonthTile";
import ProtectedPage from "@/components/shared/ProtectedPage";
import { Transaction } from "@/domain";
import { getSession } from "@/pages/api/auth/[...nextauth]";
import Container from "@mui/material/Container";
import { GetServerSideProps } from "next";

interface IndexPageProps {
  transactions: Transaction[];
}

const IndexPage: React.FC<IndexPageProps> = ({ transactions }) => (
  <ProtectedPage headline="My Budget">
    <Container maxWidth="md" sx={{ marginTop: 3 }}>
      <CurrentMonthTile transactions={transactions} />

      <AddTransactionButton />
    </Container>
  </ProtectedPage>
);

export default IndexPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const now = new Date();

  return {
    props: {
      session: session,
      transactions: filterByMonth(await getAllTransactions(session), now.getUTCFullYear(), now.getUTCMonth() + 1),
    },
  };
};
