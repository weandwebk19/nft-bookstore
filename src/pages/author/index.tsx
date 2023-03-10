import { Box, Stack } from "@mui/material";

import Head from "next/head";

import DisplayBox from "@/components/ui/publishing/DisplayBox";

const Author = () => {
  return (
    <>
      <Head>
        <title>Author - NFT Bookstore</title>
        <meta name="description" content="The world's first NFT Bookstore" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Stack spacing={8}>
          <Box component="section" sx={{ marginTop: "100px" }}>
            <DisplayBox />
          </Box>
        </Stack>
      </main>
    </>
  );
};

export default Author;
