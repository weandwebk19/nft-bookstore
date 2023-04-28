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
  LendButton,
  ReadButton,
  ReviewButton,
  SellButton
} from "@/components/shared/BookButton";
import { ActionableBookItem } from "@/components/shared/BookItem";
import { BreadCrumbs } from "@/components/shared/BreadCrumbs";
import { ContentPaper } from "@/components/shared/ContentPaper";
import { FallbackNode } from "@/components/shared/FallbackNode";
import { FilterBar } from "@/components/shared/FilterBar";
import { BookSelling } from "@/types/nftBook";
import namespaceDefaultLanguage from "@/utils/namespaceDefaultLanguage";

const PurchasedBooks = () => {
  const { t } = useTranslation("purchasedBooks");

  const breadCrumbs = [
    {
      content: t("breadcrumbs_bookshelf") as string,
      href: "/account/bookshelf"
    },
    {
      content: t("breadcrumbs_purchasedBooks") as string,
      href: "/account/bookshelf/owned-books"
    }
  ];

  const { nfts } = useOwnedPurchasedBooks();
  const router = useRouter();
  const purchasedBooks = nfts.data;
  console.log(nfts);

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
            <ContentPaper title={t("purchasedBooksTitle")}>
              {(() => {
                if (nfts.isLoading) {
                  return (
                    <Typography>{t("loadingMessage") as string}</Typography>
                  );
                } else if (purchasedBooks?.length === 0 || nfts.error) {
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
                    {purchasedBooks!.map((book: BookSelling) => {
                      return (
                        <Grid
                          item
                          key={`${book.tokenId} ${book.seller}`}
                          xs={4}
                          sm={8}
                          md={6}
                          lg={6}
                        >
                          <ActionableBookItem
                            status="isPurchased"
                            tokenId={book?.tokenId}
                            bookCover={book?.meta.bookCover}
                            title={book?.meta.title}
                            fileType={book?.meta.fileType}
                            owner={book?.seller}
                            onClick={handleBookClick}
                            amount={book?.amount}
                            amountTradeable={book?.amountTradeable}
                            buttons={
                              <Grid container columns={{ xs: 2, sm: 2 }}>
                                <Grid item xs={1} sm={1}>
                                  <SellButton
                                    tokenId={book?.tokenId}
                                    title={book?.meta.title}
                                    bookCover={book?.meta.bookCover}
                                    owner={book?.seller}
                                    amountTradeable={book?.amountTradeable!}
                                  />
                                </Grid>
                                <Grid item xs={1} sm={1}>
                                  <LendButton
                                    tokenId={book?.tokenId}
                                    title={book?.meta.title}
                                    bookCover={book?.meta.bookCover}
                                    owner={book?.seller}
                                    amountTradeable={book?.amountTradeable!}
                                  />
                                </Grid>
                                <Grid item xs={1} sm={1}>
                                  <ReviewButton
                                    tokenId={book?.tokenId}
                                    title={book?.meta.title}
                                    bookCover={book?.meta.bookCover}
                                    author={book?.seller}
                                  />
                                </Grid>
                                <Grid item xs={1} sm={1}>
                                  <ReadButton bookFile={book?.meta.bookFile} />
                                </Grid>
                              </Grid>
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
            <FilterBar
              data={purchasedBooks}
              pathname="/bookshelf/purchased-books"
            />
          </Grid>
        </Grid>
      </Stack>
    </>
  );
};

export default withAuth(PurchasedBooks);

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        ...namespaceDefaultLanguage(),
        "filter",
        "purchasedBooks"
      ]))
    }
  };
}
