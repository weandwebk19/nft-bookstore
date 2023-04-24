import { useEffect, useState } from "react";

import { Grid, Paper, Stack, Typography } from "@mui/material";

import axios from "axios";
import { ethers } from "ethers";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

import images from "@/assets/images";
import withAuth from "@/components/HOC/withAuth";
import {
  useAccount,
  useOwnedRequestsOnExtending
} from "@/components/hooks/web3";
import { useWeb3 } from "@/components/providers/web3";
import { ContentContainer } from "@/components/shared/ContentContainer";
import RequestTable from "@/components/ui/account/mailbox/request/RequestTable";
import { RequestExtendCore } from "@/types/nftBook";
import { WatchlistRowData, WatchlistStatus } from "@/types/watchlist";
import namespaceDefaultLanguage from "@/utils/namespaceDefaultLanguage";

const Request = () => {
  const { t } = useTranslation("request");
  const { account } = useAccount();
  const { ethereum, contract } = useWeb3();
  const [rows, setRows] = useState<WatchlistRowData[]>([]);
  const { swr } = useOwnedRequestsOnExtending(); // check isLoading if necessary
  const data = swr.data as RequestExtendCore[]; // replace data with rows
  console.log("swr", swr);

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
            <RequestTable data={rows!} />
          </Paper>
        </Grid>
      </ContentContainer>
    </>
  );
};

export default withAuth(Request);

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        ...namespaceDefaultLanguage(),
        "request"
      ]))
    }
  };
}
