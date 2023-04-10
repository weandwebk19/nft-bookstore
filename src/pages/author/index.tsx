import { Box, Stack } from "@mui/material";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

import withAuth from "@/components/HOC/withAuth";
import DisplayBox from "@/components/ui/publishing/DisplayBox";
import namespaceDefaultLanguage from "@/utils/namespaceDefaultLanguage";

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
          <Box component="section">
            <DisplayBox />
          </Box>
        </Stack>
      </main>
    </>
  );
};

export default withAuth(Author);

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [...namespaceDefaultLanguage()]))
    }
  };
}
