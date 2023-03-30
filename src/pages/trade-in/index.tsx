import { Box, Stack } from "@mui/material";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

import { BreadCrumbs } from "@/components/shared/BreadCrumbs";
import DisplayBox from "@/components/ui/trade-in/DisplayBox";

const TradeIn = () => {
  const { t } = useTranslation("tradeInBooks");

  const breadCrumbs = [
    {
      content: `${t("breadcrumbs_tradeIn")}`,
      href: "/trade-in"
    }
  ];

  return (
    <>
      <Head>
        <title>{`${t("titlePage")}`}</title>
        <meta name="description" content="The world's first NFT Bookstore" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Stack sx={{ pt: 3 }}>
          <Stack spacing={8}>
            <Box component="section">
              <Box sx={{ mb: 3 }}>
                <BreadCrumbs breadCrumbs={breadCrumbs} />
              </Box>
              <DisplayBox />
            </Box>
          </Stack>
        </Stack>
      </main>
    </>
  );
};

export default TradeIn;

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "common",
        "navbar",
        "footer",
        "filter",
        "fallback",
        "tradeInBooks"
      ]))
    }
  };
}
