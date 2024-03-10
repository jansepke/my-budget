import { getAllCategories } from "@/backend/categories";
import { getAllTransactions } from "@/backend/transactions";
import { TransactionList } from "@/components/transactions/TransactionList";
import { PageProps, TransactionWithRowDTO } from "@/domain";
import { getSession } from "@/pages/api/auth/[...nextauth]";
import { filterForOtherAccount, parseDTOs } from "@/utils";
import Container from "@mui/material/Container";
import { GetServerSideProps } from "next";

interface TransactionsPageProps {
  accountId: number;
  transactions: TransactionWithRowDTO[];
}

const TransactionsPage: React.FC<TransactionsPageProps> = ({ accountId, transactions }) => (
  <Container maxWidth="md" sx={{ marginTop: 1 }}>
    <TransactionList accountId={accountId} transactions={parseDTOs(transactions)} />
  </Container>
);

export default TransactionsPage;

export const getServerSideProps: GetServerSideProps<TransactionsPageProps & PageProps> = async (context) => {
  const session = await getSession(context);

  const accountId = Number(context.params?.accountId as string);

  return {
    props: {
      session: session,
      accountId: accountId,
      transactions: (await getAllTransactions(session)).filter(filterForOtherAccount(accountId)),
      categories: await getAllCategories(session),
    },
  };
};
