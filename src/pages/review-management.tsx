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
import { useAccount, useReviewsManagement } from "@/components/hooks/web3";
import { useWeb3 } from "@/components/providers/web3";
import { ContentContainer } from "@/components/shared/ContentContainer";
import CustomerReviewTable from "@/components/ui/review-management/CustomerReviewTable";
import { bookReviews } from "@/mocks";
import { ReviewRowData, ReviewStatus } from "@/types/reviews";
import namespaceDefaultLanguage from "@/utils/namespaceDefaultLanguage";

const ReviewManagement = () => {
  const { t } = useTranslation("reviewManagement");
  const { account } = useAccount();
  const { ethereum, bookStoreContract } = useWeb3();
  const { swr } = useReviewsManagement();
  console.log(swr);

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
              if (swr.isLoading) {
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
              return <CustomerReviewTable data={swr.data} />;
            })()}
          </Paper>
        </Grid>
      </ContentContainer>
    </>
  );
};

// export default withAuth(ReviewManagement);
export default ReviewManagement;

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        ...namespaceDefaultLanguage(),
        "reviewManagement"
      ]))
    }
  };
}
