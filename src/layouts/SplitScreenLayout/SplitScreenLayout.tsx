import { Box, Container } from "@mui/material";

import { Footer, NavBar } from "../components";

interface SplitScreenLayoutProps {
  children: React.ReactNode;
  onThemeChange: (theme: string) => void;
}

const SplitScreenLayout = ({
  children,
  onThemeChange
}: SplitScreenLayoutProps) => {
  return (
    <>
      <NavBar onThemeChange={onThemeChange} />
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
