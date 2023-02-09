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
      <Container>
        <Box className="content">{children}</Box>
      </Container>
      <Footer onThemeChange={onThemeChange} />
    </>
  );
};

export default DefaultLayout;
