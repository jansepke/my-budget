import { getAllAccounts } from "@/backend/accounts";
import { getAllCategories } from "@/backend/categories";
import { calculateCategoryStats } from "@/backend/category-stats";
import { getAllTransactions, getTemplateTransactions } from "@/backend/transactions";
import { AddTransactionButton } from "@/components/dashboard/AddTransactionButton";
import { CurrentMonthTile } from "@/components/dashboard/CurrentMonthTile";
import { OtherAccountsTiles } from "@/components/dashboard/OtherAccountsTiles";
import { ReportsTile } from "@/components/dashboard/ReportsTile";
import ProtectedPage from "@/components/shared/ProtectedPage";
import { Account, CategoryStat, Transaction } from "@/domain";
import { getSession } from "@/pages/api/auth/[...nextauth]";
import { filterByMonth, filterForMainAccount, filterForOtherAccounts } from "@/utils";
import Container from "@mui/material/Container";
import { GetServerSideProps } from "next";

interface IndexPageProps {
  accounts: Account[];
  mainTransactions: Transaction[];
  otherTransactions: Transaction[];
  categoryStats: CategoryStat[];
  templateTransactions: Transaction[];
}

const IndexPage: React.FC<IndexPageProps> = ({
  accounts,
  mainTransactions,
  otherTransactions,
  categoryStats,
  templateTransactions,
}) => (
  <ProtectedPage headline="My Budget">
    <Container maxWidth="md" sx={{ "> *": { marginTop: 3 }, marginBottom: 10 }}>
      <CurrentMonthTile transactions={mainTransactions} />

      <OtherAccountsTiles accounts={accounts} transactions={otherTransactions} />

      <ReportsTile categoryStats={categoryStats} templateTransactions={templateTransactions} />
    </Container>

    <AddTransactionButton />
  </ProtectedPage>
);

export default IndexPage;

export const getServerSideProps: GetServerSideProps<IndexPageProps> = async (context) => {
  const session = await getSession(context);
  const now = new Date();

  const categories = await getAllCategories(session);
  const allTransactions = await getAllTransactions(session);
  const templateTransactions = await getTemplateTransactions(session);

  return {
    props: {
      session: session,
      accounts: await getAllAccounts(session),
      mainTransactions: allTransactions
        .filter(filterByMonth(now.getUTCFullYear(), now.getUTCMonth() + 1))
        .filter(filterForMainAccount),
      otherTransactions: allTransactions.filter(filterForOtherAccounts),
      categoryStats: calculateCategoryStats(categories, allTransactions),
      templateTransactions: templateTransactions,
    },
  };
};
