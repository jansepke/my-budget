import { getAllCategories } from "@/backend/categories";
import ProtectedPage from "@/components/shared/ProtectedPage";
import { AddForm } from "@/components/transactions/AddForm";
import { Category } from "@/domain";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import Container from "@mui/material/Container";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";

interface NewTransactionPageProps {
  categories: Category[];
}

const NewTransactionPage: React.FC<NewTransactionPageProps> = ({ categories }) => (
  <ProtectedPage headline="My Budget">
    <Container maxWidth="md" sx={{ marginTop: 3 }}>
      <AddForm categories={categories} />
    </Container>
  </ProtectedPage>
);

export default NewTransactionPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  return {
    props: {
      session: session,
      categories: session ? await getAllCategories(session) : [],
    },
  };
};
