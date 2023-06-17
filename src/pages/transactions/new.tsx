import { getAllAccounts } from "@/backend/accounts";
import { getAllCategories } from "@/backend/categories";
import ProtectedPage from "@/components/shared/ProtectedPage";
import { AddForm } from "@/components/transactions/AddForm";
import { Account, Category } from "@/domain";
import { getSession } from "@/pages/api/auth/[...nextauth]";
import Container from "@mui/material/Container";
import { GetServerSideProps } from "next";

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
  const session = await getSession(context);

  return {
    props: {
      session: session,
      accounts: await getAllAccounts(session),
      categories: await getAllCategories(session),
    },
  };
};
