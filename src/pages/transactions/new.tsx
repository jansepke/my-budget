import { getAllAccounts } from "@/backend/accounts";
import { getSelectableCategories } from "@/backend/categories";
import { getAllTransactions } from "@/backend/transactions";
import { AddForm } from "@/components/transactions/AddForm";
import { Account, PageProps } from "@/domain";
import { getSession } from "@/pages/api/auth/[...nextauth]";
import { filterVariable } from "@/utils";
import Container from "@mui/material/Container";
import { GetServerSideProps } from "next";

interface NewTransactionPageProps {
  accounts: Account[];
  uniqueDescriptions: string[];
}

const NewTransactionPage: React.FC<NewTransactionPageProps> = ({ accounts, uniqueDescriptions }) => (
  <Container maxWidth="xs" sx={{ marginTop: 1 }}>
    <AddForm accounts={accounts} uniqueDescriptions={uniqueDescriptions} />
  </Container>
);

export default NewTransactionPage;

export const getServerSideProps: GetServerSideProps<NewTransactionPageProps & PageProps> = async (context) => {
  const session = await getSession(context);

  const transactions = await getAllTransactions(session);
  const descriptions = transactions.filter(filterVariable).map((t) => t.description.trim());
  const descriptionCount = descriptions.reduce(
    (p, c) => {
      p[c] = (p[c] || 0) + 1;
      return p;
    },
    {} as Record<string, number>,
  );
  const uniqueDescriptions = Object.keys(descriptionCount).sort((a, b) => descriptionCount[b] - descriptionCount[a]);

  return {
    props: {
      session: session,
      accounts: await getAllAccounts(session),
      categories: await getSelectableCategories(session),
      uniqueDescriptions: uniqueDescriptions,
    },
  };
};
