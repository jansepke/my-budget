import { getAllCategories } from "@/backend/categories";
import { getAllTransactions } from "@/backend/transactions";
import { filterForMainAccount, sum } from "@/utils";
import { CategoryReport } from "@/components/reports/CategoryReport";
import ProtectedPage from "@/components/shared/ProtectedPage";
import { CategoryStats } from "@/domain";
import { getSession } from "@/pages/api/auth/[...nextauth]";
import Container from "@mui/material/Container";
import { GetServerSideProps } from "next";

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

  const categoryStats = categories.map((c) => ({ ...c, sum: sum(transactions.filter((t) => t.category === c.value)) }));
  console.log(categoryStats);

  return {
    props: {
      session: session,
      categoryStats: categoryStats,
    },
  };
};
