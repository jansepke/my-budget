import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { signIn, signOut, useSession } from "next-auth/react";
import Page from "../components/shared/Page";
import { useEffect } from "react";

const Index = () => {
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      fetch("/api/test");
    }
  }, [session]);

  return (
    <Page headline="My Budget">
      <Container maxWidth="md" sx={{ marginTop: 3 }}>
        <Typography>My Budget</Typography>

        {session ? (
          <Typography>
            Signed in as {session.user?.email}
            <button onClick={() => signOut()}>Sign out</button>
          </Typography>
        ) : (
          <Typography>
            Not signed in
            <button onClick={() => signIn("google")}>Sign in</button>
          </Typography>
        )}
      </Container>
    </Page>
  );
};

export default Index;
