import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import ProtectedPage from "../components/shared/ProtectedPage";
import { authOptions } from "./api/auth/[...nextauth]";

const Index = () => {
  const addTransaction = () => {
    fetch("/api/transactions", { method: "POST" });
  };

  return (
    <ProtectedPage headline="My Budget">
      <Container maxWidth="md" sx={{ marginTop: 3 }}>
        <Typography variant="h4" gutterBottom>
          My Budget
        </Typography>

        <Button onClick={addTransaction} variant="contained">
          Add
        </Button>
      </Container>
    </ProtectedPage>
  );
};

export default Index;

export const getServerSideProps: GetServerSideProps = async (context) => ({
  props: {
    session: await getServerSession(context.req, context.res, authOptions),
  },
});
