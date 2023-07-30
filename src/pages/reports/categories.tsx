import { getAllCategories } from "@/backend/categories";
import { calculateCategoryStats } from "@/backend/category-stats";
import { getAllTransactions } from "@/backend/transactions";
import { CategoryReport } from "@/components/reports/CategoryReport";
import { YearStats } from "@/components/reports/YearStats";
import ProtectedPage from "@/components/shared/ProtectedPage";
import { CategoryStats } from "@/domain";
import { getSession } from "@/pages/api/auth/[...nextauth]";
import { filterForMainAccount } from "@/utils";
import Container from "@mui/material/Container";
import { GetServerSideProps } from "next";

interface CategoriesPageProps {
  categoryStats: CategoryStats[];
}

const CategoriesPage: React.FC<CategoriesPageProps> = ({ categoryStats }) => (
  <ProtectedPage headline="My Budget">
    <Container maxWidth="md" sx={{ marginTop: 3 }}>
      <YearStats categoryStats={categoryStats} />
      <CategoryReport categoryStats={categoryStats} />
    </Container>
  </ProtectedPage>
);

export default CategoriesPage;

export const getServerSideProps: GetServerSideProps<CategoriesPageProps> = async (context) => {
  const session = await getSession(context);

  const categories = await getAllCategories(session);
  const transactions = (await getAllTransactions(session)).filter(filterForMainAccount);

  return {
    props: {
      session: session,
      categoryStats: calculateCategoryStats(categories, transactions),
    },
  };
};
