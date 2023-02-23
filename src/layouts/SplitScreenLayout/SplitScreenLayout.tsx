import { Box, Container } from "@mui/material";

import { Footer, NavBar } from "../components";

interface SplitScreenLayoutProps {
  children: React.ReactNode;
}

const SplitScreenLayout = ({ children }: SplitScreenLayoutProps) => {
  return (
    <>
      <NavBar />
      <Box sx={{ minHeight: "100vh" }}>
        <Container maxWidth={false}>
          <Box className="content">{children}</Box>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default SplitScreenLayout;
