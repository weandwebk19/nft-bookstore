/* eslint-disable prettier/prettier */
import { FunctionComponent, useState } from "react";

import { Box, Grid, Stack, Typography } from "@mui/material";

import { useListedBooks } from "@hooks/web3";
import { BookBanner } from "@shared/BookBanner";
import { ContentPaper } from "@shared/ContentPaper";
import axios from "axios";
import { useRouter } from "next/router";

import { OwnableBookItem } from "@/components/shared/BookItem";
import { FallbackNode } from "@/components/shared/FallbackNode";
import { FilterBar } from "@/components/shared/FilterBar";
import { book } from "@/mocks";

import AddToWatchListButton from "./AddToWatchListButton";
import BookmarkButton from "./BookmarkButton";
import BuyButton from "./BuyButton";

const DisplayBox: FunctionComponent = () => {
  const router = useRouter();

  const { listedBooks } = useListedBooks();

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
    <Box>
      <Grid container spacing={3} columns={{ xs: 4, sm: 8, md: 12 }}>
        <Grid item xs={4} sm={5} md={9}>
          <Stack spacing={3}>
            {/* Book Banner */}
            <BookBanner
              meta={book.meta}
              details={book.details}
              tokenId={book.tokenId}
              author={book.author}
              price={book.price}
              onClick={() => {
                alert(book.meta.title);
              }}
              balance={0}
              seller={""}
              amount={0}
            />

            <ContentPaper isPaginate={true} title="Publishing books">
              {/* {listedBooks.data?.map((book: ListedBook) => (
                  <Grid item key={book.tokenId} xs={4} sm={4} md={3} lg={6}>
                    <BookItem
                      tokenId={book.tokenId}
                      seller={book.seller}
                      amount={book.amount}
                      price={book.price}
                      meta={book.meta}
                      author=""
                      balance={0}
                      onClick={() => {
                        handleBookClick(book.tokenId);
                      }}
                    />
                  </Grid>
                ))} */}
              {/* {listedBooks.isLoading && "Putting books on the shelves..."}

              {listedBooks.data && (
                <BookList
                  bookList={listedBooks.data as NftListedBook[]}
                  onClick={handleBookClick}
                />
              )}

              {!listedBooks.data && <FallbackNode />} */}

              {(() => {
                if (listedBooks.isLoading) {
                  return (
                    <Typography>Putting books on the shelves...</Typography>
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
                    {/* Can not call BookList component, since the BookCard component has
                  `buttons` prop, and it must be pass some prop of a SINGLE book such as: 
                  title, bookCover, author,... */}

                    {listedBooks?.data?.map((book) => {
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
                            author={book?.seller}
                            onClick={handleBookClick}
                            buttons={
                              <>
                                <BuyButton
                                  tokenId={book?.tokenId}
                                  title={book?.meta.title}
                                  bookCover={book?.meta.bookCover}
                                  author={book?.seller}
                                  price={book?.price}
                                />
                                <BookmarkButton />
                                <AddToWatchListButton />
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
