import { Stack } from "@mui/material";

import Head from "next/head";

const Book = () => {
  return (
    <>
      <Head>
        <title>Book - NFT Bookstore</title>
        <meta name="description" content="The world's first NFT Bookstore" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Stack spacing={8}>Book</Stack>
      </main>
    </>
  );
};

export default Book;
