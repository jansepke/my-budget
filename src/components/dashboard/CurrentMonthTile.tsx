import Link from "@/components/shared/Link";
import { TransactionList } from "@/components/transactions/TransactionList";
import { TransactionStats } from "@/components/transactions/TransactionStats";
import { Transaction } from "@/domain";
import NorthEastIcon from "@mui/icons-material/NorthEast";
import Typography from "@mui/material/Typography";

interface CurrentMonthTileProps {
  transactions: Transaction[];
}

export const CurrentMonthTile: React.FC<CurrentMonthTileProps> = ({ transactions }) => {
  const currentMonth = new Date().toLocaleString(undefined, { month: "long" });

  return (
    <div>
      <Typography variant="h5">
        <Link href="/transactions/current/current" color="inherit" underline="hover">
          Your Budget in {currentMonth} <NorthEastIcon />
        </Link>
      </Typography>
      <TransactionStats accountId={1} transactions={transactions} showFixedSum />
      <TransactionList accountId={1} transactions={transactions.slice(-5)} />
    </div>
  );
};
