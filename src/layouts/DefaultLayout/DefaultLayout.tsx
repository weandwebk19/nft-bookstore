import { Box, Container } from "@mui/material";

import { NavBar } from "../components";

interface DefaultLayoutProps {
  children: React.ReactNode;
  onThemeChange: (theme: string) => void;
}

const DefaultLayout = ({ children, onThemeChange }: DefaultLayoutProps) => {
  return (
    <Box>
      <NavBar onThemeChange={onThemeChange} />
      <Container maxWidth="xl">
        <Box className="content">{children}</Box>
      </Container>
    </Box>
  );
};

export default DefaultLayout;
