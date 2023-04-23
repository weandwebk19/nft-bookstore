import { useEffect, useState } from "react";

import { Grid, Paper, Stack, Typography } from "@mui/material";

import axios from "axios";
import { ethers } from "ethers";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

import images from "@/assets/images";
import withAuth from "@/components/HOC/withAuth";
import { useAccount } from "@/components/hooks/web3";
import { useWeb3 } from "@/components/providers/web3";
import { ContentContainer } from "@/components/shared/ContentContainer";
import ResponseTable from "@/components/ui/account/mailbox/response/ResponseTable";
import { WatchlistRowData, WatchlistStatus } from "@/types/watchlist";
import namespaceDefaultLanguage from "@/utils/namespaceDefaultLanguage";

const Response = () => {
  const { t } = useTranslation("response");
  const { account } = useAccount();
  const { ethereum, contract } = useWeb3();
  const [rows, setRows] = useState<WatchlistRowData[]>([]);

  useEffect(() => {
    (async () => {
      const rows = [] as WatchlistRowData[];

      // handle logic

      setRows(rows);
    })();
  }, [account.data]);

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
            <ResponseTable data={rows!} />
          </Paper>
        </Grid>
      </ContentContainer>
    </>
  );
};

export default withAuth(Response);

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        ...namespaceDefaultLanguage(),
        "response"
      ]))
    }
  };
}
