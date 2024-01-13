import { getAllCategories } from "@/backend/categories";
import { calculateCategoryStats } from "@/backend/category-stats";
import { getAllTransactions } from "@/backend/transactions";
import { CategoryReport } from "@/components/reports/CategoryReport";
import ProtectedPage from "@/components/shared/ProtectedPage";
import { CategoryStat } from "@/domain";
import { getSession } from "@/pages/api/auth/[...nextauth]";
import { filterBetweenDates, filterForMainAccount } from "@/utils";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import dayjs from "dayjs";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

const currentYear = new Date().getFullYear();

const YearButton: React.FC<React.PropsWithChildren & { targetYear: string | number }> = ({ children, targetYear }) => {
  const router = useRouter();
  const href = `/reports/categories/${targetYear}`;

  return (
    <Button component={Link} variant="contained" href={href} disabled={router.asPath === href}>
      {children}
    </Button>
  );
};

interface CategoriesPageProps {
  categoryStats: CategoryStat[];
}

const CategoriesPage: React.FC<CategoriesPageProps> = ({ categoryStats }) => (
  <ProtectedPage headline="My Budget">
    <Container maxWidth="md" sx={{ marginTop: 3 }}>
      <Box display="flex" justifyContent="space-between" m={2} gap={1}>
        <YearButton targetYear={currentYear - 1}>{currentYear - 1}</YearButton>
        <YearButton targetYear="current">{currentYear}</YearButton>
      </Box>
      <CategoryReport categoryStats={categoryStats} />
    </Container>
  </ProtectedPage>
);

export default CategoriesPage;

export const getServerSideProps: GetServerSideProps<CategoriesPageProps> = async (context) => {
  const session = await getSession(context);

  const yearString = context.params?.year as string;
  const year = Number(yearString === "current" ? new Date().getUTCFullYear() : yearString);

  const categories = await getAllCategories(session);
  const transactions = (await getAllTransactions(session))
    .filter(filterForMainAccount)
    .filter(filterBetweenDates(dayjs(`${year}-01-01`), dayjs(`${year}-12-31`)));

  return {
    props: {
      session: session,
      categoryStats: calculateCategoryStats(categories, transactions),
    },
  };
};
