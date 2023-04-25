import { Box, Button, Typography } from "@mui/material";
import { Grid, Stack } from "@mui/material";

import axios from "axios";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/router";

import withAuth from "@/components/HOC/withAuth";
import { useCreatedBooks } from "@/components/hooks/web3";
import {
  EditButton,
  LendButton,
  SellButton
} from "@/components/shared/BookButton";
import { ActionableBookItem } from "@/components/shared/BookItem";
import { BreadCrumbs } from "@/components/shared/BreadCrumbs";
import { ContentPaper } from "@/components/shared/ContentPaper";
import { FallbackNode } from "@/components/shared/FallbackNode";
import { FilterBar } from "@/components/shared/FilterBar";
import { StyledButton } from "@/styles/components/Button";
import { FilterField } from "@/types/filter";
import namespaceDefaultLanguage from "@/utils/namespaceDefaultLanguage";

const CreatedBooks = () => {
  const { t } = useTranslation("createdBooks");

  const breadCrumbs = [
    {
      content: t("breadcrumbs_bookshelf") as string,
      href: "/account/bookshelf"
    },
    {
      content: t("breadcrumbs_createdBooks") as string,
      href: "/account/bookshelf/created-books"
    }
  ];

  const router = useRouter();
  const { nfts } = useCreatedBooks(router.query as FilterField);
  const createdBooks = nfts.data;

  const handleBookClick = (tokenId: number | string) => {
    (async () => {
      const res = await axios.get(`/api/books/token/${tokenId}/bookId`);
      if (res.data.success === true) {
        const bookId = res.data.data;
        router.push(`/books/${bookId}`);
      }
    })();
  };

  return (
    <>
      <Head>
        <title>{`${t("titlePage")}`}</title>
        <meta name="description" content="The world's first NFT Bookstore" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Stack sx={{ pt: 3 }}>
        <Box sx={{ mb: 3 }}>
          <BreadCrumbs breadCrumbs={breadCrumbs} />
        </Box>

        <Grid container columns={{ xs: 4, sm: 8, md: 12 }} spacing={3}>
          <Grid item xs={4} sm={8} md={9} lg={9}>
            <ContentPaper title="Created books">
              {(() => {
                if (nfts.isLoading) {
                  return (
                    <Typography>{t("loadingMessage") as string}</Typography>
                  );
                } else if (createdBooks?.length === 0 || nfts.error) {
                  return (
                    <FallbackNode>
                      <Typography>{t("emptyMessage") as string}</Typography>
                    </FallbackNode>
                  );
                }
                return (
                  <Grid
                    container
                    spacing={3}
                    columns={{ xs: 4, sm: 8, md: 12, lg: 24 }}
                  >
                    {createdBooks!.map((book) => {
                      return (
                        <Grid
                          item
                          key={book.tokenId}
                          xs={4}
                          sm={4}
                          md={6}
                          lg={8}
                        >
                          <ActionableBookItem
                            status="isCreated"
                            tokenId={book?.tokenId}
                            owner={book?.author}
                            onClick={handleBookClick}
                            quantity={book?.quantity}
                            amountTradeable={book?.amountTradeable}
                            buttons={
                              <Stack
                                direction={{ xs: "column", sm: "row" }}
                                spacing={{ xs: 2, sm: 2, md: 3 }}
                                sx={{ width: "100%" }}
                              >
                                <SellButton
                                  tokenId={book?.tokenId}
                                  owner={book?.author}
                                  amountTradeable={book?.amountTradeable!}
                                />
                                <EditButton tokenId={book?.tokenId} />
                              </Stack>
                            }
                          />
                        </Grid>
                      );
                    })}
                  </Grid>
                );
              })()}
            </ContentPaper>
          </Grid>
          <Grid item xs={4} sm={8} md={3} lg={3}>
            <FilterBar
              data={createdBooks}
              pathname="/bookshelf/created-books"
            />
          </Grid>
        </Grid>
      </Stack>
    </>
  );
};

export default withAuth(CreatedBooks);

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        ...namespaceDefaultLanguage(),
        "filter",
        "createdBooks"
      ]))
    }
  };
}
