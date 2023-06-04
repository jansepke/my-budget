import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Page from "../components/shared/Page";

const Index = () => {
  return (
    <Page headline="My Money">
      <Container maxWidth="md" sx={{ marginTop: 3 }}>
        <Typography>My Money</Typography>
      </Container>
    </Page>
  );
};

export default Index;
