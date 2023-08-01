import { CategoryStats } from "@/domain";
import NorthEastIcon from "@mui/icons-material/NorthEast";
import { Link as MuiLink } from "@mui/material";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { YearStats } from "../reports/YearStats";

interface ReportsTileProps {
  categoryStats: CategoryStats[];
}

export const ReportsTile: React.FC<ReportsTileProps> = ({ categoryStats }) => (
  <div>
    <Typography variant="h5">
      <MuiLink component={Link} href="/reports/categories" color="inherit" underline="hover">
        Reports <NorthEastIcon />
      </MuiLink>
    </Typography>
    <YearStats categoryStats={categoryStats} />
  </div>
);
