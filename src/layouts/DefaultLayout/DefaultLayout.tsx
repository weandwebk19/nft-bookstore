import { Box, Container } from "@mui/material";

import { ScrollButton } from "@/components/shared/ScrollButton";

import { Footer, NavBar } from "../components";

interface DefaultLayoutProps {
  children: React.ReactNode;
}

const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  return (
    <>
      <NavBar />
      <Box sx={{ minHeight: "100vh" }}>
        <Container maxWidth="xl" sx={{ pt: 8 }}>
          <Box className="content">{children}</Box>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default DefaultLayout;
