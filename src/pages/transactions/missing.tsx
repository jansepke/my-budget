import { getAllCategories } from "@/backend/categories";
import { getAllTransactions } from "@/backend/transactions";
import { TransactionList } from "@/components/transactions/TransactionList";
import { PageProps, TransactionWithRowDTO } from "@/domain";
import { getSession } from "@/pages/api/auth/[...nextauth]";
import { filterForMainAccount, parseDTOs } from "@/utils";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { GetServerSideProps } from "next";

interface TransactionsPageProps {
  transactions: TransactionWithRowDTO[];
}

const TransactionsPage: React.FC<TransactionsPageProps> = ({ transactions }) => (
  <Container maxWidth="md" sx={{ marginTop: 1 }}>
    <Typography variant="h6">Missing Category ({transactions.length})</Typography>
    <TransactionList accountId={0} transactions={parseDTOs(transactions)} />
  </Container>
);

export default TransactionsPage;

export const getServerSideProps: GetServerSideProps<TransactionsPageProps & PageProps> = async (context) => {
  const session = await getSession(context);

  const allTransactions = await getAllTransactions(session);
  return {
    props: {
      session: session,
      transactions: allTransactions.filter(filterForMainAccount).filter((t) => t.category.length === 0),
      categories: await getAllCategories(session),
    },
  };
};
