import AddIcon from "@mui/icons-material/Add";
import HomeIcon from "@mui/icons-material/Home";
import ListIcon from "@mui/icons-material/List";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";

export const Navigation: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const currentTab = (() => {
    switch (router.pathname) {
      case "/":
        return "overview";
      case "/transactions/new":
        return "new";
      default:
        if (router.pathname.startsWith("/transactions/")) {
          return "transactions";
        }
        return undefined;
    }
  })();

  return (
    <>
      <Paper sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 2 }} elevation={20}>
        <BottomNavigation showLabels value={currentTab}>
          <BottomNavigationAction value="overview" label="Overview" icon={<HomeIcon />} LinkComponent={Link} href="/" />
          <BottomNavigationAction
            value="transactions"
            label="Transactions"
            icon={<ListIcon />}
            LinkComponent={Link}
            href="/transactions/current/current"
          />
          <BottomNavigationAction
            value="new"
            label="New"
            icon={<AddIcon />}
            LinkComponent={Link}
            href="/transactions/new"
          />
          <BottomNavigationAction label="More" icon={<MoreHorizIcon />} onClick={(e) => setAnchorEl(e.currentTarget)} />
        </BottomNavigation>
      </Paper>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <MenuItem disableRipple>{session?.user?.email}</MenuItem>
        <MenuItem onClick={() => signOut()}>Logout</MenuItem>
      </Menu>
    </>
  );
};
