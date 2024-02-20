import AddIcon from "@mui/icons-material/Add";
import HomeIcon from "@mui/icons-material/Home";
import ListIcon from "@mui/icons-material/List";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Paper from "@mui/material/Paper";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

export const Navigation: React.FC = () => {
  const router = useRouter();

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
      </BottomNavigation>
    </Paper>
  );
};
