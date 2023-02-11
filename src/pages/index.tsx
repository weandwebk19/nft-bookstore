import { Box, Stack } from "@mui/material";

import DisplayBox from "@ui/Home/DisplayBox";
import Hero from "@ui/Home/Hero";
import MainProduct from "@ui/Home/MainProduct";
import Head from "next/head";

import images from "@/assets/images";
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
          <Box component="section" sx={{ height: "70vh" }}>
            <Hero />
          </Box>
          <Box component="section">
            <MainProduct />
          </Box>

          {/* Just for you */}
          <Box component="section" sx={{ height: "30vh" }}>
            <Box
              className="thumbnail"
              sx={{
                height: "inherit",
                position: "absolute",
                left: 0,
                width: "100vw",
                overflow: "hidden"
              }}
            >
              <Box
                component="img"
                src={images.gradient1}
                alt=""
                className="portrait"
              />
            </Box>
          </Box>

          <Box component="section">
            <DisplayBox />
          </Box>
        </Stack>
      </main>
    </>
  );
}

Home.PageLayout = DefaultLayout;
