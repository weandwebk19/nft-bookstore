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
import { FallbackNode } from "@/components/shared/FallbackNode";
import { FilterBar } from "@/components/shared/FilterBar";
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

  return (
    <Box>
      <Grid container spacing={3} columns={{ xs: 4, sm: 8, md: 12 }}>
        <Grid item xs={4} sm={5} md={9}>
          <Stack spacing={3}>
            <ContentPaper isPaginate={true} title="Open-for-trade books">
              {listedBooks.isLoading && "Putting books on the shelves..."}

              {listedBooks.data && (
                <BookList bookList={listedBooks.data as NftListedBook[]} />
              )}

              {!listedBooks.data && <FallbackNode />}
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
