import { getAllCategories } from "@/backend/categories";
import { getAllTransactions } from "@/backend/transactions";
import { filterBetweenDates, filterByCategory, filterForMainAccount, sum } from "@/utils";
import { CategoryReport } from "@/components/reports/CategoryReport";
import ProtectedPage from "@/components/shared/ProtectedPage";
import { CategoryStats } from "@/domain";
import { getSession } from "@/pages/api/auth/[...nextauth]";
import Container from "@mui/material/Container";
import { GetServerSideProps } from "next";
import dayjs from "dayjs";

interface CategoriesPageProps {
  categoryStats: CategoryStats[];
}

const CategoriesPage: React.FC<CategoriesPageProps> = ({ categoryStats }) => (
  <ProtectedPage headline="My Budget">
    <Container maxWidth="md" sx={{ marginTop: 3 }}>
      <CategoryReport categoryStats={categoryStats} />
    </Container>
  </ProtectedPage>
);

export default CategoriesPage;

export const getServerSideProps: GetServerSideProps<CategoriesPageProps> = async (context) => {
  const session = await getSession(context);

  const categories = await getAllCategories(session);
  const transactions = (await getAllTransactions(session)).filter(filterForMainAccount);

  const today = dayjs();
  const startOfYear = today.startOf("year");
  const startOfLastMonth = today.subtract(1, "month").startOf("month");
  const endOfLastMonth = today.subtract(1, "month").endOf("month");
  const startOfCurrentMonth = today.startOf("month");

  const currentYear = transactions.filter(filterBetweenDates(startOfYear, endOfLastMonth));
  const lastMonth = transactions.filter(filterBetweenDates(startOfLastMonth, endOfLastMonth));
  const currentMonth = transactions.filter(filterBetweenDates(startOfCurrentMonth, today));

  const categoryStats = categories.map((c) => ({
    ...c,
    yearAverage: sum(currentYear.filter(filterByCategory(c.value))) / (endOfLastMonth.month() + 1),
    lastSum: sum(lastMonth.filter(filterByCategory(c.value))),
    currentSum: sum(currentMonth.filter(filterByCategory(c.value))),
  }));

  return {
    props: {
      session: session,
      categoryStats: categoryStats,
    },
  };
};
