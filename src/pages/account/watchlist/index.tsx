import { Grid, Paper, Stack, Typography } from "@mui/material";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

import images from "@/assets/images";
import withAuth from "@/components/HOC/withAuth";
import { ContentContainer } from "@/components/shared/ContentContainer";
import WatchlistTable from "@/components/ui/account/watchlist/WatchlistTable";
import { WatchlistStatus } from "@/types/watchlist";

const Watchlist = () => {
  const { t } = useTranslation("watchlist");

  // Mock value
  const rows = [
    {
      id: 1,
      bookCover: images.mockupBookCover,
      title: "To Kill a Mockingbird",
      price: 0.5,
      status: "Frozen" as WatchlistStatus
    },
    {
      id: 2,
      bookCover: images.mockupBookCover2,
      title: "Life of Pi",
      price: 0.9,
      status: "Open for rent" as WatchlistStatus
    }
  ];

  return (
    <>
      <Head>
        <title>{t("titlePage") as string}</title>
        <meta name="description" content="The world's first NFT Bookstore" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ContentContainer titles={[`${t("containerTitle")}`]}>
        <Grid container columns={{ xs: 4, sm: 8, md: 12, lg: 12 }}>
          <Paper sx={{ p: 3, width: "100%" }}>
            <WatchlistTable data={rows} />
          </Paper>
        </Grid>
      </ContentContainer>
    </>
  );
};

export default withAuth(Watchlist);

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "navbar",
        "footer",
        "watchlist"
      ]))
    }
  };
}
