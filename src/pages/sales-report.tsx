import { Box, CircularProgress, Grid, Paper } from "@mui/material";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

import withAuth from "@/components/HOC/withAuth";
import { useAccount, useReviewsManagement } from "@/components/hooks/web3";
import { useWeb3 } from "@/components/providers/web3";
import { ContentContainer } from "@/components/shared/ContentContainer";
import SalesReportTable from "@/components/ui/sales-report/SalesReport";
import { salesReport } from "@/mocks";
import { SalesReportRowData } from "@/types/salesReport";
import namespaceDefaultLanguage from "@/utils/namespaceDefaultLanguage";

const Report = () => {
  const { t } = useTranslation("salesReport");
  const { account } = useAccount();
  const { ethereum, bookStoreContract } = useWeb3();
  const { swr } = useReviewsManagement();

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
              return (
                <SalesReportTable data={salesReport as SalesReportRowData[]} />
              );
            })()}
          </Paper>
        </Grid>
      </ContentContainer>
    </>
  );
};

export default withAuth(Report);

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        ...namespaceDefaultLanguage(),
        "salesReport"
      ]))
    }
  };
}
