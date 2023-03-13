import { Box, Stack } from "@mui/material";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

import DisplayBox from "@/components/ui/publishing/DisplayBox";

const Publishing = () => {
  return (
    <>
      <Head>
        <title>Publishing - NFT Bookstore</title>
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

export default Publishing;

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["navbar", "footer", "filter"]))
    }
  };
}
