import { TransactionList } from "@/components/transactions/TransactionList";
import { TransactionStats } from "@/components/transactions/TransactionStats";
import { Transaction } from "@/domain";
import NorthEastIcon from "@mui/icons-material/NorthEast";
import { Link as MuiLink } from "@mui/material";
import Typography from "@mui/material/Typography";
import Link from "next/link";

interface CurrentMonthTileProps {
  transactions: Transaction[];
}

export const CurrentMonthTile: React.FC<CurrentMonthTileProps> = ({ transactions }) => {
  const currentMonth = new Date().toLocaleString(undefined, { month: "long" });

  return (
    <>
      <Typography variant="h5">
        <MuiLink component={Link} href="/transactions/current/current" color="inherit" underline="hover">
          Your Budget in {currentMonth} <NorthEastIcon />
        </MuiLink>
      </Typography>
      <TransactionStats accountId={1} transactions={transactions} showFixedSum />
      <TransactionList accountId={1} transactions={transactions.slice(-5)} />
    </>
  );
};
