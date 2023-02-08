import { Box, Stack } from "@mui/material";

import DisplayBox from "@ui/Home/DisplayBox";
import Hero from "@ui/Home/Hero";
import MainProduct from "@ui/Home/MainProduct";
import Head from "next/head";

import { DefaultLayout } from "@/layouts";

export default function Home() {
  return (
    <>
      <Head>
        <title>NFT Bookstore</title>
        <meta name="description" content="The world's first NFT Bookstore" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Stack spacing={8}>
          <Box sx={{ height: "70vh" }}>
            <Hero />
          </Box>
          <Box>
            <MainProduct />
          </Box>
          <Box sx={{ height: "30vh" }}>
            <Box
              sx={{
                height: "inherit",
                backgroundColor: "DarkSeaGreen",
                position: "absolute",
                left: 0,
                width: "100vw"
              }}
            />
          </Box>
          <Box>
            <DisplayBox />
          </Box>
        </Stack>
      </main>
    </>
  );
}

Home.PageLayout = DefaultLayout;
