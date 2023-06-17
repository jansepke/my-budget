import { currencyColor, filterForOtherAccount, formatCurrency, sum } from "@/backend/utils";
import { Account, Transaction } from "@/domain";
import NorthEastIcon from "@mui/icons-material/NorthEast";
import { Link as MuiLink } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import React from "react";

interface AccountTileProps {
  account: Account;
  transactions: Transaction[];
}

const AccountTile: React.FC<AccountTileProps> = ({ account, transactions }) => {
  const accountSum = sum(transactions.filter(filterForOtherAccount(account.id)));

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          <MuiLink component={Link} href={`/transactions/other/${account.id}`} color="inherit" underline="hover">
            {account.label} <NorthEastIcon sx={{ fontSize: "inherit" }} />
          </MuiLink>
        </Typography>
        <Typography sx={{ color: currencyColor(accountSum) }}>{formatCurrency(accountSum)}</Typography>
      </CardContent>
    </Card>
  );
};

interface OtherAccountsTilesProps {
  accounts: Account[];
  transactions: Transaction[];
}

export const OtherAccountsTiles: React.FC<OtherAccountsTilesProps> = ({ accounts, transactions }) => {
  const otherAccounts = accounts.filter((a) => a.id !== 1);

  return (
    <Box mt={1}>
      <Typography variant="h5">Other Accounts</Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          m: 1,
        }}
      >
        {otherAccounts.map((a) => (
          <AccountTile key={a.id} account={a} transactions={transactions} />
        ))}
      </Box>
    </Box>
  );
};
