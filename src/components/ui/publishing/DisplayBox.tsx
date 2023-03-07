/* eslint-disable prettier/prettier */
import { FunctionComponent } from "react";

import { Box, Grid, Stack } from "@mui/material";

import { useListedBooks } from "@hooks/web3";
import { BookBanner } from "@shared/BookBanner";
import { BookItem } from "@shared/BookItem";
import { ContentPaper } from "@shared/ContentPaper";
import { useRouter } from "next/router";

import images from "@/assets/images";
import { BookList } from "@/components/shared/BookList";
import { FilterBar } from "@/components/shared/FilterBar";
import { Wrapper } from "@/components/shared/Wrapper";
import { book, bookList } from "@/mocks";
import {
  BookGenres,
  ListedBook,
  NftBook,
  NftBookAttribute,
  NftBookDetails
} from "@/types/nftBook";

const DisplayBox: FunctionComponent = () => {
  const router = useRouter();

  const { listedBooks } = useListedBooks();

  // console.log("nftBooks: ", listedBooks);

  const handleBookClick = (tokenId: number | string) => {
    router.push(`/publishing/${tokenId}`);
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

            <ContentPaper isPaginate={true} title={<>Publishing books</>}>
              <Grid
                container
                spacing={3}
                columns={{ xs: 4, sm: 8, md: 12, lg: 24 }}
              >
                {listedBooks.data?.map((book: ListedBook) => (
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
                ))}
                {/* {bookList.map((book) => (
                  <Grid
                    item
                    key={book.tokenId}
                    xs={4}
                    sm={4}
                    md={3}
                    lg={6}
                  >
                    <BookItem
                      tokenId={book.tokenId}
                      price={book.price}
                      isListed={book.isListed}
                      meta={book.meta}
                      author={book.author}
                      onClick={() => {
                        handleBookClick(book.tokenId);
                      }}
                    />
                  </Grid>
                ))} */}
              </Grid>
              <BookList bookList={bookList} onClick={handleBookClick} />
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
