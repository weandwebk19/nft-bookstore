import { FunctionComponent, useEffect, useState } from "react";

import { Box, Grid, Stack, Typography } from "@mui/material";

import { useListedBooks } from "@hooks/web3";
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
import { ListedBookCore } from "@/types/nftBook";

const DisplayBox: FunctionComponent = () => {
  const { t } = useTranslation("publishingBooks");

  const router = useRouter();
  const query = router.query;

  const { listedBooks } = useListedBooks(query as FilterField);
  // console.log(listedBooks);
  // let data: ListedBook[] = listedBooks.data!;

  // useEffect(() => {
  //   setData(listedBooks.data);
  // }, [listedBooks.isLoading]);

  // useEffect(() => {
  //   console.log(query);
  //   console.log(Object.keys(query).length > 0);
  //   if (Object.keys(query).length > 0) {
  //     const newData = listedBooks.data?.filter((item) => {
  //       console.log("item.meta.title", item.meta.title);
  //       console.log("query.title", query.title?.toString());
  //       console.log("is", item.meta.title.includes(query.title?.toString()!));
  //       return item.meta.title.includes(query.title?.toString()!);
  //     });
  //     // setData(newData);
  //     listedBooks.mutate(newData);
  //   }
  // }, [query, listedBooks.isLoading]);

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
                //  description={firstBook?.info.description}
                //  price={firstBook?.price}
                //  genres={}
                //  languages={}
                onClick={() => {
                  alert(book.meta.title);
                }}
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
                    <Typography>{t("loadingMessage") as string}</Typography>
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
                    {listedBooks.data?.map((book: ListedBookCore) => {
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
