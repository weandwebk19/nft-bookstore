import { Box, Container } from "@mui/material";

import { Footer, NavBar } from "../components";

interface DefaultLayoutProps {
  children: React.ReactNode;
}

const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  return (
    <>
      <NavBar />
      <Box sx={{ minHeight: "100vh" }}>
        <Container maxWidth="xl">
          <Box className="content">{children}</Box>
        </Container>
      </Box>

      <Footer />
    </>
  );
};

export default DefaultLayout;
