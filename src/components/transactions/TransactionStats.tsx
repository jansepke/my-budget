import { formatCurrency } from "@/backend/utils";
import { Transaction } from "@/domain";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface TransactionStatsProps {
  transactions: Transaction[];
}

export const TransactionStats: React.FC<TransactionStatsProps> = ({ transactions }) => {
  const totalSum = sum(transactions);
  const incomeSum = sum(transactions.filter((t) => t.category?.startsWith("I")));
  const fixedSum = sum(transactions.filter((t) => t.category?.startsWith("M")));
  const variableSum = sum(transactions.filter((t) => !t.category?.startsWith("M") && !t.category?.startsWith("I")));

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        m: 1,
      }}
    >
      <Typography>{formatCurrency(incomeSum)} (Income)</Typography>
      <Typography>{formatCurrency(fixedSum)} (Fixed)</Typography>
      <Typography>{formatCurrency(variableSum)} (Variable)</Typography>
      <Typography>{formatCurrency(totalSum)} (Rest)</Typography>
    </Box>
  );
};

function sum(transactions: Transaction[]) {
  return transactions.reduce((sum, t) => sum + t.amount, 0);
}
