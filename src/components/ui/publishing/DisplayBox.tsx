import { FunctionComponent, useEffect, useState } from "react";

import { Box, CircularProgress, Grid, Stack, Typography } from "@mui/material";

import { usePublishingBooks } from "@hooks/web3";
import { BookBanner } from "@shared/BookBanner";
import { ContentPaper } from "@shared/ContentPaper";
import axios from "axios";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import { AddToWatchlistButton } from "@/components/shared/BookButton";
import BuyButton from "@/components/shared/BookButton/BuyButton";
import { OwnableBookItem } from "@/components/shared/BookItem";
import { FallbackNode } from "@/components/shared/FallbackNode";
import { FilterBar } from "@/components/shared/FilterBar";
import { book } from "@/mocks";
import { FilterField } from "@/types/filter";
import { BookSellingCore } from "@/types/nftBook";

const DisplayBox: FunctionComponent = () => {
  const { t } = useTranslation("publishingBooks");

  const router = useRouter();
  const query = router.query;

  const { listedBooks } = usePublishingBooks(query as FilterField);

  const handleBookClick = (tokenId: number | string) => {
    (async () => {
      const res = await axios.get(`/api/books/token/${tokenId}/bookId`);
      if (res.data.success === true) {
        const bookId = res.data.data;
        router.push(`/books/${bookId}`);
      }
    })();
  };

  // should be replaced with the newest book that has been published
  const firstBook = listedBooks?.data?.[0];

  return (
    <Box>
      <Grid container spacing={3} columns={{ xs: 4, sm: 8, md: 12 }}>
        <Grid item xs={4} sm={5} md={9}>
          <Stack spacing={3}>
            {/* Book Banner */}
            {firstBook && (
              <BookBanner
                tokenId={firstBook?.tokenId}
                author={firstBook?.seller}
                onClick={() => handleBookClick(firstBook?.tokenId)}
              />
            )}

            <ContentPaper
              isPaginate={true}
              totalPages={Math.ceil(listedBooks.data.length / 30)}
              title={t("publishingBooksTitle")}
            >
              {(() => {
                if (listedBooks.isLoading) {
                  return (
                    <Stack
                      spacing={2}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <CircularProgress />
                      <Typography>{t("loadingMessage") as string}</Typography>
                    </Stack>
                  );
                } else if (
                  listedBooks?.data?.length === 0 ||
                  listedBooks.error
                ) {
                  return <FallbackNode />;
                }
                return (
                  <Grid
                    container
                    spacing={3}
                    columns={{ xs: 4, sm: 8, md: 12, lg: 24 }}
                  >
                    {listedBooks.data?.map((book: BookSellingCore) => {
                      return (
                        <Grid
                          item
                          key={`${book.tokenId}+${book.seller}+${book.price}`}
                          xs={4}
                          sm={8}
                          md={6}
                          lg={6}
                        >
                          <OwnableBookItem
                            price={book?.price}
                            tokenId={book?.tokenId}
                            author={book?.seller}
                            onClick={handleBookClick}
                            buttons={
                              <>
                                <BuyButton
                                  tokenId={book?.tokenId}
                                  seller={book?.seller}
                                  price={book?.price}
                                  supplyAmount={book?.amount}
                                />
                                <AddToWatchlistButton
                                  isLastInButtonGroup
                                  tokenId={book?.tokenId}
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
          </Stack>
        </Grid>
        <Grid item xs={4} sm={3} md={3}>
          <Stack spacing={3}>
            <FilterBar data={listedBooks?.data} pathname="/publishing" />
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DisplayBox;
