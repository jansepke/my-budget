import { Transaction } from "@/domain";
import { FIXED_GROUP, INCOME_CATEGORY, formatCurrency, sum } from "@/utils";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface TransactionStatsProps {
  accountId: number;
  transactions: Transaction[];
  showFixedSum?: boolean;
}

export const TransactionStats: React.FC<TransactionStatsProps> = ({ accountId, transactions, showFixedSum }) => {
  const totalSum = sum(transactions.filter((t) => t.from === accountId || t.to === accountId));
  const incomeSum = sum(transactions.filter((t) => t.category?.startsWith(INCOME_CATEGORY)));
  const fixedSum = sum(transactions.filter((t) => t.category?.startsWith(FIXED_GROUP)));
  const variableSum = sum(
    transactions.filter((t) => !t.category.startsWith(INCOME_CATEGORY) && !t.category.startsWith(FIXED_GROUP)),
  );

  return (
    <Box display="flex" justifyContent="space-between" m={2}>
      <Typography color="text.secondary">{formatCurrency(incomeSum)}</Typography>
      {showFixedSum && <Typography color="text.secondary">{formatCurrency(fixedSum + variableSum)}</Typography>}
      <Typography color="text.secondary">= {formatCurrency(totalSum)}</Typography>
    </Box>
  );
};
