/* eslint-disable prettier/prettier */
import { FunctionComponent } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Box, CircularProgress, Grid, Stack, Typography } from "@mui/material";

import { useAllLendingBooks } from "@hooks/web3";
import { BookBanner } from "@shared/BookBanner";
import { ContentPaper } from "@shared/ContentPaper";
import axios from "axios";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import { AddToWatchlistButton } from "@/components/shared/BookButton";
import RentButton from "@/components/shared/BookButton/RentButton";
import { OwnableBookItem } from "@/components/shared/BookItem";
import { FallbackNode } from "@/components/shared/FallbackNode";
import { FilterBar } from "@/components/shared/FilterBar";
import { FilterField } from "@/types/filter";
import { LendBookCore } from "@/types/nftBook";

const DisplayBox: FunctionComponent = () => {
  const { t } = useTranslation("borrowBooks");

  const router = useRouter();
  const query = router.query;

  const { nfts } = useAllLendingBooks(query as FilterField);

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
            <ContentPaper isPaginate={true} title={t("borrowBooksTitle")}>
              {(() => {
                if (nfts.isLoading) {
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

                    {nfts?.data?.map((book: LendBookCore) => {
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
                            author={book?.renter}
                            onClick={handleBookClick}
                            buttons={
                              <>
                                <RentButton
                                  tokenId={book?.tokenId}
                                  renter={book?.renter}
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
            <FilterBar data={nfts?.data} pathname="/borrow" />
          </Stack>
        </Grid>
      </Grid>
      <ToastContainer />
    </Box>
  );
};

export default DisplayBox;
