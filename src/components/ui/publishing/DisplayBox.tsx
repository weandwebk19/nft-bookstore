/* eslint-disable prettier/prettier */
import { FunctionComponent } from "react";

import { Box, Grid, Stack } from "@mui/material";

import { useListedBooks } from "@hooks/web3";
import { BookBanner } from "@shared/BookBanner";
import { ContentPaper } from "@shared/ContentPaper";
import axios from "axios";
import { useRouter } from "next/router";

import images from "@/assets/images";
import { BookList } from "@/components/shared/BookList";
import { FilterBar } from "@/components/shared/FilterBar";
import { PlaceholderNode } from "@/components/shared/PlaceholderNode";
import { Wrapper } from "@/components/shared/Wrapper";
import { book, bookList, bookList2 } from "@/mocks";
import {
  BookGenres,
  ListedBook,
  NftBook,
  NftBookAttribute,
  NftBookDetails,
  NftListedBook
} from "@/types/nftBook";

const DisplayBox: FunctionComponent = () => {
  const router = useRouter();

  const { listedBooks } = useListedBooks();

  console.log("nftBooks: ", listedBooks.data);

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
              {listedBooks.isLoading && "Putting books on the shelves..."}

              {listedBooks.data && (
                <BookList
                  bookList={listedBooks.data as NftListedBook[]}
                  onClick={handleBookClick}
                />
              )}

              {!listedBooks.data && <PlaceholderNode />}
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
