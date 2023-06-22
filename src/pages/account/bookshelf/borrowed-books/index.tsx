/* eslint-disable prettier/prettier */
import { useEffect, useState } from "react";

import { Box, Typography } from "@mui/material";
import { Grid, Stack } from "@mui/material";

import axios from "axios";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/router";

import withAuth from "@/components/HOC/withAuth";
import { useOwnedBorrowedBooks } from "@/components/hooks/web3";
import {
  LendButton,
  ReadButton,
  ReviewButton,
  SellButton
} from "@/components/shared/BookButton";
import ExtendRequestButton from "@/components/shared/BookButton/ExtendRequestButton";
import ShareButton from "@/components/shared/BookButton/ShareButton";
import { ActionableBookItem } from "@/components/shared/BookItem";
import { BreadCrumbs } from "@/components/shared/BreadCrumbs";
import { ContentPaper } from "@/components/shared/ContentPaper";
import { FallbackNode } from "@/components/shared/FallbackNode";
import { FilterBar } from "@/components/shared/FilterBar";
import { FilterField } from "@/types/filter";
import { BorrowedBook } from "@/types/nftBook";
import namespaceDefaultLanguage from "@/utils/namespaceDefaultLanguage";
import { secondsToDhms } from "@/utils/secondsToDhms";

const BorrowedBooks = () => {
  const { t } = useTranslation("borrowedBooks");

  const breadCrumbs = [
    {
      content: t("breadcrumbs_bookshelf") as string,
      href: "/account/bookshelf"
    },
    {
      content: t("breadcrumbs_borrowedBooks") as string,
      href: "/account/bookshelf/borrowed-books"
    }
  ];

  const router = useRouter();
  const { nfts } = useOwnedBorrowedBooks(router.query as FilterField);
  const rentedBooks = nfts.data as BorrowedBook[];
  const [nowTime, setNowTime] = useState<number>(0);

  useEffect(() => {
    const seconds = new Date().getTime() / 1000;
    setNowTime(seconds);
  }, []);

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
          <Grid item xs={4} sm={8} md={9}>
            <ContentPaper title={t("borrowedBooksTitle")}>
              {(() => {
                if (nfts.isLoading) {
                  return (
                    <Typography>{t("loadingMessage") as string}</Typography>
                  );
                } else if (rentedBooks?.length === 0 || nfts.error) {
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
                    {rentedBooks!.map((book) => {
                      return (
                        <Grid
                          item
                          key={book.tokenId}
                          xs={4}
                          sm={4}
                          md={6}
                          lg={6}
                        >
                          <ActionableBookItem
                            status="isBorrowed"
                            tokenId={book?.tokenId}
                            renter={book?.renter}
                            onClick={handleBookClick}
                            price={book?.price}
                            amount={book?.amount}
                            endTime={book?.endTime}
                            countDown={secondsToDhms(book?.endTime - nowTime)}
                            buttons={
                              <Grid
                                container
                                columns={{ xs: 2, sm: 2 }}
                                spacing={2}
                              >
                                {(book?.endTime > nowTime) ?
                                  <Grid item xs={1} sm={1}>
                                    <ShareButton
                                      tokenId={book?.tokenId}
                                      renter={book?.renter}
                                      borrower={book?.borrower}
                                      startTime={book?.startTime}
                                      endTime={book?.endTime}
                                      borrowedAmount={book?.amount}
                                    />
                                  </Grid> : null
                                }
                                <Grid item xs={1} sm={1}>
                                  <ExtendRequestButton
                                    tokenId={book?.tokenId}
                                    renter={book?.renter}
                                    supplyAmount={book?.amount}
                                    startTime={book?.startTime}
                                    endTime={book?.endTime}
                                  />
                                </Grid>
                                <Grid item xs={1} sm={1}>
                                  <ReviewButton
                                    tokenId={book?.tokenId}
                                    author={book?.renter}
                                  />
                                </Grid>
                                {(book?.endTime > nowTime) ?
                                  <Grid item xs={1} sm={1}>
                                    <ReadButton tokenId={book?.tokenId} />
                                  </Grid> : null
                                }
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
              data={rentedBooks}
              pathname="/bookshelf/borrowed-books"
            />
          </Grid>
        </Grid>
      </Stack>
    </>
  );
};

export default withAuth(BorrowedBooks);

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        ...namespaceDefaultLanguage(),
        "filter",
        "borrowedBooks",
        "bookButtons"
      ]))
    }
  };
}
