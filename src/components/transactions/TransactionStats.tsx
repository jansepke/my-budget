import { Transaction } from "@/domain";
import { FIXED_GROUP, INCOME_CATEGORY, filterVariable, formatCurrency, sum } from "@/utils";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

interface TransactionStatsProps {
  accountId: number;
  transactions: Transaction[];
}

export const TransactionStats: React.FC<TransactionStatsProps> = ({ accountId, transactions }) => {
  const totalSum = sum(transactions.filter((t) => t.from === accountId || t.to === accountId));
  const incomeSum = sum(transactions.filter((t) => t.category?.startsWith(INCOME_CATEGORY)));
  const fixedSum = sum(transactions.filter((t) => t.category?.startsWith(FIXED_GROUP)));
  const variableSum = sum(transactions.filter(filterVariable));

  return (
    <Box display="flex" justifyContent="space-between" m={2}>
      <Typography color="text.secondary">{formatCurrency(incomeSum)}</Typography>
      <Tooltip
        arrow
        title={
          <>
            fixed: {formatCurrency(variableSum)}
            <br />
            variable: {formatCurrency(fixedSum)}
          </>
        }
      >
        <Typography color="text.secondary">{formatCurrency(fixedSum + variableSum)}</Typography>
      </Tooltip>
      <Typography color="text.secondary">= {formatCurrency(totalSum)}</Typography>
    </Box>
  );
};
