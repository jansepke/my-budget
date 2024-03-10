import { YearStats } from "@/components/reports/YearStats";
import Link from "@/components/shared/Link";
import { CategoryStat, TransactionDTO } from "@/domain";
import NorthEastIcon from "@mui/icons-material/NorthEast";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface ReportsTileProps {
  categoryStats: CategoryStat[];
  templateTransactions: TransactionDTO[];
  missingCategoryCount: number;
  averageIncome: number;
}

export const ReportsTile: React.FC<ReportsTileProps> = ({
  categoryStats,
  templateTransactions,
  averageIncome,
  missingCategoryCount,
}) => (
  <div>
    <Typography variant="h5">Reports</Typography>

    <YearStats
      categoryStats={categoryStats}
      templateTransactions={templateTransactions}
      averageIncome={averageIncome}
    />

    <Box m={2}>
      <Typography variant="h6">
        <Link href="/transactions/missing" color="inherit" underline="hover">
          Missing Category <NorthEastIcon />
        </Link>
      </Typography>
      <Typography color="text.secondary">{missingCategoryCount} transactions without a category</Typography>
    </Box>
  </div>
);
