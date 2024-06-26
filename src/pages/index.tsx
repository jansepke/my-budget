import { getAllAccounts } from "@/backend/accounts";
import { getAllCategories } from "@/backend/categories";
import { calculateCategoryStats } from "@/backend/category-stats";
import { getAverageIncome } from "@/backend/income";
import { getAllTransactions, getTemplateTransactions } from "@/backend/transactions";
import { CurrentMonthTile } from "@/components/dashboard/CurrentMonthTile";
import { OtherAccountsTiles } from "@/components/dashboard/OtherAccountsTiles";
import { ReportsTile } from "@/components/dashboard/ReportsTile";
import { Account, CategoryStat, PageProps, TransactionDTO } from "@/domain";
import { getSession } from "@/pages/api/auth/[...nextauth]";
import { filterBetweenDates, filterByMonth, filterForMainAccount, filterForOtherAccounts, parseDTOs } from "@/utils";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";

interface IndexPageProps {
  accounts: Account[];
  mainTransactions: TransactionDTO[];
  otherTransactions: TransactionDTO[];
  categoryStats: CategoryStat[];
  templateTransactions: TransactionDTO[];
  missingCategoryCount: number;
  averageIncome: number;
}

const IndexPage: React.FC<IndexPageProps> = ({
  accounts,
  mainTransactions,
  otherTransactions,
  categoryStats,
  templateTransactions,
  averageIncome,
  missingCategoryCount,
}) => {
  const { data: session } = useSession();
  const firstName = session?.user?.name?.split(" ")[0];

  return (
    <Container maxWidth="md" sx={{ "> *": { marginTop: 3 }, marginBottom: 10 }}>
      <Typography variant="h4" mt={3} color="primary">
        Hello {firstName}
      </Typography>
      <CurrentMonthTile transactions={parseDTOs(mainTransactions)} />

      <OtherAccountsTiles accounts={accounts} transactions={parseDTOs(otherTransactions)} />

      <ReportsTile
        categoryStats={categoryStats}
        templateTransactions={parseDTOs(templateTransactions)}
        averageIncome={averageIncome}
        missingCategoryCount={missingCategoryCount}
      />
    </Container>
  );
};

export default IndexPage;

export const getServerSideProps: GetServerSideProps<IndexPageProps & PageProps> = async (context) => {
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
      categoryStats: calculateCategoryStats(
        categories,
        allTransactions
          .filter(filterForMainAccount)
          .filter(filterBetweenDates(dayjs().startOf("year"), dayjs().endOf("year"))),
      ),
      templateTransactions: templateTransactions,
      averageIncome: await getAverageIncome(session),
      missingCategoryCount: allTransactions.filter(filterForMainAccount).filter((t) => t.category.length === 0).length,
      categories,
    },
  };
};
