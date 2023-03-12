/* eslint-disable prettier/prettier */
import { useEffect, useState } from "react";

import { Typography } from "@mui/material";
import { Grid, Stack } from "@mui/material";

import axios from "axios";
import { useRouter } from "next/router";

import { useAccount, useOwnedNfts } from "@/components/hooks/web3";
import { ContentPaper } from "@/components/shared/ContentPaper";
import { FallbackNode } from "@/components/shared/FallbackNode";
import { FilterBar } from "@/components/shared/FilterBar";
import BookCard from "@/components/ui/account/bookshelf/created-books/BookCard";

const CreatedBooks = () => {
  const router = useRouter();
  const { account } = useAccount();

  const { nfts } = useOwnedNfts();
  const [createdBooks, setCreatedBooks] = useState<any[]>([]);

  useEffect(() => {
    if (nfts.data?.length !== 0) {
      const res = nfts.data?.filter((nft) => nft.author === account.data);
      if (res) setCreatedBooks(res);
    }
  }, [nfts.data, account.data]);

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
    <Stack sx={{ pt: 12 }}>
      <Grid container columns={{ xs: 4, sm: 8, md: 12 }} spacing={3}>
        <Grid item xs={4} sm={8} md={9}>
          <ContentPaper title="Created books">
            {(() => {
              if (nfts.isLoading) {
                return <Typography>Putting books on the shelves...</Typography>;
              } else if (createdBooks.length === 0 || nfts.error) {
                return (
                  <FallbackNode>
                    <Typography>You haven&apos;t create any book.</Typography>
                  </FallbackNode>
                );
              }
              return (
                <Grid
                  container
                  spacing={3}
                  columns={{ xs: 4, sm: 8, md: 12, lg: 24 }}
                >
                  {createdBooks!.map((book) => {
                    return (
                      <Grid
                        item
                        key={book.tokenId}
                        xs={4}
                        sm={8}
                        md={6}
                        lg={12}
                      >
                        <BookCard
                          tokenId={book?.tokenId}
                          bookCover={book?.meta.data.bookCover}
                          bookTitle={book?.meta.data.title}
                          fileType={book?.meta.data.fileType}
                          author={book?.author}
                          onClick={handleBookClick}
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
          <ContentPaper title="Filter">
            <FilterBar />
          </ContentPaper>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default CreatedBooks;
