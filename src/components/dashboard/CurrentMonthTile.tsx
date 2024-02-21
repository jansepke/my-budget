import { calculateGroupStats } from "@/backend/category-stats";
import { useCategories } from "@/components/shared/CategoriesProvider";
import Link from "@/components/shared/Link";
import { TransactionStats } from "@/components/transactions/TransactionStats";
import { Transaction } from "@/domain";
import { FIXED_GROUP } from "@/utils";
import NorthEastIcon from "@mui/icons-material/NorthEast";
import { useTheme } from "@mui/material";
import Typography from "@mui/material/Typography";
import { Pie, PieChart, ResponsiveContainer } from "recharts";

interface CurrentMonthTileProps {
  transactions: Transaction[];
}

export const CurrentMonthTile: React.FC<CurrentMonthTileProps> = ({ transactions }) => {
  const { categories } = useCategories();
  const theme = useTheme();

  const now = new Date();
  const currentMonth = now.toLocaleString(undefined, { month: "long" });
  const stats = calculateGroupStats(categories, transactions)
    .map((c) => ({ ...c, sum: Math.round(c.sums[now.getMonth()]) }))
    .filter((c) => c.sum < 0 && !c.value.startsWith(FIXED_GROUP));

  console.log(stats);

  return (
    <div>
      <Typography variant="h5">
        <Link href="/transactions/current/current" color="inherit" underline="hover">
          Your Budget in {currentMonth} <NorthEastIcon />
        </Link>
      </Typography>
      <TransactionStats accountId={1} transactions={transactions} showFixedSum />
      {/* <TransactionList accountId={1} transactions={transactions.slice(-5)} /> */}
      <ResponsiveContainer height={200}>
        <PieChart>
          <Pie
            data={stats}
            nameKey="label"
            dataKey={(c: (typeof stats)[0]) => -c.sum}
            innerRadius={30}
            outerRadius={60}
            fill={theme.palette.primary.main}
            label={(c: (typeof stats)[0]) => `${c.label}: ${c.sum}€`}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
