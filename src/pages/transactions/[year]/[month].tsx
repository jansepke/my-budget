import { getSelectableCategories } from "@/backend/categories";
import { getAllTransactions } from "@/backend/transactions";
import { AddTransactionButton } from "@/components/dashboard/AddTransactionButton";
import ProtectedPage from "@/components/shared/ProtectedPage";
import { CategorySelector } from "@/components/transactions/CategorySelector";
import { Toolbar } from "@/components/transactions/Toolbar";
import { TransactionList } from "@/components/transactions/TransactionList";
import { TransactionStats } from "@/components/transactions/TransactionStats";
import { Category, Transaction } from "@/domain";
import { getSession } from "@/pages/api/auth/[...nextauth]";
import { filterByMonth, filterForMainAccount } from "@/utils";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

interface TransactionsPageProps {
  year: number;
  month: number;
  transactions: Transaction[];
  categories: Category[];
}

const TransactionsPage: React.FC<TransactionsPageProps> = (props) => {
  const router = useRouter();
  const filterCategory = router.query.category as string | null;

  const filteredTransactions = props.transactions.filter(
    (t) =>
      filterCategory === undefined || t.category === filterCategory || (filterCategory === "none" && t.category === ""),
  );
  const categories: Category[] = [...props.categories, { value: "none", label: "none" }];

  const path = router.asPath.split("?")[0];
  const handleFilterCategory = (v: string | undefined) =>
    router.push(`${path}${v == undefined ? "" : `?category=${v}`}`);

  return (
    <ProtectedPage headline="My Budget">
      <Container maxWidth="md" sx={{ marginTop: 3 }}>
        <Toolbar year={props.year} month={props.month} />
        <TransactionStats accountId={1} transactions={props.transactions} showFixedSum />
        <Box display="flex" justifyContent="center" alignItems="center" m={2}>
          <CategorySelector value={filterCategory} onChange={handleFilterCategory} categories={categories} />
        </Box>
        <Box mb={10}>
          <TransactionList accountId={1} transactions={filteredTransactions} />
        </Box>

        <AddTransactionButton />
      </Container>
    </ProtectedPage>
  );
};

export default TransactionsPage;

export const getServerSideProps: GetServerSideProps<TransactionsPageProps> = async (context) => {
  const session = await getSession(context);

  const yearString = context.params?.year as string;
  const year = Number(yearString === "current" ? new Date().getUTCFullYear() : yearString);
  const monthString = context.params?.month as string;
  const month = Number(monthString === "current" ? new Date().getUTCMonth() + 1 : monthString);

  const categories = await getSelectableCategories(session);

  return {
    props: {
      session: session,
      year,
      month,
      transactions: (await getAllTransactions(session)).filter(filterByMonth(year, month)).filter(filterForMainAccount),
      categories,
    },
  };
};
