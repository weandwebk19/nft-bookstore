import { Box, Container } from "@mui/material";

import { Footer, NavBar } from "../components";

interface ZenLayoutProps {
  children: React.ReactNode;
}

const ZenLayout = ({ children }: ZenLayoutProps) => {
  return (
    <>
      {/* <NavBar /> */}
      <Box sx={{ minHeight: "100vh", mt: 3 }}>
        <Container maxWidth={false}>
          <Box
            className="content"
            sx={{ display: "flex", justifyContent: "center" }}
          >
            {children}
          </Box>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default ZenLayout;
