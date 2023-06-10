import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { signIn, signOut, useSession } from "next-auth/react";
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

      {session ? (
        <>
          <Typography>
            Signed in as {session.user?.email}&nbsp;
            <Button onClick={() => signOut()} size="small">
              Sign out
            </Button>
          </Typography>
          {children}
        </>
      ) : (
        <Typography>
          Please&nbsp;
          <Button onClick={() => signIn("google")}>Sign in</Button>
        </Typography>
      )}
    </>
  );
};

export default ProtectedPage;
