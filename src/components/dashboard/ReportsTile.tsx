import Link from "@/components/shared/Link";
import { CategoryStat, Transaction } from "@/domain";
import NorthEastIcon from "@mui/icons-material/NorthEast";
import Typography from "@mui/material/Typography";
import { YearStats } from "../reports/YearStats";

interface ReportsTileProps {
  categoryStats: CategoryStat[];
  templateTransactions: Transaction[];
}

export const ReportsTile: React.FC<ReportsTileProps> = ({ categoryStats, templateTransactions }) => (
  <div>
    <Typography variant="h5">
      <Link href="/reports/categories" color="inherit" underline="hover">
        Reports <NorthEastIcon />
      </Link>
    </Typography>
    <YearStats categoryStats={categoryStats} templateTransactions={templateTransactions} />
  </div>
);
