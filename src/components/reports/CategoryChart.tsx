import { calculateGroupStats } from "@/backend/category-stats";
import { useCategories } from "@/components/shared/CategoriesProvider";
import { Transaction } from "@/domain";
import { FIXED_GROUP } from "@/utils";
import { useTheme } from "@mui/material";
import { Pie, PieChart, ResponsiveContainer } from "recharts";

interface CategoryChartProps {
  transactions: Transaction[];
}

export const CategoryChart: React.FC<CategoryChartProps> = ({ transactions }) => {
  const { categories } = useCategories();
  const theme = useTheme();

  const now = new Date();
  const stats = calculateGroupStats(categories, transactions)
    .map((c) => ({ ...c, sum: Math.round(c.sums[now.getMonth()]) }))
    .filter((c) => c.sum < 0 && !c.value.startsWith(FIXED_GROUP));
  const totalSum = stats.reduce((sum, stat) => sum + stat.sum, 0);

  const renderLabel = (c: (typeof stats)[0]) => (c.sum / totalSum > 0.05 ? `${c.label}: ${c.sum}€` : undefined);

  return (
    <ResponsiveContainer height={200}>
      <PieChart>
        <Pie
          data={stats}
          nameKey="label"
          dataKey={(c: (typeof stats)[0]) => -c.sum}
          innerRadius={30}
          outerRadius={60}
          isAnimationActive={false}
          fill={theme.palette.primary.main}
          label={renderLabel}
          labelLine={false}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};
