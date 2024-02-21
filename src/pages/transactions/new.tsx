import { getAllAccounts } from "@/backend/accounts";
import { getSelectableCategories } from "@/backend/categories";
import { AddForm } from "@/components/transactions/AddForm";
import { Account, PageProps } from "@/domain";
import { getSession } from "@/pages/api/auth/[...nextauth]";
import Container from "@mui/material/Container";
import { GetServerSideProps } from "next";

interface NewTransactionPageProps {
  accounts: Account[];
}

const NewTransactionPage: React.FC<NewTransactionPageProps> = ({ accounts }) => (
  <Container maxWidth="xs" sx={{ marginTop: 1 }}>
    <AddForm accounts={accounts} />
  </Container>
);

export default NewTransactionPage;

export const getServerSideProps: GetServerSideProps<NewTransactionPageProps & PageProps> = async (context) => {
  const session = await getSession(context);

  return {
    props: {
      session: session,
      accounts: await getAllAccounts(session),
      categories: await getSelectableCategories(session),
    },
  };
};
