import { useEffect, useState } from "react";

import {
  Box,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  Typography
} from "@mui/material";

import axios from "axios";
import { ethers } from "ethers";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

import images from "@/assets/images";
import withAuth from "@/components/HOC/withAuth";
import { useTransactionHistories } from "@/components/hooks/api";
import { useAccount } from "@/components/hooks/web3";
import { useWeb3 } from "@/components/providers/web3";
import { ContentContainer } from "@/components/shared/ContentContainer";
import TransactionHistoryTable from "@/components/ui/account/transactionHistory/TransactionHistoryTable";
// import { WatchlistRowData, WatchlistStatus } from "@/types/watchlist";
import namespaceDefaultLanguage from "@/utils/namespaceDefaultLanguage";

const TransactionHistory = () => {
  const { t } = useTranslation("transactionHistory");
  const { account } = useAccount();

  // const [rows, setRows] = useState<WatchlistRowData[]>([]);
  const [rows, setRows] = useState([]);

  const { data = [], isLoading } = useTransactionHistories(
    account.data as string
  );
  console.log("data:", data);
  console.log("isLoading:", isLoading);

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
              return <TransactionHistoryTable data={data!} />;
            })()}
          </Paper>
        </Grid>
      </ContentContainer>
    </>
  );
};

export default withAuth(TransactionHistory);

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        ...namespaceDefaultLanguage(),
        "transactionHistory"
      ]))
    }
  };
}
