import { Box, Container } from "@mui/material";

import { Footer, NavBar } from "../components";

interface DefaultLayoutProps {
  children: React.ReactNode;
  onThemeChange: (theme: string) => void;
}

const DefaultLayout = ({ children, onThemeChange }: DefaultLayoutProps) => {
  return (
    <>
      <NavBar onThemeChange={onThemeChange} />
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
