import { Box, Stack } from "@mui/material";

import DisplayBox from "@/components/ui/publish/DisplayBox";
import Head from "next/head";

const Publish = () => {
  return (
    <>
      <Head>
        <title>Publish - NFT Bookstore</title>
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

export default Publish;
