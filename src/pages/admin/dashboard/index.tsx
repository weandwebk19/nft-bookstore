import { Box, CircularProgress, Grid, Paper } from "@mui/material";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

import withAuth from "@/components/HOC/withAuth";
import { useTransactionHistories } from "@/components/hooks/api";
import { useAccount } from "@/components/hooks/web3";
import { ContentContainer } from "@/components/shared/ContentContainer";
import DashboardTable from "@/components/ui/moderator/dashboard/DashboardTable";
import namespaceDefaultLanguage from "@/utils/namespaceDefaultLanguage";

const DashboardAdmin = () => {
  const { t } = useTranslation("dashboard");
  const { account } = useAccount();

  const { data = [], isLoading } = useTransactionHistories(
    account.data as string
  );

  const mockData = [
    {
      tokenId: 1,
      title: "Harry Potter",
      bookSample:
        "https://gateway.pinata.cloud/ipfs/QmVfJR8tQwLTxs8dpMQDbfe1SdWD5bo2prUc98EgQpaXKu",
      bookCover:
        "https://gateway.pinata.cloud/ipfs/QmVfJR8tQwLTxs8dpMQDbfe1SdWD5bo2prUc98EgQpaXKu",
      nftUri:
        "https://gateway.pinata.cloud/ipfs/QmRha8zUx4SNEgNoV7PEV5DogFALhidduSbsm8UjtPn4Kk",
      author: "0xA63d2d15E6cA7F4fB9E693Ea37a283F7cB50AB25",
      timestamp: new Date("2023-10-25T14:48:00").getTime()
    },
    {
      tokenId: 2,
      title: "Titanic",
      bookSample:
        "https://gateway.pinata.cloud/ipfs/QmVfJR8tQwLTxs8dpMQDbfe1SdWD5bo2prUc98EgQpaXKu",
      bookCover:
        "https://gateway.pinata.cloud/ipfs/QmVfJR8tQwLTxs8dpMQDbfe1SdWD5bo2prUc98EgQpaXKu",
      nftUri:
        "https://gateway.pinata.cloud/ipfs/QmRha8zUx4SNEgNoV7PEV5DogFALhidduSbsm8UjtPn4Kk",
      author: "0xA63d2d15E6cA7F4fB9E693Ea37a283F7cB50AB25",
      timestamp: new Date("2023-06-20T06:22:36.732Z").getTime()
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
            {(() => {
              if (isLoading) {
                return (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      minHeight: "200px"
                    }}
                  >
                    <CircularProgress />
                  </Box>
                );
              }
              return <DashboardTable data={mockData!} />;
            })()}
          </Paper>
        </Grid>
      </ContentContainer>
    </>
  );
};

export default withAuth(DashboardAdmin);

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        ...namespaceDefaultLanguage(),
        "dashboard"
      ]))
    }
  };
}
