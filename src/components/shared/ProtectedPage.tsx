import HomeIcon from "@mui/icons-material/Home";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import React from "react";

interface PageProps extends React.PropsWithChildren {
  headline: string;
}

const ProtectedPage: React.FC<PageProps> = ({ headline, children }) => {
  const { data: session } = useSession();

  return (
    <>
      <Head>
        <title>{headline}</title>
        <meta name="description" content="My Budget" />
      </Head>

      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton component={Link} href="/" color="inherit">
              <HomeIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              My Budget
            </Typography>
            {session ? (
              <>
                <Typography sx={{ display: { xs: "none", md: "inherit" } }}>{session.user?.email}&nbsp;</Typography>
                <Button color="inherit" onClick={() => signOut()} size="small">
                  Logout
                </Button>
              </>
            ) : (
              <Button color="inherit" onClick={() => signIn("google")}>
                Login
              </Button>
            )}
          </Toolbar>
        </AppBar>
      </Box>
      {session ? children : null}
    </>
  );
};

export default ProtectedPage;
