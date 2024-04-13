import { getAllCategories } from "@/backend/categories";
import { getAllTransactions } from "@/backend/transactions";
import { TransactionList } from "@/components/transactions/TransactionList";
import { PageProps, TransactionWithRowDTO } from "@/domain";
import { getSession } from "@/pages/api/auth/[...nextauth]";
import { filterForMainAccount, parseDTOs } from "@/utils";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { GetServerSideProps } from "next";

interface MissingTransactionsPageProps {
  transactions: TransactionWithRowDTO[];
}

const MissingTransactionsPage: React.FC<MissingTransactionsPageProps> = ({ transactions }) => (
  <Container maxWidth="md" sx={{ marginTop: 1 }}>
    <Typography variant="h6">Missing Category ({transactions.length})</Typography>
    <TransactionList transactions={parseDTOs(transactions)} />
  </Container>
);

export default MissingTransactionsPage;

export const getServerSideProps: GetServerSideProps<MissingTransactionsPageProps & PageProps> = async (context) => {
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
