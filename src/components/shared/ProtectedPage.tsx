import { Navigation } from "@/components/shared/Navigation";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useSession } from "next-auth/react";
import Head from "next/head";
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
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              My Budget
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
      {session ? (
        <>
          <Box mb={6}>{children}</Box>
          <Navigation />
        </>
      ) : null}
    </>
  );
};

export default ProtectedPage;
