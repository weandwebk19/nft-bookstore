import { Box, Stack } from "@mui/material";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

import { BreadCrumbs } from "@/components/shared/BreadCrumbs";
import DisplayBox from "@/components/ui/borrow/DisplayBox";

const breadCrumbs = [
  {
    content: "Borrow",
    href: "/borrow"
  }
];

const Borrow = () => {
  return (
    <>
      <Head>
        <title>Borrow - NFT Bookstore</title>
        <meta name="description" content="The world's first NFT Bookstore" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Stack spacing={8}>
          <Box component="section">
            <Box sx={{ mb: 3 }}>
              <BreadCrumbs breadCrumbs={breadCrumbs} />
            </Box>
            <DisplayBox />
          </Box>
        </Stack>
      </main>
    </>
  );
};

export default Borrow;

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["navbar", "footer", "filter"]))
    }
  };
}
