import { formatCurrency, sum } from "@/backend/utils";
import { Transaction } from "@/domain";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface TransactionStatsProps {
  accountId: number;
  transactions: Transaction[];
  showFixedSum?: boolean;
}

const INCOME_CATEGORY = "I";
const FIXED_CATEGORY = "M";

export const TransactionStats: React.FC<TransactionStatsProps> = ({ accountId, transactions, showFixedSum }) => {
  const totalSum = sum(transactions.filter((t) => t.from === accountId || t.to === accountId));
  const incomeSum = sum(transactions.filter((t) => t.category?.startsWith(INCOME_CATEGORY)));
  const fixedSum = sum(transactions.filter((t) => t.category?.startsWith(FIXED_CATEGORY)));
  const variableSum = sum(
    transactions.filter(
      (t) => t.category && !t.category.startsWith(INCOME_CATEGORY) && !t.category.startsWith(FIXED_CATEGORY)
    )
  );

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        m: 1,
      }}
    >
      <Typography color="text.secondary">{formatCurrency(incomeSum)} (Income)</Typography>
      {showFixedSum && <Typography color="text.secondary">{formatCurrency(fixedSum)} (Fixed)</Typography>}
      <Typography color="text.secondary">{formatCurrency(variableSum)} (Variable)</Typography>
      <Typography color="text.secondary">{formatCurrency(totalSum)} (Rest)</Typography>
    </Box>
  );
};
