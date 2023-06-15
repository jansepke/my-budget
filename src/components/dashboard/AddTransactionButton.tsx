import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import Link from "next/link";

export const AddTransactionButton: React.FC = () => (
  <Fab
    LinkComponent={Link}
    href="/transactions/new"
    color="primary"
    sx={{
      position: "fixed",
      bottom: (theme) => theme.spacing(2),
      right: (theme) => theme.spacing(2),
    }}
  >
    <AddIcon />
  </Fab>
);
