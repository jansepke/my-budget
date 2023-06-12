import ProtectedPage from "@/components/shared/ProtectedPage";
import { AddForm } from "@/components/transactions/AddForm";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";

const Index = () => (
  <ProtectedPage headline="My Budget">
    <Container maxWidth="md" sx={{ marginTop: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Budget
      </Typography>

      <AddForm />
    </Container>
  </ProtectedPage>
);

export default Index;

export const getServerSideProps: GetServerSideProps = async (context) => ({
  props: {
    session: await getServerSession(context.req, context.res, authOptions),
  },
});
