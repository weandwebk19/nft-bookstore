import { Box, Container } from "@mui/material";

import { useRouter } from "next/router";

import { ScrollButton } from "@/components/shared/ScrollButton";

import { Footer, NavBar } from "../components";

interface DefaultLayoutProps {
  children: React.ReactNode;
}

const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  // const router = useRouter();
  // console.log("router", router);

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
