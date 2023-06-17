import { getAllAccounts } from "@/backend/accounts";
import { getAllTransactions } from "@/backend/transactions";
import { filterByMonth, filterForMainAccount, filterForOtherAccounts } from "@/backend/utils";
import { AddTransactionButton } from "@/components/dashboard/AddTransactionButton";
import { CurrentMonthTile } from "@/components/dashboard/CurrentMonthTile";
import { OtherAccountsTiles } from "@/components/dashboard/OtherAccountsTiles";
import ProtectedPage from "@/components/shared/ProtectedPage";
import { Account, Transaction } from "@/domain";
import { getSession } from "@/pages/api/auth/[...nextauth]";
import Container from "@mui/material/Container";
import { GetServerSideProps } from "next";

interface IndexPageProps {
  accounts: Account[];
  mainTransactions: Transaction[];
  otherTransactions: Transaction[];
}

const IndexPage: React.FC<IndexPageProps> = ({ accounts, mainTransactions, otherTransactions }) => (
  <ProtectedPage headline="My Budget">
    <Container maxWidth="md" sx={{ marginTop: 3 }}>
      <CurrentMonthTile transactions={mainTransactions} />

      <OtherAccountsTiles accounts={accounts} transactions={otherTransactions} />

      <AddTransactionButton />
    </Container>
  </ProtectedPage>
);

export default IndexPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const now = new Date();

  const allTransactions = await getAllTransactions(session);

  return {
    props: {
      session: session,
      accounts: await getAllAccounts(session),
      mainTransactions: allTransactions
        .filter(filterByMonth(now.getUTCFullYear(), now.getUTCMonth() + 1))
        .filter(filterForMainAccount),
      otherTransactions: allTransactions.filter(filterForOtherAccounts),
    },
  };
};
