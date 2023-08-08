import Link from "@/components/shared/Link";
import { CategoryStats } from "@/domain";
import NorthEastIcon from "@mui/icons-material/NorthEast";
import Typography from "@mui/material/Typography";
import { YearStats } from "../reports/YearStats";

interface ReportsTileProps {
  categoryStats: CategoryStats[];
}

export const ReportsTile: React.FC<ReportsTileProps> = ({ categoryStats }) => (
  <div>
    <Typography variant="h5">
      <Link href="/reports/categories" color="inherit" underline="hover">
        Reports <NorthEastIcon />
      </Link>
    </Typography>
    <YearStats categoryStats={categoryStats} />
  </div>
);
