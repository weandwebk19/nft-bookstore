/* eslint-disable prettier/prettier */
import { Box, Typography } from "@mui/material";
import { Grid, Stack } from "@mui/material";

import axios from "axios";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/router";

import withAuth from "@/components/HOC/withAuth";
import { useOwnedPurchasedBooks } from "@/components/hooks/web3";
import {
  LeaseButton,
  ReadButton,
  SellButton
} from "@/components/shared/BookButton";
import { ActionableBookItem } from "@/components/shared/BookItem";
import { BreadCrumbs } from "@/components/shared/BreadCrumbs";
import { ContentPaper } from "@/components/shared/ContentPaper";
import { FallbackNode } from "@/components/shared/FallbackNode";
import { FilterBar } from "@/components/shared/FilterBar";
import { PurchasedBook } from "@/types/nftBook";
import namespaceDefaultLanguage from "@/utils/namespaceDefaultLanguage";

const BoughtBooks = () => {
  const { t } = useTranslation("boughtBooks");

  const breadCrumbs = [
    {
      content: t("breadcrumbs_bookshelf") as string,
      href: "/account/bookshelf"
    },
    {
      content: t("breadcrumbs_boughtBooks") as string,
      href: "/account/bookshelf/owned-books"
    }
  ];

  const { nfts } = useOwnedPurchasedBooks();
  const router = useRouter();
  const boughtBooks = nfts.data;
  // console.log(nfts);

  const handleBookClick = (tokenId: number | string) => {
    (async () => {
      const res = await axios.get(`/api/books/token/${tokenId}/bookId`);
      console.log("res", res);
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
          <Grid item xs={4} sm={8} md={9}>
            <ContentPaper title={t("boughtBooksTitle")}>
              {(() => {
                if (nfts.isLoading) {
                  return (
                    <Typography>{t("loadingMessage") as string}</Typography>
                  );
                } else if (boughtBooks?.length === 0 || nfts.error) {
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
                    {boughtBooks!.map((book: PurchasedBook) => {
                      return (
                        <Grid
                          item
                          key={book.listedId}
                          xs={4}
                          sm={8}
                          md={6}
                          lg={12}
                        >
                          <ActionableBookItem
                            status="isBought"
                            tokenId={book?.listedBook.tokenId}
                            bookCover={book?.meta.bookCover}
                            title={book?.meta.title}
                            fileType={book?.meta.fileType}
                            owner={book?.listedBook.seller}
                            onClick={handleBookClick}
                            amount={book?.amount}
                            amountTradeable={book?.amountTradeable}
                            buttons={
                              <>
                                <SellButton
                                  tokenId={book?.listedBook.tokenId}
                                  title={book?.meta.title}
                                  bookCover={book?.meta.bookCover}
                                  owner={book?.listedBook.seller}
                                  amountTradeable={book?.amountTradeable!}
                                />
                                <LeaseButton
                                  tokenId={book?.listedBook.tokenId}
                                  title={book?.meta.title}
                                  bookCover={book?.meta.bookCover}
                                  owner={book?.listedBook.seller}
                                  amountTradeable={book?.amountTradeable!}
                                />
                              </>
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
          <Grid item xs={4} sm={8} md={3}>
            <ContentPaper title="Filter">
              <FilterBar />
            </ContentPaper>
          </Grid>
        </Grid>
      </Stack>
    </>
  );
};

export default withAuth(BoughtBooks);

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        ...namespaceDefaultLanguage(),
        "filter",
        "boughtBooks"
      ]))
    }
  };
}
