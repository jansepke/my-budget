import { getAllAccounts } from "@/backend/accounts";
import { getAllCategories } from "@/backend/categories";
import ProtectedPage from "@/components/shared/ProtectedPage";
import { AddForm } from "@/components/transactions/AddForm";
import { Account, Category } from "@/domain";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import Container from "@mui/material/Container";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";

interface NewTransactionPageProps {
  accounts: Account[];
  categories: Category[];
}

const NewTransactionPage: React.FC<NewTransactionPageProps> = ({ accounts, categories }) => (
  <ProtectedPage headline="My Budget">
    <Container maxWidth="xs" sx={{ marginTop: 3 }}>
      <AddForm accounts={accounts} categories={categories} />
    </Container>
  </ProtectedPage>
);

export default NewTransactionPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  return {
    props: {
      session: session,
      accounts: session ? await getAllAccounts(session) : [],
      categories: session ? await getAllCategories(session) : [],
    },
  };
};
