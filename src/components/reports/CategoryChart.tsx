import { calculateGroupStats } from "@/backend/category-stats";
import { useCategories } from "@/components/shared/CategoriesProvider";
import { Transaction } from "@/domain";
import { FIXED_GROUP } from "@/utils";
import { useTheme } from "@mui/material";
import { Pie, PieChart, ResponsiveContainer } from "recharts";

interface CategoryChartProps {
  transactions: Transaction[];
  month: number;
}

export const CategoryChart: React.FC<CategoryChartProps> = ({ transactions, month }) => {
  const { categories } = useCategories();
  const theme = useTheme();

  const stats = calculateGroupStats(categories, transactions)
    .map((c) => ({ ...c, sum: Math.round(c.sums[month]) }))
    .filter((c) => c.sum < 0 && !c.value.startsWith(FIXED_GROUP))
    .sort((a, b) => a.sum - b.sum);
  const totalSum = stats.reduce((sum, stat) => sum + stat.sum, 0);

  const renderLabel = (c: (typeof stats)[0]) => (c.sum / totalSum > 0.05 ? `${c.label}: ${c.sum}€` : undefined);

  if (stats.length === 0) {
    return null;
  }

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
          startAngle={180}
          endAngle={-180}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};
