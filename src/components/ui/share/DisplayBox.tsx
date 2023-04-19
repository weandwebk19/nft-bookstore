/* eslint-disable prettier/prettier */
import { FunctionComponent } from "react";

import { Box, Grid, Stack, Typography } from "@mui/material";

import { useAllSharingBooks } from "@hooks/web3";
import { BookBanner } from "@shared/BookBanner";
import { ContentPaper } from "@shared/ContentPaper";
import axios from "axios";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import { AddToWatchlistButton } from "@/components/shared/BookButton";
import BuyButton from "@/components/shared/BookButton/BuyButton";
import TakeButton from "@/components/shared/BookButton/TakeButton";
import { OwnableBookItem } from "@/components/shared/BookItem";
import { FallbackNode } from "@/components/shared/FallbackNode";
import { FilterBar } from "@/components/shared/FilterBar";
import { BookSharing } from "@/types/nftBook";

const DisplayBox: FunctionComponent = () => {
  const { t } = useTranslation("shareBooks");

  const router = useRouter();

  const { nfts } = useAllSharingBooks();

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
    <Box>
      <Grid container spacing={3} columns={{ xs: 4, sm: 8, md: 12 }}>
        <Grid item xs={4} sm={5} md={9}>
          <Stack spacing={3}>
            <ContentPaper isPaginate={true} title={t("shareBooksTitle")}>
              {(() => {
                if (nfts.isLoading) {
                  return (
                    <Typography>{t("loadingMessage") as string}</Typography>
                  );
                } else if (nfts?.data?.length === 0 || nfts.error) {
                  return <FallbackNode />;
                }
                return (
                  <Grid
                    container
                    spacing={3}
                    columns={{ xs: 4, sm: 8, md: 12, lg: 24 }}
                  >
                    {/* Can not call BookList component, since the BookCard component has
                  `buttons` prop, and it must be pass some prop of a SINGLE book such as: 
                  title, bookCover, author,... */}

                    {nfts?.data?.map((book: BookSharing) => {
                      return (
                        <Grid
                          item
                          key={book.tokenId}
                          xs={4}
                          sm={8}
                          md={6}
                          lg={6}
                        >
                          <OwnableBookItem
                            price={book?.price}
                            tokenId={book?.tokenId}
                            bookCover={book?.meta.bookCover}
                            title={book?.meta.title}
                            fileType={book?.meta.fileType}
                            author={book?.sharedPer}
                            onClick={handleBookClick}
                            buttons={
                              <>
                                <TakeButton
                                  tokenId={book?.tokenId}
                                  title={book?.meta.title}
                                  bookCover={book?.meta.bookCover}
                                  fromRenter={book?.fromRenter}
                                  sharer={book?.sharer}
                                  startTime={book?.startTime}
                                  endTime={book?.endTime}
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
            <ContentPaper title="Filter">
              <FilterBar />
            </ContentPaper>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DisplayBox;
